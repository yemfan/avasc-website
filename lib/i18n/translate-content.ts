import { createHash } from "node:crypto";
import type Anthropic from "@anthropic-ai/sdk";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getAnthropicClient, isAnthropicConfigured } from "@/lib/ai/anthropic";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * On-demand translation of public DB content (blog, alerts, briefings, stories)
 * with a persistent cache. English is canonical and returned untouched; other
 * locales are looked up in `ContentTranslation` and, on a miss/stale hash,
 * translated via Claude and cached. Everything fails open to the English source
 * so a missing API key or model error never breaks a page.
 *
 * IMPORTANT: only pass PUBLIC, already-anonymized fields here. Never send private
 * victim narratives, admin notes, or report PII to translation.
 */

const MODEL = "claude-sonnet-5";

const LANGUAGE_NAME: Record<Exclude<Locale, "en">, string> = {
  es: "Spanish",
  zh: "Simplified Chinese",
};

type Fields = Record<string, string>;

function hashFields(fields: Fields): string {
  return createHash("sha256").update(JSON.stringify(fields)).digest("hex").slice(0, 32);
}

function hasContent(fields: Fields): boolean {
  return Object.values(fields).some((v) => typeof v === "string" && v.trim().length > 0);
}

/** Keep only keys we asked for, coerce to string, fall back to source per-key. */
function coerce(source: Fields, raw: unknown): Fields {
  const out: Fields = { ...source };
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    for (const key of Object.keys(source)) {
      const v = (raw as Record<string, unknown>)[key];
      if (typeof v === "string" && v.trim().length > 0) out[key] = v;
    }
  }
  return out;
}

function extractJsonObject(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function callClaude(locale: Exclude<Locale, "en">, fields: Fields): Promise<Fields> {
  const client = getAnthropicClient();
  const target = LANGUAGE_NAME[locale];
  const system =
    `You are a professional translator for AVASC, an anti-scam victim-support nonprofit. ` +
    `Translate the string VALUES of the given JSON object into ${target}. Rules:\n` +
    `- Return ONLY a JSON object with the SAME keys and translated values — no commentary, no code fence.\n` +
    `- Preserve the supportive, plain, non-alarmist tone.\n` +
    `- Leave URLs, email addresses, #hashtags, @handles, numbers, and proper nouns ` +
    `(AVASC, IC3, FTC, agency and brand names) unchanged.\n` +
    `- Keep line breaks and punctuation structure. Do not add, remove, or summarize content.`;

  const message: Anthropic.Message = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system,
    messages: [{ role: "user", content: JSON.stringify(fields) }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return coerce(fields, extractJsonObject(text));
}

/**
 * Translate `fields` for one entity into `locale`, using (and populating) the
 * cache. Returns the source unchanged for English, empty input, or any failure.
 */
export async function translateFields<T extends Fields>(
  entityType: string,
  entityId: string,
  locale: Locale,
  fields: T
): Promise<T> {
  if (locale === defaultLocale || !hasContent(fields) || !isAnthropicConfigured()) {
    return fields;
  }

  const sourceHash = hashFields(fields);

  const cached = await prisma.contentTranslation
    .findUnique({
      where: { entityType_entityId_locale: { entityType, entityId, locale } },
    })
    .catch(() => null);
  if (cached && cached.sourceHash === sourceHash) {
    return { ...fields, ...(cached.fields as Fields) };
  }

  let translated: Fields;
  try {
    translated = await callClaude(locale as Exclude<Locale, "en">, fields);
  } catch {
    return fields; // fail open to English
  }

  await prisma.contentTranslation
    .upsert({
      where: { entityType_entityId_locale: { entityType, entityId, locale } },
      create: {
        entityType,
        entityId,
        locale,
        sourceHash,
        fields: translated as unknown as Prisma.InputJsonValue,
      },
      update: { sourceHash, fields: translated as unknown as Prisma.InputJsonValue },
    })
    .catch(() => {});

  return { ...fields, ...translated };
}

/**
 * Translate many entities concurrently with a bounded pool. Cache hits are
 * instant; only a cold (never-viewed-in-this-locale) set pays the model cost,
 * once. Preserves input order.
 */
export async function translateMany<T extends Fields>(
  entityType: string,
  locale: Locale,
  items: Array<{ id: string; fields: T }>,
  concurrency = 6
): Promise<T[]> {
  if (locale === defaultLocale || !isAnthropicConfigured()) {
    return items.map((it) => it.fields);
  }

  const results: T[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      const it = items[i];
      results[i] = await translateFields(entityType, it.id, locale, it.fields);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

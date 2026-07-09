import { createHash } from "node:crypto";
import type Anthropic from "@anthropic-ai/sdk";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getAnthropicClient, isAnthropicConfigured } from "@/lib/ai/anthropic";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { BriefingView } from "@/lib/briefings/queries";
import { translateFields } from "@/lib/i18n/translate-content";

/**
 * Localize "This Week in Scams" briefings. The structured body (sections /
 * keyPoints / protectYourself) is translated in one cached Claude call per
 * briefing (entityType "briefing"); the merge is length-matched and defensive
 * so a malformed translation can never break rendering — it falls back to the
 * English field. Card fields for the index use a lighter, batched path.
 */

const MODEL = "claude-sonnet-5";
const ENTITY_FULL = "briefing";
const ENTITY_CARD = "briefing_card";

const LANGUAGE_NAME: Record<Exclude<Locale, "en">, string> = {
  es: "Spanish",
  zh: "Simplified Chinese",
};

type Payload = {
  title: string;
  dek: string | null;
  summary: string | null;
  periodLabel: string | null;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  keyPoints: string[];
  protectYourself: string[];
};

function pack(view: BriefingView): Payload {
  return {
    title: view.title,
    dek: view.dek,
    summary: view.summary,
    periodLabel: view.periodLabel,
    sections: view.sections.map((s) => ({ heading: s.heading, paragraphs: [...s.paragraphs] })),
    keyPoints: [...view.keyPoints],
    protectYourself: [...view.protectYourself],
  };
}

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim().length > 0 ? v : fallback;
}

/** Use the translated array only if it is the same length and all strings; else keep source. */
function mergeStringArray(translated: unknown, source: string[]): string[] {
  if (!Array.isArray(translated) || translated.length !== source.length) return source;
  return source.map((orig, i) => str(translated[i], orig));
}

function mergeBack(view: BriefingView, t: Partial<Payload> | null): BriefingView {
  if (!t || typeof t !== "object") return view;
  const sections =
    Array.isArray(t.sections) && t.sections.length === view.sections.length
      ? view.sections.map((s, i) => {
          const ts = t.sections![i] as { heading?: unknown; paragraphs?: unknown } | undefined;
          return {
            heading: str(ts?.heading, s.heading),
            paragraphs: mergeStringArray(ts?.paragraphs, s.paragraphs),
          };
        })
      : view.sections;

  return {
    ...view,
    title: str(t.title, view.title),
    dek: view.dek == null ? null : str(t.dek, view.dek),
    summary: view.summary == null ? null : str(t.summary, view.summary),
    periodLabel: view.periodLabel == null ? null : str(t.periodLabel, view.periodLabel),
    sections,
    keyPoints: mergeStringArray(t.keyPoints, view.keyPoints),
    protectYourself: mergeStringArray(t.protectYourself, view.protectYourself),
  };
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

async function callClaude(locale: Exclude<Locale, "en">, payload: Payload): Promise<unknown> {
  const client = getAnthropicClient();
  const target = LANGUAGE_NAME[locale];
  const system =
    `You translate AVASC anti-scam "This Week in Scams" briefings into ${target}. ` +
    `You are given a JSON object. Translate every string VALUE into ${target} and return the SAME JSON shape. Rules:\n` +
    `- Return ONLY the JSON object — no commentary, no code fence.\n` +
    `- Keep EXACTLY the same keys, array lengths, and nesting. Translate each array element in place.\n` +
    `- Preserve the supportive, plain, non-alarmist tone.\n` +
    `- Leave URLs, numbers, and proper nouns (AVASC, FTC, FBI, IC3, CISA, FinCEN, agency/brand names) unchanged.`;

  const message: Anthropic.Message = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system,
    messages: [{ role: "user", content: JSON.stringify(payload) }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return extractJsonObject(text);
}

/** Full briefing localization for the detail page (structured body included). */
export async function translateBriefingView(view: BriefingView, locale: Locale): Promise<BriefingView> {
  if (locale === defaultLocale || !isAnthropicConfigured()) return view;

  const payload = pack(view);
  const sourceHash = createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 32);

  const cached = await prisma.contentTranslation
    .findUnique({ where: { entityType_entityId_locale: { entityType: ENTITY_FULL, entityId: view.id, locale } } })
    .catch(() => null);
  if (cached && cached.sourceHash === sourceHash) {
    return mergeBack(view, cached.fields as Partial<Payload>);
  }

  let translated: unknown;
  try {
    translated = await callClaude(locale as Exclude<Locale, "en">, payload);
  } catch {
    return view;
  }
  if (!translated || typeof translated !== "object") return view;

  await prisma.contentTranslation
    .upsert({
      where: { entityType_entityId_locale: { entityType: ENTITY_FULL, entityId: view.id, locale } },
      create: {
        entityType: ENTITY_FULL,
        entityId: view.id,
        locale,
        sourceHash,
        fields: translated as Prisma.InputJsonValue,
      },
      update: { sourceHash, fields: translated as Prisma.InputJsonValue },
    })
    .catch(() => {});

  return mergeBack(view, translated as Partial<Payload>);
}

/** Lighter localization for index cards — only the fields a card renders. */
export async function translateBriefingCards(views: BriefingView[], locale: Locale, concurrency = 6): Promise<BriefingView[]> {
  if (locale === defaultLocale || !isAnthropicConfigured()) return views;

  const out: BriefingView[] = new Array(views.length);
  let cursor = 0;
  async function worker() {
    while (cursor < views.length) {
      const i = cursor++;
      const v = views[i];
      const fields = {
        title: v.title,
        dek: v.dek ?? "",
        summary: v.summary ?? "",
        periodLabel: v.periodLabel ?? "",
      };
      const t = await translateFields(ENTITY_CARD, v.id, locale, fields);
      out[i] = {
        ...v,
        title: str(t.title, v.title),
        dek: v.dek == null ? null : str(t.dek, v.dek),
        summary: v.summary == null ? null : str(t.summary, v.summary),
        periodLabel: v.periodLabel == null ? null : str(t.periodLabel, v.periodLabel),
      };
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, views.length) }, worker));
  return out;
}

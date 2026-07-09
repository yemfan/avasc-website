import { createHash } from "node:crypto";
import type Anthropic from "@anthropic-ai/sdk";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getAnthropicClient, isAnthropicConfigured } from "@/lib/ai/anthropic";
import { redactPii } from "./redact-pii";

/**
 * Translate a private case narrative INTO ENGLISH for moderator review.
 *
 * Unlike the public content layer (English → other locales), this runs the other
 * direction and over PRIVATE text, so it is deliberately separate and defensive:
 *   1. PII is REDACTED before anything leaves (structured identifiers → placeholders).
 *   2. Only the redacted text is sent to Claude.
 *   3. The result is cached under an INTERNAL entityType (`case_review`) that no
 *      public path ever reads.
 * Everything fails closed to "unavailable" rather than leaking the raw narrative.
 */

const MODEL = "claude-sonnet-5";
const ENTITY_TYPE = "case_review";
const REVIEW_LOCALE = "en"; // the review rendering is English

export type CaseReviewTranslation = {
  summary: string;
  fullNarrative: string;
  /** Always true — a reminder in the UI that this is the redacted, machine-translated view. */
  redacted: true;
};

type Redacted = { summary: string; fullNarrative: string };

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

async function translateToEnglish(redacted: Redacted): Promise<Redacted> {
  const client = getAnthropicClient();
  const system =
    `You translate victim scam-report text into clear, plain English for internal moderator review at AVASC. ` +
    `The input is already PII-redacted: keep every placeholder token exactly as-is ([email], [phone], [card], ` +
    `[ssn], [id], [number], [link], [handle]). Rules:\n` +
    `- Return ONLY a JSON object {"summary": string, "fullNarrative": string}. No commentary, no code fence.\n` +
    `- Faithful, neutral translation. Do not summarize, embellish, or add content.\n` +
    `- If a field is already English, return it unchanged.`;

  const message: Anthropic.Message = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system,
    messages: [{ role: "user", content: JSON.stringify(redacted) }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const raw = extractJsonObject(text);
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    summary: typeof obj.summary === "string" && obj.summary.trim() ? obj.summary : redacted.summary,
    fullNarrative:
      typeof obj.fullNarrative === "string" && obj.fullNarrative.trim() ? obj.fullNarrative : redacted.fullNarrative,
  };
}

/** Redact + translate a case's narrative to English for review, using the cache. */
export async function translateCaseForReview(
  caseId: string,
): Promise<{ ok: boolean; translation?: CaseReviewTranslation; error?: string }> {
  if (!isAnthropicConfigured()) {
    return { ok: false, error: "Translation is not configured (ANTHROPIC_API_KEY missing)." };
  }

  const row = await prisma.case
    .findUnique({ where: { id: caseId }, select: { summary: true, fullNarrative: true } })
    .catch(() => null);
  if (!row) return { ok: false, error: "Case not found." };

  const redacted: Redacted = {
    summary: redactPii(row.summary ?? ""),
    fullNarrative: redactPii(row.fullNarrative ?? ""),
  };
  const sourceHash = createHash("sha256").update(JSON.stringify(redacted)).digest("hex").slice(0, 32);

  const cached = await prisma.contentTranslation
    .findUnique({
      where: { entityType_entityId_locale: { entityType: ENTITY_TYPE, entityId: caseId, locale: REVIEW_LOCALE } },
    })
    .catch(() => null);
  if (cached && cached.sourceHash === sourceHash) {
    const f = cached.fields as Redacted;
    return { ok: true, translation: { summary: f.summary, fullNarrative: f.fullNarrative, redacted: true } };
  }

  let english: Redacted;
  try {
    english = await translateToEnglish(redacted);
  } catch {
    return { ok: false, error: "Translation failed. Please try again." };
  }

  await prisma.contentTranslation
    .upsert({
      where: { entityType_entityId_locale: { entityType: ENTITY_TYPE, entityId: caseId, locale: REVIEW_LOCALE } },
      create: {
        entityType: ENTITY_TYPE,
        entityId: caseId,
        locale: REVIEW_LOCALE,
        sourceHash,
        fields: english as unknown as Prisma.InputJsonValue,
      },
      update: { sourceHash, fields: english as unknown as Prisma.InputJsonValue },
    })
    .catch(() => {});

  return { ok: true, translation: { ...english, redacted: true } };
}

import type Anthropic from "@anthropic-ai/sdk";

import { getAnthropicClient } from "@/lib/ai/anthropic";
import { SCAM_TYPES, type ReportFieldSuggestion } from "@/lib/report/scam-types";

export { MAX_ACCOUNT_CHARS } from "@/lib/report/scam-types";
export type { ReportFieldSuggestion } from "@/lib/report/scam-types";

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 1200;

function buildSystemPrompt(): string {
  return [
    "You help a scam victim fill out AVASC's structured report form from their own free-text account. Extract only what they actually say — never invent details.",
    "",
    "Produce these fields:",
    "- title: a short, neutral headline (max ~90 chars), e.g. 'Fake bank fraud-department call led to a wire transfer'.",
    `- scamType: EXACTLY one of these labels: ${SCAM_TYPES.map((t) => `"${t}"`).join(", ")}. Pick the closest; use "Other" if none fit; use "" only if truly unclear.`,
    "- description: a clear 2-5 sentence summary of what happened, in the third person or as the reporter wrote it. Neutral and factual.",
    "- amountLost: the amount of money lost as a plain number string in USD (e.g. '5000' or '49.99'), or '' if none/unknown. Digits and one decimal point only — no currency symbols or commas.",
    "- contactMethod: how the scammer first reached them (e.g. 'Phone call', 'Text message', 'Facebook DM', 'Dating app', 'Email'), or '' if unclear.",
    "- evidence: any concrete indicators they mentioned — phone numbers, emails, domains/URLs, wallet addresses, transaction IDs, usernames, company names — one per line, or '' if none. Do NOT fabricate indicators.",
    "",
    "Do not include passwords, full card numbers, SSNs, or 2FA codes even if present — omit them.",
    'Return ONLY a JSON object: {"title": string, "scamType": string, "description": string, "amountLost": string, "contactMethod": string, "evidence": string}. No text outside the JSON.',
  ].join("\n");
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function coerce(raw: unknown): ReportFieldSuggestion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const scamTypeRaw = str(o.scamType);
  const scamType = (SCAM_TYPES as readonly string[]).includes(scamTypeRaw) ? scamTypeRaw : scamTypeRaw ? "Other" : "";
  const amount = str(o.amountLost).replace(/[^0-9.]/g, "");
  const suggestion: ReportFieldSuggestion = {
    title: str(o.title).slice(0, 200),
    scamType,
    description: str(o.description),
    amountLost: amount,
    contactMethod: str(o.contactMethod).slice(0, 120),
    evidence: str(o.evidence),
  };
  // Require at least something useful.
  if (!suggestion.title && !suggestion.description && !suggestion.scamType) return null;
  return suggestion;
}

/** Suggest structured report fields from a free-text account. Returns null on a failed parse. */
export async function suggestReportFields(account: string): Promise<ReportFieldSuggestion | null> {
  const client = getAnthropicClient();

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: account }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = extractJson(text);
  return parsed ? coerce(parsed) : null;
}

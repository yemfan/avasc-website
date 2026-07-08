import type Anthropic from "@anthropic-ai/sdk";

import { getAnthropicClient } from "@/lib/ai/anthropic";
import { RISK_LEVELS, type ScamCheckResource, type ScamCheckResult, type ScamRisk } from "@/lib/scam-check/types";

export { MAX_DESC_CHARS, MAX_IMAGES, MAX_IMAGE_BASE64_CHARS } from "@/lib/scam-check/types";
export type { ScamCheckResult } from "@/lib/scam-check/types";

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 2000;

export type ScamCheckImage = { mediaType: "image/png" | "image/jpeg" | "image/gif" | "image/webp"; base64: string };

export type ScamCheckInput = { description: string; images: ScamCheckImage[] };

function buildSystemPrompt(): string {
  return [
    "You are the Scam Check assistant for AVASC (Association of Victims Against Cyber-Scams), a nonprofit that helps fraud victims.",
    "A person shares a description and/or screenshots of a message, profile, website, or conversation they're unsure about. Assess how likely it is to be a scam and tell them what to do.",
    "",
    "How to judge:",
    "- Weigh classic scam signals: urgency/pressure, threats, unsolicited contact, requests for gift cards / wire / crypto / bank transfers, too-good-to-be-true returns, romance-then-money, look-alike domains, requests for remote access or 2FA codes, 'pay a fee to release your funds', poor grammar, or a mismatch between the sender and the brand they claim.",
    "- risk levels: 'high' = strong scam indicators; 'medium' = several suspicious signs; 'low' = few red flags in what was shared; 'unclear' = not enough information.",
    "",
    "Hard rules:",
    "- NEVER give false reassurance. Even for 'low', frame it as 'fewer red flags — still stay cautious', never 'this is safe'. If unsure, use 'unclear'.",
    "- Be calm, supportive, and non-judgmental. Victims feel shame; never blame them.",
    "- General guidance only — not legal or financial advice. Never guarantee outcomes.",
    "- Public-safe: never explain how to run or improve a scam.",
    "- If money may have been sent, tell them to contact their bank / card issuer / payment app immediately.",
    "- Warn about 'recovery' services that charge an upfront fee to get money back — a common second scam.",
    "- Never ask them to share passwords, full card numbers, government IDs, or 2FA codes.",
    "- Point them to official reporting: FBI IC3 (https://www.ic3.gov) and the FTC (https://reportfraud.ftc.gov); add the relevant platform/bank where useful.",
    "- Base 'signals' ONLY on what they actually described or that is visible in the screenshots. Quote or paraphrase concrete details you saw. Do not invent facts.",
    "",
    'Return ONLY a JSON object: {"risk": "high"|"medium"|"low"|"unclear", "verdict": string, "scamType": string|null, "signals": string[], "whatToDo": string[], "reporting": [{"label": string, "url": string}], "caution": string}. The "caution" must include a brief reminder that this is an automated check that can be wrong. No text outside the JSON.',
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

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0).map((v) => v.trim());
}

function asResources(value: unknown): ScamCheckResource[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((r): ScamCheckResource | null => {
      if (!r || typeof r !== "object") return null;
      const o = r as Record<string, unknown>;
      const url = typeof o.url === "string" ? o.url : "";
      if (!/^https?:\/\//i.test(url)) return null;
      const label = typeof o.label === "string" && o.label.trim() ? o.label.trim() : url;
      return { label, url };
    })
    .filter((r): r is ScamCheckResource => r !== null);
}

function coerce(raw: unknown): ScamCheckResult | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const risk = (typeof o.risk === "string" ? o.risk.toLowerCase() : "") as ScamRisk;
  const verdict = typeof o.verdict === "string" ? o.verdict.trim() : "";
  if (!RISK_LEVELS.includes(risk) || !verdict) return null;
  return {
    risk,
    verdict,
    scamType: typeof o.scamType === "string" && o.scamType.trim() ? o.scamType.trim() : null,
    signals: asStringArray(o.signals),
    whatToDo: asStringArray(o.whatToDo),
    reporting: asResources(o.reporting),
    caution: typeof o.caution === "string" ? o.caution.trim() : "",
  };
}

/** Analyze a suspected scam from a description and/or screenshots. Returns null on a failed parse. */
export async function analyzeScamCheck(input: ScamCheckInput): Promise<ScamCheckResult | null> {
  const client = getAnthropicClient();

  const content: Anthropic.ContentBlockParam[] = [];
  for (const img of input.images) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: img.mediaType, data: img.base64 },
    });
  }
  const desc = input.description.trim();
  content.push({
    type: "text",
    text: desc
      ? `Here is what I'm worried about:\n\n${desc}${input.images.length ? "\n\n(Screenshots are attached above.)" : ""}`
      : "Please assess the attached screenshot(s) for signs of a scam.",
  });

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = extractJson(text);
  return parsed ? coerce(parsed) : null;
}

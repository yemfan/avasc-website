import type Anthropic from "@anthropic-ai/sdk";

import { getAnthropicClient } from "@/lib/ai/anthropic";
import { MAX_SITUATION_CHARS, type Guidance, type GuidanceResource } from "@/lib/guides/types";

export { MAX_SITUATION_CHARS } from "@/lib/guides/types";
export type { Guidance, GuidanceResource } from "@/lib/guides/types";

/**
 * AVASC "Describe your situation" AI guide — on-demand, NOT persisted.
 *
 * A victim describes what happened in plain language; Claude returns empathetic,
 * public-safe, actionable guidance (what it looks like, what to do now, how to
 * report, how to protect yourself). This is general educational guidance, not
 * legal or financial advice, and never a how-to for scammers. No web_search.
 */

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 1600;

function buildSystemPrompt(): string {
  return [
    "You are a calm, compassionate scam-support guide for AVASC (Association of Victims Against Cyber-Scams), a nonprofit that helps fraud victims.",
    "A person describes their situation. Respond with clear, practical, emotionally supportive guidance.",
    "",
    "Rules:",
    "- Be empathetic and non-judgmental. Victims often feel shame; never blame them.",
    "- Give general educational guidance only — NOT legal or financial advice. Do not promise or guarantee recovery of money.",
    "- Public-safe: never explain how to run or evade a scam.",
    "- If they may have sent money, tell them to contact their bank / card issuer / the payment app immediately to try to stop or reverse it.",
    "- Warn about 'recovery' services or people who contact victims promising to get money back for an upfront fee — that is a common second scam.",
    "- Never ask them to share passwords, full card numbers, government IDs, or 2FA codes.",
    "- Point them to OFFICIAL reporting: the FBI IC3 (https://www.ic3.gov), the FTC (https://reportfraud.ftc.gov), and local police. Add others only if clearly relevant (e.g. the crypto exchange, the platform where it happened).",
    "- If the situation involves threats, sextortion, self-harm, a minor, or immediate danger, gently include appropriate crisis resources (e.g. call 911 or local emergency services; in the US the 988 Suicide & Crisis Lifeline; for a minor, the NCMEC CyberTipline https://report.cybertip.org).",
    "- Base the likely scam type only on what they describe; if unclear, set it to null.",
    "",
    'Return ONLY a JSON object with this shape: {"acknowledgement": string, "likelyScamType": string | null, "immediateSteps": string[], "reporting": [{"label": string, "url": string}], "protectYourself": string[], "emotionalSupport": string}. No text outside the JSON.',
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

function asResources(value: unknown): GuidanceResource[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((r): GuidanceResource | null => {
      if (!r || typeof r !== "object") return null;
      const o = r as Record<string, unknown>;
      const url = typeof o.url === "string" ? o.url : "";
      if (!/^https?:\/\//i.test(url)) return null;
      const label = typeof o.label === "string" && o.label.trim() ? o.label.trim() : url;
      return { label, url };
    })
    .filter((r): r is GuidanceResource => r !== null);
}

function coerce(raw: unknown): Guidance | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const acknowledgement = typeof o.acknowledgement === "string" ? o.acknowledgement.trim() : "";
  const immediateSteps = asStringArray(o.immediateSteps);
  if (!acknowledgement && immediateSteps.length === 0) return null;
  return {
    acknowledgement,
    likelyScamType:
      typeof o.likelyScamType === "string" && o.likelyScamType.trim() ? o.likelyScamType.trim() : null,
    immediateSteps,
    reporting: asResources(o.reporting),
    protectYourself: asStringArray(o.protectYourself),
    emotionalSupport: typeof o.emotionalSupport === "string" ? o.emotionalSupport.trim() : "",
  };
}

/** Generate guidance for a described situation. Returns null on a failed parse. */
export async function generateGuidance(situation: string): Promise<Guidance | null> {
  const client = getAnthropicClient();

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: situation.slice(0, MAX_SITUATION_CHARS) }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = extractJson(text);
  return parsed ? coerce(parsed) : null;
}

import type Anthropic from "@anthropic-ai/sdk";

import { getAnthropicClient } from "@/lib/ai/anthropic";
import { appBaseUrl } from "@/lib/subscriptions/links";
import type { BriefingView } from "@/lib/briefings/queries";
import { SOCIAL_PLATFORMS, type SocialPlatform, type SocialPost } from "@/lib/social/types";

export { SOCIAL_PLATFORMS, platformLabel } from "@/lib/social/types";
export type { SocialPlatform, SocialPost } from "@/lib/social/types";

/**
 * AVASC social content generator — on-demand, NOT persisted.
 *
 * Reformats a PUBLISHED, cited briefing (the canonical saved content) into
 * ready-to-post platform copy. No web_search and no DB writes: the briefing is
 * the source of truth, social posts are an ephemeral rendering the team copies
 * out and posts manually. Same sensitivity discipline as the briefings engine —
 * accurate to the briefing, victim-centered, non-sensational, public-safe,
 * never a how-to for scammers.
 */

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 2000;

function articleUrl(b: BriefingView): string {
  return `${appBaseUrl()}/briefings/${encodeURIComponent(b.slug)}`;
}

function buildSystemPrompt(): string {
  return [
    "You are the social media editor for AVASC (Association of Victims Against Cyber-Scams), a nonprofit that helps fraud victims and warns the public about scams.",
    "You turn a published, fact-checked scam briefing into ready-to-post social copy.",
    "",
    "Hard rules:",
    "- Stay strictly accurate to the briefing. Do NOT invent statistics, dollar amounts, arrests, or claims that are not in the briefing.",
    "- Victim-centered and non-sensational. Inform and protect; never mock victims, never fear-monger.",
    "- Public-safe only. Never include operational detail that would help someone run a scam.",
    "- Every post must help a reader protect themselves and point them to the full briefing link for details.",
    "- Neutral, trustworthy nonprofit voice. Light, purposeful emoji are OK (e.g. a warning sign); no clickbait.",
    "",
    "Write one post for each platform with its constraints:",
    "- x: must fit in 280 characters. The link auto-shortens to ~23 chars, so keep the text (everything except the link) under ~230 characters. Punchy. 1-2 hashtags.",
    "- linkedin: 1-3 short paragraphs, professional; 3-5 hashtags. Include the link.",
    "- facebook: 2-4 sentences, plain and shareable; 2-4 hashtags. Include the link.",
    "- instagram: an engaging caption (a few short lines, may use line breaks); 5-10 hashtags. Include the link.",
    "",
    'Return ONLY a JSON object: {"posts":[{"platform","body","hashtags":[]}, ...]} with exactly one entry per platform (x, linkedin, facebook, instagram). Put hashtags in the "hashtags" array (with the # prefix); you may also weave them into the body where natural. No commentary outside the JSON.',
  ].join("\n");
}

function buildUserPrompt(b: BriefingView): string {
  const url = articleUrl(b);
  const lines: string[] = [];
  lines.push(`Briefing title: ${b.title}`);
  if (b.dek) lines.push(`Subtitle: ${b.dek}`);
  if (b.periodLabel) lines.push(`Period: ${b.periodLabel}`);
  if (b.summary) lines.push(`Summary: ${b.summary}`);
  if (b.keyPoints.length) {
    lines.push("Key points:");
    b.keyPoints.forEach((k) => lines.push(`- ${k}`));
  }
  if (b.protectYourself.length) {
    lines.push("How to protect yourself:");
    b.protectYourself.forEach((p) => lines.push(`- ${p}`));
  }
  if (b.sources.length) {
    const pubs = Array.from(
      new Set(b.sources.map((s) => s.publisher || s.title).filter(Boolean))
    ).slice(0, 5);
    if (pubs.length) lines.push(`Sourced from: ${pubs.join(", ")}`);
  }
  lines.push(`Full briefing link (use this exact URL): ${url}`);
  lines.push("");
  lines.push("Write the four social posts now, grounded only in the above.");
  return lines.join("\n");
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

function coercePosts(raw: unknown): SocialPost[] {
  const obj = raw as { posts?: unknown };
  const arr = Array.isArray(obj?.posts) ? obj.posts : Array.isArray(raw) ? (raw as unknown[]) : [];
  const byPlatform = new Map<SocialPlatform, SocialPost>();

  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const platform = typeof o.platform === "string" ? (o.platform.toLowerCase() as SocialPlatform) : null;
    if (!platform || !SOCIAL_PLATFORMS.includes(platform)) continue;
    const body = typeof o.body === "string" ? o.body.trim() : "";
    if (!body) continue;
    const hashtags = Array.isArray(o.hashtags)
      ? o.hashtags
          .filter((h): h is string => typeof h === "string" && h.trim().length > 0)
          .map((h) => (h.startsWith("#") ? h.trim() : `#${h.trim()}`))
      : [];
    byPlatform.set(platform, { platform, body, hashtags });
  }

  // Preserve canonical platform order.
  return SOCIAL_PLATFORMS.map((p) => byPlatform.get(p)).filter((p): p is SocialPost => Boolean(p));
}

/**
 * Generate platform social posts from a published briefing. Returns [] on a failed
 * parse (caller surfaces a friendly error). Throws only if the AI call itself fails.
 */
export async function generateSocialPosts(briefing: BriefingView): Promise<SocialPost[]> {
  const client = getAnthropicClient();

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: buildUserPrompt(briefing) }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = extractJson(text);
  if (!parsed) return [];
  return coercePosts(parsed);
}

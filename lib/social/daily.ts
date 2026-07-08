import type Anthropic from "@anthropic-ai/sdk";

import { getAnthropicClient } from "@/lib/ai/anthropic";
import { prisma } from "@/lib/prisma";
import { appBaseUrl } from "@/lib/subscriptions/links";
import { PUBLIC_CLUSTER_STATUS } from "@/lib/public-database/constants";
import { getLatestPublishedBriefing } from "@/lib/briefings/queries";
import { getScamStatSeries } from "@/lib/scam-stats/queries";
import { listApprovedPublicStories } from "@/lib/public-stories/service";
import { SOCIAL_PLATFORMS, type SocialPlatform, type SocialPost } from "@/lib/social/types";

/**
 * Daily social content — themed weekly rotation. Each weekday draws from a
 * different AVASC content pillar (database, guides, stats, stories, briefings,
 * resources), then Claude writes platform-ready copy. Public-safe, victim-centered,
 * accurate to the source — never a how-to for scammers. No web_search.
 */

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 2000;

export type DailyTheme = { key: string; label: string };
export type DailyContext = { theme: DailyTheme; instruction: string; context: string; linkUrl: string };

/** Rotation index that advances once per week, to vary picks week over week. */
function weekIndex(d: Date): number {
  return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86_400_000 / 7);
}

const GUIDES = [
  { slug: "how-to-identify-a-scam", title: "How to identify a scam" },
  { slug: "romance-scam-warning-signs", title: "Romance scam warning signs" },
  { slug: "cryptocurrency-scam-types", title: "Cryptocurrency scam types" },
  { slug: "phishing-email-protection", title: "Phishing & fake-website protection" },
  { slug: "elder-fraud-prevention", title: "Elder fraud prevention" },
  { slug: "job-scam-warning-signs", title: "Job scam warning signs" },
  { slug: "tech-support-scam-protection", title: "Tech support scam protection" },
  { slug: "what-to-do-if-youve-been-scammed", title: "What to do if you've been scammed" },
];

/** Build the day's theme + grounding context. Returns null if no usable data. */
export async function buildDailyContext(date = new Date()): Promise<DailyContext | null> {
  const base = appBaseUrl();
  const wk = weekIndex(date);

  switch (date.getUTCDay()) {
    // Monday — scam-of-the-week spotlight
    case 1: {
      const clusters = await prisma.scamCluster
        .findMany({
          where: { publicStatus: PUBLIC_CLUSTER_STATUS },
          orderBy: { threatScore: "desc" },
          take: 8,
          select: { title: true, slug: true, summary: true, redFlags: true, safetyWarning: true },
        })
        .catch(() => []);
      if (!clusters.length) return null;
      const c = clusters[wk % clusters.length];
      return {
        theme: { key: "scam_spotlight", label: "Scam-of-the-week spotlight" },
        instruction: "Spotlight this scam pattern so people can recognize and avoid it.",
        context: [
          `Scam pattern: ${c.title}`,
          c.summary && `What it is: ${c.summary}`,
          c.redFlags && `Red flags: ${c.redFlags}`,
          c.safetyWarning && `Safety note: ${c.safetyWarning}`,
        ]
          .filter(Boolean)
          .join("\n"),
        linkUrl: `${base}/database/${c.slug}`,
      };
    }

    // Tuesday — red-flag / warning-sign tip
    case 2: {
      const clusters = await prisma.scamCluster
        .findMany({
          where: { publicStatus: PUBLIC_CLUSTER_STATUS, redFlags: { not: null } },
          orderBy: { threatScore: "desc" },
          take: 8,
          select: { title: true, redFlags: true, commonScript: true },
        })
        .catch(() => []);
      const c = clusters.length ? clusters[(wk + 3) % clusters.length] : null;
      return {
        theme: { key: "red_flag", label: "Red-flag warning sign" },
        instruction:
          "Share a concrete red flag people can watch for. Frame it as 'if you see X, it's a scam signal.'",
        context: c
          ? [`Related scam: ${c.title}`, c.redFlags && `Red flags: ${c.redFlags}`].filter(Boolean).join("\n")
          : "Universal red flags: urgency and pressure, threats, unsolicited contact, requests for gift cards / wire / crypto, and 'pay a fee to release your funds.'",
        linkUrl: `${base}/guides`,
      };
    }

    // Wednesday — scam stat
    case 3: {
      const [ic3, ftc] = await Promise.all([
        getScamStatSeries("ic3_losses_usd").catch(() => null),
        getScamStatSeries("ftc_losses_usd").catch(() => null),
      ]);
      const lines: string[] = [];
      if (ic3?.latest) {
        lines.push(
          `FBI IC3: Americans reported $${ic3.latest.valueBillions}B lost to cybercrime in ${ic3.latest.year}${
            ic3.latest.yoyPct !== null ? ` (up ${ic3.latest.yoyPct}% year over year)` : ""
          }.`
        );
      }
      if (ftc?.latest) lines.push(`FTC: $${ftc.latest.valueBillions}B reported lost to fraud in ${ftc.latest.year}.`);
      lines.push("Globally, over $1 trillion is lost to scams each year (GASA).");
      return {
        theme: { key: "stat", label: "Scam stat of the week" },
        instruction: "Share one striking, accurate scam statistic to raise awareness. Cite the source agency.",
        context: lines.join("\n"),
        linkUrl: `${base}/briefings`,
      };
    }

    // Thursday — survivor story / you're-not-alone
    case 4: {
      const stories = await listApprovedPublicStories(20).catch(() => []);
      const s = stories.length ? stories[wk % stories.length] : null;
      return {
        theme: { key: "story", label: "Survivor story" },
        instruction:
          "Share an empathetic, you're-not-alone message inspired by a real survivor story. Do not shame victims; encourage reporting and support.",
        context: s
          ? `Survivor story: "${s.title}"\n${s.body.slice(0, 400)}`
          : "Being scammed is not your fault — scammers are professionals. Reporting helps protect others, and support is available.",
        linkUrl: s ? `${base}/stories/${s.slug}` : `${base}/stories`,
      };
    }

    // Friday — This Week in Scams (latest briefing; generic fallback if none yet)
    case 5: {
      const b = await getLatestPublishedBriefing("weekly").catch(() => null);
      if (b) {
        return {
          theme: { key: "this_week", label: "This Week in Scams" },
          instruction: "Tease this week's scam briefing and drive readers to the full write-up.",
          context: [
            `Briefing: ${b.title}`,
            b.dek && b.dek,
            b.summary && b.summary,
            b.keyPoints.length && `Key points:\n- ${b.keyPoints.slice(0, 4).join("\n- ")}`,
          ]
            .filter(Boolean)
            .join("\n"),
          linkUrl: `${base}/briefings/${b.slug}`,
        };
      }
      return {
        theme: { key: "this_week", label: "This Week in Scams" },
        instruction: "Encourage people to check this week's scam news and stay alert to the scams making the rounds now.",
        context:
          "AVASC publishes plain-English weekly scam briefings that combine our own data with authoritative warnings from the FTC, FBI IC3, CISA, and state Attorneys General.",
        linkUrl: `${base}/briefings`,
      };
    }

    // Saturday — how to protect yourself (a guide)
    case 6: {
      const g = GUIDES[wk % GUIDES.length];
      return {
        theme: { key: "protect", label: "Protect yourself" },
        instruction: "Give a short, practical protect-yourself tip and point to the full guide.",
        context: `Topic: ${g.title}. Offer one actionable prevention tip on this topic.`,
        linkUrl: `${base}/guides/${g.slug}`,
      };
    }

    // Sunday — where to get help
    default: {
      return {
        theme: { key: "get_help", label: "Where to get help" },
        instruction:
          "Remind people where to get help if they've been targeted: report it, get recovery guidance, and find trusted resources. Warm and supportive.",
        context:
          "If you've been targeted: report to the FBI IC3 (ic3.gov) and the FTC (reportfraud.ftc.gov), and to AVASC. Free recovery guidance and a directory of trusted victim-support resources are available. Beware anyone who charges an upfront fee to 'recover' your money — that's a common second scam.",
        linkUrl: `${base}/resources`,
      };
    }
  }
}

function buildSystemPrompt(): string {
  return [
    "You are the social media editor for AVASC (Association of Victims Against Cyber-Scams), a nonprofit that helps fraud victims and warns the public about scams.",
    "Write today's short social posts from the provided theme and content.",
    "",
    "Hard rules:",
    "- Stay strictly accurate to the provided content. Do NOT invent statistics, dollar amounts, arrests, or claims.",
    "- Victim-centered and non-sensational. Inform and protect; never mock victims, never fear-monger.",
    "- Public-safe only. Never include operational detail that would help someone run a scam.",
    "- Every post should help a reader and include the provided content link.",
    "- AVASC is a nonprofit funded by donations. In the facebook, linkedin, and instagram posts, add a short warm closing line inviting readers to support AVASC, using the donate link provided. For x, include the donate link only if the whole post still fits within 280 characters (otherwise keep just the content link).",
    "- Trustworthy nonprofit voice. Light, purposeful emoji are OK; no clickbait.",
    "",
    "Write one post per platform:",
    "- x: fits in 280 characters (the link auto-shortens to ~23 chars, so keep the text under ~230). Punchy. 1-2 hashtags.",
    "- linkedin: 1-3 short sentences, professional; 3-5 hashtags. Include the link.",
    "- facebook: 2-4 sentences, plain and shareable; 2-4 hashtags. Include the link.",
    "- instagram: an engaging caption (a few short lines); 5-10 hashtags. Include the link.",
    "",
    'Return ONLY JSON: {"posts":[{"platform","body","hashtags":[]}, ...]} with one entry per platform (x, linkedin, facebook, instagram). No text outside the JSON.',
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

function coercePosts(raw: unknown): SocialPost[] {
  const arr = Array.isArray((raw as { posts?: unknown })?.posts) ? (raw as { posts: unknown[] }).posts : [];
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
  return SOCIAL_PLATFORMS.map((p) => byPlatform.get(p)).filter((p): p is SocialPost => Boolean(p));
}

/** Generate platform posts for the day's theme/context. Returns [] on a failed parse. */
export async function generateDailyPosts(ctx: DailyContext): Promise<SocialPost[]> {
  const client = getAnthropicClient();
  const user = [
    `Today's theme: ${ctx.theme.label}`,
    ctx.instruction,
    "",
    "Content to base the posts on:",
    ctx.context,
    "",
    `Content link to include in each post (use exactly): ${ctx.linkUrl}`,
    `Donate link (invite support with this, per the rules): ${appBaseUrl()}/donate`,
    "",
    "Write the posts now.",
  ].join("\n");

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: user }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = extractJson(text);
  return parsed ? coercePosts(parsed) : [];
}

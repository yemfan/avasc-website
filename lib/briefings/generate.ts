import type Anthropic from "@anthropic-ai/sdk";
import { AccessTier } from "@prisma/client";

import { getAnthropicClient } from "@/lib/ai/anthropic";
import { PUBLIC_CLUSTER_STATUS } from "@/lib/public-database/constants";
import {
  getPublicIndicatorDisplayValue,
  indicatorTypeLabel,
} from "@/lib/public-database/public-indicator-display";
import { prisma } from "@/lib/prisma";
import { slugifyBriefingTitle } from "@/lib/briefings/slug";

/**
 * "This Week in Scams" weekly briefings generator.
 *
 * Grounds an authoritative, victim-centered weekly briefing in (a) AVASC's OWN
 * public-safe data (PUBLISHED clusters, isPublic indicators, PUBLIC incidents) and
 * (b) authoritative external sources via Claude's web_search tool (FTC, FBI IC3,
 * CISA, FinCEN, state AGs). Public-safe only — never a how-to for scammers.
 *
 * Hard-won config (do NOT regress):
 *  - STREAM via `client.messages.stream({...}).finalMessage()` — a large max_tokens
 *    trips the SDK's ~10-min non-streaming ceiling.
 *  - max_tokens: 32000 — web_search result blocks + thinking count against output.
 *  - MAX_TOOL_ROUNDS = 12 must exceed web_search max_uses = 5, so a round remains to
 *    write the final JSON after searching.
 *  - pause_turn continuation loop + JSON-fence extraction + a repair fallback.
 */

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 32000;
const MAX_TOOL_ROUNDS = 12;
const WEB_SEARCH_MAX_USES = 5;
const CLUSTER_WINDOW_DAYS = 14;
const MAX_CLUSTERS = 8;
const MAX_INDICATORS_PER_CLUSTER = 6;
const MAX_INCIDENTS = 10;

/** Structured briefing body persisted to `Briefing.bodyJson`. */
export type BriefingSection = {
  heading: string;
  paragraphs: string[];
};

export type BriefingSource = {
  title: string;
  url: string;
  publisher?: string;
};

export type GeneratedBriefing = {
  title: string;
  dek: string;
  periodLabel: string;
  summary: string;
  sections: BriefingSection[];
  keyPoints: string[];
  protectYourself: string[];
  sources: BriefingSource[];
};

type PublicSafeSnapshot = {
  generatedAtIso: string;
  periodLabel: string;
  clusters: Array<{
    title: string;
    scamType: string;
    summary: string;
    riskLevel: string;
    threatScore: number;
    reportCount: number;
    indicators: Array<{ type: string; example: string; occurrences: number }>;
  }>;
  incidents: Array<{
    scamType: string;
    title: string;
    summary: string | null;
    firstSeen: string | null;
    lastSeen: string | null;
  }>;
};

function currentPeriodLabel(now = new Date()): string {
  return `Week of ${now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
}

/**
 * Pull ONLY public-safe AVASC data:
 *  - PUBLISHED clusters updated in the last ~14 days (top by threatScore).
 *  - isPublic cluster indicator aggregates (values masked via public-indicator-display).
 *  - PUBLIC incidents (recent).
 */
function loadClusters(since: Date) {
  return prisma.scamCluster.findMany({
    where: {
      publicStatus: PUBLIC_CLUSTER_STATUS,
      updatedAt: { gte: since },
    },
    orderBy: [{ threatScore: "desc" }, { updatedAt: "desc" }],
    take: MAX_CLUSTERS,
    select: {
      title: true,
      scamType: true,
      summary: true,
      riskLevel: true,
      threatScore: true,
      reportCountSnapshot: true,
      indicatorAggregates: {
        where: { isPublic: true },
        orderBy: { occurrenceCount: "desc" },
        take: MAX_INDICATORS_PER_CLUSTER,
        select: {
          indicatorType: true,
          normalizedValue: true,
          displayValue: true,
          occurrenceCount: true,
        },
      },
    },
  });
}

function loadIncidents() {
  return prisma.incident.findMany({
    where: { accessTier: AccessTier.PUBLIC },
    orderBy: [{ lastSeenAt: "desc" }, { updatedAt: "desc" }],
    take: MAX_INCIDENTS,
    select: {
      canonicalScamType: true,
      title: true,
      narrativeSummary: true,
      firstSeenAt: true,
      lastSeenAt: true,
    },
  });
}

async function loadPublicSafeSnapshot(): Promise<PublicSafeSnapshot> {
  const since = new Date(Date.now() - CLUSTER_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  // Proprietary data is a BONUS, not a requirement: if it's unavailable (sparse
  // week, or a DB without these tables yet), degrade to an empty snapshot and let
  // the briefing be grounded on web_search of external authorities instead. Each
  // query is isolated so one failing never blocks the whole briefing.
  let clusters: Awaited<ReturnType<typeof loadClusters>> = [];
  try {
    clusters = await loadClusters(since);
  } catch (e) {
    console.warn("[briefings] cluster snapshot unavailable; using external sources only:", e instanceof Error ? e.message : e);
  }

  let incidents: Awaited<ReturnType<typeof loadIncidents>> = [];
  try {
    incidents = await loadIncidents();
  } catch (e) {
    console.warn("[briefings] incident snapshot unavailable:", e instanceof Error ? e.message : e);
  }

  return {
    generatedAtIso: new Date().toISOString(),
    periodLabel: currentPeriodLabel(),
    clusters: clusters.map((c) => ({
      title: c.title,
      scamType: c.scamType,
      summary: c.summary,
      riskLevel: c.riskLevel,
      threatScore: c.threatScore,
      reportCount: c.reportCountSnapshot,
      indicators: c.indicatorAggregates.map((agg) => ({
        // Friendly category label — never the raw indicator type enum.
        type: indicatorTypeLabel(agg.indicatorType),
        // Masked/staff-approved public display value only.
        example: getPublicIndicatorDisplayValue({
          indicatorType: agg.indicatorType,
          normalizedValue: agg.normalizedValue,
          displayValue: agg.displayValue,
          isPublic: true,
        }),
        occurrences: agg.occurrenceCount,
      })),
    })),
    incidents: incidents.map((i) => ({
      scamType: i.canonicalScamType,
      title: i.title,
      summary: i.narrativeSummary,
      firstSeen: i.firstSeenAt ? i.firstSeenAt.toISOString().slice(0, 10) : null,
      lastSeen: i.lastSeenAt ? i.lastSeenAt.toISOString().slice(0, 10) : null,
    })),
  };
}

const SYSTEM_PROMPT = `You are a senior scam-intelligence editor for AVASC (Association of Victims Against Cyber-Scams), a nonprofit that helps fraud victims. You write "This Week in Scams" — an authoritative, victim-centered weekly briefing for a general audience that includes people who have already been defrauded.

Non-negotiable editorial rules:
- Accurate, cited, non-sensational, plain-English, and protective. Never alarmist or fear-mongering.
- Victim-centered and non-judgmental: victims are not stupid; the shame is on the scammer.
- NEVER write a how-to for scammers. Describe only public-safe indicators and protective guidance — what the public can watch for and do, not operational detail that would help a fraudster.
- EVERY external factual claim must be backed by a real, verifiable source URL you found via web_search. Do not invent sources, statistics, URLs, or enforcement actions. If you cannot verify a claim, leave it out.
- Ground specifics in BOTH (a) AVASC's own public data provided to you (what our database is seeing this period) AND (b) this week's authoritative external reporting (FTC Consumer Sentinel, FBI IC3, CISA, FinCEN, state Attorneys General, reputable press).
- The AVASC indicator "examples" you are given are already masked/public-safe. You may reference the CATEGORY of indicator (e.g. "spoofed phone numbers", "lookalike domains") but do not present masked fragments as actionable.`;

function buildUserPrompt(snapshot: PublicSafeSnapshot): string {
  return `Write this week's "This Week in Scams" briefing.

AVASC PUBLIC-SAFE DATA (${snapshot.periodLabel}, generated ${snapshot.generatedAtIso}):
${JSON.stringify(
  { clusters: snapshot.clusters, publicIncidents: snapshot.incidents },
  null,
  2
)}

TASK:
1. Use web_search to find this week's authoritative fraud news, warnings, and enforcement (FTC, FBI IC3, CISA, FinCEN, state AGs, reputable outlets). Prefer the most recent, official sources.
2. Weave together what AVASC's database is seeing (above) with the external reporting. Where the two align, say so; where AVASC is seeing something notable, surface it as "what we're seeing."
3. Keep it protective and public-safe: highlight indicators the public can recognize and concrete steps to stay safe or recover.

Return ONLY a single JSON object (no prose before or after, no markdown fences) with EXACTLY this shape:
{
  "title": string,            // clean, specific, <= 70 characters, no clickbait
  "dek": string,              // one-sentence standfirst
  "periodLabel": string,      // e.g. "${snapshot.periodLabel}"
  "summary": string,          // 1-2 sentence plain summary for cards/SEO
  "sections": [ { "heading": string, "paragraphs": [string, ...] }, ... ],
  "keyPoints": [string, ...], // 3-6 concise takeaways
  "protectYourself": [string, ...], // 3-6 concrete protective actions
  "sources": [ { "title": string, "url": string, "publisher": string }, ... ] // real URLs only
}`;
}

/** Web search tool (as specified for this slice). */
const WEB_SEARCH_TOOL = {
  type: "web_search_20250305" as const,
  name: "web_search" as const,
  max_uses: WEB_SEARCH_MAX_USES,
};

/** Concatenate all text blocks from an assistant message. */
function collectText(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

/** Extract a JSON object from model text: strip ```json fences, then take the outermost {...}. */
function extractJson(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

/**
 * Strip the model's web_search citation markup (e.g. <cite index="16-1,16-2">…</cite>)
 * and stray bracketed refs from a text field, keeping the readable prose. The real
 * source links live in the Sources list, so these inline markers are noise.
 */
function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<\/?cite[^>]*>/gi, "")
    .replace(/\[\d+(?:[-,]\d+)*\]/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function coerceStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => cleanText(v))
    .filter((v) => v.length > 0);
}

function coerceBriefing(raw: unknown): GeneratedBriefing | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const title = cleanText(o.title);
  if (!title) return null;

  const sections: BriefingSection[] = Array.isArray(o.sections)
    ? o.sections
        .map((s): BriefingSection | null => {
          if (!s || typeof s !== "object") return null;
          const sec = s as Record<string, unknown>;
          const heading = cleanText(sec.heading);
          const paragraphs = coerceStringArray(sec.paragraphs);
          if (!heading || paragraphs.length === 0) return null;
          return { heading, paragraphs };
        })
        .filter((s): s is BriefingSection => s !== null)
    : [];
  if (sections.length === 0) return null;

  const sources: BriefingSource[] = Array.isArray(o.sources)
    ? o.sources
        .map((s): BriefingSource | null => {
          if (!s || typeof s !== "object") return null;
          const src = s as Record<string, unknown>;
          const url = typeof src.url === "string" ? src.url.trim() : "";
          // Only keep real http(s) URLs — enforce the citation discipline.
          if (!/^https?:\/\//i.test(url)) return null;
          const srcTitle = typeof src.title === "string" && src.title.trim() ? src.title.trim() : url;
          const publisher =
            typeof src.publisher === "string" && src.publisher.trim()
              ? src.publisher.trim()
              : undefined;
          return { title: srcTitle, url, publisher };
        })
        .filter((s): s is BriefingSource => s !== null)
    : [];

  return {
    title: title.slice(0, 120),
    dek: cleanText(o.dek),
    periodLabel: typeof o.periodLabel === "string" && o.periodLabel.trim() ? o.periodLabel.trim() : currentPeriodLabel(),
    summary: cleanText(o.summary),
    sections,
    keyPoints: coerceStringArray(o.keyPoints),
    protectYourself: coerceStringArray(o.protectYourself),
    sources,
  };
}

/**
 * Run the tool loop: stream each turn, continue on pause_turn / tool_use, and stop
 * when the model ends its turn. Returns the concatenated final assistant text.
 */
async function runAgentLoop(
  client: Anthropic,
  messages: Anthropic.MessageParam[]
): Promise<string> {
  let lastText = "";

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages,
      tools: [WEB_SEARCH_TOOL],
    });
    const message = await stream.finalMessage();

    lastText = collectText(message) || lastText;

    // Always carry the assistant turn forward (server-tool blocks must be preserved).
    messages.push({ role: "assistant", content: message.content });

    if (message.stop_reason === "pause_turn") {
      // Server-side tool loop hit its internal limit; re-send to resume. No extra user turn.
      continue;
    }

    if (message.stop_reason === "tool_use") {
      // web_search is a server tool — results are already in message.content. Resuming
      // the conversation lets the model read them and continue toward the final answer.
      continue;
    }

    // end_turn / max_tokens / stop_sequence / refusal — done looping.
    break;
  }

  return lastText;
}

/**
 * Generate a weekly briefing. Returns null on failure (never throws to the caller
 * beyond a missing API key, which surfaces from getAnthropicClient()).
 */
export async function generateWeeklyBriefing(): Promise<GeneratedBriefing | null> {
  const client = getAnthropicClient();
  const snapshot = await loadPublicSafeSnapshot();

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: buildUserPrompt(snapshot) },
  ];

  let text: string;
  try {
    text = await runAgentLoop(client, messages);
  } catch (err) {
    console.error("[briefings] generation failed", err instanceof Error ? err.message : err);
    return null;
  }

  const jsonText = extractJson(text);
  if (!jsonText) {
    console.error("[briefings] no JSON object found in model output");
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    // Repair fallback: ask the model to re-emit ONLY valid JSON, no tools.
    try {
      const repair = await client.messages
        .stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages: [
            ...messages,
            {
              role: "user",
              content:
                "Your previous output was not valid JSON. Re-output the SAME briefing as a single valid JSON object only — no markdown fences, no commentary. Do not use any tools.",
            },
          ],
        })
        .finalMessage();
      const repaired = extractJson(collectText(repair));
      if (!repaired) return null;
      parsed = JSON.parse(repaired);
    } catch (err) {
      console.error("[briefings] JSON repair failed", err instanceof Error ? err.message : err);
      return null;
    }
  }

  const briefing = coerceBriefing(parsed);
  if (!briefing) {
    console.error("[briefings] parsed JSON did not match the expected briefing shape");
  }
  return briefing;
}

/**
 * Generate a weekly briefing and upsert it as a published `Briefing` row
 * (category "this_week"). Best-effort — returns the slug on success, else null.
 */
export async function publishBriefing(): Promise<string | null> {
  const briefing = await generateWeeklyBriefing();
  if (!briefing) return null;

  const slug = slugifyBriefingTitle(briefing.title, new Date());

  try {
    await prisma.briefing.upsert({
      where: { slug },
      create: {
        slug,
        title: briefing.title,
        dek: briefing.dek || null,
        category: "this_week",
        summary: briefing.summary || null,
        bodyJson: {
          sections: briefing.sections,
          keyPoints: briefing.keyPoints,
          protectYourself: briefing.protectYourself,
        },
        sources: briefing.sources,
        periodLabel: briefing.periodLabel || null,
        status: "published",
      },
      update: {
        title: briefing.title,
        dek: briefing.dek || null,
        summary: briefing.summary || null,
        bodyJson: {
          sections: briefing.sections,
          keyPoints: briefing.keyPoints,
          protectYourself: briefing.protectYourself,
        },
        sources: briefing.sources,
        periodLabel: briefing.periodLabel || null,
        status: "published",
      },
    });
    return slug;
  } catch (err) {
    console.error("[briefings] publish upsert failed", err instanceof Error ? err.message : err);
    return null;
  }
}

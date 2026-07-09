import type Anthropic from "@anthropic-ai/sdk";

import { getAnthropicClient } from "@/lib/ai/anthropic";
import { prisma } from "@/lib/prisma";

/**
 * Granular fraud-breakdown updater — pulls the latest published FTC / FBI IC3
 * breakdowns (losses by payment method, contact method, top crime types) via
 * Claude + web_search, and upserts them into `ScamStatBreakdown`. Same hard-won
 * harness as `generate.ts`. Never invents figures/URLs — verified + sourced only.
 */

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 8000;
const MAX_TOOL_ROUNDS = 12;
const WEB_SEARCH_MAX_USES = 6;

/**
 * Known dimensions. Anything else the model returns is dropped.
 * (Contact-method was piloted but the report's by-loss ranking is easy to get
 * partially wrong — omitting phone calls — so it's left out until verifiable.)
 */
export const BREAKDOWN_DIMENSIONS: Record<string, { source: string; label: string }> = {
  ftc_payment_method: { source: "FTC", label: "FTC — fraud losses by payment method" },
  ic3_crime_type: { source: "FBI IC3", label: "FBI IC3 — losses by crime type" },
};

const WEB_SEARCH_TOOL = {
  type: "web_search_20250305" as const,
  name: "web_search" as const,
  max_uses: WEB_SEARCH_MAX_USES,
};

function collectText(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

function extractJson(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

async function runAgentLoop(client: Anthropic, system: string, messages: Anthropic.MessageParam[]): Promise<string> {
  let lastText = "";
  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const stream = client.messages.stream({ model: MODEL, max_tokens: MAX_TOKENS, system, messages, tools: [WEB_SEARCH_TOOL] });
    const message = await stream.finalMessage();
    lastText = collectText(message) || lastText;
    messages.push({ role: "assistant", content: message.content });
    if (message.stop_reason === "pause_turn" || message.stop_reason === "tool_use") continue;
    break;
  }
  return lastText;
}

const SYSTEM_PROMPT = [
  "You are a careful data researcher for AVASC, a nonprofit anti-scam organization. Accuracy matters more than completeness — a wrong number is worse than a missing one.",
  "Find these breakdowns for the MOST RECENT year that has an official published annual report (the FTC Consumer Sentinel Network Data Book, and the FBI IC3 Annual Report). Use the same year for all three only if both reports cover it; otherwise use each source's latest published year.",
  '  - dimension "ftc_payment_method": FTC reported fraud losses by PAYMENT METHOD (bank transfer/payment, cryptocurrency, wire transfer, gift cards & reload cards, credit card, payment app, etc.). Search ftc.gov / the Data Book. Only include a category if its figure appears in an official ftc.gov source.',
  '  - dimension "ic3_crime_type": FBI IC3 reported losses by CRIME TYPE — the top categories by dollar loss (investment, business email compromise, tech/customer support, confidence/romance, government impersonation, etc.). Search ic3.gov / FBI.',
  "For each category give the reported loss in ABSOLUTE US DOLLARS (e.g. 5700000000 for $5.7 billion). Use the exact category label the report uses. Only include categories whose figure you can verify from the official report, and give that report's URL. Do NOT invent, estimate, round-trip from percentages, or extrapolate.",
  'Return ONLY a JSON object: {"points":[{"dimension":"ftc_payment_method","year":2024,"category":"Cryptocurrency","valueUsd":9300000000,"sourceUrl":"https://..."}, ...]}. No text outside the JSON.',
].join("\n");

type Point = { dimension: string; year: number; category: string; valueUsd: number; sourceUrl: string };

function coerce(raw: unknown): Point[] {
  const obj = raw as { points?: unknown };
  const arr = Array.isArray(obj?.points) ? obj.points : [];
  const out: Point[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const dimension = typeof o.dimension === "string" ? o.dimension.trim() : "";
    if (!(dimension in BREAKDOWN_DIMENSIONS)) continue;
    const category = typeof o.category === "string" ? o.category.trim() : "";
    if (!category) continue;
    const year = typeof o.year === "number" ? Math.trunc(o.year) : Number(o.year);
    const valueUsd = typeof o.valueUsd === "number" ? o.valueUsd : Number(o.valueUsd);
    const sourceUrl = typeof o.sourceUrl === "string" ? o.sourceUrl.trim() : "";
    if (!Number.isFinite(year) || year < 2000 || year > 2100) continue;
    if (!Number.isFinite(valueUsd) || valueUsd <= 0 || valueUsd > 1e12) continue;
    if (!/^https?:\/\//i.test(sourceUrl)) continue;
    out.push({ dimension, year, category, valueUsd: Math.round(valueUsd), sourceUrl });
  }
  return out;
}

export type BreakdownRefreshResult = { ok: boolean; upserted: number; dimensions: string[]; error?: string };

/** Research + upsert the FTC/IC3 breakdowns. Only overwrites with verified, sourced values. */
export async function refreshScamBreakdowns(): Promise<BreakdownRefreshResult> {
  const client = getAnthropicClient();

  let text: string;
  try {
    text = await runAgentLoop(client, SYSTEM_PROMPT, [
      { role: "user", content: "Find the FTC and IC3 fraud breakdowns and return the JSON points." },
    ]);
  } catch (err) {
    return { ok: false, upserted: 0, dimensions: [], error: err instanceof Error ? err.message : "AI call failed" };
  }

  const json = extractJson(text);
  if (!json) return { ok: false, upserted: 0, dimensions: [], error: "No JSON in model output" };

  let points: Point[];
  try {
    points = coerce(JSON.parse(json));
  } catch {
    return { ok: false, upserted: 0, dimensions: [], error: "JSON parse failed" };
  }
  if (points.length === 0) return { ok: false, upserted: 0, dimensions: [], error: "No valid data points" };

  // Rank within each (dimension, year) group by descending loss.
  const groups = new Map<string, Point[]>();
  for (const p of points) {
    const key = `${p.dimension}:${p.year}`;
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(p);
  }
  const dims = new Set<string>();
  for (const group of groups.values()) {
    group.sort((a, b) => b.valueUsd - a.valueUsd);
    for (let i = 0; i < group.length; i++) {
      const p = group[i];
      const source = BREAKDOWN_DIMENSIONS[p.dimension].source;
      await prisma.scamStatBreakdown.upsert({
        where: { dimension_year_category: { dimension: p.dimension, year: p.year, category: p.category } },
        create: { dimension: p.dimension, source, year: p.year, category: p.category, valueUsd: p.valueUsd, rank: i + 1, sourceUrl: p.sourceUrl },
        update: { valueUsd: p.valueUsd, rank: i + 1, sourceUrl: p.sourceUrl, source },
      });
      dims.add(p.dimension);
    }
  }

  return { ok: true, upserted: points.length, dimensions: [...dims] };
}

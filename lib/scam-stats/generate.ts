import type Anthropic from "@anthropic-ai/sdk";

import { getAnthropicClient } from "@/lib/ai/anthropic";
import { prisma } from "@/lib/prisma";

/**
 * Scam-stats updater — refreshes the year-over-year FBI IC3 reported-losses series
 * used by the public trend chart. Uses Claude + web_search to find the official
 * annual figures (incl. any newly published report year) and upserts them by
 * (metric, year). Mirrors the briefings web_search harness.
 *
 * Hard-won config (do NOT regress): stream via finalMessage; max_tokens headroom
 * for web_search result blocks; MAX_TOOL_ROUNDS > web_search max_uses; pause_turn
 * continuation loop; JSON-fence extraction. Never invents figures/URLs.
 */

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 8000;
const MAX_TOOL_ROUNDS = 10;
const WEB_SEARCH_MAX_USES = 4;
const METRIC = "ic3_losses_usd";
const SOURCE = "FBI IC3";

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

async function runAgentLoop(
  client: Anthropic,
  systemPrompt: string,
  messages: Anthropic.MessageParam[]
): Promise<string> {
  let lastText = "";
  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages,
      tools: [WEB_SEARCH_TOOL],
    });
    const message = await stream.finalMessage();
    lastText = collectText(message) || lastText;
    messages.push({ role: "assistant", content: message.content });
    if (message.stop_reason === "pause_turn" || message.stop_reason === "tool_use") continue;
    break;
  }
  return lastText;
}

const SYSTEM_PROMPT = [
  "You are a careful data researcher for AVASC, a nonprofit anti-scam organization.",
  "Task: find the FBI Internet Crime Complaint Center (IC3) TOTAL reported losses for each year from 2019 through the most recent year for which an IC3 Annual Internet Crime Report has been published.",
  "Use web_search against ic3.gov and the FBI, and reputable summaries only. Report each year's official total losses in USD BILLIONS (e.g. 16.6 for $16.6 billion).",
  "Include the newest year if its annual report is out; omit any year whose report is not yet published. Do NOT invent, estimate, or extrapolate figures — only report values you can verify from a real source, and give that source's URL.",
  'Return ONLY a JSON object: {"series":[{"year":2024,"valueBillions":16.6,"sourceUrl":"https://..."}, ...]}. No text outside the JSON.',
].join("\n");

type Point = { year: number; valueBillions: number; sourceUrl: string };

function coerce(raw: unknown): Point[] {
  const obj = raw as { series?: unknown };
  const arr = Array.isArray(obj?.series) ? obj.series : [];
  const out: Point[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const year = typeof o.year === "number" ? Math.trunc(o.year) : Number(o.year);
    const valueBillions = typeof o.valueBillions === "number" ? o.valueBillions : Number(o.valueBillions);
    const sourceUrl = typeof o.sourceUrl === "string" ? o.sourceUrl.trim() : "";
    if (!Number.isFinite(year) || year < 2000 || year > 2100) continue;
    if (!Number.isFinite(valueBillions) || valueBillions <= 0 || valueBillions > 1000) continue;
    if (!/^https?:\/\//i.test(sourceUrl)) continue;
    out.push({ year, valueBillions: Math.round(valueBillions * 100) / 100, sourceUrl });
  }
  return out;
}

export type RefreshResult = { ok: boolean; upserted: number; years: number[]; error?: string };

/** Research + upsert the IC3 loss series. Only overwrites with verified, sourced values. */
export async function refreshScamStats(): Promise<RefreshResult> {
  const client = getAnthropicClient();

  let text: string;
  try {
    text = await runAgentLoop(client, SYSTEM_PROMPT, [
      { role: "user", content: "Find the IC3 total reported losses per year and return the JSON series." },
    ]);
  } catch (err) {
    return { ok: false, upserted: 0, years: [], error: err instanceof Error ? err.message : "AI call failed" };
  }

  const json = extractJson(text);
  if (!json) return { ok: false, upserted: 0, years: [], error: "No JSON in model output" };

  let points: Point[];
  try {
    points = coerce(JSON.parse(json));
  } catch {
    return { ok: false, upserted: 0, years: [], error: "JSON parse failed" };
  }
  if (points.length === 0) return { ok: false, upserted: 0, years: [], error: "No valid data points" };

  const years: number[] = [];
  for (const p of points) {
    await prisma.scamStat.upsert({
      where: { metric_year: { metric: METRIC, year: p.year } },
      create: { metric: METRIC, year: p.year, valueBillions: p.valueBillions, source: SOURCE, sourceUrl: p.sourceUrl },
      update: { valueBillions: p.valueBillions, source: SOURCE, sourceUrl: p.sourceUrl },
    });
    years.push(p.year);
  }

  return { ok: true, upserted: years.length, years: years.sort((a, b) => a - b) };
}

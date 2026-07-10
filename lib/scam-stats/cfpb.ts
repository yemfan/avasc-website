import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

/**
 * CFPB Consumer Complaint Database — a free, no-key, DAILY-updated public API.
 * We pull a rolling 12-month snapshot of scam-related complaints (total + top
 * states + top products) and cache it in `AppSetting` (refreshed by the
 * scam-stats cron), so the page reads from the DB and never depends on the API
 * being up at request time.
 *
 * Honest framing: this counts consumer complaints that mention "scam" in the
 * CFPB database — a real, live signal, not a total count of all scams.
 */

const CFPB_API = "https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/";
const CFPB_SOURCE_URL = "https://www.consumerfinance.gov/data-research/consumer-complaints/search/?searchText=scam";
const SNAPSHOT_KEY = "cfpb_scam_snapshot";

export type CfpbSnapshot = {
  fetchedAt: string;
  windowStart: string;
  total: number;
  byState: { state: string; count: number }[];
  byProduct: { product: string; count: number }[];
  sourceUrl: string;
};

type Bucket = { key?: unknown; doc_count?: unknown };

function buckets(agg: unknown, name: string): Bucket[] {
  const outer = (agg as Record<string, unknown> | undefined)?.[name] as Record<string, unknown> | undefined;
  const inner = outer?.[name] as { buckets?: unknown } | undefined;
  return Array.isArray(inner?.buckets) ? (inner!.buckets as Bucket[]) : [];
}

function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

/** Fetch a fresh CFPB scam-complaint snapshot (rolling 12 months). Null on failure. */
export async function fetchCfpbSnapshot(): Promise<CfpbSnapshot | null> {
  const windowStart = daysAgoIso(365);
  const url = `${CFPB_API}?search_term=scam&date_received_min=${windowStart}&size=0`;
  let json: unknown;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "AVASC/1.0 (+https://www.avasc.org)" } });
    if (!res.ok) return null;
    json = await res.json();
  } catch {
    return null;
  }

  const total = (json as { hits?: { total?: { value?: unknown } } })?.hits?.total?.value;
  if (typeof total !== "number") return null;

  const aggregations = (json as { aggregations?: unknown })?.aggregations;
  const byState = buckets(aggregations, "state")
    .filter((b) => typeof b.key === "string" && (b.key as string).length === 2 && typeof b.doc_count === "number")
    .slice(0, 10)
    .map((b) => ({ state: b.key as string, count: b.doc_count as number }));
  const byProduct = buckets(aggregations, "product")
    .filter((b) => typeof b.key === "string" && typeof b.doc_count === "number")
    .slice(0, 5)
    .map((b) => ({ product: b.key as string, count: b.doc_count as number }));

  return { fetchedAt: new Date().toISOString(), windowStart, total, byState, byProduct, sourceUrl: CFPB_SOURCE_URL };
}

export type CfpbRefreshResult = { ok: boolean; total?: number; error?: string };

/** Fetch + cache the CFPB snapshot into AppSetting. Called by the scam-stats cron. */
export async function refreshCfpbSnapshot(): Promise<CfpbRefreshResult> {
  const snap = await fetchCfpbSnapshot();
  if (!snap) return { ok: false, error: "CFPB fetch failed" };
  await prisma.appSetting.upsert({
    where: { key: SNAPSHOT_KEY },
    create: { key: SNAPSHOT_KEY, value: snap as unknown as Prisma.InputJsonValue },
    update: { value: snap as unknown as Prisma.InputJsonValue },
  });
  return { ok: true, total: snap.total };
}

/** Read the cached CFPB snapshot (null if never refreshed / on error). */
export async function getCfpbSnapshot(): Promise<CfpbSnapshot | null> {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: SNAPSHOT_KEY } });
    return row ? (row.value as unknown as CfpbSnapshot) : null;
  } catch {
    return null;
  }
}

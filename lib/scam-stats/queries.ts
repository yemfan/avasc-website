import { prisma } from "@/lib/prisma";

export type ScamStatPoint = { year: number; valueBillions: number };

export type ScamStatSeries = {
  metric: string;
  source: string;
  sourceUrl: string;
  points: ScamStatPoint[];
  /** Latest year's value and YoY % change (null if <2 points). */
  latest: { year: number; valueBillions: number; yoyPct: number | null } | null;
};

/**
 * Load a year-over-year stat series (e.g. "ic3_losses_usd"), ascending by year.
 * Falls back to null on any DB error so the page still renders.
 */
export async function getScamStatSeries(metric = "ic3_losses_usd"): Promise<ScamStatSeries | null> {
  try {
    const rows = await prisma.scamStat.findMany({
      where: { metric },
      orderBy: { year: "asc" },
      select: { year: true, valueBillions: true, source: true, sourceUrl: true },
    });
    if (rows.length === 0) return null;

    const points = rows.map((r) => ({ year: r.year, valueBillions: r.valueBillions }));
    const last = points[points.length - 1];
    const prev = points.length >= 2 ? points[points.length - 2] : null;
    const yoyPct =
      prev && prev.valueBillions > 0
        ? Math.round(((last.valueBillions - prev.valueBillions) / prev.valueBillions) * 100)
        : null;

    // Source is uniform per metric; take it from the newest row.
    const newest = rows[rows.length - 1];
    return {
      metric,
      source: newest.source,
      sourceUrl: newest.sourceUrl,
      points,
      latest: { year: last.year, valueBillions: last.valueBillions, yoyPct },
    };
  } catch (err) {
    console.error("[scam-stats] load failed", err instanceof Error ? err.message : err);
    return null;
  }
}

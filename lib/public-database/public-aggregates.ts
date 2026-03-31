import type { PrismaClient } from "@prisma/client";
import type { PublicPatternSummary } from "./public-profile-types";

type CaseAggRow = {
  paymentMethod: string | null;
  initialContactChannel: string | null;
  jurisdiction: string | null;
  createdAt: Date;
};

function tally(rows: CaseAggRow[]): {
  payment: Map<string, number>;
  platform: Map<string, number>;
  country: Map<string, number>;
  dates: Date[];
} {
  const payment = new Map<string, number>();
  const platform = new Map<string, number>();
  const country = new Map<string, number>();
  const dates: Date[] = [];

  for (const r of rows) {
    dates.push(r.createdAt);
    if (r.paymentMethod?.trim()) {
      const k = r.paymentMethod.trim();
      payment.set(k, (payment.get(k) ?? 0) + 1);
    }
    if (r.initialContactChannel?.trim()) {
      const k = r.initialContactChannel.trim();
      platform.set(k, (platform.get(k) ?? 0) + 1);
    }
    if (r.jurisdiction?.trim()) {
      const k = r.jurisdiction.trim();
      country.set(k, (country.get(k) ?? 0) + 1);
    }
  }

  return { payment, platform, country, dates };
}

function mapToSortedList(m: Map<string, number>): { label: string; count: number }[] {
  return [...m.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/**
 * Aggregate non-identifying case fields for cases linked to a cluster.
 */
export async function buildPublicPatternSummary(
  prisma: PrismaClient,
  clusterId: string,
  commonScript: string | null
): Promise<PublicPatternSummary> {
  const rows = await prisma.case.findMany({
    where: { clusterLinks: { some: { scamClusterId: clusterId } } },
    select: {
      paymentMethod: true,
      initialContactChannel: true,
      jurisdiction: true,
      createdAt: true,
    },
  });

  const { payment, platform, country, dates } = tally(rows);
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());

  return {
    reportCount: rows.length,
    firstReportedAt: sortedDates[0]?.toISOString() ?? null,
    lastReportedAt: sortedDates[sortedDates.length - 1]?.toISOString() ?? null,
    dominantPaymentMethods: mapToSortedList(payment).slice(0, 8),
    dominantPlatforms: mapToSortedList(platform).slice(0, 8),
    dominantCountries: mapToSortedList(country).slice(0, 12),
    commonScript,
  };
}

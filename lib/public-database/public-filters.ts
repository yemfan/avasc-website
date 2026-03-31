import type { PrismaClient } from "@prisma/client";
import { PUBLIC_CLUSTER_STATUS } from "./constants";
import type { AvailablePublicFilters, PublicRiskLevel } from "./public-profile-types";

export { getPublicDatabaseFilters } from "./get-public-database-filters";

const RISK_LEVELS: PublicRiskLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

/**
 * Normalize free-text search: trim, collapse whitespace, cap length.
 */
export function normalizePublicSearchQuery(raw: string | undefined): string {
  if (!raw) return "";
  return raw.trim().replace(/\s+/g, " ").slice(0, 280);
}

/**
 * Distinct filter values for published clusters + linked case aggregates (safe fields only).
 */
export async function getAvailablePublicFilters(prisma: PrismaClient): Promise<AvailablePublicFilters> {
  const published = await prisma.scamCluster.findMany({
    where: { publicStatus: PUBLIC_CLUSTER_STATUS },
    select: { id: true, scamType: true },
  });
  if (published.length === 0) {
    return {
      scamTypes: [],
      riskLevels: RISK_LEVELS,
      paymentMethods: [],
      platforms: [],
      countries: [],
    };
  }

  const clusterIds = published.map((p) => p.id);
  const scamTypes = [...new Set(published.map((p) => p.scamType).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );

  const caseRows = await prisma.case.findMany({
    where: {
      clusterLinks: { some: { scamClusterId: { in: clusterIds } } },
    },
    select: {
      paymentMethod: true,
      initialContactChannel: true,
      jurisdiction: true,
    },
  });

  const paymentMethods = countDistinctStrings(caseRows.map((c) => c.paymentMethod));
  const platforms = countDistinctStrings([
    ...caseRows.map((c) => c.initialContactChannel),
  ]);
  const countries = countDistinctStrings(caseRows.map((c) => c.jurisdiction));

  return {
    scamTypes,
    riskLevels: RISK_LEVELS,
    paymentMethods,
    platforms,
    countries,
  };
}

function countDistinctStrings(values: (string | null | undefined)[]): string[] {
  const counts = new Map<string, number>();
  for (const v of values) {
    const s = v?.trim();
    if (!s) continue;
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([k]) => k)
    .slice(0, 40);
}

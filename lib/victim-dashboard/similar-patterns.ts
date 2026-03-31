import type { PrismaClient } from "@prisma/client";
import { scoreCaseMatches } from "@/lib/matching";
import { suggestScamClustersFromMatches } from "@/lib/matching";
import { PUBLIC_CLUSTER_STATUS } from "@/lib/public-database/constants";

export type VictimSafeClusterMatch = {
  id: string;
  title: string;
  slug: string;
  scamType: string;
  riskLevel: string;
  summaryExcerpt: string;
  overlapNote: string;
};

/**
 * Published scam profiles only — no internal merge reasoning, no other victims’ private data.
 */
export async function getVictimSafePublishedClustersForCase(
  prisma: PrismaClient,
  caseId: string
): Promise<VictimSafeClusterMatch[]> {
  const matches = await scoreCaseMatches(prisma, caseId, {
    mode: "internal",
    includeLowConfidence: true,
    suppressNoisyPlatformOnly: true,
    limit: 220,
  });

  const suggestions = await suggestScamClustersFromMatches(prisma, matches, 40, 16);
  if (suggestions.length === 0) return [];

  const clusters = await prisma.scamCluster.findMany({
    where: {
      id: { in: suggestions.map((s) => s.clusterId) },
      publicStatus: PUBLIC_CLUSTER_STATUS,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      scamType: true,
      riskLevel: true,
      summary: true,
    },
  });

  const noteById = new Map(suggestions.map((s) => [s.clusterId, s.overlapNote]));

  return clusters.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    scamType: c.scamType,
    riskLevel: c.riskLevel,
    summaryExcerpt:
      c.summary.trim().length > 220 ? `${c.summary.trim().slice(0, 219)}…` : c.summary.trim() || "—",
    overlapNote: noteById.get(c.id) ?? "",
  }));
}

/** Count distinct published profiles linked to any of the user’s cases (via clustering). */
export async function countPublishedPatternsLinkedToUserCases(
  prisma: PrismaClient,
  userId: string
): Promise<number> {
  const grouped = await prisma.scamClusterCase.groupBy({
    by: ["scamClusterId"],
    where: {
      case: { userId },
      scamCluster: { publicStatus: PUBLIC_CLUSTER_STATUS },
    },
  });
  return grouped.length;
}

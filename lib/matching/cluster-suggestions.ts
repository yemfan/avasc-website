import type { PrismaClient } from "@prisma/client";
import type { CaseMatchResult } from "./match-types";

export type ClusterSuggestionRow = {
  clusterId: string;
  title: string;
  slug: string;
  overlapCaseCount: number;
  overlapNote: string;
};

/**
 * Rank curated scam clusters that appear on overlapping matched cases.
 * Pure follow-on to `CaseMatchResult[]` — keeps dependency direction one-way.
 */
export async function suggestScamClustersFromMatches(
  prisma: PrismaClient,
  matchResults: CaseMatchResult[],
  maxMatchedCases: number,
  maxClusters: number
): Promise<ClusterSuggestionRow[]> {
  const caseIds = [...new Set(matchResults.map((m) => m.matchedCaseId))].slice(0, maxMatchedCases);
  if (caseIds.length === 0) return [];

  const links = await prisma.scamClusterCase.findMany({
    where: { caseId: { in: caseIds } },
    include: { scamCluster: { select: { id: true, title: true, slug: true } } },
    take: 200,
  });

  const counts = new Map<string, { cluster: (typeof links)[0]["scamCluster"]; n: number }>();
  for (const l of links) {
    const cur = counts.get(l.scamClusterId);
    if (cur) cur.n += 1;
    else counts.set(l.scamClusterId, { cluster: l.scamCluster, n: 1 });
  }

  const ranked = [...counts.values()].sort((a, b) => b.n - a.n).slice(0, maxClusters);

  return ranked.map((r) => ({
    clusterId: r.cluster.id,
    title: r.cluster.title,
    slug: r.cluster.slug,
    overlapCaseCount: r.n,
    overlapNote: `Linked to ${r.n} overlapping case${r.n === 1 ? "" : "s"} that share indicators with this report.`,
  }));
}

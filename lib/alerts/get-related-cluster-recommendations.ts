import type { RiskLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PUBLIC_CLUSTER_STATUS } from "@/lib/public-database/constants";

export type RelatedClusterRecommendation = {
  id: string;
  slug: string;
  title: string;
  scamType: string;
  summary: string;
  riskLevel: RiskLevel;
  reportCount: number;
  sharedIndicatorCount: number;
  score: number;
};

/**
 * Suggest published clusters similar to the user's follows (shared scam type / indicator keys, report volume).
 */
export async function getRelatedClusterRecommendations(
  followedClusterIds: string[],
  limit = 5
): Promise<RelatedClusterRecommendation[]> {
  if (followedClusterIds.length === 0) return [];

  const followed = await prisma.scamCluster.findMany({
    where: {
      id: { in: followedClusterIds },
    },
    include: {
      indicatorAggregates: {
        where: { isPublic: true },
      },
    },
  });

  const scamTypes = [...new Set(followed.map((c) => c.scamType))];
  const indicatorKeys = new Set(
    followed.flatMap((c) =>
      c.indicatorAggregates.map((i) => `${i.indicatorType}:${i.normalizedValue}`)
    )
  );

  const candidates = await prisma.scamCluster.findMany({
    where: {
      publicStatus: PUBLIC_CLUSTER_STATUS,
      id: { notIn: followedClusterIds },
      OR: [
        { scamType: { in: scamTypes } },
        {
          indicatorAggregates: {
            some: {
              isPublic: true,
            },
          },
        },
      ],
    },
    include: {
      indicatorAggregates: {
        where: { isPublic: true },
      },
      _count: {
        select: {
          caseLinks: true,
        },
      },
    },
    take: 25,
    orderBy: [{ updatedAt: "desc" }],
  });

  return candidates
    .map((cluster) => {
      const sharedIndicatorCount = cluster.indicatorAggregates.filter((i) =>
        indicatorKeys.has(`${i.indicatorType}:${i.normalizedValue}`)
      ).length;

      let score = 0;
      if (scamTypes.includes(cluster.scamType)) score += 50;
      score += sharedIndicatorCount * 30;
      score += Math.min(cluster._count.caseLinks, 10);

      return {
        id: cluster.id,
        slug: cluster.slug,
        title: cluster.title,
        scamType: cluster.scamType,
        summary: cluster.summary,
        riskLevel: cluster.riskLevel,
        reportCount: cluster._count.caseLinks,
        sharedIndicatorCount,
        score,
      };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

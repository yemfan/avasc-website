import { ClusterPublicStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { PublicScamProfileCard, RelatedPublicScamProfile } from "@/lib/public-database/public-profile-types";
import { normalizePublicRiskLevel } from "./public-risk";

function excerpt(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/**
 * Map a slim related profile to the card model used on the public detail page (search / previews omitted).
 */
export function relatedPublicScamProfileToCard(r: RelatedPublicScamProfile): PublicScamProfileCard {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    scamType: r.scamType,
    riskLevel: normalizePublicRiskLevel(r.riskLevel),
    summaryExcerpt: excerpt(r.summary, 220),
    reportCount: r.reportCount,
    firstReportedAt: null,
    lastReportedAt: null,
    lastUpdatedAt: new Date().toISOString(),
    indicatorPreview: [],
    dominantPlatforms: [],
    dominantPaymentMethods: [],
    relevanceScore: r.sharedIndicatorCount,
    matchTier: "browse",
  };
}

/**
 * Related published profiles: overlap on public `ClusterIndicatorAggregate` rows, same scam type, and risk alignment.
 */
export async function getRelatedPublicClusters(
  clusterId: string,
  limit = 6
): Promise<RelatedPublicScamProfile[]> {
  const sourceCluster = await prisma.scamCluster.findUnique({
    where: { id: clusterId },
    include: {
      indicatorAggregates: {
        where: {
          isPublic: true,
        },
      },
    },
  });

  if (!sourceCluster) {
    return [];
  }

  const sourceIndicators = sourceCluster.indicatorAggregates
    .map((indicator) => ({
      indicatorType: indicator.indicatorType,
      normalizedValue: indicator.normalizedValue,
    }))
    .filter((item) => item.normalizedValue && item.normalizedValue.trim().length > 0);

  const orConditions: Prisma.ScamClusterWhereInput[] = [{ scamType: sourceCluster.scamType }];

  if (sourceIndicators.length > 0) {
    orConditions.push({
      indicatorAggregates: {
        some: {
          isPublic: true,
          OR: sourceIndicators.map((indicator) => ({
            indicatorType: indicator.indicatorType,
            normalizedValue: indicator.normalizedValue,
          })),
        },
      },
    });
  }

  const publishedCandidates = await prisma.scamCluster.findMany({
    where: {
      id: { not: clusterId },
      publicStatus: ClusterPublicStatus.PUBLISHED,
      OR: orConditions,
    },
    include: {
      caseLinks: {
        select: { id: true },
      },
      indicatorAggregates: {
        where: {
          isPublic: true,
        },
      },
    },
    take: 30,
  });

  const sourceIndicatorKeys = new Set(
    sourceIndicators.map((indicator) => `${indicator.indicatorType}:${indicator.normalizedValue}`)
  );

  const ranked = publishedCandidates
    .map((cluster) => {
      const sharedIndicatorCount = cluster.indicatorAggregates.filter((indicator) =>
        sourceIndicatorKeys.has(`${indicator.indicatorType}:${indicator.normalizedValue}`)
      ).length;

      let score = 0;

      if (cluster.scamType === sourceCluster.scamType) score += 50;
      score += sharedIndicatorCount * 40;

      if (cluster.riskLevel === sourceCluster.riskLevel) score += 10;

      return {
        id: cluster.id,
        slug: cluster.slug,
        title: cluster.title,
        scamType: cluster.scamType,
        summary: cluster.summary,
        riskLevel: cluster.riskLevel,
        reportCount: cluster.caseLinks.length,
        sharedIndicatorCount,
        _score: score,
        _updatedAt: cluster.updatedAt.getTime(),
      };
    })
    .filter((item) => item._score > 0)
    .sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      return b._updatedAt - a._updatedAt;
    })
    .slice(0, limit)
    .map((item) => {
      const { _score, _updatedAt, ...publicItem } = item;
      void _score;
      void _updatedAt;
      return publicItem;
    });

  return ranked;
}

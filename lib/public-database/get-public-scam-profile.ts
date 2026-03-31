import { ClusterPublicStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  canShowPublicIndicator,
  getPublicIndicatorDisplayValue,
} from "@/lib/public-database/public-indicator-display";
import { getRelatedPublicClusters } from "@/lib/public-database/public-related-clusters";
import type { PublicIndicatorGroup, PublicScamProfile } from "@/lib/public-database/public-scam-profile-types";

export async function getPublicScamProfileBySlug(
  slug: string
): Promise<PublicScamProfile | null> {
  const cluster = await prisma.scamCluster.findUnique({
    where: { slug },
    include: {
      caseLinks: {
        include: {
          case: {
            select: {
              id: true,
              createdAt: true,
            },
          },
        },
      },
      indicatorAggregates: {
        orderBy: [
          { indicatorType: "asc" },
          { isVerified: "desc" },
          { linkedCaseCount: "desc" },
          { occurrenceCount: "desc" },
        ],
      },
    },
  });

  if (!cluster || cluster.publicStatus !== ClusterPublicStatus.PUBLISHED) {
    return null;
  }

  const publicIndicators = cluster.indicatorAggregates.filter(canShowPublicIndicator);

  const groupedMap = new Map<string, PublicIndicatorGroup>();

  for (const indicator of publicIndicators) {
    const type = indicator.indicatorType;
    const group = groupedMap.get(type) ?? {
      type,
      items: [],
    };

    group.items.push({
      id: indicator.id,
      type,
      value: getPublicIndicatorDisplayValue(indicator),
      linkedCaseCount: indicator.linkedCaseCount,
      occurrenceCount: indicator.occurrenceCount,
      isVerified: indicator.isVerified,
    });

    groupedMap.set(type, group);
  }

  const indicators = Array.from(groupedMap.values());

  const linkedCases = cluster.caseLinks.map((link) => link.case);
  const reportCount = linkedCases.length;

  const firstReportedAt =
    linkedCases.length > 0
      ? new Date(Math.min(...linkedCases.map((c) => c.createdAt.getTime())))
      : null;

  const latestReportedAt =
    linkedCases.length > 0
      ? new Date(Math.max(...linkedCases.map((c) => c.createdAt.getTime())))
      : null;

  const relatedProfiles = await getRelatedPublicClusters(cluster.id);

  return {
    id: cluster.id,
    slug: cluster.slug,
    title: cluster.title,
    scamType: cluster.scamType,
    summary: cluster.summary,
    riskLevel: cluster.riskLevel,
    redFlags: cluster.redFlags,
    commonScript: cluster.commonScript,
    safetyWarning: cluster.safetyWarning,
    recommendedNextStep: cluster.recommendedNextStep,
    reportCount,
    firstReportedAt,
    latestReportedAt,
    indicators,
    relatedProfiles,
  };
}

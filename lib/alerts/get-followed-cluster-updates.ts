import type { IndicatorType, RiskLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PUBLIC_CLUSTER_STATUS } from "@/lib/public-database/constants";

export type FollowedClusterUpdateRow = {
  id: string;
  slug: string;
  title: string;
  scamType: string;
  summary: string;
  riskLevel: RiskLevel;
  threatScore: number;
  updatedAt: Date;
  reportCount: number;
  newIndicators: Array<{
    type: IndicatorType;
    value: string;
    verified: boolean;
  }>;
};

/**
 * Published clusters the subscription follows, with recent public indicator changes since `since`.
 */
export async function getFollowedClusterUpdates(
  subscriptionId: string,
  since: Date
): Promise<FollowedClusterUpdateRow[]> {
  const links = await prisma.clusterSubscription.findMany({
    where: {
      subscriptionId,
      scamCluster: {
        publicStatus: PUBLIC_CLUSTER_STATUS,
      },
    },
    include: {
      scamCluster: {
        include: {
          indicatorAggregates: {
            where: {
              isPublic: true,
              updatedAt: { gte: since },
            },
            orderBy: [{ isVerified: "desc" }, { linkedCaseCount: "desc" }],
            take: 5,
          },
          _count: {
            select: {
              caseLinks: true,
            },
          },
        },
      },
    },
  });

  return links.map((link) => ({
    id: link.scamCluster.id,
    slug: link.scamCluster.slug,
    title: link.scamCluster.title,
    scamType: link.scamCluster.scamType,
    summary: link.scamCluster.summary,
    riskLevel: link.scamCluster.riskLevel,
    threatScore: link.scamCluster.threatScore,
    updatedAt: link.scamCluster.updatedAt,
    reportCount: link.scamCluster._count.caseLinks,
    newIndicators: link.scamCluster.indicatorAggregates.map((i) => ({
      type: i.indicatorType,
      value: i.displayValue || i.normalizedValue,
      verified: i.isVerified,
    })),
  }));
}

import type { PrismaClient } from "@prisma/client";
import { IndicatorType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ClusterAlertMetrics } from "@/lib/alerts/alert-scoring";

const clusterAlertInclude = {
  caseLinks: {
    include: {
      case: {
        select: {
          createdAt: true,
          amountLost: true,
        },
      },
    },
  },
  indicatorAggregates: true,
} as const;

export type ClusterWithAlertRelations = NonNullable<
  Awaited<ReturnType<typeof getClusterAlertMetricsForClient>>
>["cluster"];

/**
 * Core loader — pass a `PrismaClient` (e.g. cron / tests).
 */
export async function getClusterAlertMetricsForClient(prismaClient: PrismaClient, clusterId: string) {
  const cluster = await prismaClient.scamCluster.findUnique({
    where: { id: clusterId },
    include: clusterAlertInclude,
  });

  if (!cluster) {
    throw new Error("Cluster not found");
  }

  const now = new Date();
  const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const linkedCases = cluster.caseLinks.map((link) => link.case);

  const reportCount = linkedCases.length;

  const reportsLast24h = linkedCases.filter((c) => c.createdAt >= twentyFourHoursAgo).length;

  const reportsLast6h = linkedCases.filter((c) => c.createdAt >= sixHoursAgo).length;

  const verifiedWalletCount = cluster.indicatorAggregates.filter(
    (i) => i.indicatorType === IndicatorType.WALLET && i.isVerified
  ).length;

  const verifiedDomainCount = cluster.indicatorAggregates.filter(
    (i) => i.indicatorType === IndicatorType.DOMAIN && i.isVerified
  ).length;

  const verifiedEmailCount = cluster.indicatorAggregates.filter(
    (i) => i.indicatorType === IndicatorType.EMAIL && i.isVerified
  ).length;

  const amountCases = linkedCases.filter((c) => c.amountLost !== null);
  const avgLossUsd =
    amountCases.length > 0
      ? amountCases.reduce((sum, c) => sum + Number(c.amountLost ?? 0), 0) / amountCases.length
      : 0;

  const matchConnections = linkedCases.length;

  const metrics: ClusterAlertMetrics = {
    reportCount,
    reportsLast24h,
    reportsLast6h,
    verifiedWalletCount,
    verifiedDomainCount,
    verifiedEmailCount,
    avgLossUsd,
    matchConnections,
    scamType: cluster.scamType,
  };

  return { cluster, metrics };
}

/** App default: uses shared `prisma` from `@/lib/prisma`. */
export async function getClusterAlertMetrics(clusterId: string) {
  return getClusterAlertMetricsForClient(prisma, clusterId);
}

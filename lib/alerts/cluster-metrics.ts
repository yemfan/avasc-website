import type { PrismaClient } from "@prisma/client";
import type { ClusterAlertMetrics } from "@/lib/alerts/alert-scoring";
import {
  getClusterAlertMetricsForClient,
  type ClusterWithAlertRelations,
} from "@/lib/alerts/get-cluster-alert-metrics";

export type { ClusterWithAlertRelations };

/**
 * Metrics only — for cron / pipelines that already have a `PrismaClient`.
 */
export async function loadClusterAlertMetrics(
  prisma: PrismaClient,
  clusterId: string
): Promise<ClusterAlertMetrics> {
  const { metrics } = await getClusterAlertMetricsForClient(prisma, clusterId);
  return metrics;
}

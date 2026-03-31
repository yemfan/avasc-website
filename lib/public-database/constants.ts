import { ClusterPublicStatus } from "@prisma/client";

/**
 * Only clusters with this `ScamCluster.publicStatus` appear in public routes.
 * Private cases, draft clusters, and `isPublic: false` indicators must never be shown — enforce in services only.
 */
export const PUBLIC_CLUSTER_STATUS: ClusterPublicStatus = ClusterPublicStatus.PUBLISHED;

export type PublicClusterStatus = typeof PUBLIC_CLUSTER_STATUS;

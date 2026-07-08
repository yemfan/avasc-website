import type { Prisma } from "@prisma/client";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

export type ReviewQueueItem = {
  id: string;
  title: string;
  message: string;
  alertType: string;
  riskLevel?: string | null;
  sourceName?: string | null;
  sourceFileId?: string | null;
  scamClusterId?: string | null;
  scamClusterSlug?: string | null;
  scamClusterTitle?: string | null;
  approvalStatus: string;
  isPublicVisible: boolean;
  isRealtimeVisible: boolean;
  isHomepageVisible: boolean;
  isDailyFeedVisible: boolean;
  createdAt: Date;
  indicatorLabels: string[];
};

export type GetReviewQueueOverviewOptions = {
  /** e.g. `"ONEDRIVE"` for imported-feed queue only */
  sourceType?: string;
  take?: number;
};

export async function getReviewQueueOverview(
  options?: GetReviewQueueOverviewOptions
): Promise<ReviewQueueItem[]> {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const where: Prisma.AlertWhereInput = { approvalStatus: "PENDING" };
  if (options?.sourceType) {
    where.sourceType = options.sourceType;
  }

  const alerts = await prisma.alert.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: options?.take ?? 100,
    select: {
      id: true,
      title: true,
      message: true,
      alertType: true,
      riskLevel: true,
      sourceName: true,
      sourceFileId: true,
      scamClusterId: true,
      approvalStatus: true,
      isPublicVisible: true,
      isRealtimeVisible: true,
      isHomepageVisible: true,
      isDailyFeedVisible: true,
      createdAt: true,
      scamCluster: {
        select: {
          slug: true,
          title: true,
          indicatorAggregates: {
            where: { isPublic: true },
            orderBy: [{ isVerified: "desc" }, { linkedCaseCount: "desc" }],
            take: 8,
            select: {
              indicatorType: true,
              displayValue: true,
              normalizedValue: true,
            },
          },
        },
      },
    },
  });

  return alerts.map((a) => ({
    id: a.id,
    title: a.title,
    message: a.message,
    alertType: a.alertType,
    riskLevel: a.riskLevel,
    sourceName: a.sourceName,
    sourceFileId: a.sourceFileId,
    scamClusterId: a.scamClusterId,
    scamClusterSlug: a.scamCluster?.slug ?? null,
    scamClusterTitle: a.scamCluster?.title ?? null,
    approvalStatus: a.approvalStatus,
    isPublicVisible: a.isPublicVisible,
    isRealtimeVisible: a.isRealtimeVisible,
    isHomepageVisible: a.isHomepageVisible,
    isDailyFeedVisible: a.isDailyFeedVisible,
    createdAt: a.createdAt,
    indicatorLabels:
      a.scamCluster?.indicatorAggregates.map((ind) =>
        `${ind.indicatorType}: ${ind.displayValue ?? ind.normalizedValue}`.slice(0, 140)
      ) ?? [],
  }));
}

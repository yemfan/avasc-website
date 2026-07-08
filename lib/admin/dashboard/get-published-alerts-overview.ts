import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

export type PublishedAlertRow = {
  id: string;
  title: string;
  alertType: string;
  scamClusterSlug?: string | null;
  scamClusterTitle?: string | null;
  isPublicVisible: boolean;
  isRealtimeVisible: boolean;
  isHomepageVisible: boolean;
  isDailyFeedVisible: boolean;
  createdAt: Date;
  approvedAt: Date | null;
};

export async function getPublishedAlertsOverview(): Promise<PublishedAlertRow[]> {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const rows = await prisma.alert.findMany({
    where: {
      approvalStatus: "APPROVED",
      isPublicVisible: true,
    },
    orderBy: [{ approvedAt: "desc" }, { createdAt: "desc" }],
    take: 200,
    select: {
      id: true,
      title: true,
      alertType: true,
      isPublicVisible: true,
      isRealtimeVisible: true,
      isHomepageVisible: true,
      isDailyFeedVisible: true,
      createdAt: true,
      approvedAt: true,
      scamCluster: { select: { slug: true, title: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    alertType: r.alertType,
    scamClusterSlug: r.scamCluster?.slug ?? null,
    scamClusterTitle: r.scamCluster?.title ?? null,
    isPublicVisible: r.isPublicVisible,
    isRealtimeVisible: r.isRealtimeVisible,
    isHomepageVisible: r.isHomepageVisible,
    isDailyFeedVisible: r.isDailyFeedVisible,
    createdAt: r.createdAt,
    approvedAt: r.approvedAt,
  }));
}

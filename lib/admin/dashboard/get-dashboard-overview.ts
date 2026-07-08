import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

import { amountLostUsdFromPayload } from "./payload-amount";

export type DashboardOverview = {
  liveStatus: {
    activeAlerts: number;
    pendingApproval: number;
    importsToday: number;
    failedImports: number;
  };
  kpis: {
    alertsPublishedToday: number;
    newScamClustersToday: number;
    estimatedLossesTracked24h: number;
    approvalRate7d: number;
  };
  internalRealtimeFeed: Array<{
    id: string;
    title: string;
    shortText: string;
    sourceName?: string | null;
    createdAt: Date;
  }>;
  attentionItems: Array<{
    id: string;
    kind: "FAILED_IMPORT" | "PENDING_ALERT";
    message: string;
  }>;
  recentImports: Array<{
    id: string;
    fileName: string;
    source: string;
    type: string;
    status: string;
    linkedAlertTitle?: string | null;
    errorMessage?: string | null;
    createdAt: Date;
  }>;
  reviewQueue: Array<{
    id: string;
    title: string;
    type: string;
    priority?: string | null;
    source?: string | null;
    summary: string;
    createdAt: Date;
  }>;
};

export async function getDashboardOverview(): Promise<DashboardOverview> {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    activeAlerts,
    pendingApproval,
    importsToday,
    failedImports,
    alertsPublishedToday,
    newScamClustersToday,
    approved7d,
    imported7d,
    recentRealtime,
    recentImports,
    pendingAlerts,
    recentFailedImports,
    recentPendingAlerts,
    ingestions24hForLoss,
  ] = await Promise.all([
    prisma.alert.count({
      where: {
        approvalStatus: "APPROVED",
        isPublicVisible: true,
      },
    }),
    prisma.alert.count({
      where: {
        approvalStatus: "PENDING",
      },
    }),
    prisma.externalContentIngestion.count({
      where: { createdAt: { gte: dayAgo } },
    }),
    prisma.externalContentIngestion.count({
      where: {
        status: "FAILED",
        createdAt: { gte: dayAgo },
      },
    }),
    prisma.alert.count({
      where: {
        approvalStatus: "APPROVED",
        approvedAt: { gte: dayAgo },
      },
    }),
    prisma.scamCluster.count({
      where: {
        createdAt: { gte: dayAgo },
      },
    }),
    prisma.alert.count({
      where: {
        approvalStatus: "APPROVED",
        createdAt: { gte: weekAgo },
        sourceType: "ONEDRIVE",
      },
    }),
    prisma.alert.count({
      where: {
        createdAt: { gte: weekAgo },
        sourceType: "ONEDRIVE",
      },
    }),
    prisma.alert.findMany({
      where: {
        alertType: "REALTIME",
      },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        message: true,
        sourceName: true,
        createdAt: true,
      },
    }),
    prisma.externalContentIngestion.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        linkedAlert: {
          select: {
            title: true,
          },
        },
      },
    }),
    prisma.alert.findMany({
      where: {
        approvalStatus: "PENDING",
      },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        alertType: true,
        riskLevel: true,
        sourceName: true,
        message: true,
        createdAt: true,
      },
    }),
    prisma.externalContentIngestion.findMany({
      where: { status: "FAILED" },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        sourceFilePath: true,
      },
    }),
    prisma.alert.findMany({
      where: { approvalStatus: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
      },
    }),
    prisma.externalContentIngestion.findMany({
      where: { createdAt: { gte: dayAgo } },
      select: { rawPayload: true },
    }),
  ]);

  let estimatedLossesTracked24h = 0;
  for (const row of ingestions24hForLoss) {
    estimatedLossesTracked24h += amountLostUsdFromPayload(row.rawPayload);
  }

  const approvalRate7d = imported7d > 0 ? Math.round((approved7d / imported7d) * 100) : 0;

  return {
    liveStatus: {
      activeAlerts,
      pendingApproval,
      importsToday,
      failedImports,
    },
    kpis: {
      alertsPublishedToday,
      newScamClustersToday,
      estimatedLossesTracked24h: Math.round(estimatedLossesTracked24h * 100) / 100,
      approvalRate7d,
    },
    internalRealtimeFeed: recentRealtime.map((row) => ({
      id: row.id,
      title: row.title,
      shortText: row.message,
      sourceName: row.sourceName,
      createdAt: row.createdAt,
    })),
    attentionItems: [
      ...recentFailedImports.map((row) => ({
        id: row.id,
        kind: "FAILED_IMPORT" as const,
        message: `Failed import: ${row.sourceFilePath}`,
      })),
      ...recentPendingAlerts.map((row) => ({
        id: row.id,
        kind: "PENDING_ALERT" as const,
        message: `Pending approval: ${row.title}`,
      })),
    ],
    recentImports: recentImports.map((row) => ({
      id: row.id,
      fileName: row.sourceFilePath,
      source: row.sourceName,
      type: row.contentType,
      status: row.status,
      linkedAlertTitle: row.linkedAlert?.title ?? null,
      errorMessage: row.errorMessage,
      createdAt: row.createdAt,
    })),
    reviewQueue: pendingAlerts.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.alertType,
      priority: row.riskLevel,
      source: row.sourceName,
      summary: row.message,
      createdAt: row.createdAt,
    })),
  };
}

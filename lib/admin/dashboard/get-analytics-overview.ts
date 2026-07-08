import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

import { daysAgo } from "./dashboard-time";

export type AnalyticsOverview = {
  alertsByType: Array<{ label: string; value: number }>;
  importsByStatus: Array<{ label: string; value: number }>;
  casesByScamType: Array<{ label: string; value: number }>;
  topIndicatorTypes: Array<{ label: string; value: number }>;
  clustersByRisk: Array<{ label: string; value: number }>;
  lossesOverTime: Array<{ label: string; value: number }>;
};

type WindowKey = "7d" | "30d";

async function bucketAlertsByType(since: Date): Promise<AnalyticsOverview["alertsByType"]> {
  const rows = await prisma.alert.groupBy({
    by: ["alertType"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });
  return rows
    .map((r) => ({ label: r.alertType || "UNKNOWN", value: r._count._all }))
    .sort((a, b) => b.value - a.value);
}

async function bucketImportsByStatus(since: Date): Promise<AnalyticsOverview["importsByStatus"]> {
  const rows = await prisma.externalContentIngestion.groupBy({
    by: ["status"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });
  return rows
    .map((r) => ({ label: r.status || "UNKNOWN", value: r._count._all }))
    .sort((a, b) => b.value - a.value);
}

async function bucketCasesByScamType(since: Date): Promise<AnalyticsOverview["casesByScamType"]> {
  const rows = await prisma.case.groupBy({
    by: ["scamType"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });
  return rows
    .map((r) => ({ label: r.scamType, value: r._count._all }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);
}

async function bucketIndicatorTypes(since: Date): Promise<AnalyticsOverview["topIndicatorTypes"]> {
  const rows = await prisma.caseIndicator.groupBy({
    by: ["indicatorType"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });
  return rows
    .map((r) => ({ label: String(r.indicatorType), value: r._count._all }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

async function bucketClustersByRisk(): Promise<AnalyticsOverview["clustersByRisk"]> {
  const rows = await prisma.scamCluster.groupBy({
    by: ["riskLevel"],
    _count: { _all: true },
  });
  return rows
    .map((r) => ({ label: String(r.riskLevel), value: r._count._all }))
    .sort((a, b) => b.value - a.value);
}

/** UTC calendar day totals for reported losses in range. */
async function lossesOverTimeBuckets(since: Date): Promise<AnalyticsOverview["lossesOverTime"]> {
  const cases = await prisma.case.findMany({
    where: {
      createdAt: { gte: since },
      amountLost: { not: null },
    },
    select: { createdAt: true, amountLost: true },
  });

  const map = new Map<string, number>();
  for (const c of cases) {
    const d = c.createdAt;
    const label = d.toISOString().slice(0, 10);
    const add = c.amountLost != null ? Number(c.amountLost) : 0;
    map.set(label, (map.get(label) ?? 0) + add);
  }

  return [...map.entries()]
    .map(([label, value]) => ({ label, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export async function getAnalyticsOverview(options?: { window?: WindowKey }): Promise<AnalyticsOverview> {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const now = new Date();
  const window: WindowKey = options?.window ?? "7d";
  const since = window === "30d" ? daysAgo(now, 30) : daysAgo(now, 7);

  const [
    alertsByType,
    importsByStatus,
    casesByScamType,
    topIndicatorTypes,
    clustersByRisk,
    lossesOverTime,
  ] = await Promise.all([
    bucketAlertsByType(since),
    bucketImportsByStatus(since),
    bucketCasesByScamType(since),
    bucketIndicatorTypes(since),
    bucketClustersByRisk(),
    lossesOverTimeBuckets(since),
  ]);

  return {
    alertsByType,
    importsByStatus,
    casesByScamType,
    topIndicatorTypes,
    clustersByRisk,
    lossesOverTime,
  };
}

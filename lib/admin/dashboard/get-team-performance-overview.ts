import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

import { daysAgo } from "./dashboard-time";

export type TeamPerformanceOverview = {
  rows: Array<{
    userId?: string | null;
    name: string;
    submittedCount: number;
    approvedCount: number;
    rejectedCount: number;
    approvalRate: number;
    rejectionRate: number;
    qualityScore: number;
  }>;
};

export async function getTeamPerformanceOverview(): Promise<TeamPerformanceOverview> {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const now = new Date();
  const since = daysAgo(now, 30);

  const decisions = await prisma.alert.findMany({
    where: {
      approvedAt: { gte: since },
      approvalStatus: { in: ["APPROVED", "REJECTED"] },
    },
    select: {
      approvalStatus: true,
      approvedByUserId: true,
      sourceName: true,
    },
  });

  type Row = {
    userId: string | null;
    approved: number;
    rejected: number;
    sourceFallback: string | null;
  };
  const map = new Map<string, Row>();

  for (const d of decisions) {
    const uid = d.approvedByUserId;
    const key = uid ?? `src:${d.sourceName ?? "unknown"}`;
    let row = map.get(key);
    if (!row) {
      row = { userId: uid, approved: 0, rejected: 0, sourceFallback: d.sourceName };
      map.set(key, row);
    }
    if (d.approvalStatus === "APPROVED") row.approved += 1;
    if (d.approvalStatus === "REJECTED") row.rejected += 1;
  }

  const userIds = [...new Set([...map.values()].map((r) => r.userId).filter(Boolean))] as string[];
  const users =
    userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, displayName: true, email: true },
        })
      : [];
  const userLabel = new Map(users.map((u) => [u.id, u.displayName?.trim() || u.email || u.id]));

  const rows: TeamPerformanceOverview["rows"] = [];
  for (const row of map.values()) {
    const approvedCount = row.approved;
    const rejectedCount = row.rejected;
    const submittedCount = approvedCount + rejectedCount;
    const name = row.userId
      ? userLabel.get(row.userId) ?? "Staff"
      : `Source: ${row.sourceFallback ?? "unknown"}`;
    const approvalRate =
      submittedCount === 0 ? 0 : Math.round((approvedCount / submittedCount) * 1000) / 10;
    const rejectionRate =
      submittedCount === 0 ? 0 : Math.round((rejectedCount / submittedCount) * 1000) / 10;
    const qualityScore = Math.min(100, Math.round(approvalRate * 0.9 + (submittedCount > 0 ? 10 : 0)));

    rows.push({
      userId: row.userId,
      name,
      submittedCount,
      approvedCount,
      rejectedCount,
      approvalRate,
      rejectionRate,
      qualityScore,
    });
  }

  rows.sort((a, b) => b.submittedCount - a.submittedCount);

  return { rows };
}

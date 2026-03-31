import type { IndicatorType, Prisma, PrismaClient } from "@prisma/client";

const caseDetailInclude = {
  user: { select: { id: true, email: true, displayName: true } },
  indicators: {
    orderBy: [{ indicatorType: "asc" as const }, { createdAt: "asc" as const }],
  },
  evidenceFiles: { orderBy: { createdAt: "desc" as const } },
  clusterLinks: {
    include: {
      scamCluster: {
        select: { id: true, title: true, slug: true, publicStatus: true, riskLevel: true },
      },
    },
  },
  supportRequests: {
    orderBy: { createdAt: "desc" as const },
    include: {
      user: { select: { id: true, email: true, displayName: true } },
      assignedTo: { select: { id: true, email: true, displayName: true } },
    },
  },
} satisfies Prisma.CaseInclude;

export type AdminCaseDetailRecord = Prisma.CaseGetPayload<{ include: typeof caseDetailInclude }>;

export async function fetchAdminCaseDetail(
  prisma: PrismaClient,
  caseId: string
): Promise<AdminCaseDetailRecord | null> {
  return prisma.case.findUnique({
    where: { id: caseId },
    include: caseDetailInclude,
  });
}

export type IndicatorMatchInfo = {
  otherCaseCount: number;
};

/** Count other cases sharing the same normalized type+value (pair). */
export async function fetchIndicatorMatchCounts(
  prisma: PrismaClient,
  caseId: string,
  indicators: { id: string; indicatorType: IndicatorType; normalizedValue: string }[]
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  await Promise.all(
    indicators.map(async (ind) => {
      const otherCaseCount = await prisma.caseIndicator.count({
        where: {
          indicatorType: ind.indicatorType,
          normalizedValue: ind.normalizedValue,
          caseId: { not: caseId },
        },
      });
      map.set(ind.id, otherCaseCount);
    })
  );
  return map;
}

export async function fetchCaseAuditTimeline(
  prisma: PrismaClient,
  params: { caseId: string; indicatorIds: string[]; evidenceIds: string[] },
  take = 80
) {
  const { caseId, indicatorIds, evidenceIds } = params;
  const or: Prisma.AuditLogWhereInput[] = [{ entityType: "Case", entityId: caseId }];
  if (indicatorIds.length) {
    or.push({ entityType: "CaseIndicator", entityId: { in: indicatorIds } });
  }
  if (evidenceIds.length) {
    or.push({ entityType: "EvidenceFile", entityId: { in: evidenceIds } });
  }
  return prisma.auditLog.findMany({
    where: { OR: or },
    orderBy: { createdAt: "desc" },
    take,
    include: { actor: { select: { email: true, displayName: true } } },
  });
}

/** Legacy hook; `Case` no longer links to global `Entity` rows in this schema. */
export function maxEntityRiskScore(): number {
  return 0;
}

export function riskLevelLabel(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 80) return "critical";
  if (score >= 55) return "high";
  if (score >= 30) return "medium";
  if (score > 0) return "low";
  return "low";
}

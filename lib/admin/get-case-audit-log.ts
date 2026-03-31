import { prisma } from "@/lib/prisma";

export async function getCaseAuditLog(caseId: string) {
  return prisma.auditLog.findMany({
    where: {
      entityType: "Case",
      entityId: caseId,
    },
    include: {
      actor: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });
}

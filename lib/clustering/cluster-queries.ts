import type { PrismaClient } from "@prisma/client";

export async function getCaseIdsInCluster(
  prisma: PrismaClient,
  clusterId: string,
  take: number
): Promise<string[]> {
  const rows = await prisma.scamClusterCase.findMany({
    where: { scamClusterId: clusterId },
    select: { caseId: true },
    take,
  });
  return rows.map((r) => r.caseId);
}

export async function filterCaseIdsNotInAnyCluster(
  prisma: PrismaClient,
  caseIds: string[]
): Promise<string[]> {
  if (caseIds.length === 0) return [];
  const links = await prisma.scamClusterCase.findMany({
    where: { caseId: { in: caseIds } },
    select: { caseId: true },
  });
  const busy = new Set(links.map((l) => l.caseId));
  return caseIds.filter((id) => !busy.has(id));
}

export async function getLinkedClusterIdsForCase(
  prisma: PrismaClient,
  caseId: string
): Promise<string[]> {
  const rows = await prisma.scamClusterCase.findMany({
    where: { caseId },
    select: { scamClusterId: true },
  });
  return rows.map((r) => r.scamClusterId);
}

import { prisma } from "@/lib/prisma";
import { normalizeIndicatorValue } from "@/lib/indicators";
import { riskScoreFromReportCount } from "@/lib/risk";

/** Upsert `ScamEntity` rows and link them to a case once; refresh risk scores. */
export async function linkCaseIndicatorsToEntities(caseId: string) {
  const indicators = await prisma.caseIndicator.findMany({ where: { caseId } });

  for (const ind of indicators) {
    const normalized = normalizeIndicatorValue(ind.type, ind.value);
    if (!normalized) continue;

    let entity = await prisma.scamEntity.findUnique({
      where: {
        type_normalizedValue: {
          type: ind.type,
          normalizedValue: normalized,
        },
      },
    });

    if (!entity) {
      entity = await prisma.scamEntity.create({
        data: {
          type: ind.type,
          normalizedValue: normalized,
          reportCount: 0,
          riskScore: 0,
        },
      });
    }

    const existing = await prisma.caseEntityLink.findUnique({
      where: {
        caseId_entityId: { caseId, entityId: entity.id },
      },
    });
    if (existing) continue;

    await prisma.caseEntityLink.create({
      data: { caseId, entityId: entity.id },
    });

    const updated = await prisma.scamEntity.update({
      where: { id: entity.id },
      data: {
        reportCount: { increment: 1 },
        lastSeenAt: new Date(),
      },
    });

    await prisma.scamEntity.update({
      where: { id: entity.id },
      data: { riskScore: riskScoreFromReportCount(updated.reportCount) },
    });
  }
}

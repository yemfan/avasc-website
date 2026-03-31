import type { IndicatorType, PrismaClient } from "@prisma/client";
import type { CandidateIndicatorRow, SourcePairInfo, TargetCaseMeta } from "./aggregate-matches";

const OR_CHUNK = 32;

/**
 * Batch OR query for exact (type, value) pairs — chunked to stay within practical query size limits.
 */
export async function queryCandidateIndicators(
  prisma: PrismaClient,
  params: {
    sourceCaseId: string;
    pairs: SourcePairInfo[];
    requirePublicTargets: boolean;
  }
): Promise<CandidateIndicatorRow[]> {
  const { sourceCaseId, pairs, requirePublicTargets } = params;
  if (pairs.length === 0) return [];

  const seen = new Set<string>();
  const out: CandidateIndicatorRow[] = [];

  for (let i = 0; i < pairs.length; i += OR_CHUNK) {
    const slice = pairs.slice(i, i + OR_CHUNK);
    const rows = await prisma.caseIndicator.findMany({
      where: {
        caseId: { not: sourceCaseId },
        ...(requirePublicTargets ? { isPublic: true } : {}),
        OR: slice.map((p) => ({
          AND: [{ indicatorType: p.type }, { normalizedValue: p.value }],
        })),
      },
      select: {
        id: true,
        caseId: true,
        indicatorType: true,
        normalizedValue: true,
      },
    });
    for (const r of rows) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      out.push({
        id: r.id,
        caseId: r.caseId,
        type: r.indicatorType,
        value: r.normalizedValue,
      });
    }
  }

  return out;
}

export async function loadTargetCaseMeta(
  prisma: PrismaClient,
  caseIds: string[]
): Promise<Map<string, TargetCaseMeta>> {
  if (caseIds.length === 0) return new Map();
  const rows = await prisma.case.findMany({
    where: { id: { in: caseIds } },
    select: {
      id: true,
      title: true,
      scamType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return new Map(rows.map((r) => [r.id, r]));
}

export async function loadCaseIndicatorsForMatching(
  prisma: PrismaClient,
  caseId: string
): Promise<
  {
    id: string;
    caseId: string;
    type: IndicatorType;
    value: string;
    rawValue: string | null;
    confidenceScore: number | null;
    isPublic: boolean;
  }[]
> {
  const rows = await prisma.caseIndicator.findMany({
    where: { caseId },
    orderBy: [{ indicatorType: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      caseId: true,
      indicatorType: true,
      normalizedValue: true,
      rawValue: true,
      confidenceScore: true,
      isPublic: true,
    },
  });
  return rows.map((r) => ({
    id: r.id,
    caseId: r.caseId,
    type: r.indicatorType,
    value: r.normalizedValue,
    rawValue: r.rawValue,
    confidenceScore: r.confidenceScore,
    isPublic: r.isPublic,
  }));
}

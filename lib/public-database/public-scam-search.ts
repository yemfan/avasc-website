import { ClusterPublicStatus, IndicatorType, Prisma, type RiskLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PublicScamSearchResult } from "@/lib/public-database/public-search-types";
import { getPublicIndicatorDisplayValue } from "@/lib/public-database/public-indicator-display";

function parseAggregateIndicatorFilter(raw: string | undefined): IndicatorType | undefined {
  if (!raw || raw === "ALL") return undefined;
  const v = raw.trim() as IndicatorType;
  return (Object.values(IndicatorType) as string[]).includes(v) ? v : undefined;
}

export type SearchPublicScamProfilesParams = {
  query?: string;
  scamType?: string;
  riskLevel?: string;
  indicatorType?: string;
};

export async function searchPublicScamProfiles({
  query,
  scamType,
  riskLevel,
  indicatorType,
}: SearchPublicScamProfilesParams): Promise<PublicScamSearchResult[]> {
  const q = query?.trim();

  const andClauses: Prisma.ScamClusterWhereInput[] = [
    {
      publicStatus: ClusterPublicStatus.PUBLISHED,
    },
  ];

  if (scamType && scamType !== "ALL") {
    andClauses.push({
      scamType,
    });
  }

  if (riskLevel && riskLevel !== "ALL") {
    andClauses.push({
      riskLevel: riskLevel as RiskLevel,
    });
  }

  const indicatorEnum = parseAggregateIndicatorFilter(indicatorType);

  if (indicatorEnum) {
    andClauses.push({
      indicatorAggregates: {
        some: {
          isPublic: true,
          indicatorType: indicatorEnum,
        },
      },
    });
  }

  if (q) {
    andClauses.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { scamType: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        {
          indicatorAggregates: {
            some: {
              isPublic: true,
              ...(indicatorEnum ? { indicatorType: indicatorEnum } : {}),
              OR: [
                { normalizedValue: { contains: q, mode: "insensitive" } },
                { displayValue: { contains: q, mode: "insensitive" } },
              ],
            },
          },
        },
      ],
    });
  }

  const clusters = await prisma.scamCluster.findMany({
    where: {
      AND: andClauses,
    },
    include: {
      caseLinks: {
        select: {
          id: true,
        },
      },
      indicatorAggregates: {
        where: {
          isPublic: true,
          ...(indicatorEnum ? { indicatorType: indicatorEnum } : {}),
        },
        orderBy: [
          { isVerified: "desc" },
          { linkedCaseCount: "desc" },
          { occurrenceCount: "desc" },
        ],
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 50,
  });

  const results = clusters.map((cluster) => {
    const matchedIndicators = q
      ? cluster.indicatorAggregates
          .filter((indicator) => {
            const displayValue = indicator.displayValue ?? "";
            const normalizedValue = indicator.normalizedValue ?? "";
            const queryLower = q.toLowerCase();

            return (
              displayValue.toLowerCase().includes(queryLower) ||
              normalizedValue.toLowerCase().includes(queryLower)
            );
          })
          .slice(0, 5)
          .map((indicator) => ({
            type: indicator.indicatorType,
            value: getPublicIndicatorDisplayValue(indicator),
            isVerified: indicator.isVerified,
          }))
      : cluster.indicatorAggregates.slice(0, 5).map((indicator) => ({
          type: indicator.indicatorType,
          value: getPublicIndicatorDisplayValue(indicator),
          isVerified: indicator.isVerified,
        }));

    return {
      id: cluster.id,
      slug: cluster.slug,
      title: cluster.title,
      scamType: cluster.scamType,
      summary: cluster.summary,
      riskLevel: cluster.riskLevel,
      reportCount: cluster.caseLinks.length,
      updatedAt: cluster.updatedAt,
      matchedIndicators,
    };
  });

  return rankPublicScamSearchResults(results, q);
}

function rankPublicScamSearchResults(
  results: PublicScamSearchResult[],
  query?: string
) {
  if (!query) return results;

  const lowered = query.toLowerCase();

  return [...results].sort((a, b) => {
    const scoreA = getSearchScore(a, lowered);
    const scoreB = getSearchScore(b, lowered);

    if (scoreB !== scoreA) return scoreB - scoreA;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });
}

function getSearchScore(result: PublicScamSearchResult, query: string) {
  let score = 0;

  if (result.title.toLowerCase().includes(query)) score += 100;
  if (result.scamType.toLowerCase().includes(query)) score += 60;
  if (result.summary.toLowerCase().includes(query)) score += 40;

  for (const indicator of result.matchedIndicators) {
    if (indicator.value.toLowerCase() === query) score += 120;
    else if (indicator.value.toLowerCase().includes(query)) score += 80;

    if (indicator.isVerified) score += 10;
  }

  score += Math.min(result.reportCount * 2, 20);

  return score;
}

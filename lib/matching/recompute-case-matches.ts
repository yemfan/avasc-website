import {
  ClusterSuggestionType,
  IndicatorType,
  MatchStrengthLabel,
  RiskLevel,
  SuggestionStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

const MATCH_WEIGHTS: Record<IndicatorType, number> = {
  [IndicatorType.WALLET]: 95,
  [IndicatorType.TX_HASH]: 100,
  [IndicatorType.DOMAIN]: 80,
  [IndicatorType.EMAIL]: 75,
  [IndicatorType.PHONE]: 75,
  [IndicatorType.SOCIAL_HANDLE]: 60,
  [IndicatorType.ALIAS]: 40,
  [IndicatorType.PLATFORM]: 20,
  [IndicatorType.COMPANY_NAME]: 30,
  [IndicatorType.BANK_ACCOUNT]: 85,
};

function getStrengthLabel(score: number): MatchStrengthLabel {
  if (score >= 120) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

/**
 * Recomputes case-to-case similarity and derives cluster suggestions.
 *
 * Note: current schema does not include persistent CaseMatchCache/ClusterSuggestion
 * tables, so this computes in memory and returns summary counts.
 */
export async function recomputeCaseMatches(caseId: string) {
  const sourceCase = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      indicators: true,
    },
  });

  if (!sourceCase) {
    throw new Error("Case not found.");
  }

  const sourceIndicators = sourceCase.indicators.filter(
    (i) => i.normalizedValue && i.normalizedValue.trim().length > 0
  );

  if (sourceIndicators.length === 0) {
    return {
      matchesCreated: 0,
      suggestionsCreated: 0,
      matches: [],
      suggestions: [],
    };
  }

  const matchableConditions = sourceIndicators.map((indicator) => ({
    indicatorType: indicator.indicatorType,
    normalizedValue: indicator.normalizedValue,
  }));

  const matchingIndicators = await prisma.caseIndicator.findMany({
    where: {
      OR: matchableConditions.map((c) => ({
        indicatorType: c.indicatorType,
        normalizedValue: c.normalizedValue,
      })),
      caseId: {
        not: caseId,
      },
    },
    include: {
      case: {
        select: {
          id: true,
          title: true,
          scamType: true,
          status: true,
          visibility: true,
          createdAt: true,
        },
      },
    },
  });

  const groupedMatches = new Map<
    string,
    {
      targetCase: {
        id: string;
        title: string;
        scamType: string;
        status: string;
        visibility: string;
        createdAt: Date;
      };
      totalScore: number;
      matchedIndicatorTypes: Set<string>;
      matchedIndicators: Array<{
        indicatorType: string;
        normalizedValue: string;
        weight: number;
      }>;
      reasons: string[];
    }
  >();

  for (const matched of matchingIndicators) {
    const key = matched.caseId;
    const indicatorType = matched.indicatorType;
    const normalizedValue = matched.normalizedValue;
    const weight = MATCH_WEIGHTS[indicatorType] ?? 10;

    const existing =
      groupedMatches.get(key) ??
      {
        targetCase: matched.case,
        totalScore: 0,
        matchedIndicatorTypes: new Set<string>(),
        matchedIndicators: [],
        reasons: [],
      };

    const duplicateIndicator = existing.matchedIndicators.some(
      (i) =>
        i.indicatorType === indicatorType &&
        i.normalizedValue === normalizedValue
    );

    if (!duplicateIndicator) {
      existing.totalScore += weight;
      existing.matchedIndicatorTypes.add(indicatorType);
      existing.matchedIndicators.push({
        indicatorType,
        normalizedValue,
        weight,
      });
      existing.reasons.push(
        `Matched ${indicatorType.toLowerCase()} ${normalizedValue}`
      );
    }

    groupedMatches.set(key, existing);
  }

  const matchRows = [...groupedMatches.entries()].map(([targetCaseId, data]) => {
    const strengthLabel = getStrengthLabel(data.totalScore);
    const isVisibleToVictim = data.totalScore >= 70;
    const isVisiblePublicly = data.totalScore >= 120;
    return {
      sourceCaseId: caseId,
      targetCaseId,
      totalScore: data.totalScore,
      strengthLabel,
      matchedIndicatorTypes: Array.from(data.matchedIndicatorTypes),
      matchedIndicatorsJson: data.matchedIndicators,
      reasonsJson: data.reasons,
      isVisibleToVictim,
      isVisiblePublicly,
    };
  });

  const candidateTargetIds = matchRows
    .filter((row) => row.totalScore >= 70)
    .map((row) => row.targetCaseId);

  const linkedTargets = candidateTargetIds.length
    ? await prisma.case.findMany({
        where: { id: { in: candidateTargetIds } },
        include: {
          clusterLinks: {
            include: {
              scamCluster: true,
            },
          },
        },
      })
    : [];

  type ClusterScoreAgg = {
    clusterId: string;
    title: string;
    fitScore: number;
    reasons: string[];
    riskLevel: RiskLevel;
  };

  const clusterScores = new Map<string, ClusterScoreAgg>();

  for (const targetCase of linkedTargets) {
    const targetMatch = matchRows.find((m) => m.targetCaseId === targetCase.id);
    if (!targetMatch) continue;

    for (const link of targetCase.clusterLinks) {
      const cluster = link.scamCluster;

      const existing =
        clusterScores.get(cluster.id) ??
        {
          clusterId: cluster.id,
          title: cluster.title,
          fitScore: 0,
          reasons: [],
          riskLevel: cluster.riskLevel,
        };

      existing.fitScore += targetMatch.totalScore;
      existing.reasons.push(
        `Matched clustered case "${targetCase.title}" linked to "${cluster.title}"`
      );

      clusterScores.set(cluster.id, existing);
    }
  }

  const clusterSuggestionRows: Array<{
    caseId: string;
    suggestionType: ClusterSuggestionType;
    suggestedClusterId: string | null;
    fitScore: number;
    confidenceLabel: MatchStrengthLabel;
    reasonsJson: string[];
    seedCaseIds: string[];
    status: SuggestionStatus;
  }> = [...clusterScores.values()].map((clusterData) => ({
    caseId,
    suggestionType: ClusterSuggestionType.ASSIGN_TO_EXISTING,
    suggestedClusterId: clusterData.clusterId,
    fitScore: clusterData.fitScore,
    confidenceLabel: getStrengthLabel(clusterData.fitScore),
    reasonsJson: clusterData.reasons,
    seedCaseIds: [] as string[],
    status: SuggestionStatus.PENDING,
  }));

  if (clusterSuggestionRows.length === 0 && matchRows.length > 0) {
    const topMatches = matchRows
      .filter((row) => row.totalScore >= 30)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 5);

    if (topMatches.length > 0) {
      clusterSuggestionRows.push({
        caseId,
        suggestionType: ClusterSuggestionType.CREATE_NEW,
        suggestedClusterId: null,
        fitScore: topMatches[0].totalScore,
        confidenceLabel: getStrengthLabel(topMatches[0].totalScore),
        reasonsJson: [
          "No strong existing cluster assignment found.",
          "Multiple case similarities suggest a possible new cluster candidate.",
        ],
        seedCaseIds: topMatches.map((m) => m.targetCaseId),
        status: SuggestionStatus.PENDING,
      });
    }
  }

  return {
    matchesCreated: matchRows.length,
    suggestionsCreated: clusterSuggestionRows.length,
    matches: matchRows,
    suggestions: clusterSuggestionRows,
  };
}

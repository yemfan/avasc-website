import { IndicatorType } from "@prisma/client";
import type { CaseMatchResult, MatchedIndicatorDetail } from "./match-types";
import { scoreToStrengthLabel, weightForType, NOISY_PLATFORM_VALUES, LOW_CONFIDENCE_CUTOFF } from "./match-config";
import { buildModeratorReasons, uniqueIndicatorTypes } from "./match-reasons";
import { sortCaseMatchResults } from "./match-ranking";
import { isEmptyNormalized } from "./indicator-normalizers";

export const PAIR_SEP = "\u0000";

export function pairKey(type: IndicatorType, value: string): string {
  return `${type}${PAIR_SEP}${value}`;
}

export type SourceIndicatorInput = {
  id: string;
  caseId: string;
  type: IndicatorType;
  value: string;
  confidenceScore: number | null;
  isPublic: boolean;
};

export type SourcePairInfo = {
  type: IndicatorType;
  value: string;
  sourceIds: string[];
  weight: number;
};

export type CandidateIndicatorRow = {
  id: string;
  caseId: string;
  type: IndicatorType;
  value: string;
};

export type TargetCaseMeta = {
  id: string;
  title: string;
  scamType: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Collapse duplicate indicators on the source case so one normalized `(type, value)` pair
 * contributes **once** to score. Per target case, the same pair also only adds weight once
 * (`appliedPairKeys`).
 */
export function buildSourcePairMap(
  indicators: SourceIndicatorInput[],
  opts: {
    includeLowConfidence: boolean;
    includeTypes?: Set<IndicatorType>;
    excludeTypes?: Set<IndicatorType>;
  }
): Map<string, SourcePairInfo> {
  const map = new Map<string, SourcePairInfo>();

  for (const ind of indicators) {
    if (opts.excludeTypes?.has(ind.type)) continue;
    if (opts.includeTypes && !opts.includeTypes.has(ind.type)) continue;
    if (!opts.includeLowConfidence && ind.confidenceScore !== null && ind.confidenceScore < LOW_CONFIDENCE_CUTOFF) {
      continue;
    }
    if (isEmptyNormalized(ind.value)) continue;

    const k = pairKey(ind.type, ind.value);
    const w = weightForType(ind.type);
    const cur = map.get(k);
    if (cur) {
      cur.sourceIds.push(ind.id);
      cur.sourceIds.sort();
    } else {
      map.set(k, { type: ind.type, value: ind.value, sourceIds: [ind.id], weight: w });
    }
  }
  return map;
}

type TargetAgg = {
  totalScore: number;
  appliedPairKeys: Set<string>;
  details: MatchedIndicatorDetail[];
};

function isNoisyPlatformOnlyMatch(details: MatchedIndicatorDetail[]): boolean {
  const types = uniqueIndicatorTypes(details.map((d) => d.indicatorType));
  if (types.length !== 1 || types[0] !== IndicatorType.PLATFORM) return false;
  const v = details[0]?.normalizedValue ?? "";
  return NOISY_PLATFORM_VALUES.has(v);
}

/**
 * Pure aggregation: map candidate rows (same type+value as source pairs) into scored case results.
 */
export function aggregateCaseMatches(
  sourceCaseId: string,
  sourcePairMap: Map<string, SourcePairInfo>,
  candidates: CandidateIndicatorRow[],
  targetMetaById: Map<string, TargetCaseMeta>
): CaseMatchResult[] {
  const byTarget = new Map<string, TargetAgg>();

  for (const row of candidates) {
    if (row.caseId === sourceCaseId) continue;
    const k = pairKey(row.type, row.value);
    const pinfo = sourcePairMap.get(k);
    if (!pinfo) continue;

    let agg = byTarget.get(row.caseId);
    if (!agg) {
      agg = { totalScore: 0, appliedPairKeys: new Set(), details: [] };
      byTarget.set(row.caseId, agg);
    }

    if (!agg.appliedPairKeys.has(k)) {
      agg.appliedPairKeys.add(k);
      agg.totalScore += pinfo.weight;
      agg.details.push({
        indicatorType: pinfo.type,
        normalizedValue: pinfo.value,
        sourceIndicatorId: pinfo.sourceIds[0]!,
        matchedIndicatorId: row.id,
        weight: pinfo.weight,
      });
    } else {
      const existing = agg.details.find((d) => pairKey(d.indicatorType, d.normalizedValue) === k);
      if (existing && row.id < existing.matchedIndicatorId) {
        existing.matchedIndicatorId = row.id;
      }
    }
  }

  const results: CaseMatchResult[] = [];

  for (const [targetId, agg] of byTarget) {
    const meta = targetMetaById.get(targetId);
    if (!meta) continue;

    const sharedIndicatorTypes = uniqueIndicatorTypes(agg.details.map((d) => d.indicatorType));
    const suppressedAsNoise = isNoisyPlatformOnlyMatch(agg.details);

    const totalScore = agg.totalScore;
    const reasons = buildModeratorReasons(agg.details, totalScore);

    results.push({
      matchedCaseId: targetId,
      totalScore,
      strengthLabel: scoreToStrengthLabel(totalScore),
      matchedIndicators: agg.details,
      reasons,
      sharedIndicatorTypes,
      latestCaseDate: meta.updatedAt > meta.createdAt ? meta.updatedAt : meta.createdAt,
      scamType: meta.scamType,
      title: meta.title,
      suppressedAsNoise,
    });
  }

  return sortCaseMatchResults(results);
}

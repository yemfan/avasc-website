import type { PrismaClient } from "@prisma/client";
import {
  aggregateCaseMatches,
  buildSourcePairMap,
  type SourceIndicatorInput,
} from "./aggregate-matches";
import { loadCaseIndicatorsForMatching, loadTargetCaseMeta, queryCandidateIndicators } from "./match-queries";
import { suggestScamClustersFromMatches, type ClusterSuggestionRow } from "./cluster-suggestions";
import {
  getSimilarCasesOptionsSchema,
  suggestClustersOptionsSchema,
  type CaseMatchResult,
  type GetSimilarCasesOptions,
  type SuggestClustersOptions,
} from "./match-types";
import { filterMatchesForView, withExplainabilityForMode } from "./match-filters";
import type { IndicatorType } from "@prisma/client";

export { normalizeIndicatorValue } from "./indicator-normalizers";

export async function getCaseIndicators(prisma: PrismaClient, caseId: string) {
  return loadCaseIndicatorsForMatching(prisma, caseId);
}

/** Raw DB hits for debugging / exports — same batch strategy as scoring. */
export async function findExactIndicatorMatches(prisma: PrismaClient, sourceCaseId: string) {
  const rows = await loadCaseIndicatorsForMatching(prisma, sourceCaseId);
  const inputs = rows as SourceIndicatorInput[];
  const pairMap = buildSourcePairMap(inputs, { includeLowConfidence: true });
  const pairs = [...pairMap.values()];
  return queryCandidateIndicators(prisma, {
    sourceCaseId,
    pairs,
    requirePublicTargets: false,
  });
}

export async function scoreCaseMatches(
  prisma: PrismaClient,
  sourceCaseId: string,
  options?: Partial<GetSimilarCasesOptions>
): Promise<CaseMatchResult[]> {
  const opts = getSimilarCasesOptionsSchema.parse(options ?? {});
  return runScoringPipeline(prisma, sourceCaseId, opts);
}

export async function getSimilarCases(
  prisma: PrismaClient,
  sourceCaseId: string,
  options?: Partial<GetSimilarCasesOptions>
): Promise<CaseMatchResult[]> {
  const opts = getSimilarCasesOptionsSchema.parse(options ?? {});
  let ranked = await runScoringPipeline(prisma, sourceCaseId, opts);

  if (opts.suppressNoisyPlatformOnly) {
    ranked = ranked.filter((r) => !(r.suppressedAsNoise && r.sharedIndicatorTypes.length === 1));
  }

  ranked = withExplainabilityForMode(ranked, opts.mode);
  ranked = filterMatchesForView(ranked, opts.mode, opts.minimumScore);

  return ranked.slice(0, opts.limit);
}

export async function suggestScamClusters(
  prisma: PrismaClient,
  sourceCaseId: string,
  options?: Partial<SuggestClustersOptions>
): Promise<ClusterSuggestionRow[]> {
  const opts = suggestClustersOptionsSchema.parse(options ?? {});
  let matches = await scoreCaseMatches(prisma, sourceCaseId, {
    mode: "internal",
    includeLowConfidence: true,
    suppressNoisyPlatformOnly: false,
  });
  matches = matches.filter((m) => m.totalScore >= opts.minimumScore);
  matches = matches.filter((m) => !(m.suppressedAsNoise && m.sharedIndicatorTypes.length === 1));
  return suggestScamClustersFromMatches(prisma, matches, opts.maxMatchedCases, opts.maxClusters);
}

async function runScoringPipeline(
  prisma: PrismaClient,
  sourceCaseId: string,
  opts: GetSimilarCasesOptions
): Promise<CaseMatchResult[]> {
  const rows = await loadCaseIndicatorsForMatching(prisma, sourceCaseId);
  let inputs = rows as SourceIndicatorInput[];

  if (opts.mode === "public") {
    inputs = inputs.filter((i) => i.isPublic);
  }

  const includeTypes = opts.includeIndicatorTypes?.length
    ? new Set<IndicatorType>(opts.includeIndicatorTypes)
    : undefined;
  const excludeTypes = opts.excludeIndicatorTypes?.length
    ? new Set<IndicatorType>(opts.excludeIndicatorTypes)
    : undefined;

  const pairMap = buildSourcePairMap(inputs, {
    includeLowConfidence: opts.includeLowConfidence,
    includeTypes,
    excludeTypes,
  });
  const pairs = [...pairMap.values()];
  if (pairs.length === 0) return [];

  const candidates = await queryCandidateIndicators(prisma, {
    sourceCaseId,
    pairs,
    requirePublicTargets: opts.mode === "public",
  });

  const targetIds = [...new Set(candidates.map((c) => c.caseId))];
  const meta = await loadTargetCaseMeta(prisma, targetIds);

  return aggregateCaseMatches(sourceCaseId, pairMap, candidates, meta);
}

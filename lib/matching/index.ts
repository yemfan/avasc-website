/**
 * Indicator matching engine — entry points for admin, victim, and public surfaces.
 * See ./README.md for architecture.
 */

export {
  getCaseIndicators,
  findExactIndicatorMatches,
  scoreCaseMatches,
  getSimilarCases,
  suggestScamClusters,
  normalizeIndicatorValue,
} from "./indicator-matcher";

export type {
  CaseMatchResult,
  MatchedIndicatorDetail,
  MatchStrengthLabel,
  MatchViewMode,
  GetSimilarCasesOptions,
  PublicCaseMatchSummary,
} from "./match-types";

export { getSimilarCasesOptionsSchema, suggestClustersOptionsSchema } from "./match-types";

export {
  EXACT_MATCH_WEIGHTS,
  scoreToStrengthLabel,
  STRENGTH_THRESHOLDS,
  DEFAULT_PUBLIC_MINIMUM_SCORE,
  LOW_CONFIDENCE_CUTOFF,
  PRIORITY_SIGNAL_TYPES,
  matchHasPrioritySignal,
} from "./match-config";

export { sortCaseMatchResults } from "./match-ranking";

export {
  normalizeEmail,
  normalizeDomain,
  normalizePhone,
  normalizeWallet,
  normalizeTxHash,
  normalizeSocialHandle,
  normalizeAlias,
  normalizePlatform,
} from "./indicator-normalizers";

export { filterMatchesForView, projectToPublicSummaries, withExplainabilityForMode } from "./match-filters";

export { suggestScamClustersFromMatches, type ClusterSuggestionRow } from "./cluster-suggestions";

export { aggregateCaseMatches, buildSourcePairMap, pairKey } from "./aggregate-matches";

export { recomputeCaseMatches } from "./recompute-case-matches";

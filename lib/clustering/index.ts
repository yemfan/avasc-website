/** Cluster merge suggestions (admin). */
export { findClusterMergeSuggestions } from "./cluster-merge";

/** Types shared with admin cluster UI. */
export type { ClusterSuggestionBundle } from "./cluster-types";

/**
 * Intake-side regex extraction + heuristic cluster scoring (skeleton).
 * Complements DB-backed matchers in `cluster-suggester.ts` / `lib/matching`.
 */
export {
  decideClusterAssignment,
  extractIndicatorsFromText,
  runIndicatorAndClusteringEngine,
  scoreCaseAgainstClusters,
  suggestRiskLevelForNewCluster,
} from "./intake-cluster-engine";

export type {
  ClusterCandidate,
  ClusterDecision,
  ClusterMatchScore,
  IntakeCaseInput,
  ParsedIndicator,
} from "./intake-cluster-engine";

/** Prisma persistence + intake engine orchestration. */
export {
  processCaseForMatching,
  recomputeOpenCases,
  type ProcessCaseMatchingOptions,
} from "./process-case-for-matching";

/**
 * Scam clustering engine — builds on the indicator matcher (no duplicated matching rules).
 * See ./README.md
 */

export {
  getClusterSuggestionForCase,
  scoreCaseAgainstCluster,
  suggestNewClusterFromCase,
  buildClusterGraph,
  generateClusterMetadata,
} from "./cluster-suggester";

export { findClusterMergeSuggestions, computeClusterInterconnect } from "./cluster-merge";

export {
  computeConnectedComponents,
  mergeUndirectedEdges,
  componentContainingSeed,
} from "./cluster-graph";

export {
  STRONG_EDGE_THRESHOLD,
  CRITICAL_EDGE_THRESHOLD,
  MIN_CLUSTER_SIZE_FOR_AUTO_SUGGESTION,
  CLUSTER_ASSIGNMENT_MIN_SCORE,
  CLUSTER_MERGE_MIN_INTERCONNECT_SCORE,
  STRUCTURAL_MIN_NON_PRIORITY_MATCH_SCORE,
  PUBLIC_CLUSTER_FIT_REVIEW_MIN,
  PUBLIC_CLUSTER_FIT_READY_MIN,
  PUBLIC_MERGE_INTERCONNECT_REVIEW_MIN,
  MAX_CASES_PER_CLUSTER_IN_MERGE_SCAN,
  MAX_CLUSTERS_FOR_MERGE_SCAN,
  MAX_NEIGHBORS_FOR_NEW_CLUSTER_GRAPH,
  SCAM_TYPE_ALIGNMENT_BONUS,
} from "./cluster-config";

export type {
  ClusterSuggestionBundle,
  ExistingClusterAssignmentSuggestion,
  NewClusterSuggestion,
  ClusterMergeSuggestion,
  CaseClusterFitResult,
  ClusterGraph,
  ClusterMetadata,
  ClusterConfidenceLabel,
  PublicReadiness,
  ClusterEngineOptions,
} from "./cluster-types";

export { isUsableMatchEdge, isStructuralClusterEdge, modeString } from "./cluster-utils";
export { publicReadinessFromFit, fitScoreToConfidence, riskLevelFromSignals } from "./cluster-scorer";
export { isSafeForPublicPreview, shouldShowInternallyOnly } from "./cluster-filters";

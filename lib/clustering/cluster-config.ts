/**
 * Tunable thresholds for rule-based clustering (MVP).
 * Adjust here without changing graph or scoring algorithms.
 */

/** Minimum case↔case match score to treat as a graph edge (from matcher totalScore). */
export const STRONG_EDGE_THRESHOLD = 70;

/** Matches at or above this are treated as “critical” structural links for merge logic. */
export const CRITICAL_EDGE_THRESHOLD = 120;

/** Minimum nodes in a connected component to suggest a new cluster (includes seed case). */
export const MIN_CLUSTER_SIZE_FOR_AUTO_SUGGESTION = 2;

/** Minimum aggregate fit score to recommend assigning a case to an existing cluster. */
export const CLUSTER_ASSIGNMENT_MIN_SCORE = 80;

/** Minimum cross-cluster interconnect sum to suggest merging two clusters. */
export const CLUSTER_MERGE_MIN_INTERCONNECT_SCORE = 140;

/**
 * For **cluster structure** (new-cluster graph, merge interconnect), an edge counts only if it passes
 * `isStructuralClusterEdge()` in cluster-utils — i.e. matcher output is reused, not re-scored.
 * Non-priority-only pairs must meet at least this totalScore (from matcher) unless critical tier.
 */
export const STRUCTURAL_MIN_NON_PRIORITY_MATCH_SCORE = 100;

/** Public readiness: stricter than internal (see cluster-scorer). */
export const PUBLIC_CLUSTER_FIT_REVIEW_MIN = 95;
export const PUBLIC_CLUSTER_FIT_READY_MIN = 150;

/** Merge suggestions: higher bar before marking even “review” for any public-facing narrative. */
export const PUBLIC_MERGE_INTERCONNECT_REVIEW_MIN = 280;

/** Max cases to pull from each cluster when evaluating merge (performance guard). */
export const MAX_CASES_PER_CLUSTER_IN_MERGE_SCAN = 12;

/** Max clusters to compare in global merge sweep (MVP). */
export const MAX_CLUSTERS_FOR_MERGE_SCAN = 35;

/** Max neighbor cases to expand when building a new-cluster candidate graph. */
export const MAX_NEIGHBORS_FOR_NEW_CLUSTER_GRAPH = 24;

/** Small bonus when case.scamType matches cluster.scamType (same string). */
export const SCAM_TYPE_ALIGNMENT_BONUS = 12;

/** Caps for fit score formula (same scale as matcher scores, roughly 0–220+). */
export const FIT_SCORE_MEMBER_STRONG_WEIGHT = 14;
export const FIT_SCORE_MAX_MEMBER_BONUS = 72;

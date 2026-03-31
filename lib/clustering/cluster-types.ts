import { z } from "zod";
import type { IndicatorType } from "@prisma/client";
import type { MatchStrengthLabel } from "@/lib/matching";

export type ClusterConfidenceLabel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type PublicReadiness = "internal_only" | "review_suggested" | "public_ready";

export interface ExistingClusterAssignmentSuggestion {
  clusterId: string;
  clusterTitle: string;
  clusterSlug: string;
  clusterScamType: string;
  fitScore: number;
  confidenceLabel: ClusterConfidenceLabel;
  matchedCaseCount: number;
  strongMatchCount: number;
  matchedIndicatorTypes: IndicatorType[];
  reasons: string[];
  publicReadiness: PublicReadiness;
}

export interface NewClusterSuggestion {
  seedCaseIds: string[];
  suggestedTitle: string;
  suggestedSlugHint: string;
  suggestedScamType: string;
  suggestedSummary: string;
  riskLevel: string;
  confidenceLabel: ClusterConfidenceLabel;
  reasons: string[];
  publicReadiness: PublicReadiness;
  /** Representative edge strengths (case pairs) for review. */
  edgeHighlights: { caseA: string; caseB: string; matchScore: number }[];
}

export interface ClusterMergeSuggestion {
  sourceClusterId: string;
  sourceClusterTitle: string;
  targetClusterId: string;
  targetClusterTitle: string;
  interconnectScore: number;
  confidenceLabel: ClusterConfidenceLabel;
  reasons: string[];
  sharedIndicatorsSummary: string;
  pairCountAboveStrong: number;
  publicReadiness: PublicReadiness;
}

export interface ClusterSuggestionBundle {
  caseId: string;
  caseScamType: string;
  caseTitle: string;
  alreadyLinkedClusterIds: string[];
  existingClusterSuggestions: ExistingClusterAssignmentSuggestion[];
  newClusterSuggestion: NewClusterSuggestion | null;
  /** Highest-priority narrative for staff triage. */
  summaryLine: string;
}

export interface CaseClusterFitResult {
  caseId: string;
  clusterId: string;
  clusterTitle: string;
  clusterSlug: string;
  clusterScamType: string;
  fitScore: number;
  confidenceLabel: ClusterConfidenceLabel;
  matchedCaseCount: number;
  strongMatchCount: number;
  matchedIndicatorTypes: IndicatorType[];
  reasons: string[];
  publicReadiness: PublicReadiness;
  alreadyInCluster: boolean;
}

export interface ClusterGraph {
  nodeIds: string[];
  /** Undirected edges a-b with weight = matcher totalScore for that pair. */
  edges: { a: string; b: string; weight: number }[];
}

export interface ClusterMetadata {
  seedCaseIds: string[];
  suggestedTitle: string;
  suggestedScamType: string;
  suggestedSummary: string;
  riskLevel: string;
  dominantScamType: string;
  reportCount: number;
}

export const clusterEngineOptionsSchema = z.object({
  mode: z.enum(["internal", "public"]).default("internal"),
});

export type ClusterEngineOptions = z.infer<typeof clusterEngineOptionsSchema>;

/** Re-export matcher strength for convenience in UI. */
export type { MatchStrengthLabel };

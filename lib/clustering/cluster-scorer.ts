import type { IndicatorType } from "@prisma/client";
import type { CaseMatchResult } from "@/lib/matching";
import { PRIORITY_SIGNAL_TYPES, matchHasPrioritySignal } from "@/lib/matching";
import {
  CLUSTER_ASSIGNMENT_MIN_SCORE,
  CRITICAL_EDGE_THRESHOLD,
  PUBLIC_CLUSTER_FIT_READY_MIN,
  PUBLIC_CLUSTER_FIT_REVIEW_MIN,
  SCAM_TYPE_ALIGNMENT_BONUS,
  STRONG_EDGE_THRESHOLD,
} from "./cluster-config";
import type { ClusterConfidenceLabel, PublicReadiness } from "./cluster-types";
import { textSimilarityBonus } from "./cluster-text-bonus";

function uniqueTypes(types: IndicatorType[]): IndicatorType[] {
  return [...new Set(types)];
}

export function fitScoreToConfidence(fitScore: number, bestEdgeScore: number): ClusterConfidenceLabel {
  if (bestEdgeScore >= CRITICAL_EDGE_THRESHOLD || fitScore >= 160) return "CRITICAL";
  if (fitScore >= 115 || bestEdgeScore >= STRONG_EDGE_THRESHOLD + 25) return "HIGH";
  if (fitScore >= 75) return "MEDIUM";
  return "LOW";
}

/**
 * Publishing is **stricter** than internal triage: higher fit bars + priority-type requirement for any “review” tier.
 */
export function publicReadinessFromFit(fitScore: number, sharedTypes: IndicatorType[]): PublicReadiness {
  const hasStrong = matchHasPrioritySignal(sharedTypes);
  if (fitScore >= PUBLIC_CLUSTER_FIT_READY_MIN && hasStrong) return "public_ready";
  if (fitScore >= PUBLIC_CLUSTER_FIT_REVIEW_MIN && hasStrong) return "review_suggested";
  return "internal_only";
}

export function computeClusterFitFromMatches(params: {
  sourceCase: {
    id: string;
    scamType: string;
    title: string;
    summary: string | null;
  };
  cluster: { id: string; title: string; slug: string; scamType: string };
  matchesToMembers: CaseMatchResult[];
  memberSummaries: { id: string; title: string; summary: string | null }[];
}): {
  fitScore: number;
  confidenceLabel: ClusterConfidenceLabel;
  matchedCaseCount: number;
  strongMatchCount: number;
  matchedIndicatorTypes: IndicatorType[];
  reasons: string[];
  publicReadiness: PublicReadiness;
  bestEdgeScore: number;
} {
  const { sourceCase, cluster, matchesToMembers, memberSummaries } = params;
  if (matchesToMembers.length === 0) {
    return {
      fitScore: 0,
      confidenceLabel: "LOW",
      matchedCaseCount: 0,
      strongMatchCount: 0,
      matchedIndicatorTypes: [],
      reasons: ["No matcher links found between this case and cases in this cluster (thresholds may exclude weak overlaps)."],
      publicReadiness: "internal_only",
      bestEdgeScore: 0,
    };
  }

  const sorted = [...matchesToMembers].sort((a, b) => b.totalScore - a.totalScore);
  const bestEdgeScore = sorted[0]!.totalScore;
  const topK = sorted.slice(0, Math.min(3, sorted.length));
  const avgTop = topK.reduce((s, m) => s + m.totalScore, 0) / topK.length;

  const strongMatchCount = matchesToMembers.filter((m) => m.totalScore >= CLUSTER_ASSIGNMENT_MIN_SCORE).length;
  const matchedCaseCount = matchesToMembers.length;

  const typeAcc: IndicatorType[] = [];
  for (const m of matchesToMembers) {
    typeAcc.push(...m.sharedIndicatorTypes);
  }
  const matchedIndicatorTypes = uniqueTypes(typeAcc);

  let fitScore =
    bestEdgeScore * 0.48 +
    avgTop * 0.32 +
    Math.min(strongMatchCount * 16, 72) * 0.2;

  if (sourceCase.scamType === cluster.scamType) {
    fitScore += SCAM_TYPE_ALIGNMENT_BONUS;
  }

  let textBonus = 0;
  const byId = new Map(memberSummaries.map((m) => [m.id, m]));
  for (const m of sorted.slice(0, 5)) {
    const other = byId.get(m.matchedCaseId);
    if (other) {
      textBonus = Math.max(
        textBonus,
        textSimilarityBonus(
          { title: sourceCase.title, summary: sourceCase.summary },
          { title: other.title, summary: other.summary }
        )
      );
    }
  }
  fitScore += textBonus * 0.35;

  const confidenceLabel = fitScoreToConfidence(fitScore, bestEdgeScore);

  const reasons: string[] = [];
  reasons.push(
    `Strongest link to cluster member “${sorted[0]!.title}” with match score ${bestEdgeScore} (${sorted[0]!.strengthLabel}).`
  );
  if (strongMatchCount > 0) {
    reasons.push(
      `${strongMatchCount} cluster member${strongMatchCount === 1 ? "" : "s"} meet the assignment strength bar (score ≥ ${CLUSTER_ASSIGNMENT_MIN_SCORE}).`
    );
  }
  if (matchedIndicatorTypes.length) {
    reasons.push(`Overlapping indicator categories: ${matchedIndicatorTypes.join(", ")}.`);
  }
  if (sourceCase.scamType === cluster.scamType) {
    reasons.push(`Scam type aligns with cluster (${cluster.scamType}).`);
  }
  if (textBonus > 0) {
    reasons.push(`Lightweight title/summary phrase overlap adds a small supporting bump (${textBonus.toFixed(0)} pts raw).`);
  }

  const publicReadiness = publicReadinessFromFit(fitScore, matchedIndicatorTypes);

  return {
    fitScore: Math.round(fitScore * 10) / 10,
    confidenceLabel,
    matchedCaseCount,
    strongMatchCount,
    matchedIndicatorTypes,
    reasons,
    publicReadiness,
    bestEdgeScore,
  };
}

export function riskLevelFromSignals(params: {
  reportCount: number;
  hasTxOrWallet: boolean;
  maxEdgeScore: number;
}): "low" | "medium" | "high" | "critical" {
  const { reportCount, hasTxOrWallet, maxEdgeScore } = params;
  if (maxEdgeScore >= CRITICAL_EDGE_THRESHOLD && hasTxOrWallet) return "critical";
  if (maxEdgeScore >= STRONG_EDGE_THRESHOLD + 20 && reportCount >= 3) return "high";
  if (reportCount >= 4 || maxEdgeScore >= STRONG_EDGE_THRESHOLD) return "medium";
  return "low";
}

export function hasStrongIndicatorSignal(types: IndicatorType[]): boolean {
  return types.some((t) => PRIORITY_SIGNAL_TYPES.has(t));
}

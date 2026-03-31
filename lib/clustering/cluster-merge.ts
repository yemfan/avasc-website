import type { PrismaClient } from "@prisma/client";
import { scoreCaseMatches } from "@/lib/matching";
import {
  CLUSTER_MERGE_MIN_INTERCONNECT_SCORE,
  CRITICAL_EDGE_THRESHOLD,
  MAX_CASES_PER_CLUSTER_IN_MERGE_SCAN,
  MAX_CLUSTERS_FOR_MERGE_SCAN,
  PUBLIC_MERGE_INTERCONNECT_REVIEW_MIN,
} from "./cluster-config";
import type { ClusterMergeSuggestion, PublicReadiness } from "./cluster-types";
import { getCaseIdsInCluster } from "./cluster-queries";
import { isStructuralClusterEdge, isUsableMatchEdge } from "./cluster-utils";

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/**
 * Sum of matcher scores across unique cross-cluster case pairs (each pair counted once).
 */
export async function computeClusterInterconnect(
  prisma: PrismaClient,
  clusterA: string,
  clusterB: string
): Promise<{ score: number; pairCount: number; maxEdge: number; sampleReasons: string[] }> {
  const sa = await getCaseIdsInCluster(prisma, clusterA, MAX_CASES_PER_CLUSTER_IN_MERGE_SCAN);
  const sb = await getCaseIdsInCluster(prisma, clusterB, MAX_CASES_PER_CLUSTER_IN_MERGE_SCAN);
  const setB = new Set(sb);
  const seen = new Set<string>();
  let score = 0;
  let maxEdge = 0;
  const sampleReasons: string[] = [];

  for (const ca of sa) {
    const matches = await scoreCaseMatches(prisma, ca, {
      mode: "internal",
      includeLowConfidence: true,
      suppressNoisyPlatformOnly: true,
      limit: 250,
    });
    for (const m of matches) {
      if (!isUsableMatchEdge(m)) continue;
      if (!isStructuralClusterEdge(m)) continue;
      if (!setB.has(m.matchedCaseId)) continue;
      const k = pairKey(ca, m.matchedCaseId);
      if (seen.has(k)) continue;
      seen.add(k);
      score += m.totalScore;
      if (m.totalScore > maxEdge) maxEdge = m.totalScore;
      if (sampleReasons.length < 4) {
        sampleReasons.push(
          `Structural cross-link ${ca.slice(0, 8)}… ↔ ${m.matchedCaseId.slice(0, 8)}… (score ${m.totalScore}, ${m.sharedIndicatorTypes.join(", ") || "—"})`
        );
      }
    }
  }

  return { score, pairCount: seen.size, maxEdge, sampleReasons };
}

function mergeConfidence(score: number, maxEdge: number): ClusterMergeSuggestion["confidenceLabel"] {
  if (score >= 260 || maxEdge >= CRITICAL_EDGE_THRESHOLD) return "CRITICAL";
  if (score >= CLUSTER_MERGE_MIN_INTERCONNECT_SCORE + 40) return "HIGH";
  if (score >= CLUSTER_MERGE_MIN_INTERCONNECT_SCORE) return "MEDIUM";
  return "LOW";
}

/** Merge suggestions are never auto-public; “review” tier uses a stricter bar than internal interconnect. */
function mergePublicReadiness(interconnect: number, maxEdge: number): PublicReadiness {
  if (interconnect >= PUBLIC_MERGE_INTERCONNECT_REVIEW_MIN && maxEdge >= CRITICAL_EDGE_THRESHOLD) {
    return "review_suggested";
  }
  return "internal_only";
}

export async function findClusterMergeSuggestions(
  prisma: PrismaClient
): Promise<ClusterMergeSuggestion[]> {
  const clusters = await prisma.scamCluster.findMany({
    orderBy: { updatedAt: "desc" },
    take: MAX_CLUSTERS_FOR_MERGE_SCAN,
    select: { id: true, title: true },
  });

  const out: ClusterMergeSuggestion[] = [];

  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      const A = clusters[i]!;
      const B = clusters[j]!;
      const { score, pairCount, maxEdge, sampleReasons } = await computeClusterInterconnect(
        prisma,
        A.id,
        B.id
      );
      if (score < CLUSTER_MERGE_MIN_INTERCONNECT_SCORE || pairCount === 0) continue;

      const reasons: string[] = [
        `Cross-cluster interconnect score ${score} (structural matcher links only) from ${pairCount} unique case pair link(s); strongest edge ${maxEdge}.`,
        ...sampleReasons,
        "Merge requires staff confirmation — not applied automatically.",
      ];

      out.push({
        sourceClusterId: A.id,
        sourceClusterTitle: A.title,
        targetClusterId: B.id,
        targetClusterTitle: B.title,
        interconnectScore: score,
        confidenceLabel: mergeConfidence(score, maxEdge),
        reasons,
        sharedIndicatorsSummary: "See pair lines above; derived from indicator matcher overlap across clusters (weak platform-only edges excluded from the sum).",
        pairCountAboveStrong: pairCount,
        publicReadiness: mergePublicReadiness(score, maxEdge),
      });
    }
  }

  return out.sort((a, b) => b.interconnectScore - a.interconnectScore);
}

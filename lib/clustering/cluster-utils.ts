import type { CaseMatchResult } from "@/lib/matching";
import { matchHasPrioritySignal } from "@/lib/matching";
import { CRITICAL_EDGE_THRESHOLD, STRUCTURAL_MIN_NON_PRIORITY_MATCH_SCORE } from "./cluster-config";

/** Drop matcher rows that are generic platform-only noise (aligned with matching engine rules). */
export function isUsableMatchEdge(m: CaseMatchResult): boolean {
  if (m.suppressedAsNoise && m.sharedIndicatorTypes.length === 1) return false;
  return true;
}

/**
 * Whether this **matcher row** may form structural links for clustering graphs / merge sums.
 * Uses only `CaseMatchResult` fields from the matching engine — no duplicate indicator math.
 *
 * - Priority-type overlap (wallet, domain, tx, email, phone): allowed at any score that passed matcher filters.
 * - Otherwise: require near-certain total score (critical tier) OR strong non-priority stack (e.g. alias+social).
 * - Excludes platform-only / weak-only chains that should not define clusters.
 */
export function isStructuralClusterEdge(m: CaseMatchResult): boolean {
  if (!isUsableMatchEdge(m)) return false;
  if (matchHasPrioritySignal(m.sharedIndicatorTypes)) return true;
  if (m.totalScore >= CRITICAL_EDGE_THRESHOLD) return true;
  if (m.totalScore >= STRUCTURAL_MIN_NON_PRIORITY_MATCH_SCORE) return true;
  return false;
}

export function modeString(values: string[]): string {
  if (values.length === 0) return "unknown";
  const counts = new Map<string, number>();
  for (const v of values) {
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  let best = values[0]!;
  let n = 0;
  for (const [k, c] of counts) {
    if (c > n) {
      n = c;
      best = k;
    }
  }
  return best;
}

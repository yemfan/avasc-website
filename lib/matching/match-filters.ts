import type { CaseMatchResult, PublicCaseMatchSummary, MatchViewMode } from "./match-types";
import { buildPublicHeadline, explainForMode } from "./match-reasons";
import { DEFAULT_PUBLIC_MINIMUM_SCORE } from "./match-config";

/** Strip sensitive strings for victim/public consumers while keeping structure. */
export function filterMatchesForView(
  results: CaseMatchResult[],
  mode: MatchViewMode,
  minimumScore?: number
): CaseMatchResult[] {
  const min =
    mode === "public"
      ? Math.max(minimumScore ?? DEFAULT_PUBLIC_MINIMUM_SCORE, DEFAULT_PUBLIC_MINIMUM_SCORE)
      : (minimumScore ?? 1);
  return results.filter((r) => r.totalScore >= min && !shouldDropForPublic(mode, r));
}

function shouldDropForPublic(mode: MatchViewMode, r: CaseMatchResult): boolean {
  if (mode !== "public") return false;
  return r.suppressedAsNoise;
}

export function projectToPublicSummaries(results: CaseMatchResult[]): PublicCaseMatchSummary[] {
  return results.map((r) => ({
    matchedCaseId: r.matchedCaseId,
    totalScore: r.totalScore,
    strengthLabel: r.strengthLabel,
    headline: buildPublicHeadline(r.sharedIndicatorTypes, r.strengthLabel),
    sharedIndicatorTypes: r.sharedIndicatorTypes,
    scamType: r.scamType,
  }));
}

/** Replace internal reason lines with anonymized explanations. */
export function withExplainabilityForMode(results: CaseMatchResult[], mode: MatchViewMode): CaseMatchResult[] {
  if (mode === "internal") return results;
  return results.map((r) => ({
    ...r,
    reasons: explainForMode(r.matchedIndicators, "public"),
    matchedIndicators: r.matchedIndicators.map((m) => ({
      ...m,
      normalizedValue: "",
    })),
  }));
}

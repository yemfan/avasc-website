import type { CaseMatchResult } from "./match-types";
import { matchHasPrioritySignal } from "./match-config";

/**
 * Sort order (tunable via `PRIORITY_SIGNAL_TYPES` in match-config):
 * 1. Matches that include at least one priority signal (e.g. wallet, domain, tx) — never ranked below weak-only matches.
 * 2. Higher total score first within the same tier.
 * 3. More recent case activity as a stable tie-breaker.
 */
export function sortCaseMatchResults(results: CaseMatchResult[]): CaseMatchResult[] {
  return [...results].sort((a, b) => {
    const pa = matchHasPrioritySignal(a.sharedIndicatorTypes) ? 1 : 0;
    const pb = matchHasPrioritySignal(b.sharedIndicatorTypes) ? 1 : 0;
    if (pb !== pa) return pb - pa;
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return b.latestCaseDate.getTime() - a.latestCaseDate.getTime();
  });
}

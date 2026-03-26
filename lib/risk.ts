/** Deterministic risk score from aggregate report count (0–100). */
export function riskScoreFromReportCount(reportCount: number): number {
  return Math.min(100, reportCount * 8 + Math.floor(reportCount / 5) * 5);
}

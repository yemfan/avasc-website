import type { RiskLevel } from "@prisma/client";

export type ClusterAlertMetrics = {
  reportCount: number;
  reportsLast24h: number;
  reportsLast6h: number;
  verifiedWalletCount: number;
  verifiedDomainCount: number;
  verifiedEmailCount: number;
  avgLossUsd: number;
  matchConnections: number;
  scamType: string;
};

export function calculateThreatScore(metrics: ClusterAlertMetrics): number {
  let score = 0;

  score += Math.min(metrics.reportCount * 2, 30);

  if (metrics.reportsLast24h >= 3) score += 10;
  if (metrics.reportsLast24h >= 5) score += 20;
  if (metrics.reportsLast6h >= 5) score += 20;

  if (metrics.verifiedWalletCount > 0) score += 15;
  if (metrics.verifiedDomainCount > 0) score += 10;
  if (metrics.verifiedEmailCount > 0) score += 5;

  if (metrics.avgLossUsd >= 1000) score += 5;
  if (metrics.avgLossUsd >= 10000) score += 15;
  if (metrics.avgLossUsd >= 50000) score += 20;

  score += Math.min(metrics.matchConnections * 2, 10);

  if (
    ["Fake Crypto Investment", "Pig Butchering", "Fake Recovery Scam"].includes(metrics.scamType)
  ) {
    score += 10;
  }

  return Math.min(score, 100);
}

export function mapScoreToRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

/** `riskLevel` is typically `mapScoreToRiskLevel(score)` (model-derived). */
export function shouldTriggerRealtimeAlert(args: {
  score: number;
  riskLevel: RiskLevel;
  reportCount: number;
  hasVerifiedIndicator: boolean;
  reportsLast6h: number;
  lastAlertedAt: Date | null;
}): boolean {
  const { score, riskLevel, reportCount, hasVerifiedIndicator, reportsLast6h, lastAlertedAt } = args;

  if (riskLevel !== "CRITICAL") return false;
  if (score < 80) return false;
  if (reportCount < 5) return false;
  if (!hasVerifiedIndicator) return false;

  if (lastAlertedAt) {
    const hoursSinceLastAlert = (Date.now() - lastAlertedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastAlert < 12) return false;
  }

  if (reportsLast6h >= 5) return true;

  return true;
}

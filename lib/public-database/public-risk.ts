import type { PublicRiskLevel } from "./public-profile-types";

const ORDER: Record<PublicRiskLevel, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function normalizePublicRiskLevel(raw: string | null | undefined): PublicRiskLevel {
  const u = (raw ?? "medium").trim().toUpperCase();
  if (u === "CRITICAL" || u === "HIGH" || u === "MEDIUM" || u === "LOW") return u;
  return "MEDIUM";
}

export function compareRiskLevel(a: PublicRiskLevel, b: PublicRiskLevel): number {
  return ORDER[b] - ORDER[a];
}

export function riskSortKey(level: PublicRiskLevel): number {
  return ORDER[level];
}

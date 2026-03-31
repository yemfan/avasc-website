import { IndicatorType } from "@prisma/client";
import type { MatchStrengthLabel } from "./match-types";

/**
 * Exact-match weights (MVP). Higher = stronger link evidence.
 * Tuned for nonprofit triage: funds / domain / identity > social noise.
 */
export const EXACT_MATCH_WEIGHTS: Record<IndicatorType, number> = {
  [IndicatorType.TX_HASH]: 100,
  [IndicatorType.WALLET]: 95,
  [IndicatorType.DOMAIN]: 80,
  [IndicatorType.EMAIL]: 75,
  [IndicatorType.PHONE]: 75,
  [IndicatorType.SOCIAL_HANDLE]: 60,
  [IndicatorType.ALIAS]: 40,
  [IndicatorType.PLATFORM]: 20,
  [IndicatorType.COMPANY_NAME]: 35,
  [IndicatorType.BANK_ACCOUNT]: 70,
};

export function weightForType(type: IndicatorType): number {
  return EXACT_MATCH_WEIGHTS[type] ?? 20;
}

/** Total score → strength bucket (centralized for dashboards + admin). */
export const STRENGTH_THRESHOLDS: {
  label: MatchStrengthLabel;
  min: number;
  max: number;
}[] = [
  { label: "LOW", min: 1, max: 29 },
  { label: "MEDIUM", min: 30, max: 69 },
  { label: "HIGH", min: 70, max: 119 },
  { label: "CRITICAL", min: 120, max: Number.POSITIVE_INFINITY },
];

export function scoreToStrengthLabel(score: number): MatchStrengthLabel {
  if (score <= 0) return "LOW";
  for (const t of STRENGTH_THRESHOLDS) {
    if (score >= t.min && score <= t.max) return t.label;
  }
  return "CRITICAL";
}

/** Indicators at or below this confidence are ignored when includeLowConfidence is false. */
/** `CaseIndicator.confidenceScore` is 0–100 when set. */
export const LOW_CONFIDENCE_CUTOFF = 40;

/**
 * Normalized platform strings that are too generic to stand alone (exact-match only).
 * Still allowed when combined with stronger signals.
 */
export const NOISY_PLATFORM_VALUES = new Set([
  "whatsapp",
  "telegram",
  "instagram",
  "facebook",
  "tiktok",
  "discord",
  "youtube",
  "twitter",
  "x",
]);

/** Default minimum score for public / victim-style surfaces (no weak platform-only spam). */
export const DEFAULT_PUBLIC_MINIMUM_SCORE = 70;

/**
 * Types that count as **priority signals** for sort order. A match with any of these is listed
 * before matches that only use weaker types (platform, alias, social, other), even if the weak
 * match has a higher numeric score from several weak overlaps.
 */
export const PRIORITY_SIGNAL_TYPES: ReadonlySet<IndicatorType> = new Set([
  IndicatorType.TX_HASH,
  IndicatorType.WALLET,
  IndicatorType.DOMAIN,
  IndicatorType.EMAIL,
  IndicatorType.PHONE,
]);

export function matchHasPrioritySignal(sharedTypes: IndicatorType[]): boolean {
  return sharedTypes.some((t) => PRIORITY_SIGNAL_TYPES.has(t));
}

/** Reserved for fuzzy / near-duplicate matching; MVP returns 0 (exact-only path). */
export function fuzzySimilarityContribution(): number {
  return 0;
}

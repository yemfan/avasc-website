import type { CaseIndicator, ClusterIndicatorAggregate } from "@prisma/client";
import { IndicatorType } from "@prisma/client";

import { maskNormalizedValueForPublicDisplay } from "./public-indicator-masking";

/**
 * Public scam database — display & privacy rules (single source of truth).
 *
 * Rule order (cluster aggregates + shared masking path):
 * 1. If `displayValue` is set (staff-approved public label), show it as-is.
 * 2. Otherwise mask/shorten `normalizedValue` by `indicatorType` (see `maskNormalizedValueForPublicDisplay`).
 *
 * Use `getPublicIndicatorDisplayValue` everywhere public UI shows an indicator string (cluster aggregates
 * or case-level rows with `displayValue: null` when `CaseIndicator` has no staff override field).
 * `getCaseIndicatorPublicDisplayValue` is a thin wrapper over the same function.
 */

export type PublicIndicatorLike = Pick<
  ClusterIndicatorAggregate,
  "indicatorType" | "normalizedValue" | "displayValue" | "isPublic"
>;

export function canShowPublicIndicator(indicator: PublicIndicatorLike) {
  return indicator.isPublic === true;
}

/** Per-case indicators: public flag only (see Prisma `CaseIndicator`). */
export function canShowCaseIndicatorPublic(indicator: Pick<CaseIndicator, "isPublic">) {
  return indicator.isPublic === true;
}

export function getPublicIndicatorDisplayValue(indicator: PublicIndicatorLike) {
  const customDisplay = indicator.displayValue?.trim();
  if (customDisplay) {
    return customDisplay;
  }

  const raw = indicator.normalizedValue?.trim() ?? "";
  return maskNormalizedValueForPublicDisplay(indicator.indicatorType, raw);
}

export function getCaseIndicatorPublicDisplayValue(
  indicator: Pick<CaseIndicator, "indicatorType" | "normalizedValue">
) {
  return getPublicIndicatorDisplayValue({
    indicatorType: indicator.indicatorType as unknown as ClusterIndicatorAggregate["indicatorType"],
    normalizedValue: indicator.normalizedValue,
    displayValue: null,
    isPublic: true,
  });
}

const FRIENDLY_TYPE: Record<IndicatorType, string> = {
  WALLET: "Crypto wallet addresses",
  PHONE: "Phone numbers",
  EMAIL: "Email addresses",
  DOMAIN: "Websites & domains",
  TX_HASH: "Transaction references",
  SOCIAL_HANDLE: "Social media accounts",
  ALIAS: "Names & aliases",
  PLATFORM: "Apps & platforms",
  COMPANY_NAME: "Company names",
  BANK_ACCOUNT: "Bank accounts",
};

/** Short label for chips and lists (public UI). */
export function indicatorTypeLabel(type: IndicatorType): string {
  return FRIENDLY_TYPE[type];
}

/** Re-export masking helpers for routes/tests that import from this module. */
export {
  maskBankAccount,
  maskEmail,
  maskNormalizedValueForPublicDisplay,
  maskPhone,
  maskSocialHandle,
  parseIndicatorType,
  shortenMiddle,
} from "./public-indicator-masking";

const dateFmt: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };

export function formatPublicDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, dateFmt);
}

/**
 * Single line for “when people reported” on cards and headers (no victim identities).
 */
export function formatPublicActivityRange(first: string | null | undefined, last: string | null | undefined): string {
  if (!first && !last) return "Dates not shown to protect privacy";
  if (first && last && first !== last) {
    return `${formatPublicDate(first)} – ${formatPublicDate(last)}`;
  }
  const d = first ?? last;
  return d ? formatPublicDate(d) : "—";
}

export function phraseReportsLinkedToPattern(count: number): string {
  if (count <= 0) return "No linked reports yet";
  if (count === 1) return "1 anonymized report linked to this pattern";
  return `${count} anonymized reports linked to this pattern`;
}

export function phraseReportsShort(count: number): string {
  if (count <= 0) return "No reports yet";
  if (count === 1) return "1 report";
  return `${count} reports`;
}

export function phraseReportsTiedToPatternLine(count: number): string {
  if (count <= 0) return "No anonymized reports linked to this pattern yet";
  if (count === 1) return "1 anonymized report linked to this pattern";
  return `${count} anonymized reports linked to this pattern`;
}

export function copyPublicIndicatorsExplainer(): string {
  return "These are staff-reviewed clues that appear on multiple anonymized reports. Some values are partially hidden to protect privacy. This list is not complete and does not name anyone.";
}

export function copyPublicIndicatorsCardHint(): string {
  return "Sample of public clues (partially masked)";
}

export function describeRiskLevelForAudience(level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"): string {
  switch (level) {
    case "CRITICAL":
      return "High harm potential — compare carefully; your situation may still differ.";
    case "HIGH":
      return "Serious risk signals common in this pattern.";
    case "MEDIUM":
      return "Moderate risk — stay cautious and verify independently.";
    case "LOW":
      return "Lower reported harm in this pattern — still verify any contact or payment request.";
    default:
      return "Risk is informational only.";
  }
}

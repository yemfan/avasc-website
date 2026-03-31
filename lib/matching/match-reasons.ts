import { IndicatorType } from "@prisma/client";
import type { MatchedIndicatorDetail, MatchStrengthLabel, MatchViewMode } from "./match-types";
import { scoreToStrengthLabel } from "./match-config";

const TYPE_LABEL: Record<IndicatorType, string> = {
  [IndicatorType.WALLET]: "wallet address",
  [IndicatorType.DOMAIN]: "domain",
  [IndicatorType.EMAIL]: "email address",
  [IndicatorType.PHONE]: "phone number",
  [IndicatorType.TX_HASH]: "transaction hash",
  [IndicatorType.SOCIAL_HANDLE]: "social handle",
  [IndicatorType.ALIAS]: "alias",
  [IndicatorType.PLATFORM]: "platform",
  [IndicatorType.COMPANY_NAME]: "company name",
  [IndicatorType.BANK_ACCOUNT]: "bank account",
};

function truncateValue(value: string, max = 56): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

/** Single-indicator explanation for staff (full normalized value where safe). */
export function buildMatchReasonLine(type: IndicatorType, normalizedValue: string): string {
  const label = TYPE_LABEL[type] ?? "indicator";
  const tv = truncateValue(normalizedValue);
  switch (type) {
    case IndicatorType.WALLET:
      return `Same wallet address as this case: ${tv}`;
    case IndicatorType.DOMAIN:
      return `Same website domain as this case: ${tv}`;
    case IndicatorType.EMAIL:
      return `Same email contact as this case: ${tv}`;
    case IndicatorType.PHONE:
      return `Same phone number as this case: ${tv}`;
    case IndicatorType.TX_HASH:
      return `Same on-chain transaction hash as this case: ${tv}`;
    case IndicatorType.SOCIAL_HANDLE:
      return `Same social handle as this case: @${tv.replace(/^@/, "")}`;
    case IndicatorType.ALIAS:
      return `Same scammer alias as this case: “${tv}”`;
    case IndicatorType.PLATFORM:
      return `Same platform or app name as this case: “${tv}” (often weak on its own — corroborate).`;
    case IndicatorType.COMPANY_NAME:
      return `Same company or organization name as this case: “${tv}”`;
    case IndicatorType.BANK_ACCOUNT:
      return `Same bank account reference as this case: ${tv}`;
    default:
      return `Same ${label} as this case: ${tv}`;
  }
}

export function buildReasonsFromDetails(details: MatchedIndicatorDetail[]): string[] {
  const lines = details.map((d) => buildMatchReasonLine(d.indicatorType, d.normalizedValue));
  return uniquePreserveOrder(lines);
}

/** Full moderator-facing list: strength narrative, per-indicator lines, then overlap summary. */
export function buildModeratorReasons(details: MatchedIndicatorDetail[], totalScore: number): string[] {
  const { summary } = summarizeMatchStrength(totalScore);
  const lines: string[] = [`How strong: ${summary}`];
  lines.push(...buildReasonsFromDetails(details));
  if (details.length > 1) {
    lines.push(
      `In total, ${details.length} distinct normalized indicators overlap between this case and the other report (each type/value pair counted once).`
    );
  }
  return lines;
}

export function summarizeMatchStrength(score: number): {
  label: MatchStrengthLabel;
  summary: string;
} {
  const label = scoreToStrengthLabel(score);
  const summary =
    label === "CRITICAL"
      ? "Very strong link — multiple high-trust signals or a definitive on-chain match."
      : label === "HIGH"
        ? "Strong link — likely same operation or coordinated group."
        : label === "MEDIUM"
          ? "Moderate link — worth staff review and corroboration."
          : "Weak link — treat as a hint unless other evidence appears.";
  return { label, summary };
}

/** Privacy-preserving copy for victim / public contexts (no raw values). */
export function buildPublicReasonLine(type: IndicatorType): string {
  switch (type) {
    case IndicatorType.WALLET:
      return "Another report shares a wallet address pattern with yours.";
    case IndicatorType.DOMAIN:
      return "Another report involves the same website domain.";
    case IndicatorType.EMAIL:
      return "Another report references the same email contact.";
    case IndicatorType.PHONE:
      return "Another report references the same phone contact.";
    case IndicatorType.TX_HASH:
      return "Another report references the same on-chain transaction.";
    case IndicatorType.SOCIAL_HANDLE:
      return "Another report references the same social account handle.";
    case IndicatorType.ALIAS:
      return "Another report references the same scammer alias.";
    case IndicatorType.PLATFORM:
      return "Another report mentions the same platform (common signal — corroborate carefully).";
    case IndicatorType.COMPANY_NAME:
      return "Another report references the same company or organization name.";
    case IndicatorType.BANK_ACCOUNT:
      return "Another report references the same bank account pattern.";
    default:
      return "Another report shares a technical indicator with yours.";
  }
}

export function buildPublicHeadline(types: IndicatorType[], strength: MatchStrengthLabel): string {
  const unique = uniqueIndicatorTypes(types);
  if (unique.length === 0) return "A related scam pattern may exist — details are limited.";
  const parts = unique.map((t) => TYPE_LABEL[t] ?? t);
  return `${strength} confidence overlap: shared ${parts.join(", ")}.`;
}

function uniquePreserveOrder(lines: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const l of lines) {
    if (seen.has(l)) continue;
    seen.add(l);
    out.push(l);
  }
  return out;
}

export function uniqueIndicatorTypes(types: IndicatorType[]): IndicatorType[] {
  const seen = new Set<IndicatorType>();
  const out: IndicatorType[] = [];
  for (const t of types) {
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

export function explainForMode(
  details: MatchedIndicatorDetail[],
  mode: MatchViewMode
): string[] {
  if (mode === "internal") return buildReasonsFromDetails(details);
  return uniquePreserveOrder(details.map((d) => buildPublicReasonLine(d.indicatorType)));
}

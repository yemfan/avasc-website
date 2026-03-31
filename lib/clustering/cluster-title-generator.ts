import { IndicatorType } from "@prisma/client";

const TYPE_LABEL: Partial<Record<IndicatorType, string>> = {
  [IndicatorType.WALLET]: "Wallet",
  [IndicatorType.DOMAIN]: "Domain",
  [IndicatorType.TX_HASH]: "On-chain",
  [IndicatorType.EMAIL]: "Email",
  [IndicatorType.PHONE]: "Phone",
  [IndicatorType.SOCIAL_HANDLE]: "Social",
  [IndicatorType.ALIAS]: "Alias",
  [IndicatorType.PLATFORM]: "Platform",
};

/**
 * Deterministic title for a new cluster from scam type + indicator types present in the group.
 */
export function suggestClusterTitle(dominantScamType: string, indicatorTypes: IndicatorType[]): string {
  const human = humanizeScamType(dominantScamType);
  const priorityOrder = new Set<IndicatorType>([
    IndicatorType.WALLET,
    IndicatorType.DOMAIN,
    IndicatorType.TX_HASH,
    IndicatorType.EMAIL,
    IndicatorType.PHONE,
  ]);
  const priority = indicatorTypes.filter((t) => priorityOrder.has(t));
  const bits = priority.slice(0, 2).map((t) => TYPE_LABEL[t] ?? t);
  const pattern = bits.length ? `${bits.join("/")} pattern` : "shared-indicator pattern";
  return `${human} — ${pattern}`;
}

function humanizeScamType(raw: string): string {
  const s = raw.replace(/[_-]+/g, " ").trim();
  if (!s.length) return "Scam cluster";
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function suggestSlugHint(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

import { IndicatorType } from "@prisma/client";

export const INDICATOR_GROUPS: { key: string; label: string; types: IndicatorType[] }[] = [
  { key: "wallet", label: "Wallets", types: [IndicatorType.WALLET] },
  { key: "domain", label: "Domains", types: [IndicatorType.DOMAIN] },
  { key: "email", label: "Emails", types: [IndicatorType.EMAIL] },
  { key: "phone", label: "Phones", types: [IndicatorType.PHONE] },
  { key: "tx_hash", label: "Transaction hashes", types: [IndicatorType.TX_HASH] },
  { key: "alias", label: "Aliases", types: [IndicatorType.ALIAS] },
  {
    key: "platform",
    label: "Platforms & social",
    types: [IndicatorType.PLATFORM, IndicatorType.SOCIAL_HANDLE],
  },
  {
    key: "financial",
    label: "Financial & org",
    types: [IndicatorType.BANK_ACCOUNT, IndicatorType.COMPANY_NAME],
  },
  { key: "other", label: "Other", types: [] },
];

export function groupIndicators<T extends { indicatorType: IndicatorType }>(items: T[]): Map<string, T[]> {
  const byKey = new Map<string, T[]>();
  for (const g of INDICATOR_GROUPS) {
    byKey.set(g.key, []);
  }
  const typeToKey = new Map<IndicatorType, string>();
  for (const g of INDICATOR_GROUPS) {
    for (const t of g.types) typeToKey.set(t, g.key);
  }
  for (const item of items) {
    const key = typeToKey.get(item.indicatorType) ?? "other";
    byKey.get(key)!.push(item);
  }
  return byKey;
}

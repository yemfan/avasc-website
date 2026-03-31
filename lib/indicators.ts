import type { IndicatorType } from "@/lib/types/db";

export function normalizeIndicatorValue(type: IndicatorType, raw: string): string {
  const t = raw.trim().toLowerCase();
  if (type === "phone") return t.replace(/\D/g, "");
  if (type === "wallet" || type === "tx_hash") return t.replace(/\s/g, "");
  if (type === "domain") {
    return t
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .split("?")[0]!
      .trim();
  }
  if (type === "email") return t;
  return t;
}

import type { IndicatorType } from "@/lib/types/db";

export function normalizeIndicatorValue(type: IndicatorType, raw: string): string {
  const t = raw.trim().toLowerCase();
  if (type === "phone") return t.replace(/\D/g, "");
  if (type === "wallet") return t.replace(/\s/g, "");
  return t;
}

import type { Prisma } from "@prisma/client";

/** Best-effort `amount_lost_usd` from stored import JSON. */
export function amountLostUsdFromPayload(raw: Prisma.JsonValue): number {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return 0;
  const v = (raw as Record<string, unknown>).amount_lost_usd;
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : 0;
}

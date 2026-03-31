import type { PublicReadiness } from "./cluster-types";

/** Public pages should only show summaries when staff marked clusters ready — never auto-publish from engine output. */
export function isSafeForPublicPreview(readiness: PublicReadiness): boolean {
  return readiness === "public_ready";
}

export function shouldShowInternallyOnly(readiness: PublicReadiness): boolean {
  return readiness === "internal_only";
}

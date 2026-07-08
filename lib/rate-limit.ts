/**
 * Lightweight in-memory fixed-window rate limiter for public endpoints.
 *
 * Best-effort only: state lives in a module-level Map, so on serverless it is
 * per-instance (a client spread across warm instances gets a higher effective
 * limit). That's fine as a cheap abuse brake in front of a costly AI call; swap
 * in a shared store (e.g. Upstash/Redis or a DB table) if a hard global limit is
 * needed later.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export type RateLimitResult = { ok: boolean; retryAfterSec: number };

function sweep(now: number) {
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Allow up to `limit` calls per `windowMs` for `key`. Returns `ok:false` with a
 * `retryAfterSec` once the window is exhausted.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) sweep(now);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }

  existing.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

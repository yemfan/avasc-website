import Anthropic from "@anthropic-ai/sdk";

/**
 * Shared Anthropic client for AVASC AI features (e.g. the "This Week in Scams"
 * briefings generator). Auth is via `ANTHROPIC_API_KEY`. Kept as a lazily
 * constructed singleton so importing this module never throws during `next build`
 * (the key may be absent in preview/build environments), mirroring `lib/prisma.ts`.
 */

let client: Anthropic | null = null;

/** True when `ANTHROPIC_API_KEY` is present (use to gate optional AI features). */
export function isAnthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Returns the shared Anthropic client. Throws if `ANTHROPIC_API_KEY` is not set —
 * only call this from code paths that actually make a request (never at import time).
 */
export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to your environment to enable AI features (e.g. weekly scam briefings)."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}

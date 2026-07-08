import { NextResponse } from "next/server";

import { isAnthropicConfigured } from "@/lib/ai/anthropic";
import { generateGuidance, MAX_SITUATION_CHARS } from "@/lib/guides/ai";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

// Public AI endpoint: cap per-IP requests as a cheap abuse/cost brake.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

// The AI call can take a little while; give it headroom.
export const maxDuration = 60;

/**
 * Public "Describe your situation" AI guide. On-demand, not persisted.
 * Basic guardrails: input length cap + config gate. (A per-IP rate limit is a
 * sensible follow-up before heavy promotion.)
 */
export async function POST(request: Request) {
  if (!isAnthropicConfigured()) {
    return NextResponse.json(
      { ok: false, error: "The AI guide is temporarily unavailable. Please try our guides below or report your case." },
      { status: 503 }
    );
  }

  const rl = rateLimit(`guides-ai:${getClientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "You're sending requests a bit too quickly. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const situationRaw = (body as { situation?: unknown })?.situation;
  const situation = typeof situationRaw === "string" ? situationRaw.trim() : "";
  const mode = (body as { mode?: unknown })?.mode === "recovery" ? "recovery" : "guide";

  if (situation.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Please describe your situation in a little more detail." },
      { status: 400 }
    );
  }
  if (situation.length > MAX_SITUATION_CHARS) {
    return NextResponse.json(
      { ok: false, error: `Please keep your description under ${MAX_SITUATION_CHARS} characters.` },
      { status: 400 }
    );
  }

  try {
    const guidance = await generateGuidance(situation, mode);
    if (!guidance) {
      return NextResponse.json(
        { ok: false, error: "We couldn't generate guidance just now. Please try again or report your case." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, guidance });
  } catch (err) {
    console.error("[guides/ai] generation failed", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}

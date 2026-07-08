import { NextResponse } from "next/server";

import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { isAnthropicConfigured } from "@/lib/ai/anthropic";
import { runDailySocialPost } from "@/lib/social/daily-run";

/**
 * Daily social post — themed weekly rotation. Generates today's post from AVASC's
 * own content and auto-posts to configured platforms (X, Facebook). Idempotent
 * per day. Auth: `Authorization: Bearer $CRON_SECRET`.
 * Pass `?force=1` to regenerate/repost the same day.
 */
export const maxDuration = 120;

async function run(request: Request) {
  const denied = requireCronSecret(request);
  if (denied) return denied;

  if (!isAnthropicConfigured()) {
    return NextResponse.json({ ok: false, error: "ANTHROPIC_API_KEY is not configured" }, { status: 503 });
  }

  const force = new URL(request.url).searchParams.get("force") === "1";
  const result = await runDailySocialPost({ force });
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}

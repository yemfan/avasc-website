import { NextResponse } from "next/server";

import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { isAnthropicConfigured } from "@/lib/ai/anthropic";
import { publishBriefing } from "@/lib/briefings/generate";
import { sendBriefingDigest } from "@/lib/briefings/sendBriefing";

/**
 * Generate + publish the weekly "This Week in Scams" briefing, then broadcast it to
 * confirmed weekly subscribers (shared send primitives — confirmed-only, deduped,
 * with unsubscribe footer + List-Unsubscribe headers).
 * Auth: `Authorization: Bearer $CRON_SECRET` (Vercel Cron / manual runs).
 */

// Long-running: streams Claude + web_search across several tool rounds.
export const maxDuration = 300;

async function run(request: Request) {
  const denied = requireCronSecret(request);
  if (denied) return denied;

  if (!isAnthropicConfigured()) {
    return NextResponse.json(
      { ok: false, error: "ANTHROPIC_API_KEY is not configured" },
      { status: 503 }
    );
  }

  const slug = await publishBriefing("weekly");
  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "Briefing generation failed" },
      { status: 502 }
    );
  }

  const delivery = await sendBriefingDigest("weekly");

  return NextResponse.json({ ok: true, slug, delivery });
}

export async function POST(request: Request) {
  return run(request);
}

export async function GET(request: Request) {
  return run(request);
}

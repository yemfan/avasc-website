import { NextResponse } from "next/server";

import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { isAnthropicConfigured } from "@/lib/ai/anthropic";
import { publishBriefing } from "@/lib/briefings/generate";

/**
 * Generate + publish the daily "Today in Scams" briefing.
 * Auth: `Authorization: Bearer $CRON_SECRET` (Vercel Cron / manual runs).
 * This is ADDITIVE — it does not touch the existing alert/digest send pipeline.
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

  const slug = await publishBriefing("daily");
  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "Briefing generation failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, slug });
}

export async function POST(request: Request) {
  return run(request);
}

export async function GET(request: Request) {
  return run(request);
}

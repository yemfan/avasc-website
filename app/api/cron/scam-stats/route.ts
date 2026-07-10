import { NextResponse } from "next/server";

import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { isAnthropicConfigured } from "@/lib/ai/anthropic";
import { refreshScamStats } from "@/lib/scam-stats/generate";
import { refreshScamBreakdowns } from "@/lib/scam-stats/breakdowns";

/**
 * Refresh the year-over-year scam-loss series (FBI IC3 + FTC) AND the granular
 * FTC/IC3 breakdowns via Claude + web_search. This is the EXPENSIVE, annual-data
 * refresh (official reports change ~once a year), so it runs QUARTERLY. The
 * daily-updating CFPB "Live" snapshot has its own cheaper weekly cron at
 * `/api/cron/scam-stats/cfpb`. Auth: `Authorization: Bearer $CRON_SECRET`.
 */
export const maxDuration = 300;

async function run(request: Request) {
  const denied = requireCronSecret(request);
  if (denied) return denied;

  if (!isAnthropicConfigured()) {
    return NextResponse.json({ ok: false, error: "ANTHROPIC_API_KEY is not configured" }, { status: 503 });
  }

  const [series, breakdowns] = await Promise.all([refreshScamStats(), refreshScamBreakdowns()]);
  return NextResponse.json({ series, breakdowns }, { status: series.ok || breakdowns.ok ? 200 : 502 });
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}

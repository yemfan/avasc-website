import { NextResponse } from "next/server";

import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { isAnthropicConfigured } from "@/lib/ai/anthropic";
import { refreshScamStats } from "@/lib/scam-stats/generate";
import { refreshScamBreakdowns } from "@/lib/scam-stats/breakdowns";
import { refreshCfpbSnapshot } from "@/lib/scam-stats/cfpb";

/**
 * Refresh the year-over-year scam-loss series (FBI IC3 + FTC) AND the granular
 * FTC/IC3 breakdowns via Claude + web_search. Runs periodically to pick up
 * newly published annual reports / corrections. Auth: `Authorization: Bearer $CRON_SECRET`.
 */
export const maxDuration = 300;

async function run(request: Request) {
  const denied = requireCronSecret(request);
  if (denied) return denied;

  if (!isAnthropicConfigured()) {
    return NextResponse.json({ ok: false, error: "ANTHROPIC_API_KEY is not configured" }, { status: 503 });
  }

  const [series, breakdowns, cfpb] = await Promise.all([
    refreshScamStats(),
    refreshScamBreakdowns(),
    refreshCfpbSnapshot(),
  ]);
  return NextResponse.json({ series, breakdowns, cfpb }, { status: series.ok || breakdowns.ok || cfpb.ok ? 200 : 502 });
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}

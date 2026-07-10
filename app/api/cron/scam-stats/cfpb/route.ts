import { NextResponse } from "next/server";

import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { refreshCfpbSnapshot } from "@/lib/scam-stats/cfpb";

/**
 * Refresh the CFPB Consumer Complaint snapshot powering the "Live" panel on
 * /statistics and /briefings. The CFPB source updates DAILY, so this runs
 * WEEKLY to keep the "Live" badge honest — separate from the quarterly
 * IC3/FTC annual refresh. Uses only a plain public API (no Claude / web_search),
 * so it works even when ANTHROPIC_API_KEY is unset.
 * Auth: `Authorization: Bearer $CRON_SECRET`.
 */
export const maxDuration = 60;

async function run(request: Request) {
  const denied = requireCronSecret(request);
  if (denied) return denied;

  const cfpb = await refreshCfpbSnapshot();
  return NextResponse.json({ cfpb }, { status: cfpb.ok ? 200 : 502 });
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}

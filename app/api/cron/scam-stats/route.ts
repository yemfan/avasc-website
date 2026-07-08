import { NextResponse } from "next/server";

import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { isAnthropicConfigured } from "@/lib/ai/anthropic";
import { refreshScamStats } from "@/lib/scam-stats/generate";

/**
 * Refresh the year-over-year scam-loss series (FBI IC3) via Claude + web_search.
 * Runs periodically to pick up newly published annual reports / corrections.
 * Auth: `Authorization: Bearer $CRON_SECRET`.
 */
export const maxDuration = 300;

async function run(request: Request) {
  const denied = requireCronSecret(request);
  if (denied) return denied;

  if (!isAnthropicConfigured()) {
    return NextResponse.json({ ok: false, error: "ANTHROPIC_API_KEY is not configured" }, { status: 503 });
  }

  const result = await refreshScamStats();
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}

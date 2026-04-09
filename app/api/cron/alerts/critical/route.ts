import { NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { processCriticalClustersSince } from "@/lib/alerts/process-critical-clusters";
import { prisma } from "@/lib/prisma";

/**
 * Frequent CRITICAL SMS scan (default 45-minute lookback). Add to `vercel.json` crons
 * for faster SMS than the daily catch-up alone.
 */
export async function GET(request: Request) {
  const denied = requireCronSecret(request);
  if (denied) return denied;

  const since = new Date(Date.now() - 45 * 60 * 1000);
  const result = await processCriticalClustersSince(prisma, since);
  return NextResponse.json({ ok: true, ...result });
}

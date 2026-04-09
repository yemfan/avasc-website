import { NextResponse } from "next/server";
import { buildDailyDigest } from "@/lib/alerts/build-daily-digest";
import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { processCriticalClustersSince } from "@/lib/alerts/process-critical-clusters";
import { sendDailyDigestEmail } from "@/lib/alerts/send-email-digest";
import { prisma } from "@/lib/prisma";

/**
 * Daily: (1) CRITICAL SMS pipeline for clusters updated in the last 24h,
 * (2) email daily digest. Secure with `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: Request) {
  const denied = requireCronSecret(request);
  if (denied) return denied;

  const sinceCritical = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const critical = await processCriticalClustersSince(prisma, sinceCritical);

  const { subject, html, clusterCount } = await buildDailyDigest(prisma);
  const digest = await sendDailyDigestEmail(
    prisma,
    subject,
    html,
    `Daily digest (${clusterCount} updates)`
  );

  return NextResponse.json({
    success: true,
    sent: digest.emailed > 0,
    clusterCount,
    critical,
    digest,
  });
}

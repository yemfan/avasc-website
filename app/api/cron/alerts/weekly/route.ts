import { NextResponse } from "next/server";
import { buildWeeklyReport } from "@/lib/alerts/build-weekly-report";
import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { sendWeeklyDigestEmail } from "@/lib/alerts/send-email-digest";
import { prisma } from "@/lib/prisma";

/** Weekly verified email report. `Authorization: Bearer $CRON_SECRET`. */
export async function GET(request: Request) {
  const denied = requireCronSecret(request);
  if (denied) return denied;

  const { subject, html, clusterCount } = await buildWeeklyReport(prisma);
  const report = await sendWeeklyDigestEmail(
    prisma,
    subject,
    html,
    `Weekly report (${clusterCount} updates)`
  );

  return NextResponse.json({
    success: true,
    sent: report.emailed > 0,
    clusterCount,
    report,
  });
}

import { NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { sendPersonalizedDailyDigests } from "@/lib/alerts/send-personalized-daily-digests";

/**
 * Per-subscriber personalized daily emails (DigestRun + SubscriptionDigestLog).
 * Secure with `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: Request) {
  const denied = requireCronSecret(request);
  if (denied) return denied;

  try {
    const { digestRunId } = await sendPersonalizedDailyDigests();
    return NextResponse.json({ ok: true, digestRunId });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

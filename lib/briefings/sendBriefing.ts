import { prisma } from "@/lib/prisma";
import type { BriefingKind } from "@/lib/briefings/generate";
import { getLatestPublishedBriefing } from "@/lib/briefings/queries";
import { briefingEmailSubject, renderBriefingEmail } from "@/lib/briefings/emailTemplate";
import { sendDailyDigestEmail, sendWeeklyDigestEmail } from "@/lib/alerts/send-email-digest";

export type SendBriefingResult = {
  sent: boolean;
  slug?: string;
  emailed?: number;
  skipped?: number;
  reason?: string;
};

/**
 * Broadcast the latest published briefing of a cadence to confirmed subscribers.
 * Reuses the existing digest send primitives (dedup gap, delivery logs, confirmed-only
 * gate, per-subscriber unsubscribe footer + List-Unsubscribe headers).
 *
 * Weekly briefing → emailWeekly subscribers; daily briefing → emailDaily subscribers.
 */
export async function sendBriefingDigest(kind: BriefingKind): Promise<SendBriefingResult> {
  if (!process.env.AVASC_FROM_EMAIL) {
    return { sent: false, reason: "AVASC_FROM_EMAIL not configured" };
  }

  const briefing = await getLatestPublishedBriefing(kind);
  if (!briefing) {
    return { sent: false, reason: "no published briefing" };
  }

  const subject = briefingEmailSubject(briefing);
  const html = renderBriefingEmail(briefing);
  const alertTitle = `${kind === "weekly" ? "Weekly" : "Daily"} briefing: ${briefing.title}`.slice(0, 500);

  const result =
    kind === "weekly"
      ? await sendWeeklyDigestEmail(prisma, subject, html, alertTitle)
      : await sendDailyDigestEmail(prisma, subject, html, alertTitle);

  return {
    sent: result.emailed > 0,
    slug: briefing.slug,
    emailed: result.emailed,
    skipped: result.skipped,
  };
}

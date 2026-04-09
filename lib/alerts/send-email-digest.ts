import type { PrismaClient } from "@prisma/client";
import { AlertChannel } from "@prisma/client";
import { buildDailyDigest } from "@/lib/alerts/build-daily-digest";
import { buildWeeklyReport } from "@/lib/alerts/build-weekly-report";
import { getResend } from "@/lib/email/resend-client";
import { createDeliveryLog } from "@/lib/alerts/delivery-log";

const DIGEST_GAP_MS = 20 * 60 * 60 * 1000;
const WEEKLY_GAP_MS = 6 * 24 * 60 * 60 * 1000;

/**
 * Send arbitrary HTML to every active daily-digest subscriber. Creates one `Alert` (DAILY) and delivery logs.
 * Uses `getResend()` and `AVASC_FROM_EMAIL` (returns zeros if from-address is unset).
 */
export async function sendDailyDigestEmail(
  prisma: PrismaClient,
  subject: string,
  html: string,
  alertTitle?: string
): Promise<{ emailed: number; skipped: number }> {
  const from = process.env.AVASC_FROM_EMAIL;
  if (!from) {
    return { emailed: 0, skipped: 0 };
  }

  const subs = await prisma.subscription.findMany({
    where: {
      isActive: true,
      emailDaily: true,
      email: { not: null },
    },
  });

  if (subs.length === 0) {
    return { emailed: 0, skipped: 0 };
  }

  const title = alertTitle?.trim() || subject.slice(0, 500);

  const digestAlert = await prisma.alert.create({
    data: {
      title,
      message: html,
      alertType: "DAILY",
      isSent: false,
    },
  });

  let emailed = 0;
  let skipped = 0;

  for (const sub of subs) {
    const lastLog = await prisma.alertDeliveryLog.findFirst({
      where: {
        subscriptionId: sub.id,
        channel: AlertChannel.EMAIL,
        alert: { is: { alertType: "DAILY" } },
      },
      orderBy: { sentAt: "desc" },
    });
    if (lastLog && Date.now() - lastLog.sentAt.getTime() < DIGEST_GAP_MS) {
      skipped++;
      continue;
    }

    try {
      const { data, error } = await getResend().emails.send({
        from,
        to: sub.email!,
        subject,
        html,
      });
      if (error) {
        await createDeliveryLog(prisma, {
          alertId: digestAlert.id,
          subscriptionId: sub.id,
          channel: AlertChannel.EMAIL,
          status: "FAILED",
          errorMessage: error.message,
        });
        continue;
      }
      await createDeliveryLog(prisma, {
        alertId: digestAlert.id,
        subscriptionId: sub.id,
        channel: AlertChannel.EMAIL,
        status: "SENT",
        providerMessageId: data?.id ?? null,
      });
      emailed++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "send error";
      await createDeliveryLog(prisma, {
        alertId: digestAlert.id,
        subscriptionId: sub.id,
        channel: AlertChannel.EMAIL,
        status: "FAILED",
        errorMessage: msg,
      });
    }
  }

  await prisma.alert.update({
    where: { id: digestAlert.id },
    data: { isSent: true },
  });

  return { emailed, skipped };
}

export async function runDailyDigest(prisma: PrismaClient): Promise<{ emailed: number; skipped: number }> {
  if (!process.env.AVASC_FROM_EMAIL) {
    return { emailed: 0, skipped: 0 };
  }

  const { subject, html, clusterCount } = await buildDailyDigest(prisma);
  const alertTitle = `Daily digest (${clusterCount} updates)`;

  return sendDailyDigestEmail(prisma, subject, html, alertTitle);
}

/**
 * Send arbitrary HTML to every active weekly-digest subscriber. Creates one `Alert` (WEEKLY) and delivery logs.
 */
export async function sendWeeklyDigestEmail(
  prisma: PrismaClient,
  subject: string,
  html: string,
  alertTitle?: string
): Promise<{ emailed: number; skipped: number }> {
  const from = process.env.AVASC_FROM_EMAIL;
  if (!from) {
    return { emailed: 0, skipped: 0 };
  }

  const subs = await prisma.subscription.findMany({
    where: {
      isActive: true,
      emailWeekly: true,
      email: { not: null },
    },
  });

  if (subs.length === 0) {
    return { emailed: 0, skipped: 0 };
  }

  const title = alertTitle?.trim() || subject.slice(0, 500);

  const weeklyAlert = await prisma.alert.create({
    data: {
      title,
      message: html,
      alertType: "WEEKLY",
      isSent: false,
    },
  });

  let emailed = 0;
  let skipped = 0;

  for (const sub of subs) {
    const lastLog = await prisma.alertDeliveryLog.findFirst({
      where: {
        subscriptionId: sub.id,
        channel: AlertChannel.EMAIL,
        alert: { is: { alertType: "WEEKLY" } },
      },
      orderBy: { sentAt: "desc" },
    });
    if (lastLog && Date.now() - lastLog.sentAt.getTime() < WEEKLY_GAP_MS) {
      skipped++;
      continue;
    }

    try {
      const { data, error } = await getResend().emails.send({
        from,
        to: sub.email!,
        subject,
        html,
      });
      if (error) {
        await createDeliveryLog(prisma, {
          alertId: weeklyAlert.id,
          subscriptionId: sub.id,
          channel: AlertChannel.EMAIL,
          status: "FAILED",
          errorMessage: error.message,
        });
        continue;
      }
      await createDeliveryLog(prisma, {
        alertId: weeklyAlert.id,
        subscriptionId: sub.id,
        channel: AlertChannel.EMAIL,
        status: "SENT",
        providerMessageId: data?.id ?? null,
      });
      emailed++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "send error";
      await createDeliveryLog(prisma, {
        alertId: weeklyAlert.id,
        subscriptionId: sub.id,
        channel: AlertChannel.EMAIL,
        status: "FAILED",
        errorMessage: msg,
      });
    }
  }

  await prisma.alert.update({
    where: { id: weeklyAlert.id },
    data: { isSent: true },
  });

  return { emailed, skipped };
}

export async function runWeeklyReport(prisma: PrismaClient): Promise<{ emailed: number; skipped: number }> {
  if (!process.env.AVASC_FROM_EMAIL) {
    return { emailed: 0, skipped: 0 };
  }

  const { subject, html, clusterCount } = await buildWeeklyReport(prisma);
  const alertTitle = `Weekly report (${clusterCount} updates)`;

  return sendWeeklyDigestEmail(prisma, subject, html, alertTitle);
}

import { prisma } from "@/lib/prisma";
import { buildPersonalizedDailyDigest } from "@/lib/alerts/build-personalized-daily-digest";
import { getResend } from "@/lib/email/resend-client";

const DAILY_SUBJECT_FALLBACK = "AVASC Daily Scam News";

/**
 * Build + email personalized daily digests for all active daily subscribers; audit via DigestRun / SubscriptionDigestLog.
 */
export async function sendPersonalizedDailyDigests(): Promise<{ digestRunId: string }> {
  const from = process.env.AVASC_FROM_EMAIL?.trim();
  if (!from) {
    throw new Error("Missing AVASC_FROM_EMAIL");
  }

  const digestRun = await prisma.digestRun.create({
    data: {
      digestType: "DAILY",
    },
  });

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        isActive: true,
        emailDaily: true,
        email: { not: null },
      },
      select: {
        id: true,
        email: true,
      },
    });

    for (const sub of subscriptions) {
      try {
        const built = await buildPersonalizedDailyDigest(sub.id);
        if (!built) continue;

        const { error } = await getResend().emails.send({
          from,
          to: built.to,
          subject: built.subject,
          html: built.html,
        });

        if (error) {
          await prisma.subscriptionDigestLog.create({
            data: {
              subscriptionId: sub.id,
              digestRunId: digestRun.id,
              digestType: "DAILY",
              status: "FAILED",
              subject: built.subject,
              errorMessage: error.message,
            },
          });
          continue;
        }

        await prisma.subscriptionDigestLog.create({
          data: {
            subscriptionId: sub.id,
            digestRunId: digestRun.id,
            digestType: "DAILY",
            status: "SENT",
            subject: built.subject,
          },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        await prisma.subscriptionDigestLog.create({
          data: {
            subscriptionId: sub.id,
            digestRunId: digestRun.id,
            digestType: "DAILY",
            status: "FAILED",
            subject: DAILY_SUBJECT_FALLBACK,
            errorMessage: message,
          },
        });
      }
    }
  } finally {
    await prisma.digestRun.update({
      where: { id: digestRun.id },
      data: { finishedAt: new Date() },
    });
  }

  return { digestRunId: digestRun.id };
}

import { AlertChannel } from "@prisma/client";
import twilio from "twilio";
import { createDeliveryLog } from "@/lib/alerts/delivery-log";
import { prisma } from "@/lib/prisma";

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error("Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN");
  }
  return twilio(sid, token);
}

export type SendCriticalSmsResult =
  | { ok: true; messageSid: string }
  | { ok: false; error: string };

/**
 * Send a short CRITICAL alert SMS (Twilio). Caller must enforce opt-in, cooldown, and confidence gates.
 */
export async function sendCriticalScamAlertSms(input: { toE164: string; body: string }): Promise<SendCriticalSmsResult> {
  const from =
    process.env.TWILIO_MESSAGING_SERVICE_SID?.trim() ||
    process.env.TWILIO_FROM_NUMBER?.trim() ||
    "";
  if (!from) {
    return { ok: false, error: "Missing TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID" };
  }

  try {
    const client = getTwilioClient();
    const msg = await client.messages.create({
      to: input.toE164,
      body: input.body.slice(0, 1400),
      ...(from.startsWith("MG") ? { messagingServiceSid: from } : { from }),
    });
    return { ok: true, messageSid: msg.sid };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Twilio error";
    return { ok: false, error: message };
  }
}

/**
 * Broadcast a REALTIME alert to global SMS subscribers plus followers of `alert.scamClusterId` (deduped by subscription id).
 * Uses `sendCriticalScamAlertSms` (TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID).
 */
export async function sendRealtimeSmsAlert(alertId: string) {
  const alert = await prisma.alert.findUnique({
    where: { id: alertId },
  });

  if (!alert) {
    throw new Error("Alert not found");
  }

  if (alert.isSent) {
    return { skipped: true as const, reason: "already_sent" as const };
  }

  const globalSubscriptions = await prisma.subscription.findMany({
    where: {
      isActive: true,
      smsEnabled: true,
      phone: { not: null },
    },
    select: {
      id: true,
      phone: true,
    },
  });

  const clusterSubscriptions = alert.scamClusterId
    ? await prisma.clusterSubscription.findMany({
        where: {
          clusterId: alert.scamClusterId,
          subscription: {
            isActive: true,
            smsEnabled: true,
            phone: { not: null },
          },
        },
        include: {
          subscription: {
            select: {
              id: true,
              phone: true,
            },
          },
        },
      })
    : [];

  const recipients = new Map<string, { id: string; phone: string }>();

  for (const sub of globalSubscriptions) {
    if (sub.phone) {
      recipients.set(sub.id, { id: sub.id, phone: sub.phone });
    }
  }

  for (const link of clusterSubscriptions) {
    const sub = link.subscription;
    if (sub.phone) {
      recipients.set(sub.id, { id: sub.id, phone: sub.phone });
    }
  }

  for (const recipient of recipients.values()) {
    const result = await sendCriticalScamAlertSms({
      toE164: recipient.phone,
      body: alert.message,
    });

    if (result.ok) {
      await createDeliveryLog(prisma, {
        alertId: alert.id,
        subscriptionId: recipient.id,
        channel: AlertChannel.SMS,
        status: "SENT",
        providerMessageId: result.messageSid,
      });
    } else {
      await createDeliveryLog(prisma, {
        alertId: alert.id,
        subscriptionId: recipient.id,
        channel: AlertChannel.SMS,
        status: "FAILED",
        errorMessage: result.error,
      });
    }
  }

  await prisma.alert.update({
    where: { id: alert.id },
    data: { isSent: true },
  });

  return { skipped: false as const, recipients: recipients.size };
}

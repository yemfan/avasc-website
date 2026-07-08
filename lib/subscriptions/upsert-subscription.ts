import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendSubscriptionConfirmationEmail } from "@/lib/email/send-subscription-confirmation";

export type UpsertSubscriptionInput = {
  email?: string | null;
  phone?: string | null;
  smsEnabled: boolean;
  emailDaily: boolean;
  emailWeekly: boolean;
};

export type UpsertSubscriptionResult = {
  /** True when a confirmation email was (re)sent and broadcast sends are gated until confirmed. */
  pendingConfirmation: boolean;
  isNew: boolean;
};

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || null;
}

function normalizePhone(phone?: string | null) {
  return phone?.trim().replace(/\s+/g, "") || null;
}

function cadenceLabel(daily: boolean, weekly: boolean): string {
  if (daily && weekly) return "daily and weekly scam briefings";
  if (daily) return "daily scam briefings";
  if (weekly) return "weekly scam briefings";
  return "scam alerts";
}

/**
 * Single source of truth for subscribe/preferences upsert + email double opt-in.
 * Used by both the public API route and the `/alerts/subscribe` server action so the
 * two paths cannot drift. A new or still-unconfirmed email subscriber gets a fresh
 * confirmToken + confirmation email; broadcast sends stay gated on confirmedAt.
 */
export async function upsertSubscription(
  input: UpsertSubscriptionInput
): Promise<UpsertSubscriptionResult> {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const { smsEnabled, emailDaily, emailWeekly } = input;
  const wantsEmail = Boolean(email) && (emailDaily || emailWeekly);

  const matchOr = [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])];
  const existing =
    matchOr.length > 0 ? await prisma.subscription.findFirst({ where: { OR: matchOr } }) : null;

  let pendingConfirmation = false;
  let confirmTokenToSend: string | null = null;
  let unsubscribeToken = "";

  if (existing) {
    const alreadyConfirmed = Boolean(existing.confirmedAt);
    let confirmData: { confirmToken?: string | null; confirmedAt?: Date | null } = {};
    if (wantsEmail && !alreadyConfirmed) {
      const token = randomUUID();
      confirmData = { confirmToken: token, confirmedAt: null };
      pendingConfirmation = true;
      confirmTokenToSend = token;
    }

    const updated = await prisma.subscription.update({
      where: { id: existing.id },
      data: { email, phone, smsEnabled, emailDaily, emailWeekly, isActive: true, ...confirmData },
    });
    unsubscribeToken = updated.unsubscribeToken;
  } else {
    const token = wantsEmail ? randomUUID() : null;
    const created = await prisma.subscription.create({
      data: {
        email,
        phone,
        smsEnabled,
        emailDaily,
        emailWeekly,
        isActive: true,
        confirmedAt: null,
        confirmToken: token,
      },
    });
    unsubscribeToken = created.unsubscribeToken;
    if (wantsEmail) {
      pendingConfirmation = true;
      confirmTokenToSend = token;
    }
  }

  if (pendingConfirmation && email && confirmTokenToSend) {
    await sendSubscriptionConfirmationEmail({
      to: email,
      confirmToken: confirmTokenToSend,
      unsubscribeToken,
      cadenceLabel: cadenceLabel(emailDaily, emailWeekly),
    });
  }

  return { pendingConfirmation, isNew: !existing };
}

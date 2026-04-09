import { preferencesPatchSchema } from "@/lib/alerts/api-schemas";
import { prisma } from "@/lib/prisma";

export type PreferencesPatchResult =
  | { ok: true; subscriptionId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

/**
 * Applies preference updates for a subscriber row keyed by email (dashboard user email).
 * Shared by `/api/alerts/preferences` PATCH and dashboard server actions.
 * When `userId` is set, new rows are linked to `User`; updates set `userId` when provided.
 */
export async function updateAlertPreferencesForUserEmail(
  userEmail: string,
  body: unknown,
  options?: { userId?: string }
): Promise<PreferencesPatchResult> {
  const parsed = preferencesPatchSchema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const patch = parsed.data;
  const phone =
    patch.phone !== undefined
      ? patch.phone === "" || !patch.phone
        ? null
        : patch.phone.trim()
      : undefined;

  let sub = await prisma.subscription.findFirst({ where: { email: userEmail } });

  if (!sub) {
    const nextPhone = phone ?? null;
    const sms = patch.smsEnabled ?? false;
    if (sms && !nextPhone) {
      return { ok: false, error: "SMS requires a phone number in E.164 format" };
    }
    sub = await prisma.subscription.create({
      data: {
        ...(options?.userId ? { userId: options.userId } : {}),
        email: userEmail,
        phone: nextPhone,
        smsEnabled: sms,
        emailDaily: patch.emailDaily ?? false,
        emailWeekly: patch.emailWeekly ?? true,
        isActive: patch.isActive ?? true,
      },
    });
    return { ok: true, subscriptionId: sub.id };
  }

  const nextPhone = phone !== undefined ? phone : sub.phone;
  const nextSms = patch.smsEnabled ?? sub.smsEnabled;
  if (nextSms && !nextPhone) {
    return { ok: false, error: "SMS requires a phone number in E.164 format" };
  }

  const updated = await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      ...(options?.userId ? { userId: options.userId } : {}),
      phone: nextPhone,
      smsEnabled: patch.smsEnabled ?? sub.smsEnabled,
      emailDaily: patch.emailDaily ?? sub.emailDaily,
      emailWeekly: patch.emailWeekly ?? sub.emailWeekly,
      isActive: patch.isActive ?? sub.isActive,
    },
  });

  return { ok: true, subscriptionId: updated.id };
}

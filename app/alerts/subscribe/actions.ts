"use server";

import { subscribeRequestSchema } from "@/lib/alerts/subscription-schema";
import { prisma } from "@/lib/prisma";

export type SubscribeState = {
  success: boolean;
  message: string;
  errors?: Partial<
    Record<"email" | "phone" | "smsEnabled" | "emailDaily" | "emailWeekly" | "smsConsent", string>
  >;
};

function checkboxOn(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

export async function subscribeAction(_prevState: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const parsed = subscribeRequestSchema.safeParse({
    email: (formData.get("email")?.toString() ?? "").trim() || undefined,
    phone: (formData.get("phone")?.toString() ?? "").trim() || undefined,
    smsEnabled: checkboxOn(formData, "smsEnabled"),
    emailDaily: checkboxOn(formData, "emailDaily"),
    emailWeekly: checkboxOn(formData, "emailWeekly"),
    smsConsent: checkboxOn(formData, "smsConsent"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const fe = flat.fieldErrors;
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: {
        email: fe.email?.[0],
        phone: fe.phone?.[0],
        smsEnabled: fe.smsEnabled?.[0],
        emailDaily: fe.emailDaily?.[0],
        emailWeekly: fe.emailWeekly?.[0],
        smsConsent: fe.smsConsent?.[0],
      },
    };
  }

  const body = parsed.data;
  const email = body.email?.trim() || null;
  const phone = body.phone?.trim() || null;

  try {
    const existing = email
      ? await prisma.subscription.findFirst({ where: { email } })
      : phone
        ? await prisma.subscription.findFirst({ where: { phone } })
        : null;

    if (existing) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          email: email ?? existing.email,
          phone: phone ?? existing.phone,
          smsEnabled: body.smsEnabled,
          emailDaily: body.emailDaily,
          emailWeekly: body.emailWeekly,
          isActive: true,
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          email,
          phone,
          smsEnabled: body.smsEnabled,
          emailDaily: body.emailDaily,
          emailWeekly: body.emailWeekly,
          isActive: true,
        },
      });
    }

    return {
      success: true,
      message: "You're subscribed. You can update preferences anytime.",
      errors: undefined,
    };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Something went wrong.",
      errors: undefined,
    };
  }
}

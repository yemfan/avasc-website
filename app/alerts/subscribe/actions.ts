"use server";

import { subscribeRequestSchema } from "@/lib/alerts/subscription-schema";
import { upsertSubscription } from "@/lib/subscriptions/upsert-subscription";

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
    const { pendingConfirmation } = await upsertSubscription({
      email,
      phone,
      smsEnabled: body.smsEnabled,
      emailDaily: body.emailDaily,
      emailWeekly: body.emailWeekly,
    });

    return {
      success: true,
      message: pendingConfirmation
        ? "Almost there — check your email and click the confirmation link to start receiving alerts."
        : "You're subscribed. You can update preferences anytime.",
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

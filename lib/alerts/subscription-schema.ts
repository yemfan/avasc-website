import { z } from "zod";

/**
 * Same intent as:
 *   email: z.string().trim().email().optional().or(z.literal(""))
 *   phone: z.string().trim().regex(...).optional().or(z.literal(""))
 * Using `z.union` so `""` is accepted (plain `.email()` / `.regex()` fail on `""` before `.or(...)` runs).
 */
const subscriptionFields = z.object({
  email: z.union([z.literal(""), z.string().trim().email()]).optional(),
  phone: z
    .union([
      z.literal(""),
      z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid phone number"),
    ])
    .optional(),
  smsEnabled: z.boolean().default(false),
  emailDaily: z.boolean().default(false),
  emailWeekly: z.boolean().default(false),
});

function refineSubscription(
  data: z.infer<typeof subscriptionFields> & { smsConsent?: boolean },
  ctx: z.RefinementCtx
) {
  if (data.smsEnabled && !data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["phone"],
      message: "Phone number is required for SMS alerts",
    });
  }

  if ((data.emailDaily || data.emailWeekly) && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["email"],
      message: "Email is required for email digests",
    });
  }

  if (!data.smsEnabled && !data.emailDaily && !data.emailWeekly) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["smsEnabled"],
      message: "Choose at least one subscription option",
    });
  }
}

export const subscriptionSchema = subscriptionFields.superRefine((data, ctx) => {
  refineSubscription(data, ctx);
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;

/** POST `/api/alerts/subscribe` — includes `smsConsent` when SMS is enabled. */
export const subscribeRequestSchema = subscriptionFields
  .extend({
    smsConsent: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    refineSubscription(data, ctx);
    if (data.smsEnabled && !data.smsConsent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["smsConsent"],
        message: "Consent is required for SMS alerts",
      });
    }
  });

import { z } from "zod";

export {
  subscriptionSchema,
  subscribeRequestSchema,
  type SubscriptionInput,
} from "./subscription-schema";

/** Same phone rules as `subscriptionSchema` (optional empty or `+?[1-9]…`). */
export const subscriptionPhoneField = z.union([
  z.literal(""),
  z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid phone number"),
]);

/**
 * Follow a published cluster. Uses `z.union` for `email` / `phone` so `""` is valid before `.email()` / `.regex()`.
 */
export const followClusterSchema = z
  .object({
    clusterId: z.string().uuid(),
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
    smsConsent: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.smsEnabled && !data.emailDaily && !data.emailWeekly) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["smsEnabled"],
        message: "Choose at least one alert option",
      });
    }

    if (data.smsEnabled && (!data.phone || data.phone === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Phone number is required for SMS alerts",
      });
    }

    if (data.smsEnabled && !data.smsConsent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["smsConsent"],
        message: "Consent is required for SMS alerts",
      });
    }

    if ((data.emailDaily || data.emailWeekly) && (!data.email || data.email === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Email is required for email alerts",
      });
    }
  });

export type FollowClusterInput = z.infer<typeof followClusterSchema>;

export const followClusterBodySchema = followClusterSchema;

export const preferencesPatchSchema = z.object({
  phone: subscriptionPhoneField.optional(),
  smsEnabled: z.boolean().optional(),
  emailDaily: z.boolean().optional(),
  emailWeekly: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

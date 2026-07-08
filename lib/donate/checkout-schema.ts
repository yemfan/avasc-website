import { z } from "zod";

const donorNameField = z
  .string()
  .trim()
  .max(120)
  .optional()
  .transform((v) => (v === "" ? undefined : v));

const donorEmailField = z.string().trim().email("Enter a valid email.");

const amountField = z
  .number()
  .positive("Enter an amount of at least 1.")
  .max(1_000_000, "Amount is too large.");

/** Shared validation for custom donate checkout (client + API). Both one-time and
 * monthly carry a donor-chosen amount (monthly → recurring Stripe subscription). */
export const donateCheckoutRequestSchema = z.discriminatedUnion("donationType", [
  z.object({
    donorName: donorNameField,
    donorEmail: donorEmailField,
    donationType: z.literal("one_time"),
    amount: amountField,
  }),
  z.object({
    donorName: donorNameField,
    donorEmail: donorEmailField,
    donationType: z.literal("monthly"),
    amount: amountField,
  }),
]);

export type DonateCheckoutRequest = z.infer<typeof donateCheckoutRequestSchema>;

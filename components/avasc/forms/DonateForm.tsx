"use client";

import { useState, type ChangeEvent } from "react";
import { FormActions } from "./FormActions";
import { FormField } from "./FormField";
import { FormSection } from "./FormSection";
import { SelectInput } from "./SelectInput";
import { TextInput } from "./TextInput";
import { donateCheckoutRequestSchema } from "@/lib/donate/checkout-schema";

export type DonateFormProps = {
  /** When set, shown after returning from Stripe with ?thanks=1 */
  showThanks?: boolean;
};

export function DonateForm({ showThanks }: DonateFormProps) {
  const [donationType, setDonationType] = useState<"one_time" | "monthly">("one_time");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setNotice(null);
    setIsSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);
      const dt = String(fd.get("donationType") ?? "one_time");
      const amountRaw = String(fd.get("amount") ?? "").trim();
      const base = {
        donorName: String(fd.get("donorName") ?? ""),
        donorEmail: String(fd.get("donorEmail") ?? ""),
      };
      const payload =
        dt === "monthly"
          ? { ...base, donationType: "monthly" as const }
          : {
              ...base,
              donationType: "one_time" as const,
              amount: amountRaw === "" ? NaN : Number(amountRaw),
            };

      const parsed = donateCheckoutRequestSchema.safeParse(payload);
      if (!parsed.success) {
        const flat = parsed.error.flatten();
        const fe: Partial<Record<string, string>> = {};
        for (const key of Object.keys(flat.fieldErrors) as (keyof typeof flat.fieldErrors)[]) {
          const msg = flat.fieldErrors[key]?.[0];
          if (msg) fe[String(key)] = msg;
        }
        setFieldErrors(fe);
        setFormError(flat.formErrors[0] ?? "Please check the highlighted fields.");
        return;
      }

      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        url?: string;
        error?: string;
        notice?: string;
      };

      if (!res.ok || !json.ok || !json.url) {
        setFormError(json.error ?? "Could not start checkout.");
        return;
      }

      if (json.notice) setNotice(json.notice);
      window.location.assign(json.url);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit} noValidate>
      {showThanks ? (
        <p
          className="rounded-lg border border-emerald-500/30 bg-emerald-950/25 px-4 py-3 text-sm text-emerald-200"
          role="status"
        >
          Thank you — your payment is processing. If you don’t see a confirmation email shortly, check spam or contact
          support.
        </p>
      ) : null}

      {formError ? (
        <p className="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300" role="alert">
          {formError}
        </p>
      ) : null}
      {notice ? (
        <p className="rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] px-4 py-3 text-xs leading-relaxed text-[var(--avasc-text-secondary)]">
          {notice}
        </p>
      ) : null}

      <FormSection
        title="Support AVASC"
        description="Your contribution helps AVASC assist scam victims, improve public education, and build better fraud intelligence tools."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Full Name" htmlFor="donorName" error={fieldErrors.donorName}>
            <TextInput id="donorName" name="donorName" autoComplete="name" placeholder="Your name" />
          </FormField>

          <FormField label="Email" htmlFor="donorEmail" required error={fieldErrors.donorEmail}>
            <TextInput
              id="donorEmail"
              name="donorEmail"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Donation Type" htmlFor="donationType" required error={fieldErrors.donationType}>
            <SelectInput
              id="donationType"
              name="donationType"
              required
              value={donationType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setDonationType(e.target.value === "monthly" ? "monthly" : "one_time")
              }
            >
              <option value="one_time">One-Time</option>
              <option value="monthly">Monthly</option>
            </SelectInput>
          </FormField>

          <FormField
            label="Amount (USD)"
            htmlFor="amount"
            required={donationType === "one_time"}
            hint="For one-time gifts, enter your donation in USD. Monthly amount is chosen on Stripe’s page."
            error={fieldErrors.amount}
          >
            <TextInput
              id="amount"
              name="amount"
              type="number"
              min={1}
              step="0.01"
              inputMode="decimal"
              placeholder="100"
              disabled={donationType === "monthly"}
              className={donationType === "monthly" ? "opacity-60" : undefined}
            />
          </FormField>
        </div>
      </FormSection>

      <FormActions
        primaryLabel="Continue to Payment"
        secondaryLabel="Back"
        secondaryHref="/"
        isSubmitting={isSubmitting}
      >
        <p className="text-xs leading-relaxed text-[var(--avasc-text-muted)]">
          Payment will continue securely through Stripe or PayPal.
        </p>
      </FormActions>
    </form>
  );
}

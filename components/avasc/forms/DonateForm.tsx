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
  const [amount, setAmount] = useState("100");
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
      const dt = String(fd.get("donationType") ?? "one_time") === "monthly" ? "monthly" : "one_time";
      const base = {
        donorName: String(fd.get("donorName") ?? ""),
        donorEmail: String(fd.get("donorEmail") ?? ""),
      };

      // Amount is required for both one-time and monthly. Catch an empty/invalid
      // amount with a clear message (otherwise Number("") -> NaN surfaces Zod's
      // raw "expected number, received NaN").
      const amountNum = Number(amount.trim());
      if (amount.trim() === "" || !Number.isFinite(amountNum) || amountNum < 1) {
        setFieldErrors({ amount: "Enter a donation amount of at least $1." });
        setFormError("Please enter a donation amount before continuing.");
        return;
      }

      const payload = { ...base, donationType: dt as "one_time" | "monthly", amount: amountNum };

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
            label={donationType === "monthly" ? "Amount (USD / month)" : "Amount (USD)"}
            htmlFor="amount"
            required
            hint={
              donationType === "monthly"
                ? "Choose a monthly amount or enter your own. You can cancel anytime."
                : "Choose an amount or enter your own."
            }
            error={fieldErrors.amount}
          >
            <div className="flex flex-wrap gap-2">
              {[10, 25, 50, 100].map((preset) => {
                const selected = amount.trim() === String(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className={
                      selected
                        ? "rounded-lg border border-[var(--avasc-gold)] bg-[var(--avasc-gold)]/15 px-3.5 py-2 text-sm font-semibold text-[var(--avasc-gold-light)]"
                        : "rounded-lg border border-[var(--avasc-border)] px-3.5 py-2 text-sm font-medium text-[var(--avasc-text-secondary)] transition hover:border-[var(--avasc-gold)]/50 hover:text-white"
                    }
                  >
                    ${preset}
                    {donationType === "monthly" ? "/mo" : ""}
                  </button>
                );
              })}
            </div>
            <TextInput
              id="amount"
              name="amount"
              type="number"
              min={1}
              step="0.01"
              inputMode="decimal"
              placeholder="Custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2"
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

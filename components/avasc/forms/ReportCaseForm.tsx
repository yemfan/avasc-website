"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckboxField } from "./CheckboxField";
import { FormActions } from "./FormActions";
import { FormField } from "./FormField";
import { FormSection } from "./FormSection";
import { SelectInput } from "./SelectInput";
import { TextArea } from "./TextArea";
import { TextInput } from "./TextInput";
import { createCaseBodySchema, type CreateCaseBody } from "@/lib/report/case-submission";

function buildPayload(fd: FormData): CreateCaseBody {
  const title = String(fd.get("title") ?? "").trim();
  const scamType = String(fd.get("scamType") ?? "").trim();
  const summary = String(fd.get("summary") ?? "").trim();
  const fullNarrative = String(fd.get("fullNarrative") ?? "").trim();
  const narrativePrivate = [summary, fullNarrative].filter(Boolean).join("\n\n").trim();

  const amountLost = String(fd.get("amountLost") ?? "").trim();
  let amountCents: number | undefined;
  if (amountLost !== "") {
    const n = Math.round(parseFloat(amountLost) * 100);
    if (!Number.isNaN(n) && n >= 0) amountCents = n;
  }

  const currency = String(fd.get("currency") ?? "").trim() || undefined;
  const paymentMethod = String(fd.get("paymentMethod") ?? "").trim() || undefined;
  const initialContactChannel = String(fd.get("initialContactChannel") ?? "").trim() || undefined;

  const summaryShort = summary ? summary.slice(0, 500) : undefined;

  return {
    title,
    scamType,
    summaryShort,
    narrativePrivate,
    amountCents,
    currency,
    paymentMethod,
    initialContactChannel,
    visibility: "private",
    allowFollowUp: fd.get("allowFollowUp") === "on",
    allowLawEnforcementReferral: fd.get("allowLawEnforcementReferral") === "on",
    allowCaseMatching: fd.get("allowCaseMatching") === "on",
    allowAnonymizedPublicSearch: fd.get("allowPublicAnonymizedUse") === "on",
    indicators: [],
  };
}

export type ReportCaseFormProps = {
  matchedProfileSlug?: string;
};

export function ReportCaseForm({ matchedProfileSlug }: ReportCaseFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);
      const raw = buildPayload(fd);
      const parsed = createCaseBodySchema.safeParse(raw);

      if (!parsed.success) {
        const flat = parsed.error.flatten();
        const fe: Partial<Record<string, string>> = {};
        const fieldErrs = flat.fieldErrors;
        for (const key of Object.keys(fieldErrs) as (keyof typeof fieldErrs)[]) {
          const msg = fieldErrs[key]?.[0];
          if (msg) fe[String(key)] = msg;
        }
        if (fe.narrativePrivate) {
          fe.summary = fe.summary ?? fe.narrativePrivate;
        }
        setFieldErrors(fe);
        setFormError(flat.formErrors[0] ?? "Please review the highlighted fields.");
        return;
      }

      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as {
        success?: boolean;
        caseId?: string;
        error?: string;
      };

      if (!res.ok || !json.success || !json.caseId) {
        const msg =
          typeof json.error === "string"
            ? json.error
            : "We couldn’t submit your report. Please try again.";
        setFormError(msg);
        return;
      }

      setDoneId(json.caseId);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (doneId) {
    return (
      <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <p className="text-lg font-semibold text-white">Report received</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--avasc-text-secondary)]">
          Reference <span className="font-mono font-medium text-[var(--avasc-gold-light)]">{doneId}</span>. You can
          track status from your dashboard when signed in.
        </p>
        <ul className="mt-4 list-inside list-disc text-sm text-[var(--avasc-text-muted)]">
          <li>Preserve any evidence you still have (screenshots, emails, transaction exports).</li>
          <li>Watch for recovery scams — upfront fees to “release” funds are a red flag.</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/dashboard/cases/${doneId}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-6 py-3 text-sm font-semibold text-[#050A14] shadow-[0_0_20px_rgba(197,139,43,0.18)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-card)]"
          >
            Open in dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--avasc-border)] px-6 py-3 text-sm font-medium text-[var(--avasc-text-primary)] transition hover:border-[var(--avasc-gold)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--avasc-gold)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-card)]"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit} noValidate>
      {matchedProfileSlug ? (
        <div className="rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] p-4 text-sm text-[var(--avasc-text-secondary)] sm:p-5">
          <p className="font-semibold text-[var(--avasc-text-primary)]">Reporting from a published pattern</p>
          <p className="mt-2 leading-relaxed">
            Staff can use this context when reviewing your case.{" "}
            <Link
              href={`/database/${encodeURIComponent(matchedProfileSlug)}`}
              className="font-medium text-[var(--avasc-gold-light)] underline-offset-2 hover:text-[var(--avasc-gold)] hover:underline"
            >
              View pattern
            </Link>
          </p>
        </div>
      ) : null}

      {formError ? (
        <p className="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300" role="alert">
          {formError}
        </p>
      ) : null}

      <FormSection
        title="Incident Overview"
        description="Tell us what happened so AVASC can review the scam pattern and help route your case appropriately."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Case Title" htmlFor="title" required error={fieldErrors.title}>
            <TextInput
              id="title"
              name="title"
              required
              autoComplete="off"
              placeholder="Short summary of the incident"
            />
          </FormField>

          <FormField label="Scam Type" htmlFor="scamType" required error={fieldErrors.scamType}>
            <SelectInput id="scamType" name="scamType" required defaultValue="">
              <option value="" disabled>
                Select a scam type
              </option>
              <option value="Fake Crypto Investment">Fake Crypto Investment</option>
              <option value="Romance Scam">Romance Scam</option>
              <option value="Fake Recovery Scam">Fake Recovery Scam</option>
              <option value="Phishing">Phishing</option>
              <option value="Other">Other</option>
            </SelectInput>
          </FormField>
        </div>

        <FormField
          label="Summary"
          htmlFor="summary"
          required
          hint="A short explanation that helps reviewers quickly understand the pattern."
          error={fieldErrors.summary}
        >
          <TextArea
            id="summary"
            name="summary"
            required
            rows={4}
            placeholder="Describe what happened in a few clear sentences."
          />
        </FormField>

        <FormField
          label="Full Narrative"
          htmlFor="fullNarrative"
          hint="Include timeline, promises made, payment requests, and what happened when you tried to stop or withdraw."
          error={fieldErrors.fullNarrative}
        >
          <TextArea
            id="fullNarrative"
            name="fullNarrative"
            rows={8}
            placeholder="Provide as much detail as you can."
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Incident Details"
        description="These details help AVASC link patterns and assess the likely scam family."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Amount Lost" htmlFor="amountLost" error={fieldErrors.amountCents}>
            <TextInput id="amountLost" name="amountLost" inputMode="decimal" placeholder="85000.00" />
          </FormField>

          <FormField label="Currency" htmlFor="currency" error={fieldErrors.currency}>
            <TextInput id="currency" name="currency" placeholder="USD" />
          </FormField>

          <FormField label="Payment Method" htmlFor="paymentMethod" error={fieldErrors.paymentMethod}>
            <TextInput
              id="paymentMethod"
              name="paymentMethod"
              placeholder="USDT, wire transfer, bank transfer"
            />
          </FormField>

          <FormField
            label="Initial Contact Channel"
            htmlFor="initialContactChannel"
            error={fieldErrors.initialContactChannel}
          >
            <TextInput
              id="initialContactChannel"
              name="initialContactChannel"
              placeholder="WhatsApp, Telegram, email, social media"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Permissions and Preferences" description="Choose how AVASC may use your report.">
        <div className="space-y-4">
          <CheckboxField
            name="allowFollowUp"
            label="Allow follow-up from AVASC"
            description="We may contact you for clarification or additional evidence."
          />
          <CheckboxField
            name="allowLawEnforcementReferral"
            label="Allow referral to law enforcement or trusted partners"
            description="Only when appropriate and consistent with your preferences."
          />
          <CheckboxField
            name="allowCaseMatching"
            label="Allow case matching"
            description="This helps AVASC compare your case against known scam patterns."
            defaultChecked
          />
          <CheckboxField
            name="allowPublicAnonymizedUse"
            label="Allow anonymized public use"
            description="AVASC may use your case in anonymized form to help protect others."
          />
        </div>
      </FormSection>

      <FormSection title="Submit">
        <FormActions
          primaryLabel="Submit Case Report"
          secondaryLabel="Cancel"
          secondaryHref="/dashboard"
          isSubmitting={isSubmitting}
        >
          <p className="text-xs leading-relaxed text-[var(--avasc-text-muted)]">
            By submitting, you confirm the information is true to the best of your knowledge.
          </p>
        </FormActions>
      </FormSection>
    </form>
  );
}

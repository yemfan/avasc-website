"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createCaseBodySchema, type CreateCaseBody } from "@/lib/report/case-submission";

type Step = 1 | 2 | 3 | 4;

const fieldClass =
  "w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-[var(--avasc-text-primary)] placeholder:text-[var(--avasc-text-muted)] outline-none transition focus:border-[var(--avasc-gold)] focus:ring-2 focus:ring-[rgba(197,139,43,0.2)]";

const labelClass = "mb-2 block text-sm font-medium text-white";

const btnPrimaryClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14] shadow-[0_0_20px_rgba(197,139,43,0.18)] transition hover:brightness-110 disabled:opacity-50";

const btnSecondaryClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--avasc-border)] px-5 py-3 text-sm font-medium text-[var(--avasc-text-primary)] transition hover:border-[var(--avasc-gold)] hover:text-white";

type ReportFormState = {
  title: string;
  scamType: string;
  description: string;
  amountLost: string;
  contactMethod: string;
  evidence: string;
  email: string;
  allowFollowUp: boolean;
};

const initialForm = (): ReportFormState => ({
  title: "",
  scamType: "",
  description: "",
  amountLost: "",
  contactMethod: "",
  evidence: "",
  email: "",
  allowFollowUp: true,
});

function buildPayload(form: ReportFormState, matchedProfileSlug?: string): CreateCaseBody {
  const title = form.title.trim().slice(0, 200);
  const desc = form.description.trim();
  const summaryShort = desc.slice(0, 500);

  let amountCents: number | undefined;
  if (form.amountLost.trim() !== "") {
    const n = Math.round(parseFloat(form.amountLost) * 100);
    if (!Number.isNaN(n) && n >= 0) amountCents = n;
  }

  const narrativeParts = [
    desc,
    form.contactMethod.trim() && `How they contacted you: ${form.contactMethod.trim()}`,
    form.evidence.trim() && `Indicators / evidence (domains, wallets, phones, etc.):\n${form.evidence.trim()}`,
    form.email.trim() && `Reporter email: ${form.email.trim()}`,
    matchedProfileSlug && `Related published pattern: ${matchedProfileSlug}`,
  ].filter(Boolean) as string[];

  const narrativePrivate = narrativeParts.join("\n\n");

  return {
    title,
    scamType: form.scamType.trim(),
    summaryShort: summaryShort || undefined,
    narrativePrivate,
    amountCents,
    currency: "USD",
    initialContactChannel: form.contactMethod.trim() || undefined,
    visibility: "private",
    allowFollowUp: form.allowFollowUp,
    allowLawEnforcementReferral: false,
    allowCaseMatching: true,
    allowAnonymizedPublicSearch: false,
    indicators: [],
  };
}

export type ReportMatchingCaseFlowProps = {
  matchedProfileSlug?: string;
};

export function ReportMatchingCaseFlow({ matchedProfileSlug }: ReportMatchingCaseFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<ReportFormState>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);

  const matchedLabel = useMemo(
    () => matchedProfileSlug?.trim() || "",
    [matchedProfileSlug]
  );

  function updateField<K extends keyof ReportFormState>(key: K, value: ReportFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    setFormError(null);
    setFieldErrors({});
    if (step === 1) {
      const fe: Partial<Record<string, string>> = {};
      if (form.title.trim().length < 3) fe.title = "Add a short headline (at least 3 characters).";
      if (!form.scamType.trim()) fe.scamType = "Select a scam type.";
      if (form.description.trim().length < 20) fe.description = "Please add a bit more detail (at least 20 characters).";
      if (Object.keys(fe).length > 0) {
        setFieldErrors(fe);
        return;
      }
    }
    if (step === 2) {
      const fe: Partial<Record<string, string>> = {};
      if (form.contactMethod.trim().length < 2) fe.contactMethod = "How were you contacted? (e.g. WhatsApp, email).";
      if (form.evidence.trim().length < 10) fe.evidence = "Add indicators or notes (at least 10 characters).";
      if (Object.keys(fe).length > 0) {
        setFieldErrors(fe);
        return;
      }
    }
    setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  }

  function back() {
    setFormError(null);
    setFieldErrors({});
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  async function submit() {
    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    const raw = buildPayload(form, matchedLabel || undefined);
    const parsed = createCaseBodySchema.safeParse(raw);

    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const fe: Partial<Record<string, string>> = {};
      const fieldErrs = flat.fieldErrors;
      for (const key of Object.keys(fieldErrs) as (keyof typeof fieldErrs)[]) {
        const msg = fieldErrs[key]?.[0];
        if (msg) fe[String(key)] = msg;
      }
      setFieldErrors(fe);
      setFormError(flat.formErrors[0] ?? "Please review the highlighted fields.");
      setIsSubmitting(false);
      return;
    }

    try {
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
      setStep(4);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (doneId && step === 4) {
    return (
      <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.2)] sm:p-10">
        <h2 className="text-2xl font-bold text-[var(--avasc-gold-light)]">Report submitted</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--avasc-text-secondary)]">
          Your report helps others avoid scams. Thank you.
        </p>
        <p className="mt-4 text-sm text-[var(--avasc-text-secondary)]">
          Reference{" "}
          <span className="font-mono font-medium text-[var(--avasc-gold-light)]">{doneId}</span>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/dashboard/cases/${doneId}`} className={btnPrimaryClass}>
            Open in dashboard
          </Link>
          <Link href="/" className={btnSecondaryClass}>
            Home
          </Link>
        </div>
        <p className="mt-6 text-xs text-[var(--avasc-text-muted)]">
          Signed-in reporters can track status from the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Report a matching scam case</h1>
      <p className="mt-2 text-[var(--avasc-text-secondary)]">
        Help AVASC identify scam patterns and warn others.
      </p>

      {matchedLabel ? (
        <div className="mt-6 rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] p-4 text-sm text-[var(--avasc-text-secondary)] sm:p-5">
          <p className="font-semibold text-[var(--avasc-text-primary)]">Reporting from a published pattern</p>
          <p className="mt-2 leading-relaxed">
            Staff can use this context when reviewing your case.{" "}
            <Link
              href={`/database/${encodeURIComponent(matchedLabel)}`}
              className="font-medium text-[var(--avasc-gold-light)] underline-offset-2 hover:text-[var(--avasc-gold)] hover:underline"
            >
              View pattern
            </Link>
          </p>
        </div>
      ) : null}

      {formError ? (
        <p className="mt-6 rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300" role="alert">
          {formError}
        </p>
      ) : null}

      <Progress step={step} />

      {step === 1 ? (
        <Step1 form={form} fieldErrors={fieldErrors} updateField={updateField} onNext={next} />
      ) : null}
      {step === 2 ? (
        <Step2 form={form} fieldErrors={fieldErrors} updateField={updateField} onNext={next} onBack={back} />
      ) : null}
      {step === 3 ? (
        <Step3
          form={form}
          fieldErrors={fieldErrors}
          updateField={updateField}
          onSubmit={submit}
          onBack={back}
          isSubmitting={isSubmitting}
        />
      ) : null}
    </div>
  );
}

function Progress({ step }: { step: Step }) {
  return (
    <div className="mt-8 flex gap-2" aria-hidden>
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-2 flex-1 rounded-full transition-colors ${
            step >= s ? "bg-[var(--avasc-gold)]" : "bg-[var(--avasc-border)]"
          }`}
        />
      ))}
    </div>
  );
}

function Step1({
  form,
  fieldErrors,
  updateField,
  onNext,
}: {
  form: ReportFormState;
  fieldErrors: Partial<Record<string, string>>;
  updateField: <K extends keyof ReportFormState>(key: K, value: ReportFormState[K]) => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold text-white">Step 1: What happened?</h2>

      <div>
        <label className={labelClass} htmlFor="report-title">
          Short headline
        </label>
        <input
          id="report-title"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g. Fake exchange blocked my withdrawal"
          className={fieldClass}
        />
        {fieldErrors.title ? <p className="mt-1 text-sm text-red-400">{fieldErrors.title}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="report-scam-type">
          Scam type
        </label>
        <select
          id="report-scam-type"
          value={form.scamType}
          onChange={(e) => updateField("scamType", e.target.value)}
          className={fieldClass}
        >
          <option value="">Select a scam type</option>
          <option value="Fake Crypto Investment">Fake Crypto Investment</option>
          <option value="Romance Scam">Romance Scam</option>
          <option value="Fake Recovery Scam">Fake Recovery Scam</option>
          <option value="Phishing">Phishing</option>
          <option value="Impersonation Scam">Impersonation Scam</option>
          <option value="Other">Other</option>
        </select>
        {fieldErrors.scamType ? <p className="mt-1 text-sm text-red-400">{fieldErrors.scamType}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="report-description">
          Describe what happened
        </label>
        <textarea
          id="report-description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Timeline, what they promised, and what went wrong."
          rows={6}
          className={fieldClass}
        />
        {fieldErrors.description ? <p className="mt-1 text-sm text-red-400">{fieldErrors.description}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="report-amount">
          Estimated amount lost (USD)
        </label>
        <input
          id="report-amount"
          value={form.amountLost}
          onChange={(e) => updateField("amountLost", e.target.value)}
          placeholder="0.00"
          inputMode="decimal"
          className={fieldClass}
        />
      </div>

      <button type="button" onClick={onNext} className={btnPrimaryClass}>
        Continue
      </button>
    </div>
  );
}

function Step2({
  form,
  fieldErrors,
  updateField,
  onNext,
  onBack,
}: {
  form: ReportFormState;
  fieldErrors: Partial<Record<string, string>>;
  updateField: <K extends keyof ReportFormState>(key: K, value: ReportFormState[K]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold text-white">Step 2: Scam details</h2>

      <div>
        <label className={labelClass} htmlFor="report-contact">
          How did they contact you?
        </label>
        <input
          id="report-contact"
          value={form.contactMethod}
          onChange={(e) => updateField("contactMethod", e.target.value)}
          placeholder="WhatsApp, Email, Telegram, etc."
          className={fieldClass}
        />
        {fieldErrors.contactMethod ? <p className="mt-1 text-sm text-red-400">{fieldErrors.contactMethod}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="report-evidence">
          Indicators & evidence
        </label>
        <textarea
          id="report-evidence"
          value={form.evidence}
          onChange={(e) => updateField("evidence", e.target.value)}
          placeholder="Domains, wallet addresses, phone numbers, app names…"
          rows={6}
          className={fieldClass}
        />
        {fieldErrors.evidence ? <p className="mt-1 text-sm text-red-400">{fieldErrors.evidence}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onBack} className={btnSecondaryClass}>
          Back
        </button>
        <button type="button" onClick={onNext} className={btnPrimaryClass}>
          Continue
        </button>
      </div>
    </div>
  );
}

function Step3({
  form,
  fieldErrors,
  updateField,
  onSubmit,
  onBack,
  isSubmitting,
}: {
  form: ReportFormState;
  fieldErrors: Partial<Record<string, string>>;
  updateField: <K extends keyof ReportFormState>(key: K, value: ReportFormState[K]) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold text-white">Step 3: Contact & submit</h2>

      <div>
        <label className={labelClass} htmlFor="report-email">
          Email (optional)
        </label>
        <input
          id="report-email"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className={fieldClass}
        />
        {fieldErrors.email ? <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p> : null}
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] p-4">
        <input
          type="checkbox"
          checked={form.allowFollowUp}
          onChange={(e) => updateField("allowFollowUp", e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm text-[var(--avasc-text-secondary)]">
          Allow AVASC to follow up if we need clarification (recommended).
        </span>
      </label>

      <p className="text-xs leading-relaxed text-[var(--avasc-text-muted)]">
        By submitting, you confirm the information is true to the best of your knowledge. AVASC is not a law firm or
        government agency.
      </p>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onBack} className={btnSecondaryClass} disabled={isSubmitting}>
          Back
        </button>
        <button type="button" onClick={onSubmit} className={btnPrimaryClass} disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit report"}
        </button>
      </div>
    </div>
  );
}

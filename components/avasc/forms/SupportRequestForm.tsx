"use client";

import { useState } from "react";
import { submitSupportRequestAction } from "@/app/dashboard/_actions/support";
import { FormActions } from "./FormActions";
import { FormField } from "./FormField";
import { FormSection } from "./FormSection";
import { SelectInput } from "./SelectInput";
import { TextArea } from "./TextArea";
import { createSupportRequestSchema } from "@/lib/victim-dashboard/schemas";

export type SupportRequestFormProps = {
  cases: { id: string; title: string }[];
};

export function SupportRequestForm({ cases }: SupportRequestFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);
      const caseIdRaw = String(fd.get("caseId") ?? "");
      const payload = {
        caseId: caseIdRaw === "" ? "" : caseIdRaw,
        supportType: String(fd.get("supportType") ?? ""),
        note: String(fd.get("note") ?? ""),
      };

      const parsed = createSupportRequestSchema.safeParse(payload);
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

      const res = await submitSupportRequestAction(parsed.data);
      if (res.ok) {
        setSuccess("Thanks — we received your request.");
        (e.target as HTMLFormElement).reset();
      } else {
        setFormError(res.error ?? "Something went wrong.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit} noValidate>
      {formError ? (
        <p className="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300" role="alert">
          {formError}
        </p>
      ) : null}
      {success ? (
        <p
          className="rounded-lg border border-emerald-500/30 bg-emerald-950/25 px-4 py-3 text-sm text-emerald-200"
          role="status"
        >
          {success}
        </p>
      ) : null}

      <FormSection
        title="Request Support"
        description="Tell us what kind of help you need so AVASC can route your request correctly."
      >
        <FormField
          label="Related case"
          htmlFor="caseId"
          hint="Optional — link this request to a report you already submitted."
          error={fieldErrors.caseId}
        >
          <SelectInput id="caseId" name="caseId" defaultValue="">
            <option value="">General — not tied to one case</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Support Type" htmlFor="supportType" required error={fieldErrors.supportType}>
          <SelectInput id="supportType" name="supportType" required defaultValue="">
            <option value="" disabled>
              Select support type
            </option>
            <option value="EMOTIONAL_SUPPORT">Emotional Support</option>
            <option value="REPORTING_HELP">Reporting Help</option>
            <option value="RECOVERY_GUIDANCE">Recovery Guidance</option>
            <option value="LEGAL_REFERRAL">Legal Referral</option>
            <option value="MEDIA_ADVOCACY">Media Advocacy</option>
            <option value="GENERAL_HELP">General Help</option>
          </SelectInput>
        </FormField>

        <FormField
          label="How can we help?"
          htmlFor="note"
          required
          hint="Briefly describe what you need, what you’ve already done, and what outcome you are hoping for."
          error={fieldErrors.note}
        >
          <TextArea
            id="note"
            name="note"
            required
            rows={6}
            placeholder="Describe the support you are looking for."
          />
        </FormField>
      </FormSection>

      <FormActions
        primaryLabel="Submit Support Request"
        secondaryLabel="Back"
        secondaryHref="/dashboard/support"
        isSubmitting={isSubmitting}
      />
    </form>
  );
}

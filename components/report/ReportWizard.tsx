"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  createCaseBodySchema,
  INDICATOR_TYPES,
  SUPPORT_TYPES,
  type CreateCaseBody,
} from "@/lib/report/case-submission";

const DRAFT_KEY = "avasc-report-draft-v2";
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const STEP_LABELS = [
  "Incident",
  "Identifiers",
  "Evidence",
  "Privacy & consent",
  "Support",
  "Review",
] as const;

const INDICATOR_LABEL: Record<(typeof INDICATOR_TYPES)[number], string> = {
  phone: "Phone",
  email: "Email",
  domain: "Website / domain",
  wallet: "Wallet address",
  tx_hash: "Transaction hash",
  social_handle: "Social handle",
  alias: "Scammer alias",
  app_platform: "App / platform",
  other: "Other",
};

const SUPPORT_LABEL: Record<(typeof SUPPORT_TYPES)[number], string> = {
  EMOTIONAL_SUPPORT: "Emotional support",
  REPORTING_HELP: "Help reporting to authorities",
  RECOVERY_GUIDANCE: "Recovery guidance",
  LEGAL_REFERRAL: "Legal referral information",
  MEDIA_ADVOCACY: "Media / advocacy interest",
  GENERAL_HELP: "General help",
};

type ReportFormValues = Omit<CreateCaseBody, "occurredAtStart" | "occurredAtEnd" | "amountCents"> & {
  occurredAtStart: string;
  occurredAtEnd: string;
  amountInput: string;
};

function defaultFormValues(): ReportFormValues {
  return {
    title: "",
    summaryShort: "",
    scamType: "",
    amountInput: "",
    currency: "USD",
    paymentMethod: "",
    occurredAtStart: "",
    occurredAtEnd: "",
    narrativePrivate: "",
    narrativePublic: "",
    initialContactChannel: "",
    jurisdictionCountry: "",
    jurisdictionState: "",
    visibility: "private",
    allowFollowUp: true,
    allowLawEnforcementReferral: false,
    allowCaseMatching: true,
    allowAnonymizedPublicSearch: false,
    storyVisibilityCandidate: false,
    supportRequested: false,
    supportTypes: [],
    isAnonymousSubmit: false,
    indicators: [{ type: "email", value: "" }],
  };
}

function validateStep(step: number, v: ReportFormValues): string | null {
  if (step === 0) {
    if (v.title.trim().length < 3) return "Add a title (at least 3 characters).";
    if (v.scamType.trim().length < 2) return "Add a scam type.";
    if (v.narrativePrivate.trim().length < 20) return "Private narrative should be at least 20 characters.";
    return null;
  }
  if (step === 2) {
    return null;
  }
  return null;
}

function debounce(fn: () => void, ms: number) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return () => {
    if (t) clearTimeout(t);
    t = setTimeout(fn, ms);
  };
}

type ReportWizardProps = {
  /** Set when the user arrives from `/report?matchedProfile=…` (public database CTA). */
  matchedProfileSlug?: string | null;
};

export function ReportWizard({ matchedProfileSlug }: ReportWizardProps) {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState<string | null>(null);

  const form = useForm<ReportFormValues>({
    defaultValues: defaultFormValues(),
    mode: "onChange",
  });

  const { control, register, handleSubmit, watch, reset, setValue, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "indicators",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ReportFormValues & { _step?: number };
      const { _step, ...rest } = parsed;
      reset({ ...defaultFormValues(), ...rest });
      if (typeof _step === "number" && _step >= 0 && _step < STEP_LABELS.length) {
        setStep(_step);
      }
    } catch {
      /* ignore */
    }
  }, [reset]);

  useEffect(() => {
    const save = debounce(() => {
      try {
        const values = getValues();
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...values, _step: step }));
      } catch {
        /* quota / private mode */
      }
    }, 500);
    const sub = watch(() => {
      save();
    });
    return () => sub.unsubscribe();
  }, [watch, getValues, step]);

  function toggleSupportType(t: (typeof SUPPORT_TYPES)[number]) {
    const cur = getValues("supportTypes") ?? [];
    const next = cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t];
    setValue("supportTypes", next, { shouldDirty: true });
    setValue("supportRequested", next.length > 0, { shouldDirty: true });
  }

  function nextStep() {
    const vals = getValues();
    const msg = validateStep(step, vals);
    if (msg) {
      setError(msg);
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  function prevStep() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onValidSubmit(vals: ReportFormValues) {
    setLoading(true);
    setError("");
    try {
      let amountCents: number | undefined;
      if (vals.amountInput.trim() !== "") {
        const n = Math.round(parseFloat(vals.amountInput) * 100);
        if (Number.isNaN(n) || n < 0) throw new Error("Invalid amount");
        amountCents = n;
      }

      const cleanedIndicators = vals.indicators
        .map((i) => ({ type: i.type, value: i.value.trim() }))
        .filter((i) => i.value.length >= 2);

      const supportTypes = vals.supportTypes ?? [];
      const payload = {
        title: vals.title.trim(),
        summaryShort: vals.summaryShort?.trim() || undefined,
        scamType: vals.scamType.trim(),
        amountCents,
        currency: vals.currency,
        paymentMethod: vals.paymentMethod?.trim() || undefined,
        occurredAtStart: vals.occurredAtStart
          ? new Date(vals.occurredAtStart).toISOString()
          : undefined,
        occurredAtEnd: vals.occurredAtEnd ? new Date(vals.occurredAtEnd).toISOString() : undefined,
        narrativePrivate: vals.narrativePrivate.trim(),
        narrativePublic: vals.narrativePublic?.trim() || undefined,
        initialContactChannel: vals.initialContactChannel?.trim() || undefined,
        jurisdictionCountry: vals.jurisdictionCountry?.trim() || undefined,
        jurisdictionState: vals.jurisdictionState?.trim() || undefined,
        visibility: vals.visibility,
        allowFollowUp: vals.allowFollowUp,
        allowLawEnforcementReferral: vals.allowLawEnforcementReferral,
        allowCaseMatching: vals.allowCaseMatching,
        allowAnonymizedPublicSearch: vals.allowAnonymizedPublicSearch,
        storyVisibilityCandidate: vals.storyVisibilityCandidate,
        supportRequested: supportTypes.length > 0 || vals.supportRequested,
        supportTypes: supportTypes.length ? supportTypes : undefined,
        isAnonymousSubmit: vals.isAnonymousSubmit,
        indicators: cleanedIndicators,
      };

      const parsed = createCaseBodySchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Please review the form.");
      }

      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as { success?: boolean; caseId?: string; error?: string };
      if (!res.ok || !json.success || !json.caseId) {
        throw new Error(json.error ?? "Failed to submit report");
      }

      const caseId = json.caseId;

      for (const file of files) {
        if (file.size > MAX_FILE_BYTES) throw new Error(`File too large: ${file.name}`);
        const ct = file.type || "application/octet-stream";
        if (!ALLOWED_MIME.has(ct)) {
          throw new Error(`Unsupported file type: ${file.name} (use JPEG, PNG, WebP, GIF, or PDF)`);
        }

        const presign = await fetch("/api/evidence/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            caseId,
            fileName: file.name,
            contentType: ct,
            contentLength: file.size,
          }),
        });
        const pjson = (await presign.json()) as {
          success?: boolean;
          uploadUrl?: string;
          storageKey?: string;
          error?: string;
        };
        if (!presign.ok || !pjson.uploadUrl || !pjson.storageKey) {
          if (pjson.error?.includes("not configured")) break;
          throw new Error(pjson.error ?? "Upload presign failed");
        }
        const put = await fetch(pjson.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": ct },
          body: file,
        });
        if (!put.ok) throw new Error("Upload to storage failed");

        const complete = await fetch("/api/evidence/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            caseId,
            storageKey: pjson.storageKey,
            mimeType: ct,
            sizeBytes: file.size,
          }),
        });
        const cjson = (await complete.json()) as { success?: boolean; error?: string };
        if (!complete.ok || !cjson.success) {
          throw new Error(cjson.error ?? "Failed to record evidence");
        }
      }

      localStorage.removeItem(DRAFT_KEY);
      setDoneId(caseId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (doneId) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-950 shadow-sm">
        <p className="text-lg font-semibold">Report received</p>
        <p className="mt-3 text-sm leading-relaxed">
          Reference <span className="font-mono font-medium">{doneId}</span>. You can track status from your
          dashboard when signed in. If you requested support, our team will follow up according to your
          consent choices.
        </p>
        <ul className="mt-4 list-inside list-disc text-sm text-emerald-900/90">
          <li>Preserve any evidence you still have (screenshots, emails, transaction exports).</li>
          <li>Watch for recovery scams — anyone demanding upfront payment to “release” funds is suspect.</li>
          <li>Consider reporting to local authorities and your financial institution.</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {matchedProfileSlug ? (
        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-foreground">
          <p className="font-medium">Reporting from a published pattern</p>
          <p className="mt-1 text-muted-foreground">
            Staff can use this context when reviewing your case.{" "}
            <Link
              href={`/database/${encodeURIComponent(matchedProfileSlug)}`}
              className="font-medium text-foreground underline underline-offset-2"
            >
              View the scam profile
            </Link>{" "}
            you started from.
          </p>
        </div>
      ) : null}

    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (step === STEP_LABELS.length - 1) {
          void handleSubmit(onValidSubmit)(e);
        }
      }}
    >
      <ol className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        {STEP_LABELS.map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-3 py-1 ${
              i === step ? "bg-slate-900 text-white" : i < step ? "bg-slate-200 text-slate-800" : "bg-slate-100"
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Tell us what happened. This narrative stays private unless you choose to share an anonymized
            summary later.
          </p>
          <div>
            <label className="text-sm font-medium text-slate-800">Title</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              {...register("title")}
              placeholder="Short headline for your case"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">Short summary (optional)</label>
            <textarea
              className="mt-1 min-h-[72px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              {...register("summaryShort")}
              placeholder="One or two sentences for staff triage"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">Scam type</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              {...register("scamType")}
              placeholder="e.g. investment, romance, phishing, fake recovery"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-800">Amount lost (optional)</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
                {...register("amountInput")}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-800">Currency</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
                {...register("currency")}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">Payment method (optional)</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              {...register("paymentMethod")}
              placeholder="Wire, crypto, gift cards, P2P…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-800">Incident started (optional)</label>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
                {...register("occurredAtStart")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-800">Incident ended (optional)</label>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
                {...register("occurredAtEnd")}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-800">Where contact started (optional)</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
                {...register("initialContactChannel")}
                placeholder="e.g. Instagram DM, WhatsApp, dating app"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-800">Country (optional)</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
                {...register("jurisdictionCountry")}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">State / region (optional)</label>
            <input
              className="mt-1 w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              {...register("jurisdictionState")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">What happened (private, detailed)</label>
            <textarea
              className="mt-1 min-h-[160px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              {...register("narrativePrivate")}
              placeholder="Include details you are comfortable storing securely. Default visibility is private."
            />
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Add identifiers you encountered. Values are normalized for pattern matching (e.g. domains and emails
            lowercased). Leave blank rows out — only filled rows are submitted.
          </p>
          {fields.map((field, idx) => (
            <div key={field.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-end">
              <div className="sm:w-48">
                <label className="text-xs font-medium text-slate-600">Type</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...register(`indicators.${idx}.type`)}
                >
                  {INDICATOR_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {INDICATOR_LABEL[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0 flex-1">
                <label className="text-xs font-medium text-slate-600">Value</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...register(`indicators.${idx}.value`)}
                />
              </div>
              {fields.length > 1 ? (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-sm font-medium text-red-700 hover:underline sm:shrink-0"
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ type: "email", value: "" })}
            className="text-sm font-semibold text-slate-900 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-900"
          >
            Add another identifier
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Upload screenshots or documents (optional). JPEG, PNG, WebP, GIF, or PDF — up to{" "}
            {MAX_FILE_BYTES / (1024 * 1024)} MB each. Requires storage to be configured for your deployment.
          </p>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
          />
          {files.length ? (
            <ul className="space-y-1 text-xs text-slate-600">
              {files.map((f) => (
                <li key={f.name + f.size}>
                  {f.name} — {(f.size / 1024).toFixed(1)} KB
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="text-sm font-medium text-slate-800">Public visibility</label>
            <select
              className="mt-1 w-full max-w-md rounded-xl border border-slate-200 px-3 py-2 text-sm"
              {...register("visibility")}
            >
              <option value="private">Private — not visible in public search</option>
              <option value="anonymized">Anonymized public summary (moderated)</option>
              <option value="public">Public (rare; staff review)</option>
            </select>
          </div>
          {(watch("visibility") === "anonymized" || watch("visibility") === "public") && (
            <div>
              <label className="text-sm font-medium text-slate-800">Public summary (no personal details)</label>
              <textarea
                className="mt-1 min-h-[100px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                {...register("narrativePublic")}
                placeholder="Short version without names, account numbers, or addresses"
              />
            </div>
          )}
          <div className="space-y-3 text-sm text-slate-800">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
              <input type="checkbox" className="mt-0.5" {...register("allowFollowUp")} />
              <span>Allow AVASC to follow up with me about this case.</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
              <input type="checkbox" className="mt-0.5" {...register("allowLawEnforcementReferral")} />
              <span>I consent to referral to law enforcement partners when legally appropriate.</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
              <input type="checkbox" className="mt-0.5" {...register("allowCaseMatching")} />
              <span>Allow technical matching with similar cases (no public identity).</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
              <input type="checkbox" className="mt-0.5" {...register("allowAnonymizedPublicSearch")} />
              <span>Allow anonymized indicators to appear in the public scam database.</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
              <input type="checkbox" className="mt-0.5" {...register("storyVisibilityCandidate")} />
              <span>I may be open to sharing a moderated survivor story later.</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
              <input type="checkbox" className="mt-0.5" {...register("isAnonymousSubmit")} />
              <span>Hide my account from other users where possible (we still retain data for safety).</span>
            </label>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Tell us what kinds of support would help. You can select several.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SUPPORT_TYPES.map((t) => (
              <label
                key={t}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={(watch("supportTypes") ?? []).includes(t)}
                  onChange={() => toggleSupportType(t)}
                />
                <span className="text-sm font-medium text-slate-800">{SUPPORT_LABEL[t]}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {step === 5 ? (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-800">
          <p className="font-semibold text-slate-900">Review</p>
          <p>
            <span className="text-slate-500">Title:</span> {watch("title")}
          </p>
          <p>
            <span className="text-slate-500">Type:</span> {watch("scamType")}
          </p>
          <p>
            <span className="text-slate-500">Visibility:</span> {watch("visibility")}
          </p>
          <p>
            <span className="text-slate-500">Identifiers:</span>{" "}
            {watch("indicators").filter((i) => i.value.trim().length >= 2).length}
          </p>
          <p>
            <span className="text-slate-500">Files:</span> {files.length}
          </p>
          <p>
            <span className="text-slate-500">Support:</span> {(watch("supportTypes") ?? []).join(", ") || "None selected"}
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={prevStep}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Back
          </button>
        ) : null}
        {step < STEP_LABELS.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-40"
          >
            {loading ? "Submitting…" : "Submit report"}
          </button>
        )}
      </div>
    </form>
    </div>
  );
}

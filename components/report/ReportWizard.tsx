"use client";

import { useMemo, useState } from "react";

type IndicatorRow = { type: "phone" | "email" | "domain" | "wallet" | "other"; value: string };

const steps = [
  "Incident",
  "Identifiers",
  "Evidence",
  "Privacy",
  "Review",
] as const;

export function ReportWizard() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [scamType, setScamType] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [occurredAtStart, setOccurredAtStart] = useState("");
  const [occurredAtEnd, setOccurredAtEnd] = useState("");
  const [narrativePrivate, setNarrativePrivate] = useState("");
  const [narrativePublic, setNarrativePublic] = useState("");
  const [indicators, setIndicators] = useState<IndicatorRow[]>([{ type: "email", value: "" }]);
  const [visibility, setVisibility] = useState<"private" | "anonymized" | "public">("private");
  const [supportRequested, setSupportRequested] = useState(false);
  const [isAnonymousSubmit, setIsAnonymousSubmit] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const canNext = useMemo(() => {
    if (step === 0) return title.trim().length >= 3 && scamType.trim().length >= 2 && narrativePrivate.trim().length >= 20;
    if (step === 1) return true;
    if (step === 2) return true;
    if (step === 3) return true;
    return true;
  }, [step, title, scamType, narrativePrivate]);

  function addIndicator() {
    setIndicators((prev) => [...prev, { type: "email", value: "" }]);
  }

  async function submitAll() {
    setLoading(true);
    setError("");
    try {
      const amountCents =
        amount.trim() === "" ? undefined : Math.round(parseFloat(amount) * 100);
      if (amount.trim() !== "" && Number.isNaN(amountCents)) {
        throw new Error("Invalid amount");
      }

      const cleanedIndicators = indicators
        .map((i) => ({ type: i.type, value: i.value.trim() }))
        .filter((i) => i.value.length >= 2);

      const payload = {
        title: title.trim(),
        scamType: scamType.trim(),
        amountCents,
        currency,
        paymentMethod: paymentMethod.trim() || undefined,
        occurredAtStart: occurredAtStart ? new Date(occurredAtStart).toISOString() : undefined,
        occurredAtEnd: occurredAtEnd ? new Date(occurredAtEnd).toISOString() : undefined,
        narrativePrivate: narrativePrivate.trim(),
        narrativePublic: narrativePublic.trim() || undefined,
        visibility,
        supportRequested,
        isAnonymousSubmit,
        indicators: cleanedIndicators,
      };

      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { success?: boolean; caseId?: string; error?: string };
      if (!res.ok || !json.success || !json.caseId) {
        throw new Error(json.error ?? "Failed to submit report");
      }

      const caseId = json.caseId;

      for (const file of files) {
        const presign = await fetch("/api/evidence/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            caseId,
            fileName: file.name,
            contentType: file.type || "application/octet-stream",
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
          headers: { "Content-Type": file.type || "application/octet-stream" },
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
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size,
          }),
        });
        const cjson = (await complete.json()) as { success?: boolean; error?: string };
        if (!complete.ok || !cjson.success) {
          throw new Error(cjson.error ?? "Failed to record evidence");
        }
      }

      setDoneId(caseId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (doneId) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <p className="font-semibold">Report received.</p>
        <p className="mt-2 text-sm">
          Reference <span className="font-mono">{doneId}</span>. You can track status from your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ol className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        {steps.map((label, i) => (
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
          <div>
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Scam type</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={scamType}
              onChange={(e) => setScamType(e.target.value)}
              placeholder="e.g. investment, romance, phishing"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Amount (optional)</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Currency</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Payment method (optional)</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Started (optional)</label>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={occurredAtStart}
                onChange={(e) => setOccurredAtStart(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Ended (optional)</label>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={occurredAtEnd}
                onChange={(e) => setOccurredAtEnd(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">What happened (private, detailed)</label>
            <textarea
              className="mt-1 min-h-[140px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={narrativePrivate}
              onChange={(e) => setNarrativePrivate(e.target.value)}
              placeholder="Include details you are comfortable storing securely. Default visibility is private."
            />
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Add scam identifiers (phone, email, domain, crypto wallet). These are used for pattern matching.
          </p>
          {indicators.map((row, idx) => (
            <div key={idx} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="sm:w-40">
                <label className="text-xs font-medium text-slate-600">Type</label>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={row.type}
                  onChange={(e) => {
                    const v = e.target.value as IndicatorRow["type"];
                    setIndicators((prev) =>
                      prev.map((r, i) => (i === idx ? { ...r, type: v } : r))
                    );
                  }}
                >
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="domain">Domain</option>
                  <option value="wallet">Wallet</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-slate-600">Value</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={row.value}
                  onChange={(e) => {
                    const v = e.target.value;
                    setIndicators((prev) =>
                      prev.map((r, i) => (i === idx ? { ...r, value: v } : r))
                    );
                  }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addIndicator}
            className="text-sm font-medium text-slate-900 underline"
          >
            Add another identifier
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Upload screenshots or documents (optional). Requires S3 credentials in environment.
          </p>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="text-sm"
          />
          {files.length ? (
            <ul className="text-xs text-slate-600">
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
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Visibility</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as typeof visibility)}
            >
              <option value="private">Private (default)</option>
              <option value="anonymized">Anonymized public summary</option>
              <option value="public">Public</option>
            </select>
          </div>
          {(visibility === "anonymized" || visibility === "public") && (
            <div>
              <label className="text-sm font-medium text-slate-700">Public summary (optional)</label>
              <textarea
                className="mt-1 min-h-[100px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={narrativePublic}
                onChange={(e) => setNarrativePublic(e.target.value)}
                placeholder="Short version without personal identifiers"
              />
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isAnonymousSubmit}
              onChange={(e) => setIsAnonymousSubmit(e.target.checked)}
            />
            Submit as anonymous to other users (we may still retain account linkage for safety).
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={supportRequested}
              onChange={(e) => setSupportRequested(e.target.checked)}
            />
            Request recovery support
          </label>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-3 text-sm text-slate-700">
          <p>
            <span className="font-medium">Title:</span> {title}
          </p>
          <p>
            <span className="font-medium">Type:</span> {scamType}
          </p>
          <p>
            <span className="font-medium">Visibility:</span> {visibility}
          </p>
          <p>
            <span className="font-medium">Indicators:</span> {indicators.filter((i) => i.value.trim()).length}
          </p>
          <p>
            <span className="font-medium">Files:</span> {files.length}
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800"
          >
            Back
          </button>
        ) : null}
        {step < steps.length - 1 ? (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={loading || !canNext}
            onClick={() => void submitAll()}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {loading ? "Submitting…" : "Submit report"}
          </button>
        )}
      </div>
    </div>
  );
}

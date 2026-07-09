"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

import { MAX_ACCOUNT_CHARS, type ReportFieldSuggestion } from "@/lib/report/scam-types";

/**
 * "Describe it, we'll fill the form" assist for the report flow. Sends a free-text
 * account to the AI-fill endpoint and hands the suggested fields back to the parent,
 * which merges them into the form for the reporter to review and edit.
 */
export function ReportAiAssist({ onFill }: { onFill: (fields: ReportFieldSuggestion) => void }) {
  const t = useTranslations("reportAi");
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filled, setFilled] = useState(false);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setFilled(false);
    try {
      const res = await fetch("/api/report/ai-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: account.trim() }),
      });
      const data = (await res.json()) as
        | { ok: true; fields: ReportFieldSuggestion }
        | { ok: false; error: string };
      if (data.ok) {
        onFill(data.fields);
        setFilled(true);
      } else {
        setError(data.error);
      }
    } catch {
      setError(t("genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.06] p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[var(--avasc-gold-light)]" aria-hidden />
        <h3 className="text-sm font-semibold text-white">{t("title")}</h3>
      </div>
      <p className="mt-1 text-sm text-[var(--avasc-text-secondary)]">{t("intro")}</p>
      <textarea
        value={account}
        onChange={(e) => setAccount(e.target.value.slice(0, MAX_ACCOUNT_CHARS))}
        disabled={loading}
        rows={4}
        placeholder={t("placeholder")}
        className="mt-3 w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-3 py-2 text-sm text-foreground placeholder:text-[var(--avasc-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--avasc-gold)]"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading || account.trim().length < 15}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--avasc-gold)] px-4 py-2 text-sm font-semibold text-[var(--avasc-bg)] transition hover:brightness-110 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          {loading ? t("drafting") : t("draftBtn")}
        </button>
        {filled ? (
          <span className="text-xs font-medium text-emerald-300">{t("filled")}</span>
        ) : (
          <span className="text-xs text-[var(--avasc-text-muted)]">{t("warnPii")}</span>
        )}
      </div>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}

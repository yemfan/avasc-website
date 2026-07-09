"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LifeBuoy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GuidanceView } from "@/components/guidance/GuidanceView";
import { MAX_SITUATION_CHARS, type Guidance } from "@/lib/guides/types";

/**
 * AI recovery plan. Reuses the shared guidance engine (/api/guides/ai) in
 * "recovery" mode — a prioritized, victim-centered recovery plan from a plain
 * description. On-demand, not persisted.
 */
export function RecoveryAi() {
  const t = useTranslations("recoveryAi");
  const [situation, setSituation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<Guidance | null>(null);

  const tooShort = situation.trim().length < 10;

  async function onSubmit() {
    setLoading(true);
    setError(null);
    setGuidance(null);
    try {
      const res = await fetch("/api/guides/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: situation.trim(), mode: "recovery" }),
      });
      const data = (await res.json()) as { ok: true; guidance: Guidance } | { ok: false; error: string };
      if (data.ok) setGuidance(data.guidance);
      else setError(data.error);
    } catch {
      setError(t("genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--avasc-gold)]/30 bg-[var(--avasc-bg-card)] p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <LifeBuoy className="h-5 w-5 text-[var(--avasc-gold-light)]" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">{t("title")}</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t("intro")}</p>

      <div className="mt-4">
        <label htmlFor="recovery-situation" className="sr-only">
          {t("srLabel")}
        </label>
        <textarea
          id="recovery-situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value.slice(0, MAX_SITUATION_CHARS))}
          disabled={loading}
          rows={5}
          placeholder={t("placeholder")}
          className="w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-foreground placeholder:text-[var(--avasc-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--avasc-gold)]"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-[var(--avasc-text-muted)]">{t("warnPii")}</p>
          <span className="text-xs text-[var(--avasc-text-muted)]">
            {situation.length}/{MAX_SITUATION_CHARS}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <Button type="button" variant="gold" onClick={onSubmit} disabled={loading || tooShort}>
          {loading ? t("building") : t("submitBtn")}
        </Button>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {guidance ? <GuidanceView guidance={guidance} /> : null}
    </section>
  );
}

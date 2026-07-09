"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GuidanceView } from "@/components/guidance/GuidanceView";
import { MAX_SITUATION_CHARS, type Guidance } from "@/lib/guides/types";

export function AiGuide() {
  const t = useTranslations("guidesIndex");
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
        body: JSON.stringify({ situation: situation.trim() }),
      });
      const data = (await res.json()) as
        | { ok: true; guidance: Guidance }
        | { ok: false; error: string };
      if (data.ok) setGuidance(data.guidance);
      else setError(data.error);
    } catch {
      setError(t("aiError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--avasc-gold)]/30 bg-[var(--avasc-bg-soft)] p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[var(--avasc-gold-light)]" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">{t("aiTitle")}</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {t("aiIntro")}
      </p>

      <div className="mt-4">
        <label htmlFor="ai-situation" className="sr-only">
          {t("aiLabel")}
        </label>
        <textarea
          id="ai-situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value.slice(0, MAX_SITUATION_CHARS))}
          disabled={loading}
          rows={5}
          placeholder={t("aiPlaceholder")}
          className="w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-foreground placeholder:text-[var(--avasc-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--avasc-gold)]"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-[var(--avasc-text-muted)]">
            {t("aiSafetyNote")}
          </p>
          <span className="text-xs text-[var(--avasc-text-muted)]">
            {situation.length}/{MAX_SITUATION_CHARS}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <Button type="button" variant="gold" onClick={onSubmit} disabled={loading || tooShort}>
          {loading ? t("aiThinking") : t("aiSubmit")}
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

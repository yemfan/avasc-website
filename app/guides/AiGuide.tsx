"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MAX_SITUATION_CHARS, type Guidance } from "@/lib/guides/types";

export function AiGuide() {
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
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--avasc-gold)]/30 bg-[var(--avasc-bg-soft)] p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[var(--avasc-gold-light)]" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">AI Guide — describe your situation</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Not sure which guide fits? Tell us what happened in your own words and we&apos;ll give you
        tailored, practical next steps. This is general guidance, not legal or financial advice.
      </p>

      <div className="mt-4">
        <label htmlFor="ai-situation" className="sr-only">
          Describe your situation
        </label>
        <textarea
          id="ai-situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value.slice(0, MAX_SITUATION_CHARS))}
          disabled={loading}
          rows={5}
          placeholder="e.g. Someone I met online convinced me to invest in a crypto app. I sent $3,000 and now they want more before I can withdraw…"
          className="w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-foreground placeholder:text-[var(--avasc-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--avasc-gold)]"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-[var(--avasc-text-muted)]">
            Do not include passwords, full card numbers, your SSN, or 2FA codes.
          </p>
          <span className="text-xs text-[var(--avasc-text-muted)]">
            {situation.length}/{MAX_SITUATION_CHARS}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <Button type="button" variant="gold" onClick={onSubmit} disabled={loading || tooShort}>
          {loading ? "Thinking…" : "Get guidance"}
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

function GuidanceView({ guidance }: { guidance: Guidance }) {
  return (
    <div className="mt-6 space-y-5 border-t border-[var(--avasc-border)] pt-5">
      {guidance.acknowledgement ? (
        <p className="text-sm leading-relaxed text-foreground">{guidance.acknowledgement}</p>
      ) : null}

      {guidance.likelyScamType ? (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">This may be: </span>
          {guidance.likelyScamType}
        </p>
      ) : null}

      {guidance.immediateSteps.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-foreground">Do this now</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-[var(--avasc-gold-light)]">
            {guidance.immediateSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      ) : null}

      {guidance.reporting.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-foreground">Where to report</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {guidance.reporting.map((r, i) => (
              <li key={i}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--avasc-gold-light)] underline hover:text-[var(--avasc-gold)]"
                >
                  {r.label}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {guidance.protectYourself.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-foreground">Protect yourself going forward</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-[var(--avasc-gold-light)]">
            {guidance.protectYourself.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {guidance.emotionalSupport ? (
        <p className="rounded-lg bg-[var(--avasc-bg)] px-4 py-3 text-sm italic leading-relaxed text-muted-foreground">
          {guidance.emotionalSupport}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-1">
        <Link
          href="/report"
          className="rounded-full bg-[var(--avasc-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--avasc-bg)] hover:brightness-110"
        >
          Report your case
        </Link>
        <Link
          href="/recovery"
          className="rounded-full border border-[var(--avasc-border)] px-5 py-2.5 text-sm font-semibold text-foreground hover:border-[var(--avasc-gold)]/50"
        >
          Recovery resources
        </Link>
      </div>

      <p className="text-xs leading-relaxed text-[var(--avasc-text-muted)]">
        AVASC is not a law firm and does not guarantee recovery. This is general educational guidance,
        not legal or financial advice. Beware of anyone who contacts you promising to recover your
        money for an upfront fee — that is a common follow-up scam. In an emergency, contact your local
        authorities.
      </p>
    </div>
  );
}

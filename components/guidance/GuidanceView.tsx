"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Guidance } from "@/lib/guides/types";

/** Shared renderer for AI guidance (used by the Guides AI Guide and the Recovery AI plan). */
export function GuidanceView({ guidance }: { guidance: Guidance }) {
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
          href="/resources"
          className="rounded-full border border-[var(--avasc-border)] px-5 py-2.5 text-sm font-semibold text-foreground hover:border-[var(--avasc-gold)]/50"
        >
          More resources
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

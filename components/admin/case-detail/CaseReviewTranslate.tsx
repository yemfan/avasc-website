"use client";

import { useState, useTransition } from "react";
import { Languages, ShieldCheck } from "lucide-react";

import { translateCaseForReviewAction } from "@/app/[locale]/admin/cases/[id]/translate-actions";

/**
 * Moderator control to translate a non-English case narrative to English for
 * review. The narrative is PII-redacted before it leaves the server, and the
 * result is cached. Shown inside the (admin-only) narrative card.
 */
export function CaseReviewTranslate({ caseId, language }: { caseId: string; language: string | null }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ summary: string; fullNarrative: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nonEnglish = !!language && language !== "en";

  function run() {
    setError(null);
    startTransition(async () => {
      const res = await translateCaseForReviewAction(caseId);
      if (res.ok) setResult(res.translation);
      else setError(res.error);
    });
  }

  return (
    <div className="mt-5 border-t pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60"
        >
          <Languages className="h-4 w-4" aria-hidden />
          {isPending ? "Translating…" : result ? "Re-translate for review" : "Translate for review"}
        </button>
        {language ? (
          <span className="text-xs text-muted-foreground">
            Reported in <span className="font-medium uppercase">{language}</span>
          </span>
        ) : null}
        {!nonEnglish && !result ? (
          <span className="text-xs text-muted-foreground">(appears to be English)</span>
        ) : null}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
        PII (emails, phones, card/account numbers, handles, links) is redacted before translation.
      </p>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      {result ? (
        <div className="mt-3 space-y-4 rounded-xl border border-sky-200 bg-sky-50/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
            English (redacted, machine-translated — for review only)
          </p>
          <div>
            <h5 className="text-xs font-medium text-muted-foreground">Summary</h5>
            <p className="mt-1 text-sm leading-7 text-slate-800">{result.summary}</p>
          </div>
          <div>
            <h5 className="text-xs font-medium text-muted-foreground">Full narrative</h5>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-7 text-slate-800">{result.fullNarrative}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

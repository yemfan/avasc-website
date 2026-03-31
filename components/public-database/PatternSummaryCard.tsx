import type { PublicPatternSummary } from "@/lib/public-database/public-profile-types";
import { formatPublicActivityRange } from "@/lib/public-database/public-indicator-display";
import { CalendarRange, CreditCard, Globe2, Users } from "lucide-react";

export function PatternSummaryCard({ pattern }: { pattern: PublicPatternSummary }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        The numbers below come only from anonymized case fields (like payment type or country) that people chose to
        share. They are themes, not proof of who is responsible.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="h-4 w-4" aria-hidden />
            <span className="text-sm font-semibold text-slate-800">Reports</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{pattern.reportCount}</p>
          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-slate-600">
            <CalendarRange className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              When people first and last reported:{" "}
              <span className="font-medium text-slate-800">
                {formatPublicActivityRange(pattern.firstReportedAt, pattern.lastReportedAt)}
              </span>
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-slate-600">
            <CreditCard className="h-4 w-4" aria-hidden />
            <span className="text-sm font-semibold text-slate-800">How people paid (themes)</span>
          </div>
          {pattern.dominantPaymentMethods.length ? (
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-800">
              {pattern.dominantPaymentMethods.map((row) => (
                <li key={row.label}>
                  {row.label}
                  <span className="text-slate-500">
                    {" "}
                    — mentioned in {row.count} {row.count === 1 ? "report" : "reports"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">We don’t have enough shared detail to show payment themes.</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:col-span-2">
          <div className="flex items-center gap-2 text-slate-600">
            <Globe2 className="h-4 w-4" aria-hidden />
            <span className="text-sm font-semibold text-slate-800">Where & how contact happened (if shared)</span>
          </div>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-500">Channels or platforms</p>
              {pattern.dominantPlatforms.length ? (
                <ul className="mt-2 space-y-2 text-sm text-slate-800">
                  {pattern.dominantPlatforms.map((row) => (
                    <li key={row.label}>
                      {row.label}{" "}
                      <span className="text-slate-500">
                        ({row.count} {row.count === 1 ? "mention" : "mentions"})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">—</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Regions (only if victims added this)</p>
              {pattern.dominantCountries.length ? (
                <ul className="mt-2 space-y-2 text-sm text-slate-800">
                  {pattern.dominantCountries.map((row) => (
                    <li key={row.label}>
                      {row.label}{" "}
                      <span className="text-slate-500">({row.count})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">—</p>
              )}
            </div>
          </div>
        </div>

        {pattern.commonScript ? (
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5 sm:col-span-2">
            <p className="text-sm font-semibold text-amber-950">How the story often sounds</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-800">{pattern.commonScript}</p>
            <p className="mt-3 text-xs text-amber-900/80">
              This is a plain-language summary of repeated story beats — not a transcript and not legal advice.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

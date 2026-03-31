import Link from "next/link";
import type { PublicScamSearchResult } from "@/lib/public-database/public-search-types";
import { IndicatorChip } from "@/components/avasc/IndicatorChip";
import { RiskBadge } from "@/components/avasc/RiskBadge";

const linkOutlineClass =
  "inline-flex items-center justify-center rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-[var(--avasc-text-primary)] transition-colors duration-150 hover:border-[var(--avasc-gold)]/50 hover:text-[var(--avasc-gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]";

const linkGoldClass =
  "inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-4 py-2 text-sm font-semibold text-[var(--avasc-bg)] shadow-[0_0_20px_rgba(197,139,43,0.12)] transition duration-150 hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-card)]";

type ScamProfileCardProps = {
  result: PublicScamSearchResult;
};

export function ScamProfileCard({ result }: ScamProfileCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--avasc-gold)]/35 hover:shadow-[0_0_24px_rgba(197,139,43,0.1)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--avasc-text-primary)] sm:text-xl">
            {result.title}
          </h2>
          <p className="text-sm text-[var(--avasc-text-secondary)]">{result.scamType}</p>
        </div>

        <div className="flex flex-shrink-0 flex-wrap gap-2">
          <RiskBadge level={result.riskLevel} />
          <span className="inline-flex items-center rounded-full border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-3 py-1 text-xs font-medium text-[var(--avasc-text-secondary)]">
            {result.reportCount} reports
          </span>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--avasc-text-secondary)]">{result.summary}</p>

      {result.matchedIndicators.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--avasc-text-muted)]">
            Matching Public Indicators
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {result.matchedIndicators.map((indicator, idx) => (
              <IndicatorChip
                key={`${indicator.type}-${indicator.value}-${idx}`}
                type={indicator.type}
                value={indicator.value}
                verified={indicator.isVerified}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/database/${result.slug}`} className={linkOutlineClass}>
          View Scam Profile
        </Link>

        <Link
          href={`/report?matchedProfile=${encodeURIComponent(result.slug)}`}
          className={linkGoldClass}
        >
          Report a Matching Case
        </Link>
      </div>
    </article>
  );
}

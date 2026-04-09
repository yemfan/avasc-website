import Link from "next/link";
import { Search, ShieldAlert, ArrowRight, AlertTriangle, Bell } from "lucide-react";
import type { PublicDatabaseFiltersData, PublicScamSearchResult } from "@/lib/public-database/public-search-types";
import { IndicatorChip } from "@/components/avasc/IndicatorChip";
import { RiskBadge } from "@/components/avasc/RiskBadge";
import { PublicDatabaseSearchFilters } from "@/components/avasc/public-database/PublicDatabaseSearchFilters";

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type AvascPublicDatabaseViewProps = {
  results: PublicScamSearchResult[];
  filters: PublicDatabaseFiltersData;
  query: string;
  scamType: string;
  riskLevel: string;
  indicatorType: string;
};

function ResultCard({ item }: { item: PublicScamSearchResult }) {
  return (
    <article className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)] transition hover:border-[var(--avasc-gold)] hover:shadow-[0_0_20px_rgba(197,139,43,0.18)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-tight text-white">{item.title}</h3>
          <p className="mt-1 text-sm text-[var(--avasc-text-secondary)]">{item.scamType}</p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap gap-2">
          <RiskBadge level={item.riskLevel} />
          <span className="inline-flex rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
            {item.reportCount} reports
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-[var(--avasc-text-secondary)]">{item.summary}</p>

      {item.matchedIndicators.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.matchedIndicators.map((indicator, idx) => (
            <IndicatorChip
              key={`${indicator.type}-${indicator.value}-${idx}`}
              type={indicator.type}
              value={indicator.value}
              verified={indicator.isVerified}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/database/${item.slug}`}
          className="rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white hover:border-[var(--avasc-gold)]"
        >
          View Scam Profile
        </Link>
        <Link
          href={`/report?matchedProfile=${encodeURIComponent(item.slug)}`}
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-4 py-2 text-sm font-semibold text-[#050A14]"
        >
          Report Matching Case
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function SidebarCTA() {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[#0F172A] to-[#0B1F3A] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
          <Bell className="h-3.5 w-3.5" aria-hidden />
          AVASC Alerts
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">Get realtime scam alerts</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--avasc-text-secondary)]">
          Subscribe to critical SMS alerts and daily or weekly scam intelligence by email.
        </p>
        <Link
          href="/alerts/subscribe"
          className="mt-5 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-4 py-3 text-sm font-semibold text-[#050A14]"
        >
          Subscribe to Alerts
        </Link>
      </section>

      <section className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <h3 className="text-lg font-semibold text-white">Search Tips</h3>
        <ul className="mt-4 space-y-3 text-sm text-[var(--avasc-text-secondary)]">
          <li className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avasc-gold)]" aria-hidden />
            Search by domain, wallet, phone, email, alias, or platform.
          </li>
          <li className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avasc-gold)]" aria-hidden />
            Use filters to narrow by scam type, risk, or indicator type.
          </li>
          <li className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avasc-gold)]" aria-hidden />
            If a profile looks familiar, report a matching case.
          </li>
        </ul>
      </section>

      <section className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--avasc-gold-light)]">
          <AlertTriangle className="h-4 w-4" aria-hidden />
          Public Safety Note
        </div>
        <p className="mt-3 text-sm leading-7 text-[var(--avasc-text-secondary)]">
          Results include only published scam profiles and publicly approved indicators. AVASC does not publish private
          victim information.
        </p>
      </section>
    </div>
  );
}

function DatabaseEmptyState() {
  return (
    <section className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(197,139,43,0.25)] bg-[rgba(197,139,43,0.08)]">
        <Search className="h-6 w-6 text-[var(--avasc-gold-light)]" aria-hidden />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">No public scam profiles found</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--avasc-text-secondary)]">
        Try a broader keyword such as a domain, wallet, alias, platform, or scam type. If this looks similar to your
        case, consider reporting it so the pattern can be reviewed.
      </p>
    </section>
  );
}

function ActiveFilter({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-medium text-[var(--avasc-gold-light)]">
      {children}
    </span>
  );
}

export function AvascPublicDatabaseView({
  results,
  filters,
  query,
  scamType,
  riskLevel,
  indicatorType,
}: AvascPublicDatabaseViewProps) {
  return (
    <Container>
      <div className="space-y-8 py-8 sm:space-y-10 sm:py-10">
        <section className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[#0F172A] to-[#0B1F3A] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
            AVASC Public Scam Database
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Search reported scam patterns.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--avasc-text-secondary)]">
            Search published scam profiles using publicly approved indicators such as domains, wallet addresses, emails,
            aliases, platforms, and scam types.
          </p>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <PublicDatabaseSearchFilters
              filters={filters}
              query={query}
              scamType={scamType}
              riskLevel={riskLevel}
              indicatorType={indicatorType}
            />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-[var(--avasc-text-secondary)]">
                <span className="font-semibold text-white">{results.length}</span> scam profile
                {results.length === 1 ? "" : "s"} found
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--avasc-text-muted)]">
                {scamType !== "ALL" ? <ActiveFilter>{scamType}</ActiveFilter> : null}
                {riskLevel !== "ALL" ? <ActiveFilter>{formatEnum(riskLevel)}</ActiveFilter> : null}
                {indicatorType !== "ALL" ? <ActiveFilter>{formatEnum(indicatorType)}</ActiveFilter> : null}
              </div>
            </div>

            {results.length === 0 ? (
              <DatabaseEmptyState />
            ) : (
              <div className="space-y-4" aria-label="Search results">
                {results.map((item) => (
                  <ResultCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          <SidebarCTA />
        </div>
      </div>
    </Container>
  );
}

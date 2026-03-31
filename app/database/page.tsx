import type { Metadata } from "next";
import { searchPublicScamProfiles } from "@/lib/public-database/public-search";
import { getPublicDatabaseFilters } from "@/lib/public-database/public-filters";
import { SearchFiltersForm } from "@/components/avasc/SearchFiltersForm";
import { ScamProfileCard } from "@/components/avasc/ScamProfileCard";
import { PublicDatabaseEmptyState } from "@/components/public/PublicDatabaseEmptyState";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Scam pattern database",
  description:
    "Search published scam profiles using publicly approved indicators — domains, wallets, emails, and more.",
  openGraph: {
    title: "Search reported scam patterns | AVASC",
    description:
      "Privacy-safe search across published scam profiles — indicators are masked or staff-approved for public display.",
  },
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    scamType?: string;
    riskLevel?: string;
    indicatorType?: string;
  }>;
};

export default async function PublicDatabasePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = params.q ?? "";
  const scamType = params.scamType ?? "ALL";
  const riskLevel = params.riskLevel ?? "ALL";
  const indicatorType = params.indicatorType ?? "ALL";

  const [results, filters] = await Promise.all([
    searchPublicScamProfiles({
      query,
      scamType,
      riskLevel,
      indicatorType,
    }),
    getPublicDatabaseFilters(),
  ]);

  return (
    <div className="w-full space-y-6">
      <section className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[var(--avasc-bg-soft)] to-[var(--avasc-blue)] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Search Reported Scam Patterns</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--avasc-text-secondary)] sm:text-base">
          Search published scam profiles using publicly approved indicators such as domains, wallet addresses, emails,
          aliases, and scam types. Results are based on moderated, anonymized scam intelligence.
        </p>
      </section>

      <SearchFiltersForm
        filters={filters}
        initialQuery={query}
        selectedScamType={scamType}
        selectedRiskLevel={riskLevel}
        selectedIndicatorType={indicatorType}
      />

      {results.length === 0 ? (
        <PublicDatabaseEmptyState />
      ) : (
        <section className="space-y-4" aria-label="Search results">
          {results.map((result) => (
            <ScamProfileCard key={result.id} result={result} />
          ))}
        </section>
      )}

      <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 text-sm text-[var(--avasc-text-muted)] shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        Results include only published scam profiles and publicly approved indicator data. AVASC does not publish private
        victim information and is not a law firm.
      </section>
    </div>
  );
}

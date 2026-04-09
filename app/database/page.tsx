import type { Metadata } from "next";
import { searchPublicScamProfiles } from "@/lib/public-database/public-scam-search";
import { getPublicDatabaseFilters } from "@/lib/public-database/public-filters";
import { AvascPublicDatabaseView } from "@/components/avasc/public-database/AvascPublicDatabaseView";
import { getPublicAlerts } from "@/lib/alerts/avasc-alert-section-api-and-loader";

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

  const [results, filters, realtimeAlerts] = await Promise.all([
    searchPublicScamProfiles({
      query,
      scamType,
      riskLevel,
      indicatorType,
    }),
    getPublicDatabaseFilters(),
    getPublicAlerts({ type: "REALTIME", limit: 3 }).catch(() => []),
  ]);

  return (
    <main className="min-h-screen bg-[var(--avasc-bg)] text-[var(--avasc-text-primary)]">
      <AvascPublicDatabaseView
        results={results}
        filters={filters}
        query={query}
        scamType={scamType}
        riskLevel={riskLevel}
        indicatorType={indicatorType}
        realtimeAlerts={realtimeAlerts}
      />
    </main>
  );
}

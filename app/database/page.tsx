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
    type: "website",
    url: "https://avasc.org/database",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/database",
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://avasc.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Scam Database",
        item: "https://avasc.org/database",
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AvascPublicDatabaseView
      results={results}
      filters={filters}
      query={query}
      scamType={scamType}
      riskLevel={riskLevel}
      indicatorType={indicatorType}
      realtimeAlerts={realtimeAlerts}
    />
      <section className="mt-12 border-t border-slate-200 pt-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Learn More</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <a
            href="/report"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">Report a Scam</h3>
            <p className="mt-1 text-sm text-slate-600">
              Share your experience and help us expand the database.
            </p>
          </a>
          <a
            href="/stories"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">Read Survivor Stories</h3>
            <p className="mt-1 text-sm text-slate-600">
              Learn how others identified and responded to scams.
            </p>
          </a>
          <a
            href="/recovery"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">Recovery Resources</h3>
            <p className="mt-1 text-sm text-slate-600">
              Get guidance on responding to and recovering from scams.
            </p>
          </a>
        </div>
      </section>
    </>
  );
}

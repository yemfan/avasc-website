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

  // TOM CR-001: this page was returning HTTP 500 in production (reported
  // April 17). Root cause is likely a missing table, missing env var, or a
  // transient Supabase issue — without live access we can't pin it down.
  //
  // Until root cause is fixed, catch the error server-side and render a
  // graceful degraded view instead of crashing to a 500. Users see a useful
  // "temporarily unavailable" message with working links to alternative
  // resources. When the backend recovers, this code path is unchanged.
  let results: Awaited<ReturnType<typeof searchPublicScamProfiles>> = [];
  let filters: Awaited<ReturnType<typeof getPublicDatabaseFilters>> = {
    scamTypes: [],
    riskLevels: [],
    indicatorTypes: [],
  };
  let realtimeAlerts: Awaited<ReturnType<typeof getPublicAlerts>> = [];
  let databaseError: string | null = null;
  try {
    [results, filters, realtimeAlerts] = await Promise.all([
      searchPublicScamProfiles({
        query,
        scamType,
        riskLevel,
        indicatorType,
      }),
      getPublicDatabaseFilters(),
      getPublicAlerts({ type: "REALTIME", limit: 3 }).catch(() => []),
    ]);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[database] load failed", msg);
    databaseError = msg;
  }

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
      {databaseError ? (
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-lg border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.06] p-5 text-sm text-[var(--avasc-gold-light)]">
            <h2 className="text-lg font-medium text-white">Scam database is temporarily unavailable</h2>
            <p className="mt-2 text-[var(--avasc-text-secondary)]">
              We&apos;re having trouble loading the scam pattern database right now.
              Please try again in a few minutes. In the meantime:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[var(--avasc-text-secondary)]">
              <li>
                <a
                  href="https://reportfraud.ftc.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[var(--avasc-gold-light)]"
                >
                  Report a scam to the FTC (reportfraud.ftc.gov)
                </a>
              </li>
              <li>
                <a
                  href="https://www.ic3.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[var(--avasc-gold-light)]"
                >
                  File with the FBI&apos;s IC3 (ic3.gov)
                </a>
              </li>
              <li>
                <a href="/report" className="underline hover:text-[var(--avasc-gold-light)]">
                  Submit a scam report to AVASC
                </a>
              </li>
              <li>
                <a href="mailto:security@avasc.org" className="underline hover:text-[var(--avasc-gold-light)]">
                  Email security@avasc.org if you need urgent help
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <AvascPublicDatabaseView
          results={results}
          filters={filters}
          query={query}
          scamType={scamType}
          riskLevel={riskLevel}
          indicatorType={indicatorType}
          realtimeAlerts={realtimeAlerts}
        />
      )}
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

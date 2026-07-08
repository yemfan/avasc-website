import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { listPublishedBriefings } from "@/lib/briefings/queries";
import { ReportCta } from "@/components/avasc/ReportCta";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://avasc.org").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "This Week in Scams — Weekly Fraud Briefings",
  description:
    "AVASC's public-safe weekly scam intelligence: what our database is seeing plus this week's authoritative fraud warnings and enforcement, with protective guidance for the public.",
  openGraph: {
    title: "This Week in Scams — Weekly Fraud Briefings | AVASC",
    description:
      "Victim-centered weekly briefings grounded in AVASC data and authoritative sources (FTC, FBI IC3, CISA, FinCEN).",
    type: "website",
    url: `${SITE_URL}/briefings`,
  },
  twitter: { card: "summary" },
  alternates: { canonical: "/briefings" },
};

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** Small cadence label for cards so Weekly vs Daily briefings are distinguishable. */
function kindLabel(category: string): string | null {
  switch (category) {
    case "weekly":
      return "Weekly";
    case "daily":
      return "Daily";
    case "trend_report":
      return "Trend report";
    default:
      return null;
  }
}

export default async function BriefingsIndexPage() {
  let briefings: Awaited<ReturnType<typeof listPublishedBriefings>> = [];
  let loadError = false;
  try {
    briefings = await listPublishedBriefings(60);
  } catch (err) {
    console.error("[briefings] index load failed", err instanceof Error ? err.message : err);
    loadError = true;
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "This Week in Scams — Weekly Fraud Briefings",
    description:
      "Public-safe weekly scam intelligence briefings from AVASC, grounded in our data and authoritative external sources.",
    url: `${SITE_URL}/briefings`,
    isPartOf: { "@type": "WebSite", name: "AVASC", url: SITE_URL },
    hasPart: briefings.map((b) => ({
      "@type": "Article",
      headline: b.title,
      url: `${SITE_URL}/briefings/${b.slug}`,
      datePublished: b.publishedAt.toISOString(),
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Briefings", item: `${SITE_URL}/briefings` },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--avasc-gold-light)]/90">
          This Week in Scams
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Weekly Fraud Briefings</h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--avasc-text-secondary)]">
          A plain-English, victim-centered read on this week&apos;s scams — combining what the AVASC database is
          seeing with authoritative warnings and enforcement from the FTC, FBI IC3, CISA, FinCEN, and state
          Attorneys General. Every briefing links out to its sources.
        </p>
      </header>

      {loadError ? (
        <div className="rounded-2xl border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.06] p-6 text-sm text-[var(--avasc-text-secondary)]">
          <h2 className="text-lg font-medium text-white">Briefings are temporarily unavailable</h2>
          <p className="mt-2">Please try again in a few minutes. In the meantime, explore our{" "}
            <Link href="/guides" className="underline hover:text-[var(--avasc-gold-light)]">
              scam prevention guides
            </Link>{" "}
            or the{" "}
            <Link href="/database" className="underline hover:text-[var(--avasc-gold-light)]">
              scam database
            </Link>
            .
          </p>
        </div>
      ) : briefings.length === 0 ? (
        <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 text-sm text-[var(--avasc-text-secondary)]">
          <h2 className="text-lg font-medium text-white">No briefings published yet</h2>
          <p className="mt-2">
            The first &quot;This Week in Scams&quot; briefing is on the way. Until then, browse our{" "}
            <Link href="/guides" className="underline hover:text-[var(--avasc-gold-light)]">
              prevention guides
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {briefings.map((b) => (
            <Link
              key={b.id}
              href={`/briefings/${b.slug}`}
              className="group flex flex-col rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-sm transition-colors hover:border-[var(--avasc-gold)]/50"
            >
              <div className="flex items-center gap-2 text-xs text-[var(--avasc-text-muted)]">
                <span>{b.periodLabel ?? formatDate(b.publishedAt)}</span>
                {kindLabel(b.category) ? (
                  <span className="rounded-full border border-[var(--avasc-border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--avasc-text-secondary)]">
                    {kindLabel(b.category)}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-[var(--avasc-gold-light)]">
                {b.title}
              </h2>
              {b.dek || b.summary ? (
                <p className="mt-2 line-clamp-3 text-sm text-[var(--avasc-text-secondary)]">{b.dek || b.summary}</p>
              ) : null}
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--avasc-text-secondary)] group-hover:text-[var(--avasc-gold-light)]">
                Read briefing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      )}

      <ReportCta />

      <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] p-6 text-sm text-[var(--avasc-text-secondary)]">
        This is public-safe intelligence: briefings surface only indicators and patterns that are already
        public, and never operational detail that would help a fraudster. AVASC is not a law firm, investigator,
        or government agency.
      </div>
    </div>
  );
}

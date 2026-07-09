import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { listPublishedBriefings } from "@/lib/briefings/queries";
import { translateBriefingCards } from "@/lib/i18n/translate-briefing";
import type { Locale } from "@/i18n/config";
import { getScamStatSeries } from "@/lib/scam-stats/queries";
import { ScamTrendChart } from "@/components/scam-stats/ScamTrendChart";
import { ScamHighlights } from "@/components/scam-stats/ScamHighlights";
import { ReportCta } from "@/components/avasc/ReportCta";
import { localeAlternates } from "@/lib/i18n/alternates";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.avasc.org").replace(/\/$/, "");

const DATE_LOCALE: Record<Locale, string> = { en: "en-US", es: "es-ES", zh: "zh-CN" };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("briefings");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: { title: `${title} | AVASC`, description, type: "website", url: `${SITE_URL}/briefings`, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
    alternates: localeAlternates("/briefings"),
  };
}

function formatDate(d: Date, locale: Locale): string {
  return d.toLocaleDateString(DATE_LOCALE[locale] ?? "en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** Translation key for the cadence badge, or null. */
function kindLabelKey(category: string): "kindWeekly" | "kindDaily" | "kindTrend" | null {
  switch (category) {
    case "weekly":
      return "kindWeekly";
    case "daily":
      return "kindDaily";
    case "trend_report":
      return "kindTrend";
    default:
      return null;
  }
}

export default async function BriefingsIndexPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("briefings");

  let briefings: Awaited<ReturnType<typeof listPublishedBriefings>> = [];
  let loadError = false;
  try {
    briefings = await listPublishedBriefings(60);
    briefings = await translateBriefingCards(briefings, locale);
  } catch (err) {
    console.error("[briefings] index load failed", err instanceof Error ? err.message : err);
    loadError = true;
  }

  const [scamTrend, ftcTrend] = await Promise.all([
    getScamStatSeries("ic3_losses_usd"),
    getScamStatSeries("ftc_losses_usd"),
  ]);

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
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t("title")}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--avasc-text-secondary)]">{t("intro")}</p>
      </header>

      <ScamHighlights />

      {scamTrend ? <ScamTrendChart series={scamTrend} overlay={ftcTrend} /> : null}

      {loadError ? (
        <div className="rounded-2xl border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.06] p-6 text-sm text-[var(--avasc-text-secondary)]">
          <h2 className="text-lg font-medium text-white">{t("errorTitle")}</h2>
          <p className="mt-2">
            {t.rich("errorBody", {
              guides: (chunks) => (
                <Link href="/guides" className="underline hover:text-[var(--avasc-gold-light)]">
                  {chunks}
                </Link>
              ),
              database: (chunks) => (
                <Link href="/database" className="underline hover:text-[var(--avasc-gold-light)]">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      ) : briefings.length === 0 ? (
        <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 text-sm text-[var(--avasc-text-secondary)]">
          <h2 className="text-lg font-medium text-white">{t("emptyTitle")}</h2>
          <p className="mt-2">
            {t.rich("emptyBody", {
              guides: (chunks) => (
                <Link href="/guides" className="underline hover:text-[var(--avasc-gold-light)]">
                  {chunks}
                </Link>
              ),
            })}
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
                <span>{b.periodLabel ?? formatDate(b.publishedAt, locale)}</span>
                {kindLabelKey(b.category) ? (
                  <span className="rounded-full border border-[var(--avasc-border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--avasc-text-secondary)]">
                    {t(kindLabelKey(b.category)!)}
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
                {t("readBriefing")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      )}

      <ReportCta />

      <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] p-6 text-sm text-[var(--avasc-text-secondary)]">
        {t("indexDisclaimer")}
      </div>
    </div>
  );
}

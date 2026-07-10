import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getScamStatSeries } from "@/lib/scam-stats/queries";
import { ScamHighlights } from "@/components/scam-stats/ScamHighlights";
import { ScamTrendChart } from "@/components/scam-stats/ScamTrendChart";
import { ScamBreakdowns } from "@/components/scam-stats/ScamBreakdowns";
import { CfpbLiveStats } from "@/components/scam-stats/CfpbLiveStats";
import { localeAlternates } from "@/lib/i18n/alternates";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.avasc.org").replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("statistics");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: { title: `${title} | AVASC`, description, type: "website", url: `${SITE_URL}/statistics`, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
    alternates: localeAlternates("/statistics"),
  };
}

export default async function StatisticsPage() {
  const t = await getTranslations("statistics");
  const [scamTrend, ftcTrend] = await Promise.all([
    getScamStatSeries("ic3_losses_usd"),
    getScamStatSeries("ftc_losses_usd"),
  ]);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url: `${SITE_URL}/statistics`,
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "AVASC", url: SITE_URL },
    sourceOrganization: [
      { "@type": "Organization", name: "FBI Internet Crime Complaint Center (IC3)" },
      { "@type": "Organization", name: "Federal Trade Commission (FTC)" },
      { "@type": "Organization", name: "Consumer Financial Protection Bureau (CFPB)" },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t("metaTitle"), item: `${SITE_URL}/statistics` },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
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

      <ScamBreakdowns />

      <CfpbLiveStats />

      <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--avasc-gold-light)]">
          {t("methodologyTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--avasc-text-secondary)]">{t("methodologyNote")}</p>
      </section>
    </div>
  );
}

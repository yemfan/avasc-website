import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { AiGuide } from "./AiGuide";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guidesIndex");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://www.avasc.org/guides",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: "/guides",
    },
  };
}

const guides = [
  {
    slug: "how-to-identify-a-scam",
    titleKey: "guide_identify_title",
    descKey: "guide_identify_desc",
    color: "bg-blue-50 border-blue-200",
  },
  {
    slug: "what-to-do-if-youve-been-scammed",
    titleKey: "guide_recovery_title",
    descKey: "guide_recovery_desc",
    color: "bg-amber-50 border-amber-200",
  },
  {
    slug: "romance-scam-warning-signs",
    titleKey: "guide_romance_title",
    descKey: "guide_romance_desc",
    color: "bg-rose-50 border-rose-200",
  },
  {
    slug: "cryptocurrency-scam-types",
    titleKey: "guide_crypto_title",
    descKey: "guide_crypto_desc",
    color: "bg-orange-50 border-orange-200",
  },
  {
    slug: "investment-scam-red-flags",
    titleKey: "guide_investment_title",
    descKey: "guide_investment_desc",
    color: "bg-green-50 border-green-200",
  },
  {
    slug: "phishing-email-protection",
    titleKey: "guide_phishing_title",
    descKey: "guide_phishing_desc",
    color: "bg-cyan-50 border-cyan-200",
  },
  {
    slug: "elder-fraud-prevention",
    titleKey: "guide_elder_title",
    descKey: "guide_elder_desc",
    color: "bg-purple-50 border-purple-200",
  },
  {
    slug: "social-media-scams",
    titleKey: "guide_social_title",
    descKey: "guide_social_desc",
    color: "bg-indigo-50 border-indigo-200",
  },
  {
    slug: "job-scam-warning-signs",
    titleKey: "guide_job_title",
    descKey: "guide_job_desc",
    color: "bg-fuchsia-50 border-fuchsia-200",
  },
  {
    slug: "tech-support-scam-protection",
    titleKey: "guide_tech_title",
    descKey: "guide_tech_desc",
    color: "bg-teal-50 border-teal-200",
  },
  {
    slug: "online-shopping-scam-prevention",
    titleKey: "guide_shopping_title",
    descKey: "guide_shopping_desc",
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    slug: "identity-theft-protection",
    titleKey: "guide_identity_title",
    descKey: "guide_identity_desc",
    color: "bg-violet-50 border-violet-200",
  },
  {
    slug: "money-mule-awareness",
    titleKey: "guide_mule_title",
    descKey: "guide_mule_desc",
    color: "bg-pink-50 border-pink-200",
  },
  {
    slug: "charity-scam-verification",
    titleKey: "guide_charity_title",
    descKey: "guide_charity_desc",
    color: "bg-sky-50 border-sky-200",
  },
  {
    slug: "business-email-compromise",
    titleKey: "guide_bec_title",
    descKey: "guide_bec_desc",
    color: "bg-lime-50 border-lime-200",
  },
  {
    slug: "sextortion-and-blackmail-scams",
    titleKey: "guide_sextortion_title",
    descKey: "guide_sextortion_desc",
    color: "bg-red-50 border-red-200",
  },
] as const;

export default async function GuidesPage() {
  const t = await getTranslations("guidesIndex");
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.avasc.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: "https://www.avasc.org/guides",
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t("h1")}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {t("intro")}
        </p>
      </header>

      <AiGuide />

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className={`group rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300 ${guide.color}`}
          >
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">{t(guide.titleKey)}</h2>
            <p className="mt-2 text-sm text-slate-600">{t(guide.descKey)}</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700 group-hover:text-slate-900">
              {t("readGuide")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t("questionsTitle")}</h2>
        <p className="mt-3 text-sm text-slate-600">
          {t("questionsBody")}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/report"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {t("reportCta")}
          </Link>
          <Link
            href="/recovery"
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            {t("recoveryCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}

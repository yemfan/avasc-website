import { Link } from "@/i18n/navigation";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { localeAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_investment_scam_red_flags");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description,
      type: "article",
      url: "https://www.avasc.org/guides/investment-scam-red-flags",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/guides/investment-scam-red-flags"),
  };
}

export default async function InvestmentScamPage() {
  const t = await getTranslations("guide_investment_scam_red_flags");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Investment Scam Red Flags: How to Spot Fraudulent Schemes",
    description:
      "Learn to identify Ponzi schemes, unregistered investments, pressure-based tactics, and guaranteed return promises.",
    author: {
      "@type": "Organization",
      name: "AVASC",
      url: "https://www.avasc.org",
    },
    datePublished: "2025-01-01",
    publisher: {
      "@type": "Organization",
      name: "AVASC",
    },
  };

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
      {
        "@type": "ListItem",
        position: 3,
        name: "Investment Scam Red Flags",
        item: "https://www.avasc.org/guides/investment-scam-red-flags",
      },
    ],
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Link
        href="/guides"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("backToGuides")}
      </Link>

      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {t("h1")}
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          {t("intro")}
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("universalHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("universalIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("uf1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("uf1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("uf2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("uf2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("uf3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("uf3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("uf4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("uf4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("uf5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("uf5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("uf6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("uf6Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("uf7Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("uf7Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("uf8Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("uf8Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("typesHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("ponziTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("ponziBody")}
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium">{t("warningSignsLabel")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("ponziSign1")}</li>
                <li>{t("ponziSign2")}</li>
                <li>{t("ponziSign3")}</li>
                <li>{t("ponziSign4")}</li>
                <li>{t("ponziSign5")}</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("affinityTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("affinityBody")}
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium">{t("warningSignsLabel")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("affinitySign1")}</li>
                <li>{t("affinitySign2")}</li>
                <li>{t("affinitySign3")}</li>
                <li>{t("affinitySign4")}</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("pumpTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("pumpBody")}
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium">{t("warningSignsLabel")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("pumpSign1")}</li>
                <li>{t("pumpSign2")}</li>
                <li>{t("pumpSign3")}</li>
                <li>{t("pumpSign4")}</li>
                <li>{t("pumpSign5")}</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("forexTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("forexBody")}
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium">{t("warningSignsLabel")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("forexSign1")}</li>
                <li>{t("forexSign2")}</li>
                <li>{t("forexSign3")}</li>
                <li>{t("forexSign4")}</li>
                <li>{t("forexSign5")}</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("realEstateTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("realEstateBody")}
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium">{t("warningSignsLabel")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("realEstateSign1")}</li>
                <li>{t("realEstateSign2")}</li>
                <li>{t("realEstateSign3")}</li>
                <li>{t("realEstateSign4")}</li>
                <li>{t("realEstateSign5")}</li>
              </ul>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("questionsHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("questionsIntro")}
          </p>

          <ul className="space-y-3 text-slate-700">
            <li>
              <span className="font-medium">{t("q1Label")}</span> {t("q1Body")}
            </li>
            <li>
              <span className="font-medium">{t("q2Label")}</span> {t("q2Body")}
            </li>
            <li>
              <span className="font-medium">{t("q3Label")}</span> {t("q3Body")}
            </li>
            <li>
              <span className="font-medium">{t("q4Label")}</span> {t("q4Body")}
            </li>
            <li>
              <span className="font-medium">{t("q5Label")}</span> {t("q5Body")}
            </li>
            <li>
              <span className="font-medium">{t("q6Label")}</span> {t("q6Body")}
            </li>
            <li>
              <span className="font-medium">{t("q7Label")}</span> {t("q7Body")}
            </li>
            <li>
              <span className="font-medium">{t("q8Label")}</span> {t("q8Body")}
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("verifyHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify5Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("pressureHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("pressureIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("fomoTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("fomoBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("socialProofTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("socialProofBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("exclusivityTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("exclusivityBody")}
            </p>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">{t("bestResponseTitle")}</h3>
            <p className="mt-3 text-red-950/90">
              {t("bestResponseBody")}
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">{t("takeawayTitle")}</h2>
          <p className="mt-3 text-amber-950/90">
            {t("takeawayBody")}
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">{t("reportHeading")}</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("searchDbTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("searchDbBody")}</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("reportFraudTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("reportFraudBody")}</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            {t.rich("recoveryNote", {
              link: (chunks) => (
                <Link href="/recovery" className="font-medium text-slate-900 underline underline-offset-2">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>
      <RelatedGuides currentSlug="investment-scam-red-flags" />
    </div>
  );
}

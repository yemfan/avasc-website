import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_romance_scam_warning_signs");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description,
      type: "article",
      url: "https://www.avasc.org/guides/romance-scam-warning-signs",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: "/guides/romance-scam-warning-signs",
    },
  };
}

export default async function RomanceScamPage() {
  const t = await getTranslations("guide_romance_scam_warning_signs");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Romance Scam Warning Signs: How to Protect Yourself Online",
    description: "Learn to recognize catfishing, love bombing, and financial manipulation in online dating.",
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
        name: "Romance Scam Warning Signs",
        item: "https://www.avasc.org/guides/romance-scam-warning-signs",
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
          <h2 className="text-2xl font-semibold text-slate-900">{t("section1Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section1Para1")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("flag1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("flag1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("flag2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("flag2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("flag3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("flag3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("flag4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("flag4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("flag5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("flag5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("flag6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("flag6Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section2Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section2Para1")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("loveBombWhatTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("loveBombItem1")}</li>
              <li>{t("loveBombItem2")}</li>
              <li>{t("loveBombItem3")}</li>
              <li>{t("loveBombItem4")}</li>
              <li>{t("loveBombItem5")}</li>
              <li>{t("loveBombItem6")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("loveBombPurposeTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("loveBombPurposeBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("loveBombVulnTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("loveBombVulnBody")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section3Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section3Para1")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("finReqTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("finReqItem1")}</li>
              <li>{t("finReqItem2")}</li>
              <li>{t("finReqItem3")}</li>
              <li>{t("finReqItem4")}</li>
              <li>{t("finReqItem5")}</li>
              <li>{t("finReqItem6")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("finEscalationTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("finEscalationBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("finResistanceTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("finResistanceBody")}
            </p>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">{t("finWarningTitle")}</h3>
            <p className="mt-2 text-red-950/90">
              {t("finWarningBody")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section4Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section4Para1")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("persona1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("persona1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("persona2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("persona2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("persona3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("persona3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("persona4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("persona4Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section5Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section5Para1")}
          </p>

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
          <h2 className="text-2xl font-semibold text-slate-900">{t("section6Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("suspect1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("suspect1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("suspect2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("suspect2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("suspect3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("suspect3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("suspect4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t.rich("suspect4Body", {
                link: (chunks) => (
                  <a
                    href="https://reportfraud.ftc.gov"
                    className="font-medium text-slate-900 underline underline-offset-2"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">{t("reassuranceTitle")}</h2>
          <p className="mt-3 text-amber-950/90">
            {t("reassuranceBody")}
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">{t("takeActionHeading")}</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("actionDatabaseTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("actionDatabaseBody")}</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("actionReportTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("actionReportBody")}</p>
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
    </div>
  );
}

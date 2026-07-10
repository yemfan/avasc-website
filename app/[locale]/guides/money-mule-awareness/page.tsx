import { Link } from "@/i18n/navigation";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { localeAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_money_mule_awareness");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "article",
      url: "https://www.avasc.org/guides/money-mule-awareness",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/guides/money-mule-awareness"),
  };
}

export default async function MoneyMuleAwarenessPage() {
  const t = await getTranslations("guide_money_mule_awareness");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Money Mule Scams: How Criminals Use Innocent People to Move Money",
    description:
      "Learn what money mule scams are and how to avoid becoming involved in money laundering.",
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
        name: "Money Mule Awareness",
        item: "https://www.avasc.org/guides/money-mule-awareness",
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
            <h3 className="font-semibold text-slate-900">{t("section1CardTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section1CardBody")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section2Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section2Para1")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section2Card1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section2Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section2Card2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section2Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section2Card3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section2Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section2Card4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section2Card4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section2Card5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section2Card5Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section3Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section3Card1Title")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("section3Card1Item1")}</li>
              <li>{t("section3Card1Item2")}</li>
              <li>{t("section3Card1Item3")}</li>
              <li>{t("section3Card1Item4")}</li>
              <li>{t("section3Card1Item5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section3Card2Title")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("section3Card2Item1")}</li>
              <li>{t("section3Card2Item2")}</li>
              <li>{t("section3Card2Item3")}</li>
              <li>{t("section3Card2Item4")}</li>
              <li>{t("section3Card2Item5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section3Card3Title")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("section3Card3Item1")}</li>
              <li>{t("section3Card3Item2")}</li>
              <li>{t("section3Card3Item3")}</li>
              <li>{t("section3Card3Item4")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section4Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section4Para1")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section4Card1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section4Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section4Card2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section4Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section4Card3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section4Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section4Card4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section4Card4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section4Card5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section4Card5Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section5Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section5Card1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section5Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section5Card2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section5Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section5Card3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section5Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section5Card4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section5Card4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section5Card5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section5Card5Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section6Heading")}</h2>

          <ul className="space-y-2 text-slate-700">
            <li>• {t("section6Item1")}</li>
            <li>• {t("section6Item2")}</li>
            <li>• {t("section6Item3")}</li>
            <li>• {t("section6Item4")}</li>
            <li>• {t("section6Item5")}</li>
            <li>• {t("section6Item6")}</li>
            <li>• {t("section6Item7")}</li>
            <li>• {t("section6Item8")}</li>
            <li>• {t("section6Item9")}</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">{t("takeawayTitle")}</h2>
          <p className="mt-3 text-amber-950/90">
            {t("takeawayBody")}
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">{t("whatsNextHeading")}</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("nextReportTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("nextReportBody")}</p>
          </Link>

          <Link
            href="/recovery"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("nextRecoveryTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("nextRecoveryBody")}</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            {t("nextLegalNote")}
          </p>
        </div>
      </div>
      <RelatedGuides currentSlug="money-mule-awareness" />
    </div>
  );
}

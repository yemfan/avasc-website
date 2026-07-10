import { Link } from "@/i18n/navigation";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { localeAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_how_to_identify_a_scam");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description,
      type: "article",
      url: "https://www.avasc.org/guides/how-to-identify-a-scam",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/guides/how-to-identify-a-scam"),
  };
}

export default async function HowToIdentifyScamPage() {
  const t = await getTranslations("guide_how_to_identify_a_scam");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Identify a Scam: Warning Signs Everyone Should Know",
    description:
      "Learn the common red flags, pressure tactics, and suspicious offers that indicate you may be targeted by scammers.",
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
        name: "How to Identify a Scam",
        item: "https://www.avasc.org/guides/how-to-identify-a-scam",
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
            <h3 className="font-semibold text-slate-900">{t("sign1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign6Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("pressureHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("pressureIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("pressure1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("pressure1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("pressure2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("pressure2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("pressure3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("pressure3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("pressure4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("pressure4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("pressure5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("pressure5Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("byTypeHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("investmentTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("investment1")}</li>
              <li>{t("investment2")}</li>
              <li>{t("investment3")}</li>
              <li>{t("investment4")}</li>
              <li>{t("investment5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("romanceTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("romance1")}</li>
              <li>{t("romance2")}</li>
              <li>{t("romance3")}</li>
              <li>{t("romance4")}</li>
              <li>{t("romance5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("cryptoTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("crypto1")}</li>
              <li>{t("crypto2")}</li>
              <li>{t("crypto3")}</li>
              <li>{t("crypto4")}</li>
              <li>{t("crypto5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("techSupportTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("techSupport1")}</li>
              <li>{t("techSupport2")}</li>
              <li>{t("techSupport3")}</li>
              <li>{t("techSupport4")}</li>
              <li>{t("techSupport5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("jobOfferTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("jobOffer1")}</li>
              <li>{t("jobOffer2")}</li>
              <li>{t("jobOffer3")}</li>
              <li>{t("jobOffer4")}</li>
              <li>{t("jobOffer5")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("instinctsHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("instinctsIntro")}
          </p>
          <ul className="space-y-2 text-slate-700">
            <li>{t("instinct1")}</li>
            <li>{t("instinct2")}</li>
            <li>{t("instinct3")}</li>
            <li>{t("instinct4")}</li>
            <li>{t("instinct5")}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("verifyHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("verifyIntro")}
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
            href="/guides/what-to-do-if-youve-been-scammed"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("nextCard1Title")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("nextCard1Body")}</p>
          </Link>

          <Link
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("nextCard2Title")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("nextCard2Body")}</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            {t.rich("reportFooter", {
              report: (chunks) => (
                <Link href="/report" className="font-medium text-slate-900 underline underline-offset-2">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>
      <RelatedGuides currentSlug="how-to-identify-a-scam" />
    </div>
  );
}

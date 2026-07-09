import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_elder_fraud_prevention");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description,
      type: "article",
      url: "https://www.avasc.org/guides/elder-fraud-prevention",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: "/guides/elder-fraud-prevention",
    },
  };
}

export default async function ElderFraudPage() {
  const t = await getTranslations("guide_elder_fraud_prevention");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Elder Fraud Prevention: Protecting Seniors from Scams",
    description:
      "Learn about scams targeting seniors, tech support fraud, Medicare fraud, the grandparent scam, and safeguards for protecting older adults.",
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
        name: "Elder Fraud Prevention",
        item: "https://www.avasc.org/guides/elder-fraud-prevention",
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
          <h2 className="text-2xl font-semibold text-slate-900">{t("whyHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("whyIntro")}
          </p>

          <ul className="space-y-2 text-slate-700">
            <li>• <span className="font-medium">{t("whyReason1Label")}</span> {t("whyReason1Body")}</li>
            <li>• <span className="font-medium">{t("whyReason2Label")}</span> {t("whyReason2Body")}</li>
            <li>• <span className="font-medium">{t("whyReason3Label")}</span> {t("whyReason3Body")}</li>
            <li>• <span className="font-medium">{t("whyReason4Label")}</span> {t("whyReason4Body")}</li>
            <li>• <span className="font-medium">{t("whyReason5Label")}</span> {t("whyReason5Body")}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("commonHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("grandparentTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("grandparentBody")}
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">{t("redFlagsLabel")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("grandparentFlag1")}</li>
                <li>{t("grandparentFlag2")}</li>
                <li>{t("grandparentFlag3")}</li>
                <li>{t("grandparentFlag4")}</li>
                <li>{t("grandparentFlag5")}</li>
              </ul>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-600">{t("howToPreventLabel")}</p>
            <p className="mt-1 text-sm text-slate-600">
              {t("grandparentPrevent")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("techTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("techBody")}
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">{t("redFlagsLabel")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("techFlag1")}</li>
                <li>{t("techFlag2")}</li>
                <li>{t("techFlag3")}</li>
                <li>{t("techFlag4")}</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("irsTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("irsBody")}
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">{t("redFlagsLabel")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("irsFlag1")}</li>
                <li>{t("irsFlag2")}</li>
                <li>{t("irsFlag3")}</li>
                <li>{t("irsFlag4")}</li>
                <li>{t("irsFlag5")}</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("medicareTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("medicareBody")}
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">{t("redFlagsLabel")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("medicareFlag1")}</li>
                <li>{t("medicareFlag2")}</li>
                <li>{t("medicareFlag3")}</li>
                <li>{t("medicareFlag4")}</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("lotteryTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("lotteryBody")}
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">{t("redFlagsLabel")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("lotteryFlag1")}</li>
                <li>{t("lotteryFlag2")}</li>
                <li>{t("lotteryFlag3")}</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("romanceTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("romanceBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("homeTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("homeBody")}
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">{t("redFlagsLabel")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("homeFlag1")}</li>
                <li>{t("homeFlag2")}</li>
                <li>{t("homeFlag3")}</li>
                <li>{t("homeFlag4")}</li>
              </ul>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("protectHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("protect1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("protect1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("protect2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("protect2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("protect3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("protect3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("protect4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("protect4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("protect5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("protect5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("protect6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("protect6Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("protect7Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("protect7Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("legalHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("legal1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("legal1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("legal2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("legal2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("legal3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("legal3Body")}
            </p>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">{t("legalWarnTitle")}</h3>
            <p className="mt-3 text-red-950/90">
              {t("legalWarnBody")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("ifScammedHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("ifScammed1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("ifScammed1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("ifScammed2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("ifScammed2Body")}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>{t("ifScammed2Item1")}</li>
              <li>{t("ifScammed2Item2")}</li>
              <li>{t("ifScammed2Item3")}</li>
              <li>{t("ifScammed2Item4")}</li>
              <li>{t("ifScammed2Item5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("ifScammed3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("ifScammed3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("ifScammed4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("ifScammed4Body")}
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">{t("takeawayHeading")}</h2>
          <p className="mt-3 text-amber-950/90">
            {t("takeawayBody")}
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">{t("resourcesHeading")}</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("reportCardTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("reportCardBody")}</p>
          </Link>

          <Link
            href="/recovery"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("recoveryCardTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("recoveryCardBody")}</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <p className="text-sm font-medium text-slate-900">{t("additionalResourcesLabel")}</p>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>• {t("resource1")}</li>
            <li>• {t("resource2")}</li>
            <li>• {t("resource3")}</li>
            <li>• {t("resource4")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

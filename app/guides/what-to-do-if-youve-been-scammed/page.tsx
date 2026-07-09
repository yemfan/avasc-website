import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_what_to_do_if_youve_been_scammed");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description,
      type: "article",
      url: "https://www.avasc.org/guides/what-to-do-if-youve-been-scammed",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: "/guides/what-to-do-if-youve-been-scammed",
    },
  };
}

export default async function WhatToDoIfScammedPage() {
  const t = await getTranslations("guide_what_to_do_if_youve_been_scammed");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What to Do If You've Been Scammed: Step-by-Step Recovery Guide",
    description:
      "Immediate actions to take after a scam, how to report to authorities, document evidence, and access emotional support.",
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
        name: "What to Do If You've Been Scammed",
        item: "https://www.avasc.org/guides/what-to-do-if-youve-been-scammed",
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

      <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6">
        <h2 className="font-semibold text-red-950">{t("dangerHeading")}</h2>
        <p className="mt-2 text-sm text-red-950/90">
          {t("dangerBody")}
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("step1Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("step1Intro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step1Card1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step1Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step1Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step1Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step1Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step1Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step1Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step1Card4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step1Card5Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step1Card5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step1Card6Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step1Card6Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("step2Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("step2Intro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step2Card1Heading")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("step2Card1Item1")}</li>
              <li>{t("step2Card1Item2")}</li>
              <li>{t("step2Card1Item3")}</li>
              <li>{t("step2Card1Item4")}</li>
              <li>{t("step2Card1Item5")}</li>
              <li>{t("step2Card1Item6")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step2Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step2Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step2Card3Heading")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("step2Card3Item1")}</li>
              <li>{t("step2Card3Item2")}</li>
              <li>{t("step2Card3Item3")}</li>
              <li>{t("step2Card3Item4")}</li>
              <li>{t("step2Card3Item5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step2Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step2Card4Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("step3Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("step3Intro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step3Card1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step3Card1Body")}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-600">{t("step3Card1Online")}</p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step3Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step3Card2Body")}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-600">{t("step3Card2Online")}</p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step3Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step3Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step3Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step3Card4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step3Card5Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step3Card5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step3Card6Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step3Card6Body")}
            </p>
            <Link href="/report" className="mt-3 inline-block rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              {t("step3Card6Cta")}
            </Link>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step3Card7Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step3Card7Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("step4Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("step4Intro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step4Card1Heading")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("step4Card1Item1")}</li>
              <li>{t("step4Card1Item2")}</li>
              <li>{t("step4Card1Item3")}</li>
              <li>{t("step4Card1Item4")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step4Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step4Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step4Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step4Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step4Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step4Card4Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("step5Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("step5Intro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step5Card1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step5Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step5Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step5Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step5Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step5Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step5Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step5Card4Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("step6Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("step6Intro")}
          </p>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">{t("step6RedFlagsHeading")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-red-950/90">
              <li>{t("step6RedFlag1")}</li>
              <li>{t("step6RedFlag2")}</li>
              <li>{t("step6RedFlag3")}</li>
              <li>{t("step6RedFlag4")}</li>
              <li>{t("step6RedFlag5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step6ProtectHeading")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("step6Protect1")}</li>
              <li>{t("step6Protect2")}</li>
              <li>{t("step6Protect3")}</li>
              <li>{t("step6Protect4")}</li>
            </ul>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">{t("recoveryPossibleHeading")}</h2>
          <p className="mt-3 text-amber-950/90">
            {t("recoveryPossibleBody")}
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">{t("additionalResourcesHeading")}</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/recovery"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("resourceRecoveryTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("resourceRecoveryDesc")}</p>
          </Link>

          <Link
            href="/guides/how-to-identify-a-scam"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("resourceIdentifyTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("resourceIdentifyDesc")}</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            {t.rich("reportCta", {
              link: (chunks) => (
                <Link href="/report" className="font-medium text-slate-900 underline underline-offset-2">
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

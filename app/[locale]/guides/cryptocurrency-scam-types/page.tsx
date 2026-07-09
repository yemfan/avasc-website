import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_cryptocurrency_scam_types");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description,
      type: "article",
      url: "https://www.avasc.org/guides/cryptocurrency-scam-types",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: "/guides/cryptocurrency-scam-types",
    },
  };
}

export default async function CryptoScamPage() {
  const t = await getTranslations("guide_cryptocurrency_scam_types");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Common Cryptocurrency Scam Types and How to Avoid Them",
    description:
      "Learn about pig butchering, fake exchanges, pump and dump schemes, and cryptocurrency investment fraud.",
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
        name: "Cryptocurrency Scam Types",
        item: "https://www.avasc.org/guides/cryptocurrency-scam-types",
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
            {t("whyPara")}
          </p>

          <ul className="space-y-2 text-slate-700">
            <li>• <span className="font-medium">{t("whyItem1Label")}</span> {t("whyItem1Body")}</li>
            <li>• <span className="font-medium">{t("whyItem2Label")}</span> {t("whyItem2Body")}</li>
            <li>• <span className="font-medium">{t("whyItem3Label")}</span> {t("whyItem3Body")}</li>
            <li>• <span className="font-medium">{t("whyItem4Label")}</span> {t("whyItem4Body")}</li>
            <li>• <span className="font-medium">{t("whyItem5Label")}</span> {t("whyItem5Body")}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("pigHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("pigPara")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("pigHowTitle")}</h3>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-slate-700">
              <li><span className="font-medium">{t("pigStep1Label")}</span> {t("pigStep1Body")}</li>
              <li><span className="font-medium">{t("pigStep2Label")}</span> {t("pigStep2Body")}</li>
              <li><span className="font-medium">{t("pigStep3Label")}</span> {t("pigStep3Body")}</li>
              <li><span className="font-medium">{t("pigStep4Label")}</span> {t("pigStep4Body")}</li>
              <li><span className="font-medium">{t("pigStep5Label")}</span> {t("pigStep5Body")}</li>
              <li><span className="font-medium">{t("pigStep6Label")}</span> {t("pigStep6Body")}</li>
              <li><span className="font-medium">{t("pigStep7Label")}</span> {t("pigStep7Body")}</li>
            </ol>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">{t("pigWarnTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-red-950/90">
              <li>{t("pigWarn1")}</li>
              <li>{t("pigWarn2")}</li>
              <li>{t("pigWarn3")}</li>
              <li>{t("pigWarn4")}</li>
              <li>{t("pigWarn5")}</li>
              <li>{t("pigWarn6")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("fakeExHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("fakeExPara")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("fakeExLookTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("fakeExLook1")}</li>
              <li>{t("fakeExLook2")}</li>
              <li>{t("fakeExLook3")}</li>
              <li>{t("fakeExLook4")}</li>
              <li>{t("fakeExLook5")}</li>
              <li>{t("fakeExLook6")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("fakeExVerifyTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("fakeExVerify1")}</li>
              <li>{t("fakeExVerify2")}</li>
              <li>{t("fakeExVerify3")}</li>
              <li>{t("fakeExVerify4")}</li>
              <li>{t("fakeExVerify5")}</li>
              <li>{t("fakeExVerify6")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("pumpHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("pumpPara")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("pumpHowTitle")}</h3>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-slate-700">
              <li><span className="font-medium">{t("pumpStep1Label")}</span> {t("pumpStep1Body")}</li>
              <li><span className="font-medium">{t("pumpStep2Label")}</span> {t("pumpStep2Body")}</li>
              <li><span className="font-medium">{t("pumpStep3Label")}</span> {t("pumpStep3Body")}</li>
              <li><span className="font-medium">{t("pumpStep4Label")}</span> {t("pumpStep4Body")}</li>
            </ol>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">{t("pumpFlagsTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-red-950/90">
              <li>{t("pumpFlag1")}</li>
              <li>{t("pumpFlag2")}</li>
              <li>{t("pumpFlag3")}</li>
              <li>{t("pumpFlag4")}</li>
              <li>{t("pumpFlag5")}</li>
              <li>{t("pumpFlag6")}</li>
              <li>{t("pumpFlag7")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("phishHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("phishPara")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("phishTacticsTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("phishTactic1")}</li>
              <li>{t("phishTactic2")}</li>
              <li>{t("phishTactic3")}</li>
              <li>{t("phishTactic4")}</li>
              <li>{t("phishTactic5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("phishProtectTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("phishProtect1")}</li>
              <li>{t("phishProtect2")}</li>
              <li>{t("phishProtect3")}</li>
              <li>{t("phishProtect4")}</li>
              <li>{t("phishProtect5")}</li>
              <li>{t("phishProtect6")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("botsHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("botsPara")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("botsFlagsTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("botsFlag1")}</li>
              <li>{t("botsFlag2")}</li>
              <li>{t("botsFlag3")}</li>
              <li>{t("botsFlag4")}</li>
              <li>{t("botsFlag5")}</li>
              <li>{t("botsFlag6")}</li>
              <li>{t("botsFlag7")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("botsLegitTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("botsLegit1")}</li>
              <li>{t("botsLegit2")}</li>
              <li>{t("botsLegit3")}</li>
              <li>{t("botsLegit4")}</li>
              <li>{t("botsLegit5")}</li>
              <li>{t("botsLegit6")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("nftHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("nftPara")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("nftTacticsTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("nftTactic1")}</li>
              <li>{t("nftTactic2")}</li>
              <li>{t("nftTactic3")}</li>
              <li>{t("nftTactic4")}</li>
              <li>{t("nftTactic5")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("securityHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sec1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sec1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sec2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sec2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sec3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sec3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sec4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sec4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sec5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sec5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sec6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sec6Body")}
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">{t("lostHeading")}</h2>
          <p className="mt-3 text-amber-950/90">
            {t("lostBody")}
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">{t("nextStepsHeading")}</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("nextDatabaseTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("nextDatabaseBody")}</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("nextReportTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("nextReportBody")}</p>
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

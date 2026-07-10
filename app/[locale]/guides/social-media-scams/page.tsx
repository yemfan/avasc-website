import { Link } from "@/i18n/navigation";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { localeAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_social_media_scams");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description,
      type: "article",
      url: "https://www.avasc.org/guides/social-media-scams",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/guides/social-media-scams"),
  };
}

export default async function SocialMediaScamsPage() {
  const t = await getTranslations("guide_social_media_scams");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Social Media Scams: How to Stay Safe on Facebook, Instagram, and TikTok",
    description:
      "Learn to recognize fake giveaways, impersonation accounts, marketplace fraud, QR code scams, and clickbait links on social media platforms.",
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
        name: "Social Media Scams",
        item: "https://www.avasc.org/guides/social-media-scams",
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
            <li>• <span className="font-medium">{t("whyItem1Label")}</span> {t("whyItem1Text")}</li>
            <li>• <span className="font-medium">{t("whyItem2Label")}</span> {t("whyItem2Text")}</li>
            <li>• <span className="font-medium">{t("whyItem3Label")}</span> {t("whyItem3Text")}</li>
            <li>• <span className="font-medium">{t("whyItem4Label")}</span> {t("whyItem4Text")}</li>
            <li>• <span className="font-medium">{t("whyItem5Label")}</span> {t("whyItem5Text")}</li>
            <li>• <span className="font-medium">{t("whyItem6Label")}</span> {t("whyItem6Text")}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("giveawayHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("giveawayIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("giveawayHowTitle")}</h3>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-slate-700">
              <li><span className="font-medium">{t("giveawayHow1Label")}</span> {t("giveawayHow1Text")}</li>
              <li><span className="font-medium">{t("giveawayHow2Label")}</span> {t("giveawayHow2Text")}</li>
              <li><span className="font-medium">{t("giveawayHow3Label")}</span> {t("giveawayHow3Text")}</li>
              <li><span className="font-medium">{t("giveawayHow4Label")}</span> {t("giveawayHow4Text")}</li>
              <li><span className="font-medium">{t("giveawayHow5Label")}</span> {t("giveawayHow5Text")}</li>
            </ol>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">{t("giveawaySpotTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-red-950/90">
              <li>{t("giveawaySpot1")}</li>
              <li>{t("giveawaySpot2")}</li>
              <li>{t("giveawaySpot3")}</li>
              <li>{t("giveawaySpot4")}</li>
              <li>{t("giveawaySpot5")}</li>
              <li>{t("giveawaySpot6")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("giveawayDoTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("giveawayDoBody")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("imperHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("imperIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("imperTacticsTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("imperTactic1")}</li>
              <li>{t("imperTactic2")}</li>
              <li>{t("imperTactic3")}</li>
              <li>{t("imperTactic4")}</li>
              <li>{t("imperTactic5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("imperIdTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li><span className="font-medium">{t("imperId1Label")}</span> {t("imperId1Text")}</li>
              <li><span className="font-medium">{t("imperId2Label")}</span> {t("imperId2Text")}</li>
              <li><span className="font-medium">{t("imperId3Label")}</span> {t("imperId3Text")}</li>
              <li><span className="font-medium">{t("imperId4Label")}</span> {t("imperId4Text")}</li>
              <li><span className="font-medium">{t("imperId5Label")}</span> {t("imperId5Text")}</li>
              <li><span className="font-medium">{t("imperId6Label")}</span> {t("imperId6Text")}</li>
            </ul>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">{t("imperRuleTitle")}</h3>
            <p className="mt-3 text-red-950/90">
              {t("imperRuleBody")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("marketHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("marketIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("marketCommonTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li><span className="font-medium">{t("marketCommon1Label")}</span> {t("marketCommon1Text")}</li>
              <li><span className="font-medium">{t("marketCommon2Label")}</span> {t("marketCommon2Text")}</li>
              <li><span className="font-medium">{t("marketCommon3Label")}</span> {t("marketCommon3Text")}</li>
              <li><span className="font-medium">{t("marketCommon4Label")}</span> {t("marketCommon4Text")}</li>
              <li><span className="font-medium">{t("marketCommon5Label")}</span> {t("marketCommon5Text")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("marketProtectTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("marketProtect1")}</li>
              <li>{t("marketProtect2")}</li>
              <li>{t("marketProtect3")}</li>
              <li>{t("marketProtect4")}</li>
              <li>{t("marketProtect5")}</li>
              <li>{t("marketProtect6")}</li>
              <li>{t("marketProtect7")}</li>
              <li>{t("marketProtect8")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("qrHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("qrIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("qrCommonTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("qrCommon1")}</li>
              <li>{t("qrCommon2")}</li>
              <li>{t("qrCommon3")}</li>
              <li>{t("qrCommon4")}</li>
              <li>{t("qrCommon5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("qrSafetyTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("qrSafety1")}</li>
              <li>{t("qrSafety2")}</li>
              <li>{t("qrSafety3")}</li>
              <li>{t("qrSafety4")}</li>
              <li>{t("qrSafety5")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("clickbaitHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("clickbaitIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("clickbaitCommonTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("clickbaitCommon1")}</li>
              <li>{t("clickbaitCommon2")}</li>
              <li>{t("clickbaitCommon3")}</li>
              <li>{t("clickbaitCommon4")}</li>
              <li>{t("clickbaitCommon5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("clickbaitAvoidTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("clickbaitAvoid1")}</li>
              <li>{t("clickbaitAvoid2")}</li>
              <li>{t("clickbaitAvoid3")}</li>
              <li>{t("clickbaitAvoid4")}</li>
              <li>{t("clickbaitAvoid5")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("romanceHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("romanceIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("romanceFlagsTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("romanceFlag1")}</li>
              <li>{t("romanceFlag2")}</li>
              <li>{t("romanceFlag3")}</li>
              <li>{t("romanceFlag4")}</li>
              <li>{t("romanceFlag5")}</li>
              <li>{t("romanceFlag6")}</li>
              <li>{t("romanceFlag7")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("romanceProtectTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("romanceProtect1")}</li>
              <li>{t("romanceProtect2")}</li>
              <li>{t("romanceProtect3")}</li>
              <li>{t("romanceProtect4")}</li>
              <li>{t("romanceProtect5")}</li>
              <li>{t("romanceProtect6")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("mlmHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("mlmIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("mlmWarningTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("mlmWarning1")}</li>
              <li>{t("mlmWarning2")}</li>
              <li>{t("mlmWarning3")}</li>
              <li>{t("mlmWarning4")}</li>
              <li>{t("mlmWarning5")}</li>
              <li>{t("mlmWarning6")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("generalHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("generalLimitTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("generalLimitBody")}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>{t("generalLimit1")}</li>
              <li>{t("generalLimit2")}</li>
              <li>{t("generalLimit3")}</li>
              <li>{t("generalLimit4")}</li>
              <li>{t("generalLimit5")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("generalPrivacyTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("generalPrivacyBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("generalFriendTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("generalFriendBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("generalDownloadTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("generalDownloadBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("generalReportTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("generalReportBody")}
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
        <h2 className="text-2xl font-semibold text-slate-900">{t("reportProtectHeading")}</h2>

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
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("reportScamTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("reportScamBody")}</p>
          </Link>
        </div>
      </div>
      <RelatedGuides currentSlug="social-media-scams" />
    </div>
  );
}

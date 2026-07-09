import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { localeAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_phishing_email_protection");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description,
      type: "article",
      url: "https://www.avasc.org/guides/phishing-email-protection",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/guides/phishing-email-protection"),
  };
}

export default async function PhishingProtectionPage() {
  const t = await getTranslations("guide_phishing_email_protection");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Protect Yourself from Phishing Emails and Fake Websites",
    description:
      "Learn to spot phishing emails, verify senders, check URLs, and secure your accounts with two-factor authentication.",
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
        name: "How to Protect Yourself from Phishing Emails and Fake Websites",
        item: "https://www.avasc.org/guides/phishing-email-protection",
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
          <h2 className="text-2xl font-semibold text-slate-900">{t("s1Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("s1Para1")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s1CardHeading")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("s1Item1")}</li>
              <li>{t("s1Item2")}</li>
              <li>{t("s1Item3")}</li>
              <li>{t("s1Item4")}</li>
              <li>{t("s1Item5")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("s2Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card1Para")}
            </p>
            <p className="mt-3 text-sm font-medium text-slate-600">{t("s2Card1ProTipLabel")}</p>
            <p className="mt-1 text-sm text-slate-600">
              {t("s2Card1ProTip")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card2Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card3Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card4Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card5Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card5Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card6Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card6Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card7Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card7Para")}
            </p>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">{t("s2RedFlagHeading")}</h3>
            <p className="mt-3 text-red-950/90">
              {t("s2RedFlagPara")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("s3Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("s3Intro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s3Card1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s3Card1Para")}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>{t("s3Card1Item1")}</li>
              <li>{t("s3Card1Item2")}</li>
              <li>{t("s3Card1Item3")}</li>
              <li>{t("s3Card1Item4")}</li>
            </ul>
            <p className="mt-3 text-slate-700">
              {t("s3Card1Para2")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s3Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s3Card2Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s3Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s3Card3Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s3Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s3Card4Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s3Card5Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s3Card5Para")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("s4Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s4Card1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s4Card1Para")}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>{t("s4Card1Item1")}</li>
              <li>{t("s4Card1Item2")}</li>
              <li>{t("s4Card1Item3")}</li>
              <li>{t("s4Card1Item4")}</li>
              <li>{t("s4Card1Item5")}</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              {t("s4Card1Note")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s4Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s4Card2Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s4Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s4Card3Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s4Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s4Card4Para")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("s5Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s5Card1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s5Card1Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s5Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s5Card2Para")}
            </p>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">{t("s5Card3Heading")}</h3>
            <div className="mt-3 text-red-950/90 space-y-3">
              <p>{t("s5Card3Para1")}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("s5Card3Item1")}</li>
                <li>{t("s5Card3Item2")}</li>
                <li>{t("s5Card3Item3")}</li>
              </ul>
              <p className="mt-2">{t("s5Card3Para2")}</p>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("s6Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s6Card1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s6Card1Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s6Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s6Card2Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s6Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s6Card3Para")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s6Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s6Card4Para")}
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">{t("goldenHeading")}</h2>
          <p className="mt-3 text-amber-950/90">
            {t("goldenPara")}
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">{t("takeActionHeading")}</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("action1Title")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("action1Desc")}</p>
          </Link>

          <Link
            href="/guides/how-to-identify-a-scam"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("action2Title")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("action2Desc")}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

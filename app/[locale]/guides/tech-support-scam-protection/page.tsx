import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { localeAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_tech_support_scam_protection");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description,
      type: "article",
      url: "https://www.avasc.org/guides/tech-support-scam-protection",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/guides/tech-support-scam-protection"),
  };
}

export default async function TechSupportScamProtectionPage() {
  const t = await getTranslations("guide_tech_support_scam_protection");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tech Support Scam Protection: Don't Fall for Fake Computer Warnings",
    description:
      "Learn to identify fake virus popups, scam phone calls, and remote access tricks targeting your devices.",
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
        name: "Tech Support Scam Protection",
        item: "https://www.avasc.org/guides/tech-support-scam-protection",
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
            <h3 className="font-semibold text-slate-900">{t("section1Card1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section1Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section1Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section1Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section1Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section1Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section1Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section1Card4Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section2Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section2Card1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section2Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section2Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section2Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section2Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section2Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section2Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section2Card4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section2Card5Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section2Card5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section2Card6Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section2Card6Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section3Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section3Para1")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section3Card1Heading")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t.rich("section3Card1Item1", { b: (chunks) => <strong>{chunks}</strong> })}</li>
              <li>{t.rich("section3Card1Item2", { b: (chunks) => <strong>{chunks}</strong> })}</li>
              <li>{t.rich("section3Card1Item3", { b: (chunks) => <strong>{chunks}</strong> })}</li>
              <li>{t.rich("section3Card1Item4", { b: (chunks) => <strong>{chunks}</strong> })}</li>
              <li>{t.rich("section3Card1Item5", { b: (chunks) => <strong>{chunks}</strong> })}</li>
              <li>{t.rich("section3Card1Item6", { b: (chunks) => <strong>{chunks}</strong> })}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section3Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section3Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section3Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section3Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section3Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section3Card4Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section4Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section4Card1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section4Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section4Card2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section4Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section4Card3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section4Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("section4Card4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("section4Card4Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section5Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section5Para1")}
          </p>

          <ul className="space-y-2 text-slate-700">
            <li>• {t("section5Item1")}</li>
            <li>• {t("section5Item2")}</li>
            <li>• {t("section5Item3")}</li>
            <li>• {t("section5Item4")}</li>
            <li>• {t("section5Item5")}</li>
            <li>• {t("section5Item6")}</li>
            <li>• {t("section5Item7")}</li>
            <li>• {t("section5Item8")}</li>
            <li>• {t("section5Item9")}</li>
            <li>• {t("section5Item10")}</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">{t("takeawayHeading")}</h2>
          <p className="mt-3 text-amber-950/90">
            {t("takeawayBody")}
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">{t("nextHeading")}</h2>

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
            {t.rich("footerNote", {
              link: (chunks) => (
                <Link
                  href="/guides/how-to-identify-a-scam"
                  className="font-medium text-slate-900 underline underline-offset-2"
                >
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

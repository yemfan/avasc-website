import { Link } from "@/i18n/navigation";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { localeAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_job_scam_warning_signs");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description,
      type: "article",
      url: "https://www.avasc.org/guides/job-scam-warning-signs",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/guides/job-scam-warning-signs"),
  };
}

export default async function JobScamWarningSignsPage() {
  const t = await getTranslations("guide_job_scam_warning_signs");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Job Scam Warning Signs: How to Spot Fake Employment Offers",
    description:
      "Learn to recognize fake job postings, work-from-home scams, and employment fraud.",
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
        name: "Job Scam Warning Signs",
        item: "https://www.avasc.org/guides/job-scam-warning-signs",
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
            {t("section1Intro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign5Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign6Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign6Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign7Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign7Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("sign8Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("sign8Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section2Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type5Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type6Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type6Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section3Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section3Intro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify1Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify2Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify3Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify4Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify5Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify6Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify6Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify7Heading")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify7Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section4Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section4Intro")}
          </p>

          <ul className="space-y-2 text-slate-700">
            <li>{t("interviewFlag1")}</li>
            <li>{t("interviewFlag2")}</li>
            <li>{t("interviewFlag3")}</li>
            <li>{t("interviewFlag4")}</li>
            <li>{t("interviewFlag5")}</li>
            <li>{t("interviewFlag6")}</li>
            <li>{t("interviewFlag7")}</li>
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
      <RelatedGuides currentSlug="job-scam-warning-signs" />
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_business_email_compromise");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "article",
      url: "https://www.avasc.org/guides/business-email-compromise",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: "/guides/business-email-compromise",
    },
  };
}

export default async function BusinessEmailCompromisePage() {
  const t = await getTranslations("guide_business_email_compromise");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Business Email Compromise (BEC): How Scammers Target Companies",
    description:
      "Learn about CEO fraud and how to protect your organization from business email compromise.",
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
        name: "Business Email Compromise",
        item: "https://www.avasc.org/guides/business-email-compromise",
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
          <h2 className="text-2xl font-semibold text-slate-900">{t("whatIsHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("whatIsPara")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("differsTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("differsBody")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("typesHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type6Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("type7Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("type7Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("researchHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("researchPara")}
          </p>

          <ul className="space-y-2 text-slate-700">
            <li>{t("research1")}</li>
            <li>{t("research2")}</li>
            <li>{t("research3")}</li>
            <li>{t("research4")}</li>
            <li>{t("research5")}</li>
            <li>{t("research6")}</li>
            <li>{t("research7")}</li>
            <li>{t("research8")}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("redFlagsHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("senderTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("sender1")}</li>
              <li>{t("sender2")}</li>
              <li>{t("sender3")}</li>
              <li>{t("sender4")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("contentTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("content1")}</li>
              <li>{t("content2")}</li>
              <li>{t("content3")}</li>
              <li>{t("content4")}</li>
              <li>{t("content5")}</li>
              <li>{t("content6")}</li>
              <li>{t("content7")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("processTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("process1")}</li>
              <li>{t("process2")}</li>
              <li>{t("process3")}</li>
              <li>{t("process4")}</li>
              <li>{t("process5")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("preventionHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("prevent1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("prevent1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("prevent2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("prevent2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("prevent3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("prevent3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("prevent4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("prevent4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("prevent5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("prevent5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("prevent6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("prevent6Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("prevent7Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("prevent7Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("prevent8Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("prevent8Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("suspectHeading")}</h2>

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
              {t("suspect4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-700">{t("suspect5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("suspect5Body")}
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
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("nextSearchTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("nextSearchBody")}</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            {t("footerNote")}
          </p>
        </div>
      </div>
    </div>
  );
}

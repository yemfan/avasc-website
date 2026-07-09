import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_online_shopping_scam_prevention");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description,
      type: "article",
      url: "https://www.avasc.org/guides/online-shopping-scam-prevention",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: "/guides/online-shopping-scam-prevention",
    },
  };
}

export default async function OnlineShoppingScamPreventionPage() {
  const t = await getTranslations("guide_online_shopping_scam_prevention");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Online Shopping Scam Prevention: How to Shop Safely Online",
    description:
      "Learn to identify fake websites, counterfeit products, and unsafe payment methods.",
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
        name: "Online Shopping Scam Prevention",
        item: "https://www.avasc.org/guides/online-shopping-scam-prevention",
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

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("scam1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("scam1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("scam2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("scam2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("scam3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("scam3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("scam4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("scam4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("scam5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("scam5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("scam6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("scam6Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("scam7Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("scam7Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section2Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section2Intro")}
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

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify6Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("verify7Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("verify7Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section3Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section3Intro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("practice1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("practice1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("practice2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("practice2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("practice3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("practice3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("practice4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("practice4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("practice5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("practice5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("practice6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("practice6Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section4Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("action1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("action1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("action2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("action2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("action3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t.rich("action3Body", {
                link: (chunks) => (
                  <a
                    href="https://reportfraud.ftc.gov"
                    className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("action4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("action4Body")}
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

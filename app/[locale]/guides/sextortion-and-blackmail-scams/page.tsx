import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { localeAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_sextortion_and_blackmail_scams");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "article",
      url: "https://www.avasc.org/guides/sextortion-and-blackmail-scams",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/guides/sextortion-and-blackmail-scams"),
  };
}

export default async function SextortionAndBlackmailScamsPage() {
  const t = await getTranslations("guide_sextortion_and_blackmail_scams");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Sextortion and Online Blackmail: What to Do and How to Get Help",
    description:
      "Learn about sextortion scams and how to respond if you've been targeted.",
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
        name: "Sextortion and Blackmail Scams",
        item: "https://www.avasc.org/guides/sextortion-and-blackmail-scams",
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
            {t("whatIsPara1")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("importantTruthTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("importantTruthBody")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("howHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("howMassTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("howMassBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("howSocialTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("howSocialBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("howDatingTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("howDatingBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("howDmTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("howDmBody")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("neverPayHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("neverPayIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("payMoreTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("payMoreBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("noEvidenceTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("noEvidenceBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("evenIfTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("evenIfBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("fundingTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("fundingBody")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("whatToDoHeading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step6Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("step7Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("step7Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("minorsHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("minorsIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("forMinorsTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("forMinorsBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("forParentsTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("forParentsBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("minorResourcesTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("minorResource1")}</li>
              <li>{t("minorResource2")}</li>
              <li>{t("minorResource3")}</li>
              <li>{t("minorResource4")}</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("supportHeading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("supportIntro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("therapyTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("therapyBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("hotlinesTitle")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>{t("hotline1")}</li>
              <li>{t("hotline2")}</li>
              <li>{t("hotline3")}</li>
              <li>{t("hotline4")}</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("communitiesTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("communitiesBody")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("notYourFaultTitle")}</h3>
            <p className="mt-2 text-slate-700">
              {t("notYourFaultBody")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("protectHeading")}</h2>

          <ul className="space-y-2 text-slate-700">
            <li>{t("protect1")}</li>
            <li>{t("protect2")}</li>
            <li>{t("protect3")}</li>
            <li>{t("protect4")}</li>
            <li>{t("protect5")}</li>
            <li>{t("protect6")}</li>
            <li>{t("protect7")}</li>
            <li>{t("protect8")}</li>
            <li>{t("protect9")}</li>
          </ul>
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
            href="/recovery"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("nextRecoveryTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("nextRecoveryBody")}</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <p className="text-sm text-slate-600">
            <strong>{t("crisisTitle")}</strong>
          </p>
          <p className="text-sm text-slate-600">
            {t.rich("crisisBody", {
              b: (chunks) => <strong>{chunks}</strong>,
              br: () => <br />,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

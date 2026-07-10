import { Link } from "@/i18n/navigation";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { localeAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide_identity_theft_protection");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "article",
      url: "https://www.avasc.org/guides/identity-theft-protection",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/guides/identity-theft-protection"),
  };
}

export default async function IdentityTheftProtectionPage() {
  const t = await getTranslations("guide_identity_theft_protection");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Identity Theft Protection: How to Safeguard Your Personal Information",
    description:
      "Learn how to protect your personal information and detect identity theft early.",
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
        name: "Identity Theft Protection",
        item: "https://www.avasc.org/guides/identity-theft-protection",
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
            <h3 className="font-semibold text-slate-900">{t("s1Card1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s1Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s1Card2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s1Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s1Card3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s1Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s1Card4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s1Card4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s1Card5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s1Card5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s1Card6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s1Card6Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section2Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s2Card5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s2Card5Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section3Heading")}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t("section3Intro")}
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s3Card1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s3Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s3Card2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s3Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s3Card3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s3Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s3Card4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s3Card4Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s3Card5Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s3Card5Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s3Card6Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s3Card6Body")}
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section4Heading")}</h2>

          <ul className="space-y-2 text-slate-700">
            <li>{t("s4Item1")}</li>
            <li>{t("s4Item2")}</li>
            <li>{t("s4Item3")}</li>
            <li>{t("s4Item4")}</li>
            <li>{t("s4Item5")}</li>
            <li>{t("s4Item6")}</li>
            <li>{t("s4Item7")}</li>
            <li>{t("s4Item8")}</li>
            <li>{t("s4Item9")}</li>
            <li>{t("s4Item10")}</li>
            <li>{t("s4Item11")}</li>
            <li>{t("s4Item12")}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">{t("section5Heading")}</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s5Card1Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s5Card1Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s5Card2Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s5Card2Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s5Card3Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s5Card3Body")}
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t("s5Card4Title")}</h3>
            <p className="mt-2 text-slate-700">
              {t("s5Card4Body")}
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
        <h2 className="text-2xl font-semibold text-slate-900">{t("nextTitle")}</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/recovery"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("next1Title")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("next1Body")}</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{t("next2Title")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("next2Body")}</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            {t.rich("relatedGuide", {
              link: (chunks) => (
                <Link href="/guides/how-to-identify-a-scam" className="font-medium text-slate-900 underline underline-offset-2">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>
      <RelatedGuides currentSlug="identity-theft-protection" />
    </div>
  );
}

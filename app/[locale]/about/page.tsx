import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { brand, brandImages } from "@/lib/brand-images";
import { localeAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://www.avasc.org/about",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/about"),
  };
}

export default function AboutPage() {
  const t = useTranslations("about");
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
        name: "About",
        item: "https://www.avasc.org/about",
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <header className="space-y-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Image
            src={brandImages.mark180}
            alt={brand.logoAltAbout}
            width={120}
            height={120}
            className="h-24 w-24 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-2 shadow-sm"
          />
          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {t("titlePrefix")} {brand.shortName}
              </h1>
              <p className="mt-1 text-sm font-medium text-[var(--avasc-text-muted)]">{brand.legalName}</p>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {t("intro")}
            </p>
          </div>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">{t("whatWeDo")}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-[var(--avasc-gold-light)]">
            <li>{t("do1")}</li>
            <li>{t("do2")}</li>
            <li>{t("do3")}</li>
            <li>
              {t.rich("do4", {
                alerts: (chunks) => (
                  <Link
                    href="/briefings"
                    className="text-[var(--avasc-gold-light)] underline underline-offset-2 hover:text-[var(--avasc-gold)]"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </li>
            <li>
              {t.rich("do5", {
                guides: (chunks) => (
                  <Link
                    href="/guides"
                    className="text-[var(--avasc-gold-light)] underline underline-offset-2 hover:text-[var(--avasc-gold)]"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </li>
            <li>{t("do6")}</li>
          </ul>
        </Card>
        <Card className="border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">{t("whatWeAreNot")}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>{t("not1")}</li>
            <li>{t("not2")}</li>
            <li>{t("not3")}</li>
            <li>{t("not4")}</li>
          </ul>
        </Card>
      </div>

      <Card className="border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">{t("privacyTitle")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t("privacyBody")}
        </p>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/report" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          {t("reportCta")}
        </Link>
        <Link
          href="/database"
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          {t("searchCta")}
        </Link>
      </div>
    </div>
  );
}

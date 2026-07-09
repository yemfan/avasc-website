import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { RecoveryAi } from "@/components/recovery/RecoveryAi";
import { localeAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("recovery");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://www.avasc.org/recovery",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/recovery"),
  };
}

export default function RecoveryPage() {
  const t = useTranslations("recovery");
  const modules = [
    {
      title: t("cryptoTitle"),
      points: [t("cryptoPoint1"), t("cryptoPoint2"), t("cryptoPoint3")],
    },
    {
      title: t("bankTitle"),
      points: [t("bankPoint1"), t("bankPoint2"), t("bankPoint3")],
    },
    {
      title: t("romanceTitle"),
      points: [t("romancePoint1"), t("romancePoint2"), t("romancePoint3")],
    },
    {
      title: t("fakeTitle"),
      points: [t("fakePoint1"), t("fakePoint2"), t("fakePoint3")],
    },
  ];

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
        name: "Recovery Center",
        item: "https://www.avasc.org/recovery",
      },
    ],
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[var(--avasc-gold-light)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("backToHome")}
      </Link>
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          {t.rich("intro", {
            report: (chunks) => (
              <Link href="/report" className="font-medium text-[var(--avasc-gold-light)] underline underline-offset-2">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </header>

      <RecoveryAi />

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((m) => (
          <section
            key={m.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{m.title}</h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-600">
              {m.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-sm text-amber-950">
        <p className="font-semibold">{t("evidenceTitle")}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-amber-950/90">
          <li>{t("evidence1")}</li>
          <li>{t("evidence2")}</li>
          <li>{t("evidence3")}</li>
          <li>{t("evidence4")}</li>
        </ul>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">{t("resourcesTitle")}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {t("resourcesBody")}
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <a
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">{t("ftcTitle")}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {t("ftcBody")}
            </p>
          </a>
          <a
            href="https://www.ic3.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">{t("ic3Title")}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {t("ic3Body")}
            </p>
          </a>
          <a
            href="https://www.identitytheft.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">{t("identityTitle")}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {t("identityBody")}
            </p>
          </a>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("nextStepsTitle")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/stories"
            className="rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-4 transition-colors hover:border-[var(--avasc-gold-light)]"
          >
            <h3 className="font-medium text-foreground">{t("storiesTitle")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("storiesBody")}
            </p>
          </Link>
          <Link
            href="/report"
            className="rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-4 transition-colors hover:border-[var(--avasc-gold-light)]"
          >
            <h3 className="font-medium text-foreground">{t("reportTitle")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("reportBody")}
            </p>
          </Link>
          <Link
            href="/database"
            className="rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-4 transition-colors hover:border-[var(--avasc-gold-light)]"
          >
            <h3 className="font-medium text-foreground">{t("databaseTitle")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("databaseBody")}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

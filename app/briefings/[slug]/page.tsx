import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

import { getPublishedBriefingBySlug } from "@/lib/briefings/queries";
import { translateBriefingView } from "@/lib/i18n/translate-briefing";
import type { Locale } from "@/i18n/config";
import { ReportCta } from "@/components/avasc/ReportCta";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.avasc.org").replace(/\/$/, "");

const DATE_LOCALE: Record<Locale, string> = { en: "en-US", es: "es-ES", zh: "zh-CN" };

type PageProps = {
  params: Promise<{ slug: string }>;
};

function metaDescription(text: string | null | undefined, fallback: string): string {
  const base = (text && text.trim()) || fallback;
  return base.length > 155 ? `${base.slice(0, 152)}…` : base;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const raw = await getPublishedBriefingBySlug(slug);
  if (!raw) {
    return { title: "Briefing not found" };
  }
  const briefing = await translateBriefingView(raw, locale);
  const description = metaDescription(briefing.summary || briefing.dek, briefing.title);
  const canonical = `/briefings/${briefing.slug}`;
  return {
    title: briefing.title,
    description,
    openGraph: {
      title: `${briefing.title} | AVASC`,
      description,
      type: "article",
      url: `${SITE_URL}${canonical}`,
      publishedTime: briefing.publishedAt.toISOString(),
      modifiedTime: briefing.updatedAt.toISOString(),
      images: ["/og-image.png"],
      ...(briefing.sources.length ? {} : {}),
    },
    twitter: { card: "summary_large_image", title: briefing.title, description, images: ["/og-image.png"] },
    alternates: { canonical },
  };
}

export default async function BriefingArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("briefings");
  const raw = await getPublishedBriefingBySlug(slug);

  if (!raw) {
    notFound();
  }

  const briefing = await translateBriefingView(raw, locale);
  const canonicalUrl = `${SITE_URL}/briefings/${briefing.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: briefing.title,
    description: briefing.summary || briefing.dek || briefing.title,
    datePublished: briefing.publishedAt.toISOString(),
    dateModified: briefing.updatedAt.toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    author: { "@type": "Organization", name: "AVASC", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "AVASC",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
    },
    ...(briefing.sources.length
      ? { citation: briefing.sources.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url })) }
      : {}),
  };

  const howToSchema = briefing.protectYourself.length
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to protect yourself — ${briefing.title}`,
        step: briefing.protectYourself.map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text,
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Briefings", item: `${SITE_URL}/briefings` },
      { "@type": "ListItem", position: 3, name: briefing.title, item: canonicalUrl },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {howToSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Link
        href="/briefings"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--avasc-text-secondary)] hover:text-[var(--avasc-gold-light)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("allBriefings")}
      </Link>

      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--avasc-gold-light)]/90">
          {briefing.periodLabel ?? t("thisWeekFallback")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{briefing.title}</h1>
        {briefing.dek ? (
          <p className="text-lg leading-relaxed text-[var(--avasc-text-secondary)]">{briefing.dek}</p>
        ) : null}
        <p className="text-xs text-[var(--avasc-text-muted)]">
          {t("published")}{" "}
          {briefing.publishedAt.toLocaleDateString(DATE_LOCALE[locale] ?? "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {briefing.keyPoints.length ? (
        <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--avasc-gold-light)]">
            {t("keyPoints")}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--avasc-text-secondary)]">
            {briefing.keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="space-y-8">
        {briefing.sections.map((section, i) => (
          <section key={i} className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
            {section.paragraphs.map((para, j) => (
              <p key={j} className="leading-relaxed text-[var(--avasc-text-secondary)]">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>

      {briefing.protectYourself.length ? (
        <section className="rounded-2xl border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.06] p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[var(--avasc-gold-light)]" aria-hidden />
            <h2 className="text-lg font-semibold text-white">{t("protectYourself")}</h2>
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--avasc-text-secondary)]">
            {briefing.protectYourself.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {briefing.sources.length ? (
        <section className="space-y-3 border-t border-[var(--avasc-border)] pt-6">
          <h2 className="text-lg font-semibold text-white">{t("sources")}</h2>
          <ul className="space-y-2 text-sm">
            {briefing.sources.map((source, i) => (
              <li key={i} className="flex items-start gap-2">
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avasc-text-muted)]" aria-hidden />
                <span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--avasc-text-secondary)] underline hover:text-[var(--avasc-gold-light)]"
                  >
                    {source.title}
                  </a>
                  {source.publisher ? (
                    <span className="text-[var(--avasc-text-muted)]"> — {source.publisher}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ReportCta />

      <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] p-6 text-sm text-[var(--avasc-text-secondary)]">
        {t.rich("detailDisclaimer", {
          report: (chunks) => (
            <Link href="/report" className="underline hover:text-[var(--avasc-gold-light)]">
              {chunks}
            </Link>
          ),
          recovery: (chunks) => (
            <Link href="/recovery" className="underline hover:text-[var(--avasc-gold-light)]">
              {chunks}
            </Link>
          ),
        })}
      </section>
    </article>
  );
}

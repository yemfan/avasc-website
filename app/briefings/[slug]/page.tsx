import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

import { getPublishedBriefingBySlug } from "@/lib/briefings/queries";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://avasc.org").replace(/\/$/, "");

type PageProps = {
  params: Promise<{ slug: string }>;
};

function metaDescription(text: string | null | undefined, fallback: string): string {
  const base = (text && text.trim()) || fallback;
  return base.length > 155 ? `${base.slice(0, 152)}…` : base;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const briefing = await getPublishedBriefingBySlug(slug);
  if (!briefing) {
    return { title: "Briefing not found" };
  }
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
      ...(briefing.sources.length ? {} : {}),
    },
    twitter: { card: "summary", title: briefing.title, description },
    alternates: { canonical },
  };
}

export default async function BriefingArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const briefing = await getPublishedBriefingBySlug(slug);

  if (!briefing) {
    notFound();
  }

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
        All briefings
      </Link>

      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--avasc-gold-light)]/90">
          {briefing.periodLabel ?? "This Week in Scams"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{briefing.title}</h1>
        {briefing.dek ? (
          <p className="text-lg leading-relaxed text-[var(--avasc-text-secondary)]">{briefing.dek}</p>
        ) : null}
        <p className="text-xs text-[var(--avasc-text-muted)]">
          Published{" "}
          {briefing.publishedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </header>

      {briefing.keyPoints.length ? (
        <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--avasc-gold-light)]">
            Key points
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
            <h2 className="text-lg font-semibold text-white">Protect yourself</h2>
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
          <h2 className="text-lg font-semibold text-white">Sources</h2>
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

      <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] p-6 text-sm text-[var(--avasc-text-secondary)]">
        This briefing is public-safe intelligence: it surfaces only indicators and patterns that are already
        public, alongside protective guidance — never a playbook for scammers. AVASC is not a law firm,
        investigator, or government agency, and this is not legal or financial advice. If you&apos;ve been
        targeted, you can{" "}
        <Link href="/report" className="underline hover:text-[var(--avasc-gold-light)]">
          report a scam
        </Link>{" "}
        or explore{" "}
        <Link href="/recovery" className="underline hover:text-[var(--avasc-gold-light)]">
          recovery resources
        </Link>
        .
      </section>
    </article>
  );
}

import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { StoryComments } from "@/components/stories/StoryComments";
import { getPrisma } from "@/lib/prisma";
import { getApprovedStoryBySlug } from "@/lib/public-stories";
import { translateFields } from "@/lib/i18n/translate-content";
import { localeAlternates } from "@/lib/i18n/alternates";
import type { Locale } from "@/i18n/config";

type PageProps = { params: Promise<{ slug: string }> };

const DATE_LOCALE: Record<Locale, string> = { en: "en-US", es: "es-ES", zh: "zh-CN" };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("stories");
  const prisma = getPrisma();
  const story = await getApprovedStoryBySlug(prisma, slug);
  if (!story) {
    return {
      title: "Story not found",
      description: "This survivor story is unavailable.",
    };
  }
  const { title: localizedTitle } = await translateFields("story", story.id, locale, {
    title: story.title,
  });
  const title = `${localizedTitle} | ${t("detailMetaSuffix")}`;
  const description = t("detailMetaDescription");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://www.avasc.org/stories/${slug}`,
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates(`/stories/${slug}`),
  };
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("stories");
  const prisma = getPrisma();
  const raw = await getApprovedStoryBySlug(prisma, slug);
  if (!raw) notFound();

  const localized = await translateFields("story", raw.id, locale, { title: raw.title, body: raw.body });
  const story = { ...raw, title: localized.title, body: localized.body };

  const truncatedBody = story.body.length > 160 ? story.body.slice(0, 160) + "…" : story.body;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: truncatedBody,
    datePublished: story.createdAt.toISOString(),
    url: `https://www.avasc.org/stories/${slug}`,
    author: {
      "@type": "Organization",
      name: "AVASC",
    },
    publisher: {
      "@type": "Organization",
      name: "AVASC",
      logo: {
        "@type": "ImageObject",
        url: "https://www.avasc.org/icon.png",
      },
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
        name: "Stories",
        item: "https://www.avasc.org/stories",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: story.title,
        item: `https://www.avasc.org/stories/${slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Link href="/stories" className="text-sm font-medium text-muted-foreground hover:text-[var(--avasc-gold-light)] hover:underline">
        ← {t("backToStories")}
      </Link>
      <Card className="border-slate-200 p-6 shadow-sm">
        <p className="text-xs text-[var(--avasc-text-muted)]">
          {t("published")} {story.createdAt.toLocaleDateString(DATE_LOCALE[locale] ?? "en-US")}
          {story.isAnonymous ? ` · ${t("sharedAnonymously")}` : ""}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">{story.title}</h1>
        <p className="mt-4 whitespace-pre-wrap leading-relaxed text-muted-foreground">{story.body}</p>
      </Card>
      <p className="text-xs text-[var(--avasc-text-muted)]">{t("moderationNotice")}</p>
      <StoryComments slug={story.slug} />
      <section className="mt-8 border-t border-[var(--avasc-border)] pt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("relatedResources")}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/report"
            className="rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-4 transition-colors hover:border-[var(--avasc-gold-light)]"
          >
            <h3 className="font-medium text-foreground">{t("reportSimilarTitle")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("reportSimilarDesc")}</p>
          </Link>
          <Link
            href="/database"
            className="rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-4 transition-colors hover:border-[var(--avasc-gold-light)]"
          >
            <h3 className="font-medium text-foreground">{t("searchDbTitle")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("searchDbDesc")}</p>
          </Link>
          <Link
            href="/recovery"
            className="rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-4 transition-colors hover:border-[var(--avasc-gold-light)]"
          >
            <h3 className="font-medium text-foreground">{t("recoveryTitle")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("recoveryDesc")}</p>
          </Link>
          <Link
            href="/guides/what-to-do-if-youve-been-scammed"
            className="rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-4 transition-colors hover:border-[var(--avasc-gold-light)]"
          >
            <h3 className="font-medium text-foreground">{t("whatToDoTitle")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("whatToDoDesc")}</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

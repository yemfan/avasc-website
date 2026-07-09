import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, Heart } from "lucide-react";

import { listRecentDailyPosts } from "@/lib/social/daily-queries";
import { translateMany } from "@/lib/i18n/translate-content";
import type { Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.avasc.org").replace(/\/$/, "");

/** BCP-47 tags for date formatting per app locale. */
const DATE_LOCALE: Record<Locale, string> = { en: "en-US", es: "es-ES", zh: "zh-CN" };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: `${SITE_URL}/blog`, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
    alternates: { canonical: "/blog" },
  };
}

function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(DATE_LOCALE[locale] ?? "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("blog");

  let posts: Awaited<ReturnType<typeof listRecentDailyPosts>> = [];
  try {
    posts = await listRecentDailyPosts(60);
  } catch {
    posts = [];
  }

  // Translate post bodies for the active locale (cached; English passes through).
  const translatedBodies = await translateMany(
    "blog_post",
    locale,
    posts.map((p) => ({ id: p.id, fields: { body: p.body } })),
  );
  const localized = posts.map((p, i) => ({
    ...p,
    body: translatedBodies[i]?.body ?? p.body,
    themeLabel: t.has(`themes.${p.theme}`) ? t(`themes.${p.theme}`) : p.themeLabel,
  }));

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: t("metaTitle"),
    url: `${SITE_URL}/blog`,
    isPartOf: { "@type": "WebSite", name: "AVASC", url: SITE_URL },
    blogPost: localized.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: `${p.themeLabel} — ${formatDate(p.date, locale)}`,
      datePublished: p.date,
      articleBody: p.body,
      url: `${SITE_URL}/blog`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--avasc-gold-light)]/90">
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{t("title")}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{t("intro")}</p>
      </header>

      {localized.length === 0 ? (
        <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 text-sm text-muted-foreground">
          <h2 className="text-lg font-medium text-foreground">{t("emptyTitle")}</h2>
          <p className="mt-2">
            {t.rich("emptyBody", {
              briefings: (chunks) => (
                <Link href="/briefings" className="underline hover:text-[var(--avasc-gold-light)]">
                  {chunks}
                </Link>
              ),
              guides: (chunks) => (
                <Link href="/guides" className="underline hover:text-[var(--avasc-gold-light)]">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {localized.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.08] px-2.5 py-0.5 font-semibold uppercase tracking-wide text-[var(--avasc-gold-light)]">
                  {p.themeLabel}
                </span>
                <span className="text-[var(--avasc-text-muted)]">{formatDate(p.date, locale)}</span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{p.body}</p>

              {p.hashtags.length > 0 ? (
                <p className="mt-3 text-xs text-[var(--avasc-gold-light)]/80">{p.hashtags.join(" ")}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-4">
                {p.linkUrl ? (
                  <a
                    href={p.linkUrl}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--avasc-gold-light)] hover:text-[var(--avasc-gold)]"
                  >
                    {t("readMore")}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : null}
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-[var(--avasc-gold-light)]"
                >
                  <Heart className="h-3.5 w-3.5" aria-hidden />
                  {t("support")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

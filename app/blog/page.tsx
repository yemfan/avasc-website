import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

import { listRecentDailyPosts } from "@/lib/social/daily-queries";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.avasc.org").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Daily Scam Watch — AVASC Blog",
  description:
    "AVASC's daily scam-awareness posts: a rotating look at scam spotlights, red flags, statistics, survivor stories, and where to get help.",
  openGraph: {
    title: "Daily Scam Watch — AVASC Blog",
    description:
      "Daily scam-awareness posts from AVASC — spotlights, red flags, stats, survivor stories, and help.",
    type: "website",
    url: `${SITE_URL}/blog`,
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof listRecentDailyPosts>> = [];
  try {
    posts = await listRecentDailyPosts(60);
  } catch {
    posts = [];
  }

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Daily Scam Watch — AVASC Blog",
    url: `${SITE_URL}/blog`,
    isPartOf: { "@type": "WebSite", name: "AVASC", url: SITE_URL },
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: `${p.themeLabel} — ${formatDate(p.date)}`,
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
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--avasc-gold-light)]/90">
          Daily Scam Watch
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">AVASC Blog</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          A daily scam-awareness post, rotating through spotlights, red flags, statistics, survivor
          stories, and where to get help — drawn from AVASC&apos;s own data and guidance.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 text-sm text-muted-foreground">
          <h2 className="text-lg font-medium text-foreground">Nothing here yet</h2>
          <p className="mt-2">
            The first daily post is on its way. In the meantime, explore{" "}
            <Link href="/briefings" className="underline hover:text-[var(--avasc-gold-light)]">
              Scam News
            </Link>{" "}
            or our{" "}
            <Link href="/guides" className="underline hover:text-[var(--avasc-gold-light)]">
              prevention guides
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.08] px-2.5 py-0.5 font-semibold uppercase tracking-wide text-[var(--avasc-gold-light)]">
                  {p.themeLabel}
                </span>
                <span className="text-[var(--avasc-text-muted)]">{formatDate(p.date)}</span>
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
                    Read more
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : null}
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-[var(--avasc-gold-light)]"
                >
                  <Heart className="h-3.5 w-3.5" aria-hidden />
                  Support AVASC
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

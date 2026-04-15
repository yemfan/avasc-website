import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StoryComments } from "@/components/stories/StoryComments";
import { getPrisma } from "@/lib/prisma";
import { getApprovedStoryBySlug } from "@/lib/public-stories";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const prisma = getPrisma();
  const story = await getApprovedStoryBySlug(prisma, slug);
  if (!story) {
    return {
      title: "Story not found",
      description: "This survivor story is unavailable.",
    };
  }
  return {
    title: `${story.title} | Survivor story`,
    description: "Moderated survivor story from the AVASC community.",
    openGraph: {
      title: `${story.title} | Survivor story`,
      description: "Moderated survivor story from the AVASC community.",
      type: "article",
      url: `https://avasc.org/stories/${slug}`,
    },
    twitter: {
      card: "summary",
    },
  };
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const prisma = getPrisma();
  const story = await getApprovedStoryBySlug(prisma, slug);
  if (!story) notFound();

  const truncatedBody = story.body.length > 160 ? story.body.slice(0, 160) + "…" : story.body;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: truncatedBody,
    datePublished: story.createdAt.toISOString(),
    url: `https://avasc.org/stories/${slug}`,
    author: {
      "@type": "Organization",
      name: "AVASC",
    },
    publisher: {
      "@type": "Organization",
      name: "AVASC",
      logo: {
        "@type": "ImageObject",
        url: "https://avasc.org/icon.png",
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
        item: "https://avasc.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Stories",
        item: "https://avasc.org/stories",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: story.title,
        item: `https://avasc.org/stories/${slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Link href="/stories" className="text-sm font-medium text-slate-600 hover:underline">
        ← Back to stories
      </Link>
      <Card className="border-slate-200 p-6 shadow-sm">
        <p className="text-xs text-slate-500">
          Published {story.createdAt.toLocaleDateString()}
          {story.isAnonymous ? " · Shared anonymously" : ""}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{story.title}</h1>
        <p className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-800">{story.body}</p>
      </Card>
      <p className="text-xs text-slate-500">
        Story content is moderated for safety and privacy. Personal contact details and financial identifiers are not
        allowed.
      </p>
      <StoryComments slug={story.slug} />
      <section className="mt-8 border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Related Resources</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/report"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">Report a Similar Scam</h3>
            <p className="mt-1 text-sm text-slate-600">
              Share your experience and help us identify scam patterns.
            </p>
          </Link>
          <Link
            href="/database"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">Search Our Scam Database</h3>
            <p className="mt-1 text-sm text-slate-600">
              Look up reported scam indicators and patterns.
            </p>
          </Link>
          <Link
            href="/recovery"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">Find Recovery Resources</h3>
            <p className="mt-1 text-sm text-slate-600">
              Get guidance on recovering from a scam.
            </p>
          </Link>
          <Link
            href="/guides/what-to-do-if-youve-been-scammed"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">What to Do If You've Been Scammed</h3>
            <p className="mt-1 text-sm text-slate-600">
              Step-by-step guide for scam victims.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

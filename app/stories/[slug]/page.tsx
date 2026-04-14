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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
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
    </div>
  );
}

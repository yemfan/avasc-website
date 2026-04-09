import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicIndicatorGroup } from "@/components/public/PublicIndicatorGroup";
import { PublicScamProfileHeader } from "@/components/public/PublicScamProfileHeader";
import { PublicScamProfileSummary } from "@/components/public/PublicScamProfileSummary";
import { FollowScamButton } from "@/components/alerts/FollowScamButton";
import { RelatedPublicProfiles } from "@/components/public/RelatedPublicProfiles";
import { ReportMatchingCaseCTA } from "@/components/public/ReportMatchingCaseCTA";
import { getPublicScamProfileBySlug } from "@/lib/public-database/public-profile";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublicScamProfileBySlug(slug);
  if (!profile) {
    return { title: "Pattern not found" };
  }
  const description = profile.summary.slice(0, 155) + (profile.summary.length > 155 ? "…" : "");
  return {
    title: profile.title,
    description,
    openGraph: {
      title: `${profile.title} | AVASC scam database`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: profile.title,
      description,
    },
  };
}

export default async function PublicScamProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getPublicScamProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <PublicScamProfileHeader profile={profile} />
        <PublicScamProfileSummary profile={profile} />

        <ReportMatchingCaseCTA matchedProfileSlug={profile.slug} />

        <FollowScamButton clusterId={profile.id} clusterTitle={profile.title} />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Public Indicators</h2>
          {profile.indicators.length === 0 ? (
            <div className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground shadow-sm">
              No public indicators are available for this profile yet.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {profile.indicators.map((group) => (
                <PublicIndicatorGroup key={group.type} group={group} />
              ))}
            </div>
          )}
        </section>

        <RelatedPublicProfiles profiles={profile.relatedProfiles} />

        <section className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground shadow-sm">
          Public profiles are based on anonymized reported patterns and moderated cluster data. AVASC does not guarantee
          that every fact pattern is identical, and AVASC is not a law firm.
        </section>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { PublicIndicatorGroup } from "@/components/public/PublicIndicatorGroup";
import { PublicScamProfileHeader } from "@/components/public/PublicScamProfileHeader";
import { PublicScamProfileSummary } from "@/components/public/PublicScamProfileSummary";
import { FollowScamButton } from "@/components/alerts/FollowScamButton";
import { RelatedPublicProfiles } from "@/components/public/RelatedPublicProfiles";
import { ReportMatchingCaseCTA } from "@/components/public/ReportMatchingCaseCTA";
import { getPublicScamProfileBySlug } from "@/lib/public-database/public-profile";
import { translateFields } from "@/lib/i18n/translate-content";
import type { Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/** Translate the prose fields of a scam profile for the active locale (cached). */
async function localizeProfile<
  T extends {
    id: string;
    title: string;
    summary: string;
    commonScript: string | null;
    redFlags: string | null;
    safetyWarning: string | null;
    recommendedNextStep: string | null;
  },
>(profile: T, locale: Locale): Promise<T> {
  const fields: Record<string, string> = { title: profile.title, summary: profile.summary };
  if (profile.commonScript) fields.commonScript = profile.commonScript;
  if (profile.redFlags) fields.redFlags = profile.redFlags;
  if (profile.safetyWarning) fields.safetyWarning = profile.safetyWarning;
  if (profile.recommendedNextStep) fields.recommendedNextStep = profile.recommendedNextStep;

  const t = await translateFields("scam_profile", profile.id, locale, fields);
  return {
    ...profile,
    title: t.title ?? profile.title,
    summary: t.summary ?? profile.summary,
    commonScript: profile.commonScript ? t.commonScript ?? profile.commonScript : profile.commonScript,
    redFlags: profile.redFlags ? t.redFlags ?? profile.redFlags : profile.redFlags,
    safetyWarning: profile.safetyWarning ? t.safetyWarning ?? profile.safetyWarning : profile.safetyWarning,
    recommendedNextStep: profile.recommendedNextStep
      ? t.recommendedNextStep ?? profile.recommendedNextStep
      : profile.recommendedNextStep,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const raw = await getPublicScamProfileBySlug(slug);
  if (!raw) {
    return { title: "Pattern not found" };
  }
  const profile = await localizeProfile(raw, locale);
  const description = profile.summary.slice(0, 155) + (profile.summary.length > 155 ? "…" : "");
  return {
    title: profile.title,
    description,
    openGraph: {
      title: `${profile.title} | AVASC scam database`,
      description,
      type: "article",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: profile.title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function PublicScamProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("database");
  const raw = await getPublicScamProfileBySlug(slug);

  if (!raw) {
    notFound();
  }

  const profile = await localizeProfile(raw, locale);

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
        name: "Scam Database",
        item: "https://www.avasc.org/database",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: profile.title,
        item: `https://www.avasc.org/database/${slug}`,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="space-y-6">
        <PublicScamProfileHeader profile={profile} />
        <PublicScamProfileSummary profile={profile} />

        <ReportMatchingCaseCTA matchedProfileSlug={profile.slug} />

        <FollowScamButton clusterId={profile.id} clusterTitle={profile.title} />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("publicIndicators")}</h2>
          {profile.indicators.length === 0 ? (
            <div className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground shadow-sm">
              {t("noIndicators")}
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
          {t("profileDisclaimer")}
        </section>
      </div>
    </main>
  );
}

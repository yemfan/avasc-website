import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReportMatchingCaseFlow } from "@/components/avasc/report/ReportMatchingCaseFlow";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("report");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://www.avasc.org/report",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: "/report",
    },
  };
}

type PageProps = {
  searchParams: Promise<{ matchedProfile?: string | string[] }>;
};

export default async function ReportPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = sp.matchedProfile;
  const matchedProfileSlug =
    typeof raw === "string" ? raw.trim() || undefined : Array.isArray(raw) ? raw[0]?.trim() || undefined : undefined;

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
        name: "Report a Scam",
        item: "https://www.avasc.org/report",
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-4xl py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ReportMatchingCaseFlow matchedProfileSlug={matchedProfileSlug} />
    </div>
  );
}

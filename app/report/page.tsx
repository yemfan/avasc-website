import type { Metadata } from "next";
import { ReportMatchingCaseFlow } from "@/components/avasc/report/ReportMatchingCaseFlow";

export const metadata: Metadata = {
  title: "Report a Scam | AVASC",
  description: "Submit a scam report confidentially. Your report helps protect others.",
  openGraph: {
    title: "Report a Scam | AVASC",
    description: "Submit a scam report confidentially. Your report helps protect others.",
    type: "website",
    url: "https://avasc.org/report",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/report",
  },
};

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
        item: "https://avasc.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Report a Scam",
        item: "https://avasc.org/report",
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

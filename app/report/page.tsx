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

  return (
    <div className="mx-auto w-full max-w-4xl py-6 sm:py-10">
      <ReportMatchingCaseFlow matchedProfileSlug={matchedProfileSlug} />
    </div>
  );
}

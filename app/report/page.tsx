import { ReportMatchingCaseFlow } from "@/components/avasc/report/ReportMatchingCaseFlow";

export const metadata = {
  title: "Report a scam | AVASC",
  description: "Structured scam report with privacy controls.",
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

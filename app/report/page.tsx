import { PageHeader } from "@/components/avasc/PageHeader";
import { ReportCaseForm } from "@/components/avasc/forms/ReportCaseForm";

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
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Public intake"
        title="Report Your Case"
        description="Submit a scam report so AVASC can review the pattern, support your next steps, and help protect others."
      />
      <ReportCaseForm matchedProfileSlug={matchedProfileSlug} />
    </div>
  );
}

import { ReportWizard } from "@/components/report/ReportWizard";

export const metadata = {
  title: "Report a scam | AVASC",
  description: "Multi-step scam report with evidence and privacy controls.",
};

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Report a scam</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Your detailed narrative is private by default. Public views only show anonymized summaries you approve.
        </p>
      </div>
      <ReportWizard />
    </div>
  );
}

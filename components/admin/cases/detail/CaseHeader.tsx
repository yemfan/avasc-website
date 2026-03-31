import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Button } from "@/components/ui/button";
import type { CaseStatus, CaseVisibility } from "@prisma/client";
import { CaseVisibilityStatusBadge, StatusBadge } from "./StatusBadge";
import { RiskBadge } from "./RiskBadge";

export function CaseHeader({
  caseId,
  title,
  status,
  visibility,
  riskLevel,
  showRiskBadge,
}: {
  caseId: string;
  title: string;
  status: CaseStatus;
  visibility: CaseVisibility;
  riskLevel: string;
  showRiskBadge: boolean;
}) {
  return (
    <header className="space-y-4 border-b border-slate-200 pb-6">
      <AdminBreadcrumbs
        items={[
          { label: "Overview", href: "/admin" },
          { label: "Cases", href: "/admin/cases" },
          { label: title },
        ]}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 font-mono text-xs text-slate-500">{caseId}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={status} />
          <CaseVisibilityStatusBadge visibility={visibility} />
          {showRiskBadge ? <RiskBadge level={riskLevel} /> : null}
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/cases/${caseId}`} className="inline-flex items-center gap-1.5">
              Victim-facing summary
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminCaseDetailRecord } from "@/lib/admin/case-detail-query";

type Submitter = AdminCaseDetailRecord["user"];

export function VictimContextCard({
  user,
  isAnonymousSubmit,
  allowFollowUp,
  allowLawEnforcementReferral,
  allowCaseMatching,
  allowAnonymizedPublicSearch,
}: {
  user: Submitter;
  isAnonymousSubmit: boolean;
  allowFollowUp: boolean;
  allowLawEnforcementReferral: boolean;
  allowCaseMatching: boolean;
  allowAnonymizedPublicSearch: boolean;
}) {
  const displayName =
    user.displayName?.trim() || user.email || "Reporter (name withheld)";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Victim context</CardTitle>
        <p className="text-xs text-slate-500">
          Email is staff-only. Do not copy into public narratives without consent.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Display name</p>
          <p className="mt-0.5 font-medium text-slate-900">{displayName}</p>
          {user.email ? (
            <p className="mt-1 font-mono text-xs text-slate-600">{user.email}</p>
          ) : null}
          <p className="mt-1 font-mono text-[11px] text-slate-400">{user.id}</p>
        </div>
        {isAnonymousSubmit ? (
          <Badge variant="warning">Flagged anonymous to other users</Badge>
        ) : null}
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Consents</p>
          <ul className="mt-2 grid gap-1.5 text-slate-700 sm:grid-cols-2">
            <ConsentRow label="Allow follow-up" ok={allowFollowUp} />
            <ConsentRow label="Law enforcement referral" ok={allowLawEnforcementReferral} />
            <ConsentRow label="Case matching" ok={allowCaseMatching} />
            <ConsentRow label="Anonymized publishing / search" ok={allowAnonymizedPublicSearch} />
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function ConsentRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs">
      <span>{label}</span>
      <span className={ok ? "font-medium text-emerald-700" : "text-slate-500"}>{ok ? "Yes" : "No"}</span>
    </li>
  );
}

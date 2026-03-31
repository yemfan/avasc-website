import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/admin/format";
import type { Prisma } from "@prisma/client";

type AuditRow = Prisma.AuditLogGetPayload<{
  include: { actor: { select: { email: true; name: true } } };
}>;

const ACTION_LABELS: Record<string, string> = {
  "case.updated": "Case updated",
  "case.moderation_approve_anonymized": "Approved anonymized publication",
  "case.moderation_keep_private": "Set visibility to private",
  "case.moderation_flag_escalation": "Flagged for escalation",
  "case.mark_reviewed": "Marked as reviewed",
  "case.cluster_linked": "Cluster linked",
  "case.cluster_created_and_linked": "Cluster created and linked",
  "case.cluster_suggestion_logged": "Cluster suggestion logged",
  "indicator.updated": "Indicator updated",
  "evidence.staff_review_updated": "Evidence review updated",
  "support.updated": "Support request updated",
};

function labelForAction(action: string): string {
  return ACTION_LABELS[action] ?? action.replace(/\./g, " · ");
}

export function AuditTimeline({ entries }: { entries: AuditRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Audit timeline</CardTitle>
        <p className="text-xs text-slate-500">Case, indicators, evidence, and related staff actions (recent).</p>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-slate-500">No audit entries yet.</p>
        ) : (
          <ol className="relative space-y-0 border-l border-slate-200 pl-6">
            {entries.map((a) => (
              <li key={a.id} className="pb-6 last:pb-0">
                <span
                  className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-white"
                  aria-hidden
                />
                <p className="text-sm font-medium text-slate-900">{labelForAction(a.action)}</p>
                <p className="text-xs text-slate-500">
                  {formatDate(a.createdAt)}
                  {" · "}
                  {a.actor?.email ?? a.actor?.name ?? "system"}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                  {a.entityType} · {a.entityId}
                </p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

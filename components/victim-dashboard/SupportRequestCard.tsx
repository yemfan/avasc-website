import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VictimSupportRow } from "@/lib/victim-dashboard/support";
import { supportStatusLabel, supportTypeLabel } from "@/lib/victim-dashboard/support-labels";

export function SupportRequestCard({ r }: { r: VictimSupportRow }) {
  const st = supportStatusLabel(r.status);
  return (
    <Card className="border-slate-200 p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{supportTypeLabel(r.supportType)}</Badge>
        <Badge variant="outline">{st.label}</Badge>
      </div>
      <p className="mt-3 text-sm text-slate-700">
        {r.caseTitle ? (
          <>
            Related case: <span className="font-medium text-slate-900">{r.caseTitle}</span>
          </>
        ) : (
          "General support (no case linked)"
        )}
      </p>
      <p className="mt-1 text-xs text-slate-500">Submitted {r.createdAt.toLocaleString()}</p>
      {st.helper ? <p className="mt-2 text-xs text-slate-500">{st.helper}</p> : null}
      {r.userSubmittedNote ? (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <span className="font-medium text-slate-800">Your message: </span>
          {r.userSubmittedNote}
        </p>
      ) : null}
    </Card>
  );
}

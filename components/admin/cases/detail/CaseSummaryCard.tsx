import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/admin/format";
import { CaseVisibilityStatusBadge, StatusBadge } from "./StatusBadge";
import type { AdminCaseDetailRecord } from "@/lib/admin/case-detail-query";

type CaseRow = Pick<
  AdminCaseDetailRecord,
  | "title"
  | "scamType"
  | "amountLost"
  | "currency"
  | "paymentMethod"
  | "initialContactChannel"
  | "jurisdiction"
  | "incidentStartDate"
  | "incidentEndDate"
  | "status"
  | "visibility"
>;

export function CaseSummaryCard({ c }: { c: CaseRow }) {
  const amountLabel =
    c.amountLost != null && c.currency
      ? `${c.currency} ${c.amountLost.toString()}`
      : "—";

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
        <CardTitle className="text-base">Case summary</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="font-normal">
            {c.scamType}
          </Badge>
          <StatusBadge status={c.status} />
          <CaseVisibilityStatusBadge visibility={c.visibility} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
        <Field label="Title" value={c.title} fullWidth />
        <Field label="Amount lost" value={amountLabel} />
        <Field label="Payment method" value={c.paymentMethod ?? "—"} />
        <Field label="Initial contact" value={c.initialContactChannel ?? "—"} />
        <Field label="Jurisdiction" value={c.jurisdiction ?? "—"} />
        <Field
          label="Incident window"
          value={`${formatDate(c.incidentStartDate)} → ${formatDate(c.incidentEndDate)}`}
        />
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : undefined}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 text-slate-800">{value}</p>
    </div>
  );
}

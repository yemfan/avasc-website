import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/admin/format";
import type { AdminCaseDetailRecord } from "@/lib/admin/case-detail-query";
import { submitSupportUpdate } from "@/app/admin/support/support-form-actions";

type SupportRow = AdminCaseDetailRecord["supportRequests"][number];

export function SupportPanel({
  requests,
  staffOptions,
  canEdit,
}: {
  requests: SupportRow[];
  staffOptions: { id: string; email: string | null; displayName: string | null }[];
  canEdit: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="text-base">Support requests</CardTitle>
          <p className="text-xs text-slate-500">Linked tickets for this case.</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/support">Support queue</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-sm text-slate-500">No support requests linked.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((r) => (
              <li key={r.id} className="rounded-lg border border-slate-100 p-4 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-slate-500">{r.supportType}</p>
                    <Badge variant="outline" className="mt-1 font-normal">
                      {r.status}
                    </Badge>
                    <p className="mt-2 text-xs text-slate-500">{formatDate(r.createdAt)}</p>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/support#${r.id}`}>Open in queue</Link>
                  </Button>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Requester: {r.user.email ?? r.user.displayName ?? r.user.id}
                </p>
                <p className="text-xs text-slate-500">
                  Assignee: {r.assignedTo?.email ?? r.assignedTo?.displayName ?? "—"}
                </p>
                {r.note ? (
                  <div className="mt-3 rounded-md border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-700">
                    <p className="font-medium text-slate-800">Note</p>
                    <p className="mt-1 whitespace-pre-wrap">{r.note}</p>
                  </div>
                ) : null}
                {canEdit ? (
                  <form action={submitSupportUpdate} className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    <input type="hidden" name="id" value={r.id} />
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs" htmlFor={`st-${r.id}`}>
                          Status
                        </Label>
                        <Input id={`st-${r.id}`} name="status" defaultValue={r.status} className="mt-1 h-9 text-xs" />
                      </div>
                      <div>
                        <Label className="text-xs" htmlFor={`as-${r.id}`}>
                          Assign to
                        </Label>
                        <select
                          id={`as-${r.id}`}
                          name="assignedToId"
                          defaultValue={r.assignedToId ?? ""}
                          className="mt-1 flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs"
                        >
                          <option value="">Unassigned</option>
                          {staffOptions.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.displayName || u.email || u.id}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs" htmlFor={`n-${r.id}`}>
                        Internal notes (staff only — not shown to victim)
                      </Label>
                      <Textarea
                        id={`n-${r.id}`}
                        name="note"
                        defaultValue={r.note ?? ""}
                        rows={2}
                        className="mt-1 text-xs"
                      />
                    </div>
                    <Button type="submit" size="sm" variant="secondary">
                      Update request
                    </Button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

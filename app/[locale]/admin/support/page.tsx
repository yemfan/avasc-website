import Link from "next/link";
import { SupportRequestStatus, type Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/admin/format";
import { submitSupportUpdate } from "./support-form-actions";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";
const SUPPORT_STATUS_OPTIONS = Object.values(SupportRequestStatus);

type SP = Record<string, string | string[] | undefined>;
function pick(sp: SP, k: string): string | undefined {
  const v = sp[k];
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

export default async function AdminSupportPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const statusFilter = pick(sp, "status");
  const prisma = getPrisma();
  const staff = await requireStaff();
  const edit = canMutate(staff.role);

  const where: Prisma.SupportRequestWhereInput = {};
  if (statusFilter && statusFilter.length) {
    const parsedStatus = SUPPORT_STATUS_OPTIONS.find((s) => s === statusFilter);
    if (parsedStatus) where.status = parsedStatus;
  }

  const rows = await prisma.supportRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 120,
    include: {
      user: { select: { id: true, email: true, displayName: true } },
      case: { select: { id: true, title: true } },
      assignedTo: { select: { id: true, email: true, displayName: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <AdminBreadcrumbs items={[{ label: "Overview", href: "/admin" }, { label: "Support" }]} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Support requests</h1>
        <p className="mt-1 text-sm text-slate-600">Operational queue for victim-requested help categories.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter by status</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex flex-wrap items-end gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={statusFilter ?? ""}
                className="mt-1 h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">All</option>
                {SUPPORT_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Apply</Button>
          </form>
        </CardContent>
      </Card>

      {rows.length === 0 ? (
        <AdminEmptyState title="No support requests" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Case</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Created</TableHead>
              {edit ? <TableHead>Update</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.supportType}</TableCell>
                <TableCell className="max-w-[160px] truncate text-sm">
                  {r.user.email ?? r.user.displayName ?? r.user.id}
                </TableCell>
                <TableCell>
                  {r.case ? (
                    <Link href={`/admin/cases/${r.case.id}`} className="text-sm hover:underline">
                      {r.case.title}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{r.status}</Badge>
                </TableCell>
                <TableCell className="max-w-[140px] truncate text-xs">
                  {r.assignedTo?.email ?? r.assignedTo?.displayName ?? "—"}
                </TableCell>
                <TableCell className="text-sm">{formatDate(r.createdAt)}</TableCell>
                {edit ? (
                  <TableCell className="min-w-[280px]">
                    <form action={submitSupportUpdate} className="flex flex-col gap-2">
                      <input type="hidden" name="id" value={r.id} />
                      <select
                        name="status"
                        defaultValue={r.status}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
                      >
                        {SUPPORT_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <Input
                        name="assignedToId"
                        defaultValue={r.assignedToId ?? ""}
                        placeholder="Assignee user UUID"
                        className="h-8 font-mono text-xs"
                      />
                      {r.note ? (
                        <p className="text-xs text-slate-600">
                          <span className="font-medium text-slate-800">Note: </span>
                          {r.note}
                        </p>
                      ) : null}
                      <Label className="text-xs">Internal notes (staff only)</Label>
                      <Textarea name="note" defaultValue={r.note ?? ""} rows={2} className="text-xs" />
                      <Button type="submit" size="sm" variant="secondary">
                        Save
                      </Button>
                    </form>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

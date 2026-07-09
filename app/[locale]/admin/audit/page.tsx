import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
function pick(sp: SP, k: string): string | undefined {
  const v = sp[k];
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

export default async function AdminAuditPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const entityType = pick(sp, "entityType")?.trim();
  const action = pick(sp, "action")?.trim();
  const actor = pick(sp, "actor")?.trim();
  const from = pick(sp, "from");

  const prisma = getPrisma();

  const where: Prisma.AuditLogWhereInput = {};
  if (entityType) where.entityType = { contains: entityType, mode: "insensitive" };
  if (action) where.action = { contains: action, mode: "insensitive" };
  if (actor) {
    where.actorUserId = actor;
  }
  if (from) {
    const d = new Date(from);
    if (!Number.isNaN(d.getTime())) {
      where.createdAt = { gte: d };
    }
  }

  const rows = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: { select: { email: true, displayName: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <AdminBreadcrumbs items={[{ label: "Overview", href: "/admin" }, { label: "Audit log" }]} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Audit log</h1>
        <p className="mt-1 text-sm text-slate-600">
          Immutable-style record of staff actions. Filter to investigate incidents.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-12 md:items-end" method="get">
            <div className="md:col-span-3">
              <Label htmlFor="entityType">Entity type</Label>
              <Input id="entityType" name="entityType" defaultValue={entityType ?? ""} placeholder="Case" />
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="action">Action contains</Label>
              <Input id="action" name="action" defaultValue={action ?? ""} placeholder="story.approved" />
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="actor">Actor user id (UUID)</Label>
              <Input id="actor" name="actor" defaultValue={actor ?? ""} className="font-mono text-xs" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="from">From date</Label>
              <Input id="from" name="from" type="date" defaultValue={from ?? ""} />
            </div>
            <div className="md:col-span-1">
              <Button type="submit" className="w-full">
                Apply
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {rows.length === 0 ? (
        <AdminEmptyState title="No entries" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap text-sm">{formatDate(r.createdAt)}</TableCell>
                <TableCell className="max-w-[180px] truncate text-sm">
                  {r.actor?.email ?? r.actor?.displayName ?? r.actorUserId ?? "—"}
                </TableCell>
                <TableCell className="text-sm">
                  <span className="font-medium">{r.entityType}</span>
                  <span className="text-slate-500"> · </span>
                  {r.entityType === "Case" ? (
                    <Link href={`/admin/cases/${r.entityId}`} className="font-mono text-xs hover:underline">
                      {r.entityId}
                    </Link>
                  ) : (
                    <span className="font-mono text-xs">{r.entityId}</span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">{r.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

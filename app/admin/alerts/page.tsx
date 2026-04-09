import Link from "next/link";

import { getPrisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/admin/format";
import {
  approveImportedAlertFormAction,
  rejectImportedAlertFormAction,
} from "@/lib/admin/avasc-import-approval-actions";
import { submitCreateAlert, submitPublishAlert } from "./alert-form-actions";
import { requireStaff } from "@/lib/admin/session";
import { canMutate, canPublishAlerts } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

export default async function AdminAlertsPage() {
  const prisma = getPrisma();
  const staff = await requireStaff();
  const edit = canMutate(staff.role) && canPublishAlerts(staff.role);

  const [alerts, outboundPending] = await Promise.all([
    prisma.scamAlert.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.alert.findMany({
      where: {
        sourceType: "ONEDRIVE",
        approvalStatus: "PENDING",
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        scamCluster: { select: { slug: true, title: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <AdminBreadcrumbs items={[{ label: "Overview", href: "/admin" }, { label: "Alerts" }]} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Alerts</h1>
        <p className="mt-1 text-sm text-slate-600">
          Curated scam alerts for the site, plus OneDrive-ingested outbound alerts pending approval.
        </p>
      </div>

      {outboundPending.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Imported outbound alerts (pending)</CardTitle>
              <p className="mt-1 text-sm text-slate-600">
                JSON feeds from OneDrive — approve to publish or reject. Full visibility toggles:{" "}
                <Link href="/admin/alerts/visibility" className="font-medium text-slate-900 underline">
                  Alert surfaces
                </Link>
                , ingestion log:{" "}
                <Link href="/admin/imports" className="font-medium text-slate-900 underline">
                  Imports
                </Link>
                .
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Cluster</TableHead>
                  <TableHead>Created</TableHead>
                  {edit ? <TableHead className="w-[220px]">Actions</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {outboundPending.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <p className="font-medium text-slate-900">{a.title}</p>
                      <p className="line-clamp-2 text-xs text-slate-600">{a.message}</p>
                    </TableCell>
                    <TableCell className="text-sm">{a.alertType}</TableCell>
                    <TableCell className="text-sm">{a.sourceName ?? "—"}</TableCell>
                    <TableCell className="text-sm">
                      {a.scamCluster?.slug ? (
                        <Link href={`/database/${a.scamCluster.slug}`} className="underline">
                          {a.scamCluster.title ?? a.scamCluster.slug}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(a.createdAt)}</TableCell>
                    {edit ? (
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <form action={approveImportedAlertFormAction}>
                            <input type="hidden" name="alertId" value={a.id} />
                            <Button type="submit" size="sm">
                              Approve
                            </Button>
                          </form>
                          <form action={rejectImportedAlertFormAction}>
                            <input type="hidden" name="alertId" value={a.id} />
                            <Button type="submit" size="sm" variant="secondary">
                              Reject
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      <div>
        <h2 className="text-lg font-semibold text-slate-900">Scam alerts (site)</h2>
        <p className="mt-1 text-sm text-slate-600">
          Short warnings surfaced on the staff overview and public home when published.
        </p>
      </div>

      {edit ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New draft alert</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={submitCreateAlert} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="scamType">Scam type</Label>
                <Input id="scamType" name="scamType" required />
              </div>
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Input id="severity" name="severity" placeholder="info | warning | critical" defaultValue="info" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" name="summary" required rows={5} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit">Save draft</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Published at</TableHead>
            {edit ? <TableHead>Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((a) => (
            <TableRow key={a.id}>
              <TableCell>
                <p className="font-medium text-slate-900">{a.title}</p>
                <p className="line-clamp-2 text-xs text-slate-600">{a.summary}</p>
              </TableCell>
              <TableCell className="text-sm">{a.scamType}</TableCell>
              <TableCell>
                <Badge variant="outline">{a.severity}</Badge>
              </TableCell>
              <TableCell>{a.published ? "yes" : "no"}</TableCell>
              <TableCell className="text-sm">{formatDate(a.publishedAt)}</TableCell>
              {edit ? (
                <TableCell className="space-y-2">
                  <form action={submitPublishAlert}>
                    <input type="hidden" name="alertId" value={a.id} />
                    <input type="hidden" name="published" value={a.published ? "false" : "true"} />
                    <Button type="submit" size="sm" variant={a.published ? "secondary" : "default"}>
                      {a.published ? "Unpublish" : "Publish"}
                    </Button>
                  </form>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

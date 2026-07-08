import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/admin/format";
import { getDashboardOverview } from "@/lib/admin/dashboard";
import { retryFailedImportFormAction } from "@/lib/admin/avasc-admin-import-actions";
import { markImportInvalidFormAction } from "@/lib/admin/avasc-dashboard-ops-actions";

export const dynamic = "force-dynamic";

function usd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function importStatusVariant(status: string): "success" | "warning" | "danger" | "secondary" {
  switch (status) {
    case "FAILED":
      return "danger";
    case "PENDING":
    case "PROCESSING":
      return "warning";
    case "INVALIDATED":
      return "secondary";
    default:
      return "success";
  }
}

function StatCard({ label, value, tone }: { label: string; value: string | number; tone?: "danger" }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone === "danger" ? "text-red-600" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const data = await getDashboardOverview();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Admin Overview</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Live intake status, moderation queues, and scam-intelligence KPIs.
        </p>
      </section>

      {/* Live status */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active public alerts" value={data.liveStatus.activeAlerts} />
        <StatCard label="Pending approval" value={data.liveStatus.pendingApproval} />
        <StatCard label="Imports (24h)" value={data.liveStatus.importsToday} />
        <StatCard
          label="Failed imports (24h)"
          value={data.liveStatus.failedImports}
          tone={data.liveStatus.failedImports > 0 ? "danger" : undefined}
        />
      </section>

      {/* KPIs */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Alerts published (24h)" value={data.kpis.alertsPublishedToday} />
        <StatCard label="New scam clusters (24h)" value={data.kpis.newScamClustersToday} />
        <StatCard label="Losses tracked (24h)" value={usd(data.kpis.estimatedLossesTracked24h)} />
        <StatCard label="Approval rate (7d)" value={`${data.kpis.approvalRate7d}%`} />
      </section>

      {/* Needs attention */}
      {data.attentionItems.length > 0 ? (
        <Card className="border-amber-300/60">
          <CardHeader>
            <CardTitle className="text-base text-amber-700">Needs attention</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.attentionItems.map((item) => (
                <li key={`${item.kind}-${item.id}`} className="flex items-center gap-2 text-sm">
                  <Badge variant={item.kind === "FAILED_IMPORT" ? "danger" : "warning"}>
                    {item.kind === "FAILED_IMPORT" ? "Import" : "Alert"}
                  </Badge>
                  <span className="text-slate-700">{item.message}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Review queue preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Review queue</CardTitle>
            <Link href="/admin/review-queue" className="text-sm text-slate-600 underline">
              Open queue
            </Link>
          </CardHeader>
          <CardContent>
            {data.reviewQueue.length === 0 ? (
              <p className="text-sm text-slate-500">No alerts awaiting approval.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {data.reviewQueue.map((row) => (
                  <li key={row.id} className="py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-900">{row.title}</span>
                      <Badge variant="outline">{row.type}</Badge>
                      {row.priority ? <Badge variant="warning">{row.priority}</Badge> : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{row.summary}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {row.source ?? "Unknown"} · {formatDate(row.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Internal realtime feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Latest realtime alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {data.internalRealtimeFeed.length === 0 ? (
              <p className="text-sm text-slate-500">No realtime alerts yet.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {data.internalRealtimeFeed.map((row) => (
                  <li key={row.id} className="py-3">
                    <p className="font-medium text-slate-900">{row.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{row.shortText}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {row.sourceName ?? "AVASC"} · {formatDate(row.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent imports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Recent imports</CardTitle>
          <Link href="/admin/imports" className="text-sm text-slate-600 underline">
            All imports
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Linked alert</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentImports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500">
                    No imports yet.
                  </TableCell>
                </TableRow>
              ) : (
                data.recentImports.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="max-w-[14rem] truncate text-sm font-medium">{row.fileName}</TableCell>
                    <TableCell className="text-sm text-slate-600">{row.source}</TableCell>
                    <TableCell className="text-xs text-slate-600">{row.type}</TableCell>
                    <TableCell>
                      <Badge variant={importStatusVariant(row.status)}>{row.status}</Badge>
                      {row.errorMessage ? (
                        <p className="mt-1 max-w-[14rem] truncate text-xs text-red-600">{row.errorMessage}</p>
                      ) : null}
                    </TableCell>
                    <TableCell className="max-w-[12rem] truncate text-sm text-slate-600">
                      {row.linkedAlertTitle ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs">{formatDate(row.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {row.status === "FAILED" ? (
                          <>
                            <form action={retryFailedImportFormAction}>
                              <input type="hidden" name="importId" value={row.id} />
                              <Button type="submit" size="sm" variant="secondary">
                                Retry
                              </Button>
                            </form>
                            <form action={markImportInvalidFormAction}>
                              <input type="hidden" name="importId" value={row.id} />
                              <Button type="submit" size="sm" variant="ghost">
                                Invalidate
                              </Button>
                            </form>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";

import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Badge } from "@/components/ui/badge";
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
import { getPublishedAlertsOverview } from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPublishedAlertsPage() {
  const rows = await getPublishedAlertsOverview();

  return (
    <div className="space-y-8">
      <div>
        <AdminBreadcrumbs
          items={[{ label: "Overview", href: "/admin" }, { label: "Published alerts" }]}
        />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Published alerts</h1>
        <p className="mt-1 text-sm text-slate-600">
          Approved and publicly visible outbound alerts. Tune surfaces on{" "}
          <Link href="/admin/alerts/visibility" className="font-medium text-slate-900 underline">
            Alert surfaces
          </Link>
          .
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Archive</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cluster</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Approved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500">
                    No published alerts.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="max-w-xs text-sm font-medium">{r.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.alertType}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {r.scamClusterSlug ? (
                        <Link href={`/database/${r.scamClusterSlug}`} className="underline">
                          {r.scamClusterTitle ?? r.scamClusterSlug}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      RT {r.isRealtimeVisible ? "✓" : "—"} · HP {r.isHomepageVisible ? "✓" : "—"} · Daily{" "}
                      {r.isDailyFeedVisible ? "✓" : "—"}
                    </TableCell>
                    <TableCell className="text-xs">{formatDate(r.createdAt)}</TableCell>
                    <TableCell className="text-xs">{r.approvedAt ? formatDate(r.approvedAt) : "—"}</TableCell>
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

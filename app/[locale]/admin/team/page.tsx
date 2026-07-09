import { Link } from "@/i18n/navigation";

import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTeamPerformanceOverview } from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const { rows } = await getTeamPerformanceOverview();

  return (
    <div className="space-y-8">
      <div>
        <AdminBreadcrumbs items={[{ label: "Overview", href: "/admin" }, { label: "Team" }]} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Team performance</h1>
        <p className="mt-1 text-sm text-slate-600">
          Last 30 days — decisions on imported alerts. When reviewer attribution is missing, rows group by{" "}
          <span className="font-medium">source</span>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Review volume</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Decisions</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Rejected</TableHead>
                <TableHead>Approve %</TableHead>
                <TableHead>Quality</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500">
                    No data yet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r, i) => (
                  <TableRow key={`${r.name}-${i}`}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.submittedCount}</TableCell>
                    <TableCell>{r.approvedCount}</TableCell>
                    <TableCell>{r.rejectedCount}</TableCell>
                    <TableCell>{r.approvalRate}%</TableCell>
                    <TableCell>{r.qualityScore}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-sm text-slate-500">
        <Link href="/admin" className="underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}

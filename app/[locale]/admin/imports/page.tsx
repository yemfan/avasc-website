import Link from "next/link";

import { retryFailedImportFormAction } from "@/lib/admin/avasc-admin-import-actions";
import { getAdminImportsListData } from "@/lib/admin/avasc-import-approval-actions";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
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

export const dynamic = "force-dynamic";

function JsonPreview({ value }: { value: unknown }) {
  const text = JSON.stringify(value, null, 2);
  return (
    <pre className="max-h-48 max-w-xl overflow-auto rounded-md border bg-slate-950 p-3 text-xs text-slate-100">
      {text.slice(0, 8000)}
      {text.length > 8000 ? "\n…" : ""}
    </pre>
  );
}

export default async function AdminImportsPage() {
  const imports = await getAdminImportsListData();

  return (
    <div className="space-y-8">
      <div>
        <AdminBreadcrumbs
          items={[{ label: "Overview", href: "/admin" }, { label: "Imports" }]}
        />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">OneDrive ingestion</h1>
        <p className="mt-1 text-sm text-slate-600">
          Files picked up from configured Graph folders appear here with parse status. Linked outbound alerts are approved
          under{" "}
          <Link href="/admin/alerts/visibility" className="font-medium text-slate-900 underline">
            Alert surfaces
          </Link>
          .
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent ingestions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File path</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead>Linked alert</TableHead>
                <TableHead>Error</TableHead>
                <TableHead>Payload</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {imports.length === 0 ? (
                <TableRow>
                  <td colSpan={10} className="p-4 text-center text-slate-500">
                    No ingestion rows yet. Configure OneDrive env vars and cron jobs to import JSON feeds.
                  </td>
                </TableRow>
              ) : (
                imports.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="max-w-[200px] font-mono text-xs">{row.sourceFilePath}</TableCell>
                    <TableCell>{row.contentType}</TableCell>
                    <TableCell>{row.sourceName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(row.createdAt)}</TableCell>
                    <TableCell className="text-sm">{row.processedAt ? formatDate(row.processedAt) : "—"}</TableCell>
                    <TableCell>
                      {row.linkedAlert ? (
                        <Link
                          href="/admin/alerts/visibility"
                          className="text-sm font-medium text-slate-900 underline"
                        >
                          {row.linkedAlert.title.slice(0, 40)}
                          {row.linkedAlert.title.length > 40 ? "…" : ""}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs text-xs text-red-600">{row.errorMessage ?? "—"}</TableCell>
                    <TableCell>
                      <JsonPreview value={row.rawPayload} />
                    </TableCell>
                    <TableCell>
                      {row.status === "FAILED" ? (
                        <form action={retryFailedImportFormAction}>
                          <input type="hidden" name="importId" value={row.id} />
                          <Button type="submit" size="sm" variant="secondary">
                            Retry
                          </Button>
                        </form>
                      ) : null}
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

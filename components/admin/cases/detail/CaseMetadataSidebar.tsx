import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/admin/format";
import type { AdminCaseDetailRecord } from "@/lib/admin/case-detail-query";

type ClusterLink = AdminCaseDetailRecord["clusterLinks"][number];

export function CaseMetadataSidebar({
  caseId,
  createdAt,
  updatedAt,
  clusterLinks,
}: {
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
  clusterLinks: ClusterLink[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Case metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-700">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Identifiers</p>
          <p className="mt-1 font-mono text-xs break-all">{caseId}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Created</p>
            <p>{formatDate(createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Updated</p>
            <p>{formatDate(updatedAt)}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Linked clusters</p>
          {clusterLinks.length === 0 ? (
            <p className="mt-1 text-slate-500">None</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {clusterLinks.map((l) => (
                <li key={l.scamCluster.id} className="flex items-center justify-between gap-2">
                  <Link
                    href={`/admin/clusters/${l.scamCluster.id}`}
                    className="font-medium hover:underline"
                  >
                    {l.scamCluster.title}
                  </Link>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {l.scamCluster.publicStatus}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

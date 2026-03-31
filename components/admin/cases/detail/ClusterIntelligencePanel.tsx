import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClusterSuggestionBundle } from "@/lib/clustering";

function confVariant(c: string): "secondary" | "info" | "warning" | "danger" | "outline" {
  if (c === "CRITICAL") return "danger";
  if (c === "HIGH") return "warning";
  if (c === "MEDIUM") return "info";
  return "secondary";
}

export function ClusterIntelligencePanel({ bundle }: { bundle: ClusterSuggestionBundle }) {
  return (
    <Card className="border-indigo-100 bg-indigo-50/30">
      <CardHeader>
        <CardTitle className="text-base">Cluster intelligence</CardTitle>
        <p className="text-sm text-slate-700">{bundle.summaryLine}</p>
        <p className="text-xs text-slate-500">
          Rule-based suggestions from the clustering engine + indicator matcher. Staff must confirm before
          publishing profiles.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        {bundle.alreadyLinkedClusterIds.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Current links</p>
            <ul className="mt-1 space-y-1">
              {bundle.alreadyLinkedClusterIds.map((id) => (
                <li key={id} className="font-mono text-xs">
                  <Link href={`/admin/clusters/${id}`} className="text-indigo-800 hover:underline">
                    {id}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-slate-500">This case is not linked to any curated cluster yet.</p>
        )}

        {bundle.existingClusterSuggestions.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Existing cluster fits</p>
            <ul className="mt-2 space-y-3">
              {bundle.existingClusterSuggestions.slice(0, 6).map((s) => (
                <li key={s.clusterId} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/clusters/${s.clusterId}`} className="font-medium text-slate-900 hover:underline">
                      {s.clusterTitle}
                    </Link>
                    <Badge variant={confVariant(s.confidenceLabel)} className="text-[10px]">
                      {s.confidenceLabel}
                    </Badge>
                    <span className="text-xs text-slate-500">Fit {s.fitScore.toFixed(0)}</span>
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {s.publicReadiness.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs text-slate-600">
                    {s.reasons.slice(0, 4).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {bundle.newClusterSuggestion ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
            <p className="text-xs font-semibold uppercase text-amber-900">New cluster draft</p>
            <p className="mt-1 font-medium text-slate-900">{bundle.newClusterSuggestion.suggestedTitle}</p>
            <p className="mt-1 text-xs text-slate-600">{bundle.newClusterSuggestion.suggestedSummary}</p>
            <p className="mt-2 text-xs text-slate-500">
              Slug hint: <span className="font-mono">{bundle.newClusterSuggestion.suggestedSlugHint}</span> · Risk:{" "}
              {bundle.newClusterSuggestion.riskLevel} · Cases: {bundle.newClusterSuggestion.seedCaseIds.length}
            </p>
            <ul className="mt-2 list-inside list-disc text-xs text-slate-600">
              {bundle.newClusterSuggestion.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

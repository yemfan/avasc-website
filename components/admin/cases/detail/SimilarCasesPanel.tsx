import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { CaseMatchResult } from "@/lib/matching";
import { submitClusterLink } from "@/app/admin/cases/[id]/form-actions";

function strengthVariant(
  s: CaseMatchResult["strengthLabel"]
): "secondary" | "info" | "warning" | "danger" {
  if (s === "CRITICAL") return "danger";
  if (s === "HIGH") return "warning";
  if (s === "MEDIUM") return "info";
  return "secondary";
}

export function SimilarCasesPanel({
  similar,
  clusters,
  canEdit,
}: {
  similar: CaseMatchResult[];
  clusters: { id: string; title: string; slug: string }[];
  canEdit: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Similar cases (indicator engine)</CardTitle>
        <p className="text-xs text-slate-500">
          Weighted exact matches on normalized indicators. Scores are explainable and tunable in{" "}
          <code className="rounded bg-slate-100 px-1 text-[10px]">lib/matching</code>.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {similar.length === 0 ? (
          <p className="text-sm text-slate-500">No qualifying matches for this case (threshold / filters).</p>
        ) : (
          <ul className="space-y-4">
            {similar.map((s) => (
              <li key={s.matchedCaseId} className="rounded-lg border border-slate-100 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <p className="font-medium text-slate-900">{s.title}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge variant="outline" className="font-normal">
                        {s.scamType}
                      </Badge>
                      <Badge variant={strengthVariant(s.strengthLabel)} className="font-normal">
                        {s.strengthLabel}
                      </Badge>
                      <span className="text-xs text-slate-500">Score {s.totalScore}</span>
                    </div>
                    <ul className="list-inside list-disc space-y-1 text-xs text-slate-600">
                      {s.reasons.slice(0, 6).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                    {s.sharedIndicatorTypes.length ? (
                      <p className="text-[11px] text-slate-500">
                        Types: {s.sharedIndicatorTypes.join(", ")}
                      </p>
                    ) : null}
                  </div>
                  <Button size="sm" variant="secondary" asChild className="shrink-0">
                    <Link href={`/admin/cases/${s.matchedCaseId}`}>View case</Link>
                  </Button>
                </div>
                {canEdit ? (
                  <form
                    action={submitClusterLink}
                    className="mt-3 flex flex-wrap items-end gap-2 border-t border-slate-100 pt-3"
                  >
                    <input type="hidden" name="caseId" value={s.matchedCaseId} />
                    <div className="min-w-[200px] flex-1">
                      <Label className="text-xs" htmlFor={`cl-${s.matchedCaseId}`}>
                        Add this case to cluster
                      </Label>
                      <select
                        id={`cl-${s.matchedCaseId}`}
                        name="clusterId"
                        required
                        className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select cluster…
                        </option>
                        {clusters.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button type="submit" size="sm" variant="outline">
                      Link case
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

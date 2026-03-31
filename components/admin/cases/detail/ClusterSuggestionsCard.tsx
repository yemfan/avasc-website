import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ClusterSuggestionItem = {
  id: string;
  title: string;
  slug: string;
  overlapNote: string;
  overlapCaseCount?: number;
};

export function ClusterSuggestionsCard({ suggestions }: { suggestions: ClusterSuggestionItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cluster suggestions</CardTitle>
        <p className="text-xs text-slate-500">Curated clusters tied to scored similar cases.</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {suggestions.length === 0 ? (
          <p className="text-slate-500">No cluster hints from scored matches yet.</p>
        ) : (
          <ul className="space-y-3">
            {suggestions.map((s) => (
              <li key={s.id} className="rounded-md border border-slate-100 bg-slate-50/60 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/clusters/${s.id}`} className="font-medium text-slate-900 hover:underline">
                    {s.title}
                  </Link>
                  {typeof s.overlapCaseCount === "number" ? (
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {s.overlapCaseCount} case overlap
                    </Badge>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500">{s.overlapNote}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

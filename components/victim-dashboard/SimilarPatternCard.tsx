import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VictimSafeClusterMatch } from "@/lib/victim-dashboard/similar-patterns";
import { ArrowRight } from "lucide-react";

export function SimilarPatternCard({ m }: { m: VictimSafeClusterMatch }) {
  return (
    <Card className="border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="capitalize">
          {m.scamType.replace(/_/g, " ")}
        </Badge>
        <Badge variant="outline">Risk: {m.riskLevel}</Badge>
      </div>
      <h3 className="mt-3 text-base font-semibold text-slate-900">{m.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.summaryExcerpt}</p>
      {m.overlapNote ? (
        <p className="mt-2 text-xs text-slate-500">{m.overlapNote}</p>
      ) : null}
      <Link
        href={`/database/${m.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:underline"
      >
        View public scam profile
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </Card>
  );
}

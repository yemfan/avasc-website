import { Badge } from "@/components/ui/badge";
import type { CaseStatus } from "@prisma/client";
import { presentCaseStatus } from "@/lib/victim-dashboard";
import { cn } from "@/lib/utils/cn";

const TONE: Record<"neutral" | "progress" | "complete" | "attention", string> = {
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
  progress: "border-sky-200 bg-sky-50 text-sky-950",
  complete: "border-emerald-200 bg-emerald-50 text-emerald-950",
  attention: "border-amber-200 bg-amber-50 text-amber-950",
};

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const p = presentCaseStatus(status);
  return (
    <Badge
      variant="outline"
      className={cn("font-semibold", TONE[p.tone])}
      title={p.description}
    >
      {p.label}
    </Badge>
  );
}

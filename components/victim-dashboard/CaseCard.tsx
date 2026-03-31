import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { VictimCaseListItem } from "@/lib/victim-dashboard/cases";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { ScamTypeBadge } from "@/components/public-database/ScamTypeBadge";

function formatMoney(amount: number | null, currency: string | null) {
  if (amount == null) return "—";
  const cur = currency || "USD";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(amount);
}

export function CaseCard({ c }: { c: VictimCaseListItem }) {
  return (
    <Card className="flex flex-col border-slate-200/90 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-3 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <ScamTypeBadge scamType={c.scamType} />
          <CaseStatusBadge status={c.status} />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">{c.title}</h2>
        <p className="line-clamp-2 text-sm text-slate-600">
          {c.summary?.trim() || "You can add more detail anytime from your full case view."}
        </p>
        <dl className="mt-auto flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
          <div>
            <dt className="sr-only">Amount</dt>
            <dd>Reported loss: {formatMoney(c.amountLost, c.currency)}</dd>
          </div>
          <div>
            <dt className="sr-only">Submitted</dt>
            <dd>Submitted {c.createdAt.toLocaleDateString(undefined, { dateStyle: "medium" })}</dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="border-t border-slate-100">
        <Button asChild variant="default" className="w-full sm:w-auto">
          <Link href={`/dashboard/cases/${c.id}`}>View details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

import { IndicatorType } from "@prisma/client";
import { CheckCircle2 } from "lucide-react";
import { indicatorTypeLabel } from "@/lib/public-database/public-indicator-display";
import type { PublicIndicatorGroup as GroupModel } from "@/lib/public-database/public-scam-profile-types";

function groupHeading(type: string) {
  const values = Object.values(IndicatorType) as string[];
  if (values.includes(type)) {
    return indicatorTypeLabel(type as IndicatorType);
  }
  return type.replace(/_/g, " ");
}

export function PublicIndicatorGroup({ group }: { group: GroupModel }) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">{groupHeading(group.type)}</h3>
      <ul className="mt-3 divide-y divide-border">
        {group.items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-start justify-between gap-2 py-3 text-sm first:pt-0">
            <div className="min-w-0 flex-1">
              <p className="break-words text-foreground">{item.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Linked cases: {item.linkedCaseCount} · Occurrences: {item.occurrenceCount}
              </p>
            </div>
            {item.isVerified ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                Verified
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

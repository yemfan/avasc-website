import type { CaseIndicator } from "@prisma/client";
import { IndicatorRow } from "./IndicatorRow";

export function IndicatorGroup({
  label,
  indicators,
  matchById,
  canEdit,
}: {
  label: string;
  indicators: CaseIndicator[];
  matchById: Map<string, number>;
  canEdit: boolean;
}) {
  if (indicators.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
      <div className="space-y-3">
        {indicators.map((ind) => (
          <IndicatorRow
            key={ind.id}
            ind={ind}
            matchCount={matchById.get(ind.id) ?? 0}
            canEdit={canEdit}
          />
        ))}
      </div>
    </div>
  );
}

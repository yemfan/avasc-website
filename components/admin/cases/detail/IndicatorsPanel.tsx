import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CaseIndicator } from "@prisma/client";
import { INDICATOR_GROUPS, groupIndicators } from "@/lib/admin/indicator-groups";
import { IndicatorGroup } from "./IndicatorGroup";

export function IndicatorsPanel({
  indicators,
  matchById,
  canEdit,
}: {
  indicators: CaseIndicator[];
  matchById: Map<string, number>;
  canEdit: boolean;
}) {
  const grouped = groupIndicators(indicators);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Indicators</CardTitle>
        <p className="text-xs text-slate-500">
          Grouped by type. Match counts exclude this case; use search to review overlaps.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {indicators.length === 0 ? (
          <p className="text-sm text-slate-500">No indicators on this case.</p>
        ) : (
          INDICATOR_GROUPS.map((g) => (
            <IndicatorGroup
              key={g.key}
              label={g.label}
              indicators={grouped.get(g.key) ?? []}
              matchById={matchById}
              canEdit={canEdit}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

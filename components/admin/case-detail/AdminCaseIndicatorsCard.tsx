import type { CaseIndicator } from "@prisma/client";
import { IndicatorEditRow } from "@/components/admin/case-detail/IndicatorEditRow";

type AdminCaseIndicatorsCardProps = {
  indicators: CaseIndicator[];
};

export function AdminCaseIndicatorsCard({ indicators }: AdminCaseIndicatorsCardProps) {
  const grouped = groupIndicators(indicators);

  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Indicators</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Edit normalized values and control whether indicators are public or verified.
      </p>

      <div className="mt-4 space-y-5">
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="rounded-xl border p-4">
            <h4 className="text-sm font-semibold">{type}</h4>

            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <IndicatorEditRow key={item.id} indicator={item} />
              ))}
            </div>
          </div>
        ))}

        {indicators.length === 0 ? (
          <p className="text-sm text-muted-foreground">No indicators found.</p>
        ) : null}
      </div>
    </section>
  );
}

function groupIndicators(indicators: CaseIndicator[]) {
  return indicators.reduce<Record<string, CaseIndicator[]>>((acc, item) => {
    const key = item.indicatorType;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

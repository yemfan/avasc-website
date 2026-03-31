import { ClusterIndicatorAggregate } from "@prisma/client";
import { ClusterIndicatorEditRow } from "@/components/admin/cluster-detail/ClusterIndicatorEditRow";

type AdminClusterIndicatorsCardProps = {
  indicators: ClusterIndicatorAggregate[];
};

export function AdminClusterIndicatorsCard({
  indicators,
}: AdminClusterIndicatorsCardProps) {
  const grouped = indicators.reduce<Record<string, ClusterIndicatorAggregate[]>>(
    (acc, item) => {
      const key = item.indicatorType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {}
  );

  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Aggregated Indicators</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Control which cluster indicators are public-facing and mark trusted indicators as verified.
      </p>

      <div className="mt-4 space-y-5">
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="rounded-xl border p-4">
            <h4 className="text-sm font-semibold">{type}</h4>

            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <ClusterIndicatorEditRow key={item.id} indicator={item} />
              ))}
            </div>
          </div>
        ))}

        {indicators.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No aggregated indicators yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}

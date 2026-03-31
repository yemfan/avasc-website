import { ClusterIndicatorAggregate } from "@prisma/client";
import { updateClusterIndicatorAction } from "@/app/admin/clusters/[id]/indicator-actions";

type ClusterIndicatorEditRowProps = {
  indicator: ClusterIndicatorAggregate;
};

export function ClusterIndicatorEditRow({
  indicator,
}: ClusterIndicatorEditRowProps) {
  return (
    <form
      action={updateClusterIndicatorAction}
      className="rounded-lg border bg-muted/20 p-4"
    >
      <input type="hidden" name="aggregateId" value={indicator.id} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Normalized Value
          </p>
          <p className="mt-1 break-all text-sm">{indicator.normalizedValue}</p>
        </div>

        <div>
          <label
            htmlFor={`displayValue-${indicator.id}`}
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Display Value
          </label>
          <input
            id={`displayValue-${indicator.id}`}
            name="displayValue"
            defaultValue={indicator.displayValue || ""}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            placeholder="Optional public-friendly display value"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Indicator Type
          </p>
          <div className="rounded-lg border bg-background px-3 py-2 text-sm">
            {indicator.indicatorType}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Linked Cases
          </p>
          <div className="rounded-lg border bg-background px-3 py-2 text-sm">
            {indicator.linkedCaseCount}
          </div>
        </div>

        <div>
          <label
            htmlFor={`isPublic-${indicator.id}`}
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Public
          </label>
          <select
            id={`isPublic-${indicator.id}`}
            name="isPublic"
            defaultValue={String(indicator.isPublic)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`isVerified-${indicator.id}`}
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Verified
          </label>
          <select
            id={`isVerified-${indicator.id}`}
            name="isVerified"
            defaultValue={String(indicator.isVerified)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Occurrences: {indicator.occurrenceCount}</span>
        <span>Updated: {indicator.updatedAt.toLocaleString()}</span>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Save Indicator
        </button>
      </div>
    </form>
  );
}

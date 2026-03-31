import type { CaseIndicator } from "@prisma/client";
import { updateIndicatorAction } from "@/app/admin/cases/[id]/indicator-actions";

type IndicatorEditRowProps = {
  indicator: CaseIndicator;
};

export function IndicatorEditRow({ indicator }: IndicatorEditRowProps) {
  return (
    <form
      action={updateIndicatorAction}
      className="rounded-lg border bg-muted/20 p-4"
    >
      <input type="hidden" name="indicatorId" value={indicator.id} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Raw Value
          </p>
          <p className="mt-1 break-all text-sm">{indicator.rawValue}</p>
        </div>

        <div>
          <label
            htmlFor={`normalizedValue-${indicator.id}`}
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Normalized Value
          </label>
          <input
            id={`normalizedValue-${indicator.id}`}
            name="normalizedValue"
            defaultValue={indicator.normalizedValue}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Indicator Type
          </p>
          <div className="rounded-lg border bg-background px-3 py-2 text-sm">
            {indicator.indicatorType}
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
        <span>Confidence: {indicator.confidenceScore ?? "Not scored"}</span>
        <span>Created: {indicator.createdAt.toLocaleString()}</span>
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

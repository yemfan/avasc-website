import Link from "next/link";
import { Search } from "lucide-react";
import type { CaseIndicator } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitIndicatorUpdate } from "@/app/admin/cases/[id]/form-actions";
import { CopyTextButton } from "./CopyTextButton";

export function IndicatorRow({
  ind,
  matchCount,
  canEdit,
}: {
  ind: CaseIndicator;
  matchCount: number;
  canEdit: boolean;
}) {
  const q = encodeURIComponent(ind.normalizedValue);
  const searchHref = `/admin/cases?q=${q}`;

  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-slate-500">{ind.indicatorType}</span>
            {ind.isPublic ? (
              <Badge variant="outline" className="text-[10px]">
                Public
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px]">
                Private
              </Badge>
            )}
            {ind.isVerified ? (
              <Badge variant="success" className="text-[10px]">
                Verified
              </Badge>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Normalized</p>
            <p className="break-all font-mono text-sm text-slate-900">{ind.normalizedValue}</p>
          </div>
          {ind.rawValue ? (
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Raw</p>
              <p className="break-all text-xs text-slate-600">{ind.rawValue}</p>
            </div>
          ) : null}
          <p className="text-xs text-slate-600">
            Found{" "}
            <Link href={searchHref} className="font-medium text-slate-900 underline-offset-2 hover:underline">
              {matchCount} matching {matchCount === 1 ? "case" : "cases"}
            </Link>{" "}
            (search)
          </p>
          {ind.confidenceScore != null ? (
            <p className="text-xs text-slate-500">Confidence: {ind.confidenceScore}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0 lg:pl-4">
          <CopyTextButton value={ind.normalizedValue} />
          <Button variant="outline" size="sm" className="h-8" asChild>
            <Link href={searchHref} className="inline-flex items-center gap-1">
              <Search className="h-3.5 w-3.5" />
              Search
            </Link>
          </Button>
        </div>
      </div>

      {canEdit ? (
        <form action={submitIndicatorUpdate} className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <input type="hidden" name="indicatorId" value={ind.id} />
          <div className="sm:col-span-2 lg:col-span-4">
            <Label className="text-xs" htmlFor={`v-${ind.id}`}>
              Normalized value
            </Label>
            <Input
              id={`v-${ind.id}`}
              name="value"
              defaultValue={ind.normalizedValue}
              className="mt-1 font-mono text-xs"
            />
          </div>
          <div className="lg:col-span-2">
            <Label className="text-xs" htmlFor={`p-${ind.id}`}>
              Visibility
            </Label>
            <select
              id={`p-${ind.id}`}
              name="isPublic"
              defaultValue={ind.isPublic ? "true" : "false"}
              className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm"
            >
              <option value="false">Private</option>
              <option value="true">Public</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <Label className="text-xs" htmlFor={`c-${ind.id}`}>
              Confidence
            </Label>
            <Input
              id={`c-${ind.id}`}
              name="confidenceScore"
              type="number"
              step={1}
              min={0}
              max={100}
              defaultValue={ind.confidenceScore ?? ""}
              className="mt-1"
            />
          </div>
          <div className="lg:col-span-2">
            <Label className="text-xs" htmlFor={`sr-${ind.id}`}>
              Staff review
            </Label>
            <select
              id={`sr-${ind.id}`}
              name="staffReview"
              defaultValue={ind.isVerified ? "verified" : "none"}
              className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm"
            >
              <option value="none">None</option>
              <option value="verified">Verified</option>
              <option value="suspicious">Suspicious</option>
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-2">
            <Button type="submit" size="sm" variant="secondary" className="w-full sm:w-auto">
              Save indicator
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

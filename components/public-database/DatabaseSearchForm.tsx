import type { AvailablePublicFilters } from "@/lib/public-database/public-profile-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SearchValues = {
  q?: string;
  scamType?: string;
  riskLevel?: string;
  paymentMethod?: string;
  platform?: string;
  country?: string;
  indicatorType?: string;
  sort?: string;
  page?: string;
};

export function DatabaseSearchForm({
  filters,
  defaults,
}: {
  filters: AvailablePublicFilters;
  defaults: SearchValues;
}) {
  return (
    <form method="get" className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-2">
          <Label htmlFor="q" className="text-slate-800">
            Search patterns & indicators
          </Label>
          <Input
            id="q"
            name="q"
            type="search"
            defaultValue={defaults.q}
            placeholder="Wallet, domain, email, phone, title keywords…"
            className="h-11 rounded-xl border-slate-200 text-base"
            autoComplete="off"
          />
          <p className="text-xs text-slate-500">
            Exact matches on public indicators are prioritized; titles and summaries are searched with safe text
            matching only.
          </p>
        </div>
        <Button type="submit" className="h-11 rounded-xl px-8">
          Search
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="sort" className="text-xs text-slate-600">
            Sort
          </Label>
          <select
            id="sort"
            name="sort"
            defaultValue={defaults.sort ?? "relevance"}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="relevance">Most relevant</option>
            <option value="recent">Most recent</option>
            <option value="risk">Highest risk</option>
            <option value="reports">Most reported</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="scamType" className="text-xs text-slate-600">
            Scam type
          </Label>
          <select
            id="scamType"
            name="scamType"
            defaultValue={defaults.scamType ?? ""}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="">All types</option>
            {filters.scamTypes.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="riskLevel" className="text-xs text-slate-600">
            Risk level
          </Label>
          <select
            id="riskLevel"
            name="riskLevel"
            defaultValue={defaults.riskLevel ?? ""}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="">Any</option>
            {filters.riskLevels.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="indicatorType" className="text-xs text-slate-600">
            Indicator type (exact match)
          </Label>
          <select
            id="indicatorType"
            name="indicatorType"
            defaultValue={defaults.indicatorType ?? ""}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="">Any</option>
            <option value="wallet">Wallet</option>
            <option value="tx_hash">Transaction hash</option>
            <option value="domain">Domain</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="social_handle">Social handle</option>
            <option value="alias">Alias</option>
            <option value="app_platform">App / platform</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <details className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-800">More filters</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="paymentMethod" className="text-xs text-slate-600">
              Payment method (aggregate)
            </Label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              defaultValue={defaults.paymentMethod ?? ""}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="">Any</option>
              {filters.paymentMethods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="platform" className="text-xs text-slate-600">
              Platform / channel
            </Label>
            <select
              id="platform"
              name="platform"
              defaultValue={defaults.platform ?? ""}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="">Any</option>
              {filters.platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country" className="text-xs text-slate-600">
              Country / jurisdiction
            </Label>
            <select
              id="country"
              name="country"
              defaultValue={defaults.country ?? ""}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="">Any</option>
              {filters.countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </details>

      <input type="hidden" name="page" value="1" />
    </form>
  );
}

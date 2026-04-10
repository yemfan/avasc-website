"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Filter, Search } from "lucide-react";
import type { PublicDatabaseFiltersData } from "@/lib/public-database/public-search-types";

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildDatabaseHref(params: {
  query: string;
  scamType: string;
  riskLevel: string;
  indicatorType: string;
}): string {
  const p = new URLSearchParams();
  const q = params.query.trim();
  if (q) p.set("q", q);
  if (params.scamType !== "ALL") p.set("scamType", params.scamType);
  if (params.riskLevel !== "ALL") p.set("riskLevel", params.riskLevel);
  if (params.indicatorType !== "ALL") p.set("indicatorType", params.indicatorType);
  const qs = p.toString();
  return qs ? `/database?${qs}` : "/database";
}

type PublicDatabaseSearchFiltersProps = {
  filters: PublicDatabaseFiltersData;
  query: string;
  scamType: string;
  riskLevel: string;
  indicatorType: string;
};

export function PublicDatabaseSearchFilters({
  filters,
  query: initialQuery,
  scamType: initialScamType,
  riskLevel: initialRiskLevel,
  indicatorType: initialIndicatorType,
}: PublicDatabaseSearchFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);
  const [scamType, setScamType] = useState(initialScamType);
  const [riskLevel, setRiskLevel] = useState(initialRiskLevel);
  const [indicatorType, setIndicatorType] = useState(initialIndicatorType);

  useEffect(() => {
    setQuery(initialQuery);
    setScamType(initialScamType);
    setRiskLevel(initialRiskLevel);
    setIndicatorType(initialIndicatorType);
  }, [initialQuery, initialScamType, initialRiskLevel, initialIndicatorType]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipQueryDebounceOnce = useRef(true);
  /** Latest selects so query debounce always navigates with current filters (effect deps are only `query`). */
  const filterRestRef = useRef({ scamType, riskLevel, indicatorType });
  filterRestRef.current = { scamType, riskLevel, indicatorType };

  const navigate = useCallback(
    (next: { query: string; scamType: string; riskLevel: string; indicatorType: string }) => {
      const href = buildDatabaseHref(next);
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [router]
  );

  const clearDebounce = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (skipQueryDebounceOnce.current) {
      skipQueryDebounceOnce.current = false;
      return;
    }

    clearDebounce();
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      const { scamType: s, riskLevel: r, indicatorType: i } = filterRestRef.current;
      navigate({ query, scamType: s, riskLevel: r, indicatorType: i });
    }, 400);

    return clearDebounce;
  }, [query, clearDebounce, navigate]);

  const fieldClass =
    "w-full rounded-xl border border-white/[0.1] bg-[var(--avasc-bg)]/90 px-4 py-3 text-sm text-white outline-none ring-offset-2 ring-offset-[var(--avasc-bg)] transition focus:border-[var(--avasc-gold)]/50 focus:ring-2 focus:ring-[var(--avasc-gold)]/20";

  return (
    <section
      className="rounded-2xl border border-white/[0.08] bg-[var(--avasc-bg-card)]/85 p-6 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.45)] backdrop-blur-sm"
      aria-label="Search published scam patterns"
    >
      <div className="flex flex-wrap items-center gap-2 font-display text-sm font-medium text-[var(--avasc-gold-light)]">
        <Filter className="h-4 w-4 shrink-0" aria-hidden />
        <span>Search & filters</span>
        {isPending ? (
          <span className="text-xs font-normal text-[var(--avasc-text-muted)]">Updating…</span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--avasc-text-muted)]"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by domain, wallet, phone, email, alias, platform, or scam type"
            autoComplete="off"
            className={`${fieldClass} py-3 pl-11 pr-4`}
            aria-busy={isPending}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-white" htmlFor="db-scam-type-live">
              Scam Type
            </label>
            <select
              id="db-scam-type-live"
              value={scamType}
              onChange={(e) => {
                const v = e.target.value;
                clearDebounce();
                setScamType(v);
                navigate({ query, scamType: v, riskLevel, indicatorType });
              }}
              className={fieldClass}
            >
              <option value="ALL">All</option>
              {filters.scamTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white" htmlFor="db-risk-level-live">
              Risk Level
            </label>
            <select
              id="db-risk-level-live"
              value={riskLevel}
              onChange={(e) => {
                const v = e.target.value;
                clearDebounce();
                setRiskLevel(v);
                navigate({ query, scamType, riskLevel: v, indicatorType });
              }}
              className={fieldClass}
            >
              <option value="ALL">All</option>
              {filters.riskLevels.map((level) => (
                <option key={level} value={level}>
                  {formatEnum(level)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white" htmlFor="db-indicator-type-live">
              Indicator Type
            </label>
            <select
              id="db-indicator-type-live"
              value={indicatorType}
              onChange={(e) => {
                const v = e.target.value;
                clearDebounce();
                setIndicatorType(v);
                navigate({ query, scamType, riskLevel, indicatorType: v });
              }}
              className={fieldClass}
            >
              <option value="ALL">All</option>
              {filters.indicatorTypes.map((type) => (
                <option key={type} value={type}>
                  {formatEnum(type)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {query.trim() !== "" ||
        scamType !== "ALL" ||
        riskLevel !== "ALL" ||
        indicatorType !== "ALL" ? (
          <div className="flex justify-end border-t border-white/[0.08] pt-4">
            <Link
              href="/database"
              onClick={clearDebounce}
              className="text-sm text-[var(--avasc-text-muted)] underline-offset-2 transition hover:text-[var(--avasc-gold-light)] hover:underline"
            >
              Clear all filters
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

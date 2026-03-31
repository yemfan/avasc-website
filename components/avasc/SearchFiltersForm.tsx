import Link from "next/link";

export type FilterOptions = {
  scamTypes: string[];
  riskLevels: string[];
  indicatorTypes: string[];
};

const fieldClass =
  "w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-[var(--avasc-text-primary)] placeholder:text-[var(--avasc-text-muted)] outline-none transition duration-150 focus:border-[var(--avasc-gold)]/70 focus:ring-2 focus:ring-[rgba(197,139,43,0.18)] focus:ring-offset-2 focus:ring-offset-[var(--avasc-bg-card)]";

const labelClass = "mb-2 block text-sm font-medium text-[var(--avasc-text-primary)]";

const btnGoldClass =
  "inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[var(--avasc-bg)] shadow-[0_0_20px_rgba(197,139,43,0.12)] transition duration-150 hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-card)]";

const btnOutlineClass =
  "inline-flex items-center justify-center rounded-lg border border-[var(--avasc-border)] px-5 py-3 text-sm font-medium text-[var(--avasc-text-primary)] transition-colors duration-150 hover:border-[var(--avasc-gold)]/50 hover:text-[var(--avasc-gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-card)]";

type SearchFiltersFormProps = {
  filters: FilterOptions;
  initialQuery?: string;
  selectedScamType?: string;
  selectedRiskLevel?: string;
  selectedIndicatorType?: string;
  formAction?: string;
  resetHref?: string;
};

export function SearchFiltersForm({
  filters,
  initialQuery = "",
  selectedScamType = "ALL",
  selectedRiskLevel = "ALL",
  selectedIndicatorType = "ALL",
  formAction = "/database",
  resetHref = "/database",
}: SearchFiltersFormProps) {
  return (
    <section
      className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)] sm:p-6"
      aria-label="Search filters"
    >
      <form method="GET" action={formAction} className="space-y-4">
        <div>
          <label htmlFor="q" className={labelClass}>
            Search
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={initialQuery}
            placeholder="Search by domain, wallet, phone, email, alias, platform, or scam type"
            className={fieldClass}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="scamType" className={labelClass}>
              Scam Type
            </label>
            <select
              id="scamType"
              name="scamType"
              defaultValue={selectedScamType}
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
            <label htmlFor="riskLevel" className={labelClass}>
              Risk Level
            </label>
            <select
              id="riskLevel"
              name="riskLevel"
              defaultValue={selectedRiskLevel}
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
            <label htmlFor="indicatorType" className={labelClass}>
              Indicator Type
            </label>
            <select
              id="indicatorType"
              name="indicatorType"
              defaultValue={selectedIndicatorType}
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

        <div className="flex flex-wrap gap-3">
          <button type="submit" className={btnGoldClass}>
            Search
          </button>

          <Link href={resetHref} className={btnOutlineClass}>
            Reset
          </Link>
        </div>

        <p className="text-xs leading-relaxed text-[var(--avasc-text-muted)]">
          Results include only published scam profiles and publicly approved indicators.
        </p>
      </form>
    </section>
  );
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

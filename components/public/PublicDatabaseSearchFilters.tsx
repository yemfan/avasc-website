import type { PublicDatabaseFiltersData } from "@/lib/public-database/public-search-types";
import { SearchFiltersForm } from "@/components/avasc/SearchFiltersForm";

type PublicDatabaseSearchFiltersProps = {
  filters: PublicDatabaseFiltersData;
  initialQuery: string;
  selectedScamType: string;
  selectedRiskLevel: string;
  selectedIndicatorType: string;
  resetHref?: string;
};

/** Thin wrapper so `/database` can keep a stable import path; UI lives in `SearchFiltersForm`. */
export function PublicDatabaseSearchFilters({
  filters,
  initialQuery,
  selectedScamType,
  selectedRiskLevel,
  selectedIndicatorType,
  resetHref = "/database",
}: PublicDatabaseSearchFiltersProps) {
  return (
    <SearchFiltersForm
      filters={filters}
      initialQuery={initialQuery}
      selectedScamType={selectedScamType}
      selectedRiskLevel={selectedRiskLevel}
      selectedIndicatorType={selectedIndicatorType}
      formAction="/database"
      resetHref={resetHref}
    />
  );
}

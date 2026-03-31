/** Distinct filter option strings for the public database UI (published clusters + public aggregates). */
export type PublicDatabaseFiltersData = {
  scamTypes: string[];
  riskLevels: string[];
  indicatorTypes: string[];
};

export type PublicScamSearchResult = {
  id: string;
  slug: string;
  title: string;
  scamType: string;
  summary: string;
  riskLevel: string;
  reportCount: number;
  updatedAt: Date;
  matchedIndicators: Array<{
    type: string;
    value: string;
    isVerified: boolean;
  }>;
};

export type PublicIndicatorItem = {
  id: string;
  type: string;
  value: string;
  linkedCaseCount: number;
  occurrenceCount: number;
  isVerified: boolean;
};

export type PublicIndicatorGroup = {
  type: string;
  items: PublicIndicatorItem[];
};

import type { RelatedPublicScamProfile } from "./public-profile-types";

export type { RelatedPublicScamProfile } from "./public-profile-types";

export type PublicScamProfile = {
  id: string;
  slug: string;
  title: string;
  scamType: string;
  summary: string;
  riskLevel: string;
  redFlags: string | null;
  commonScript: string | null;
  safetyWarning: string | null;
  recommendedNextStep: string | null;
  reportCount: number;
  firstReportedAt: Date | null;
  latestReportedAt: Date | null;
  indicators: PublicIndicatorGroup[];
  relatedProfiles: RelatedPublicScamProfile[];
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

import { z } from "zod";
import type { IndicatorType } from "@prisma/client";

/** Public-safe risk labels for UI (matches cluster string normalization). */
export type PublicRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export const publicSearchParamsSchema = z.object({
  q: z.string().max(280).optional(),
  scamType: z.string().max(120).optional(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  paymentMethod: z.string().max(80).optional(),
  platform: z.string().max(80).optional(),
  country: z.string().max(80).optional(),
  indicatorType: z.enum([
    "phone",
    "email",
    "domain",
    "wallet",
    "other",
    "tx_hash",
    "social_handle",
    "alias",
    "app_platform",
  ]).optional(),
  sort: z.enum(["relevance", "recent", "risk", "reports"]).default("relevance"),
  page: z.coerce.number().int().min(1).max(500).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
});

export type PublicSearchParams = z.infer<typeof publicSearchParamsSchema>;

export type PublicSearchMatchTier = "indicator_exact" | "title" | "summary" | "slug" | "browse";

export type PublicScamProfileCard = {
  id: string;
  slug: string;
  title: string;
  scamType: string;
  riskLevel: PublicRiskLevel;
  summaryExcerpt: string;
  reportCount: number;
  firstReportedAt: string | null;
  lastReportedAt: string | null;
  lastUpdatedAt: string;
  indicatorPreview: { type: IndicatorType; displayValue: string }[];
  dominantPlatforms: string[];
  dominantPaymentMethods: string[];
  relevanceScore: number;
  matchTier: PublicSearchMatchTier;
};

/** Related published patterns from cluster aggregate overlap + scoring (see `getRelatedPublicClusters`). */
export type RelatedPublicScamProfile = {
  id: string;
  slug: string;
  title: string;
  scamType: string;
  summary: string;
  riskLevel: string;
  reportCount: number;
  sharedIndicatorCount: number;
};

export type PublicIndicatorRow = {
  type: IndicatorType;
  displayValue: string;
  /** Count of member cases that contributed this normalized value (public indicators only). */
  caseCount: number;
};

export type PublicIndicatorGroup = {
  type: IndicatorType;
  label: string;
  items: PublicIndicatorRow[];
};

export type PublicPatternSummary = {
  reportCount: number;
  firstReportedAt: string | null;
  lastReportedAt: string | null;
  dominantPaymentMethods: { label: string; count: number }[];
  dominantPlatforms: { label: string; count: number }[];
  dominantCountries: { label: string; count: number }[];
  commonScript: string | null;
};

export type PublicScamProfileDetail = {
  id: string;
  slug: string;
  title: string;
  scamType: string;
  riskLevel: PublicRiskLevel;
  summary: string;
  reportCount: number;
  firstReportedAt: string | null;
  lastReportedAt: string | null;
  lastUpdatedAt: string;
  whyThisProfileExists: string;
  commonVictimExperience: string | null;
  redFlags: string[];
  safetyWarning: string | null;
  recommendedNextStep: string | null;
  indicatorGroups: PublicIndicatorGroup[];
  pattern: PublicPatternSummary;
  relatedProfiles: RelatedPublicScamProfile[];
};

export type PublicFeaturedAlert = {
  id: string;
  title: string;
  summary: string;
  scamType: string;
  severity: string;
  publishedAt: string | null;
};

export type AvailablePublicFilters = {
  scamTypes: string[];
  riskLevels: PublicRiskLevel[];
  paymentMethods: string[];
  platforms: string[];
  countries: string[];
};

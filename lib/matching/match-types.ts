import { z } from "zod";
import { IndicatorType } from "@prisma/client";

const indicatorTypeSchema = z.nativeEnum(IndicatorType);

/** Aligns with scoring tiers (tunable in match-config). */
export type MatchStrengthLabel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type MatchViewMode = "internal" | "public";

export interface MatchedIndicatorDetail {
  indicatorType: IndicatorType;
  normalizedValue: string;
  sourceIndicatorId: string;
  matchedIndicatorId: string;
  weight: number;
}

export interface CaseMatchResult {
  matchedCaseId: string;
  totalScore: number;
  strengthLabel: MatchStrengthLabel;
  matchedIndicators: MatchedIndicatorDetail[];
  reasons: string[];
  sharedIndicatorTypes: IndicatorType[];
  latestCaseDate: Date;
  scamType: string;
  title: string;
  /** True when the only contributing type is app_platform and value is treated as high-noise. */
  suppressedAsNoise: boolean;
}

export const getSimilarCasesOptionsSchema = z.object({
  mode: z.enum(["internal", "public"]).default("internal"),
  minimumScore: z.number().min(0).default(1),
  limit: z.number().min(1).max(200).default(50),
  includeLowConfidence: z.boolean().default(true),
  includeIndicatorTypes: z.array(indicatorTypeSchema).optional(),
  excludeIndicatorTypes: z.array(indicatorTypeSchema).optional(),
  /** When true, drop matches that are platform-only on generic apps (WhatsApp, Telegram, …). */
  suppressNoisyPlatformOnly: z.boolean().default(true),
});

export type GetSimilarCasesOptions = z.infer<typeof getSimilarCasesOptionsSchema>;

export const suggestClustersOptionsSchema = z.object({
  mode: z.enum(["internal", "public"]).default("internal"),
  minimumScore: z.number().min(0).default(30),
  maxClusters: z.number().min(1).max(50).default(12),
  maxMatchedCases: z.number().min(1).max(100).default(40),
});

export type SuggestClustersOptions = z.infer<typeof suggestClustersOptionsSchema>;

/** Victim-safe projection: no raw indicator values unless type is safe to summarize vaguely. */
export interface PublicCaseMatchSummary {
  matchedCaseId: string;
  totalScore: number;
  strengthLabel: MatchStrengthLabel;
  headline: string;
  sharedIndicatorTypes: IndicatorType[];
  scamType: string;
}

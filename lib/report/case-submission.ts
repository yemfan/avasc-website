import { z } from "zod";
import { SupportType } from "@prisma/client";

export const INDICATOR_TYPES = [
  "phone",
  "email",
  "domain",
  "wallet",
  "tx_hash",
  "social_handle",
  "alias",
  "app_platform",
  "other",
] as const;

export type IndicatorTypeValue = (typeof INDICATOR_TYPES)[number];

export const SUPPORT_TYPES = Object.values(SupportType) as [SupportType, ...SupportType[]];

export type SupportTypeValue = (typeof SUPPORT_TYPES)[number];

export const createCaseBodySchema = z.object({
  title: z.string().min(3).max(200),
  summaryShort: z.string().max(500).optional(),
  scamType: z.string().min(2).max(120),
  amountCents: z.number().int().nonnegative().optional(),
  currency: z.string().max(8).optional(),
  paymentMethod: z.string().max(120).optional(),
  occurredAtStart: z.string().datetime().optional(),
  occurredAtEnd: z.string().datetime().optional(),
  narrativePrivate: z.string().min(20).max(20000),
  narrativePublic: z.string().max(8000).optional(),
  initialContactChannel: z.string().max(120).optional(),
  jurisdictionCountry: z.string().max(120).optional(),
  jurisdictionState: z.string().max(120).optional(),
  visibility: z.enum(["private", "anonymized", "public"]).default("private"),
  allowFollowUp: z.boolean().optional(),
  allowLawEnforcementReferral: z.boolean().optional(),
  allowCaseMatching: z.boolean().optional(),
  allowAnonymizedPublicSearch: z.boolean().optional(),
  storyVisibilityCandidate: z.boolean().optional(),
  supportRequested: z.boolean().optional(),
  supportTypes: z.array(z.enum(SUPPORT_TYPES)).max(20).optional(),
  isAnonymousSubmit: z.boolean().optional(),
  indicators: z
    .array(
      z.object({
        type: z.enum(INDICATOR_TYPES),
        value: z.string().min(2).max(500),
      })
    )
    .max(50),
});

export type CreateCaseBody = z.infer<typeof createCaseBodySchema>;

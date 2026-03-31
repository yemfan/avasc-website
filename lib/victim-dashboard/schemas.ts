import { z } from "zod";
import { SupportType as PrismaSupportType } from "@prisma/client";

export const SUPPORT_TYPES = Object.values(PrismaSupportType) as [PrismaSupportType, ...PrismaSupportType[]];

export type SupportType = (typeof SUPPORT_TYPES)[number];

export const createSupportRequestSchema = z.object({
  caseId: z
    .union([z.string().uuid(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  supportType: z.enum(SUPPORT_TYPES),
  note: z.string().trim().min(1, "Please add a short message.").max(4000),
});

export type CreateSupportRequestInput = z.infer<typeof createSupportRequestSchema>;

export const saveStorySchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().min(3).max(200),
    body: z.string().min(40).max(50_000),
    videoUrl: z
      .union([z.string().url().max(2000), z.literal("")])
      .optional()
      .transform((v) => (v === "" || v === undefined ? null : v)),
    linkedCaseId: z
      .union([z.string().uuid(), z.literal("")])
      .optional()
      .transform((v) => (v === "" || v === undefined ? null : v)),
    isAnonymous: z
      .union([z.boolean(), z.undefined()])
      .transform((v) => v === true),
  })
  .superRefine((data, ctx) => {
    const risky =
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(data.body) ||
      /\b(ssn|social security)\b/i.test(data.body);
    if (risky) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Please remove full card numbers or government ID numbers. Share themes, not account numbers.",
        path: ["body"],
      });
    }
  });

export type SaveStoryInput = z.infer<typeof saveStorySchema>;

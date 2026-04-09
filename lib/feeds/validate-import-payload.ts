import { z } from "zod";

export const importContentTypeSchema = z.enum(["REALTIME", "DAILY", "WEEKLY"]);
export const importPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

/** Handoff package schema (`importedAlertSchema`). */
export const importedAlertSchema = z.object({
  source_id: z.string().min(1),
  source_name: z.string().min(1),
  type: z.enum(["REALTIME", "DAILY", "WEEKLY"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  title: z.string().min(3),
  summary: z.string().min(5),
  short_text: z.string().min(3),
  slug: z.string().optional(),
  indicator_label: z.string().optional(),
  new_reports: z.number().int().nonnegative().optional(),
  amount_lost_usd: z.number().nonnegative().optional(),
  published_at: z.string().datetime().optional(),
});

export type ImportedAlertPayload = z.infer<typeof importedAlertSchema>;

/** Alias for existing imports — same shape as `importedAlertSchema`. */
export const importPayloadSchema = importedAlertSchema;
export type ImportPayload = ImportedAlertPayload;

export function validateImportPayload(data: unknown): { ok: true; data: ImportedAlertPayload } | { ok: false; error: string } {
  const r = importedAlertSchema.safeParse(data);
  if (!r.success) {
    return { ok: false, error: r.error.flatten().formErrors.join("; ") || "Validation failed" };
  }
  return { ok: true, data: r.data };
}

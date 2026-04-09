"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";
import { upsertImportedAlert } from "@/lib/feeds/upsert-imported-alert";
import { validateImportPayload } from "@/lib/feeds/validate-import-payload";

const retrySchema = z.object({
  importId: z.string().uuid(),
});

/**
 * Re-run validation + alert creation for a failed ingestion that still has `rawPayload`.
 */
export async function retryFailedImportFormAction(formData: FormData): Promise<void> {
  const importId = z.string().uuid().parse(formData.get("importId"));
  await retryFailedImportAction({ importId });
}

export async function retryFailedImportAction(input: unknown) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);
  void actor;
  const parsed = retrySchema.parse(input);

  const row = await prisma.externalContentIngestion.findUnique({
    where: { id: parsed.importId },
  });
  if (!row || row.status !== "FAILED") {
    throw new Error("Import not found or not in FAILED state.");
  }

  const raw = row.rawPayload;
  if (!raw || typeof raw !== "object") {
    throw new Error("No raw payload to retry.");
  }

  const validated = validateImportPayload(raw);
  if (!validated.ok) {
    throw new Error(validated.error);
  }

  if (validated.data.type !== row.contentType) {
    throw new Error("Payload type does not match ingestion content type.");
  }

  const { alertId } = await upsertImportedAlert(prisma, validated.data, {
    sourceFileId: row.sourceFileId,
    sourceFilePath: row.sourceFilePath,
  });

  await prisma.externalContentIngestion.update({
    where: { id: row.id },
    data: {
      status: "PENDING_APPROVAL",
      linkedAlertId: alertId,
      errorMessage: null,
      processedAt: new Date(),
      sourcePayloadId: validated.data.source_id,
    },
  });

  revalidatePath("/admin/imports");
  revalidatePath("/admin/alerts");
  revalidatePath("/admin/alerts/visibility");
  return { success: true as const, alertId };
}

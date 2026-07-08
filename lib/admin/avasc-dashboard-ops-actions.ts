"use server";

/**
 * Internal operations dashboard actions (retry / invalidate / review queue wrappers).
 * Core approve/reject/edit live in `avasc-import-approval-actions.ts`.
 */

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

import {
  approveImportedAlertAction,
  editImportedAlertAction,
  rejectImportedAlertAction,
} from "@/lib/admin/avasc-import-approval-actions";
import { retryFailedImportAction } from "@/lib/admin/avasc-admin-import-actions";

const importIdSchema = z.object({ importId: z.string().uuid() });
function revalidateAdminDashboard() {
  revalidatePath("/admin");
  revalidatePath("/admin/imports");
  revalidatePath("/admin/review-queue");
  revalidatePath("/admin/published-alerts");
  revalidatePath("/admin/analytics");
  revalidatePath("/admin/team");
  revalidatePath("/admin/alerts");
  revalidatePath("/admin/alerts/visibility");
  revalidatePath("/");
}

export async function retryImportAction(input: unknown) {
  return retryFailedImportAction(input);
}

export async function markImportInvalidAction(input: unknown) {
  await requireRole([UserRole.admin, UserRole.moderator]);
  const { importId } = importIdSchema.parse(input);

  const row = await prisma.externalContentIngestion.findUnique({
    where: { id: importId },
  });
  if (!row) throw new Error("Import not found.");

  await prisma.externalContentIngestion.update({
    where: { id: importId },
    data: {
      status: "INVALIDATED",
      errorMessage: row.errorMessage?.length
        ? `${row.errorMessage} | Invalidated by operator`
        : "Invalidated by operator",
      processedAt: new Date(),
    },
  });

  revalidateAdminDashboard();
  return { success: true as const };
}

export async function markImportInvalidFormAction(formData: FormData): Promise<void> {
  const importId = z.string().uuid().parse(formData.get("importId"));
  await markImportInvalidAction({ importId });
}

export async function approveReviewQueueItemAction(input: unknown) {
  return approveImportedAlertAction(input);
}

export async function rejectReviewQueueItemAction(input: unknown) {
  return rejectImportedAlertAction(input);
}

const saveEditsSchema = z.object({
  alertId: z.string().uuid(),
  title: z.string().min(1).max(500),
  message: z.string().min(1).max(20000),
});

export async function saveReviewQueueEditsAction(input: unknown) {
  const parsed = saveEditsSchema.parse(input);
  return editImportedAlertAction({
    alertId: parsed.alertId,
    title: parsed.title,
    message: parsed.message,
  });
}

const linkClusterSchema = z.object({
  alertId: z.string().uuid(),
  clusterId: z.string().uuid().nullable(),
});

export async function linkAlertToClusterAction(input: unknown) {
  await requireRole([UserRole.admin, UserRole.moderator]);
  const parsed = linkClusterSchema.parse(input);

  await prisma.alert.update({
    where: { id: parsed.alertId },
    data: { scamClusterId: parsed.clusterId },
  });
  revalidateAdminDashboard();
  return { success: true as const };
}

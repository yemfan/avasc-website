"use server";

/**
 * Internal operations dashboard actions. Core approve/reject/edit live in
 * `avasc-import-approval-actions.ts`; retry lives in `avasc-admin-import-actions.ts`.
 */

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

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

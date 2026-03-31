"use server";

import { revalidatePath } from "next/cache";
import { SupportRequestStatus } from "@prisma/client";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import { writeAuditLog } from "@/lib/admin/audit";

const updateSupportSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(SupportRequestStatus).optional(),
  note: z.string().max(20000).optional().nullable(),
  assignedToId: z.string().uuid().optional().nullable(),
});

export async function adminUpdateSupportRequest(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = updateSupportSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const existing = await prisma.supportRequest.findUnique({
    where: { id: parsed.data.id },
    select: { caseId: true },
  });
  await prisma.supportRequest.update({
    where: { id: parsed.data.id },
    data: {
      ...(parsed.data.status !== undefined ? { status: parsed.data.status } : {}),
      ...(parsed.data.note !== undefined ? { note: parsed.data.note } : {}),
      ...(parsed.data.assignedToId !== undefined
        ? { assignedToId: parsed.data.assignedToId }
        : {}),
    },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "SupportRequest",
    entityId: parsed.data.id,
    action: "support.updated",
    metadata: parsed.data,
  });

  revalidatePath("/admin/support");
  if (existing?.caseId) {
    revalidatePath(`/admin/cases/${existing.caseId}`);
  }
  return { ok: true as const };
}

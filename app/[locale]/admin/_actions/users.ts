"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/session";
import { canManageUsers } from "@/lib/admin/permissions";
import { writeAuditLog } from "@/lib/admin/audit";

const roleSchema = z.object({
  userId: z.string().uuid(),
  role: z.nativeEnum(UserRole),
});

export async function adminSetUserRole(input: unknown) {
  const ctx = await requireStaff();
  if (!canManageUsers(ctx.role)) {
    return { ok: false as const, error: "Only administrators can change roles" };
  }
  const parsed = roleSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };
  if (parsed.data.userId === ctx.userId && parsed.data.role !== "admin") {
    return { ok: false as const, error: "You cannot demote yourself" };
  }

  const prisma = getPrisma();
  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "User",
    entityId: parsed.data.userId,
    action: "user.role_changed",
    metadata: { role: parsed.data.role },
  });

  revalidatePath("/admin/users");
  return { ok: true as const };
}

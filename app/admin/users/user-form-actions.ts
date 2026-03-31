"use server";

import { z } from "zod";
import { UserRole } from "@prisma/client";
import { requireStaff } from "@/lib/admin/session";
import { canManageUsers } from "@/lib/admin/permissions";
import { adminSetUserRole } from "../_actions/users";

const roleZ = z.nativeEnum(UserRole);

export async function submitUserRole(formData: FormData) {
  const ctx = await requireStaff();
  if (!canManageUsers(ctx.role)) return;

  const userId = String(formData.get("userId") ?? "");
  const roleRaw = String(formData.get("role") ?? "");
  const role = roleZ.safeParse(roleRaw);
  if (!role.success) return;

  await adminSetUserRole({ userId, role: role.data });
}

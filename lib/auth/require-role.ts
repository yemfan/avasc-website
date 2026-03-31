import { redirect } from "next/navigation";
import { UserRole, type User } from "@prisma/client";
import { requireUser } from "@/lib/auth/require-user";

/**
 * Requires an authenticated user whose Prisma `role` is in `allowedRoles`.
 * Does not read Supabase `user_metadata` or JWT custom claims for roles.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<User> {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  return user;
}

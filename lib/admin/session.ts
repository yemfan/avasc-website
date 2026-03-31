import type { UserRole } from "@prisma/client";
import { requireStaffUser } from "@/lib/auth/session";

export type StaffContext = {
  userId: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
};

/** Server-only: Supabase session + `User` row must be admin or moderator. */
export async function requireStaff(): Promise<StaffContext> {
  const appUser = await requireStaffUser();

  return {
    userId: appUser.id,
    email: appUser.email,
    displayName: appUser.displayName,
    role: appUser.role,
  };
}

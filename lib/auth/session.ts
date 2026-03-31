import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { syncUserProfile } from "@/lib/auth/sync-user-profile";
import { getPrisma } from "@/lib/prisma";
import { isStaffRole } from "./roles";

export type SessionUser = {
  id: string;
  email: string | null;
};

export type AppUserContext = SessionUser & {
  displayName: string | null;
  role: UserRole;
};

/** `id` is the Prisma `User.id` (app user id), not the Supabase Auth UUID. */
export async function requireSessionUser(): Promise<SessionUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const appUser = await syncUserProfile(user);
  return { id: appUser.id, email: appUser.email };
}

export async function requireAppUser(): Promise<AppUserContext> {
  const sessionUser = await requireSessionUser();
  const prisma = getPrisma();
  const appUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, email: true, displayName: true, role: true },
  });
  if (!appUser) redirect("/login");
  return {
    id: appUser.id,
    email: appUser.email ?? sessionUser.email,
    displayName: appUser.displayName,
    role: appUser.role,
  };
}

export async function requireStaffUser(): Promise<AppUserContext> {
  const appUser = await requireAppUser();
  if (!isStaffRole(appUser.role)) redirect("/dashboard");
  return appUser;
}

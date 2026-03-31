import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { syncUserProfile } from "@/lib/auth/sync-user-profile";
import type { User } from "@prisma/client";

/**
 * Authenticated request flow:
 * 1. Resolve Supabase user from session cookies.
 * 2. Upsert Prisma `User` by `supabaseUserId` (email/displayName sync; role unchanged on update).
 *
 * Returns the Prisma `User` or `null` if there is no valid session.
 * Authorization must use `user.role` from this row — never JWT/app_metadata for roles.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return syncUserProfile(user);
}

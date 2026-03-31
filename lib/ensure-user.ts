import type { User as SupabaseUser } from "@supabase/supabase-js";
import { syncUserProfile } from "@/lib/auth/sync-user-profile";

export { syncUserProfile };

/** @deprecated Prefer `syncUserProfile` from `@/lib/auth/sync-user-profile`. */
export async function ensureAppUser(supabaseUser: SupabaseUser): Promise<void> {
  await syncUserProfile(supabaseUser);
}

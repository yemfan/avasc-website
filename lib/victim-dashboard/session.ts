import { requireSessionUser } from "@/lib/auth/session";

/**
 * Require a logged-in Supabase user and ensure a `User` row exists.
 * Use in dashboard layout and any server page that must be authenticated.
 */
export async function requireAuthUser() {
  return requireSessionUser();
}

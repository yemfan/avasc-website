import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client: reads the session from cookies (`@supabase/ssr`).
 * Always `await` before calling `auth.getUser()` / `auth.getSession()`.
 *
 * After OAuth or password login, use this in Route Handlers and Server Actions
 * so `setAll` can persist refreshed tokens when applicable.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  return createClient();
}

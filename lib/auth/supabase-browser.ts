import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client for Client Components (`"use client"`).
 * Session is stored in cookies via `@supabase/ssr` browser helpers.
 *
 * Use for sign-in UI, client-side session subscription, and redirects.
 * For server-rendered pages and API routes, use `createSupabaseServerClient` instead.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  return createClient();
}

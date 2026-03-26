import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getServiceSupabase } from "@/lib/supabase/service-role";

/** Ensure a `User` row exists for the Supabase auth user (id = auth.users.id). */
export async function ensureAppUser(supabaseUser: SupabaseUser) {
  const db = getServiceSupabase();
  const now = new Date().toISOString();
  const { data: existing } = await db.from("User").select("id").eq("id", supabaseUser.id).maybeSingle();

  if (existing) {
    const { error } = await db
      .from("User")
      .update({ email: supabaseUser.email ?? null, updatedAt: now })
      .eq("id", supabaseUser.id);
    if (error) throw error;
    return;
  }

  const { error } = await db.from("User").insert({
    id: supabaseUser.id,
    email: supabaseUser.email ?? null,
    role: "victim",
    prefersAnonymousSubmit: false,
    createdAt: now,
    updatedAt: now,
  });
  if (error) throw error;
}

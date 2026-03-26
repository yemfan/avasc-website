import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

/** Ensure a `User` row exists for the Supabase auth user (id = auth.users.id). */
export async function ensureAppUser(supabaseUser: SupabaseUser) {
  await prisma.user.upsert({
    where: { id: supabaseUser.id },
    create: {
      id: supabaseUser.id,
      email: supabaseUser.email ?? null,
      role: "victim",
    },
    update: {
      email: supabaseUser.email ?? null,
    },
  });
}

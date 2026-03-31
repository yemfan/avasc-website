import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@prisma/client";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Supabase Auth is the identity source (session, email, auth UUID).
 * Prisma `User` is the app profile and **only** source of truth for `role`.
 *
 * On upsert:
 * - Match by `supabaseUserId` (Auth UUID).
 * - **Create**: `role` defaults to `victim`. Never read role from Supabase JWT or user_metadata.
 * - **Update**: sync `email` and `displayName` only. `role` is managed in the database (admin flows, migrations).
 */
function pickString(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

/** Display name hints from OAuth/metadata — not used for authorization. */
function getDisplayName(user: SupabaseUser): string | null {
  const meta = user.user_metadata ?? {};
  return (
    pickString((meta as Record<string, unknown>).display_name) ||
    pickString((meta as Record<string, unknown>).full_name) ||
    pickString((meta as Record<string, unknown>).name) ||
    (user.email ? user.email.split("@")[0] : null)
  );
}

export async function syncUserProfile(supabaseUser: SupabaseUser): Promise<User> {
  if (!supabaseUser.email) {
    throw new Error("Authenticated user is missing email.");
  }

  const displayName = getDisplayName(supabaseUser);

  return prisma.user.upsert({
    where: { supabaseUserId: supabaseUser.id },
    update: {
      email: supabaseUser.email,
      displayName,
    },
    create: {
      supabaseUserId: supabaseUser.id,
      email: supabaseUser.email,
      displayName,
      role: UserRole.victim,
    },
  });
}

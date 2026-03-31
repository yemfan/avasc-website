-- Align User with prisma/schema.prisma (Supabase Auth). Mirrors supabase/migrations/20260327130500_user_supabase_user_id.sql.
ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS "supabaseUserId" UUID;
CREATE UNIQUE INDEX IF NOT EXISTS "User_supabaseUserId_key" ON public."User"("supabaseUserId");

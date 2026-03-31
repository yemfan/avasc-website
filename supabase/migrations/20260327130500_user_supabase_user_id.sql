-- Align User with prisma/schema.prisma (Supabase Auth link). Safe to re-run.
ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS "supabaseUserId" UUID;
CREATE UNIQUE INDEX IF NOT EXISTS "User_supabaseUserId_key" ON public."User"("supabaseUserId");

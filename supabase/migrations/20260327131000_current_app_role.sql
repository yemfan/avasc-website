-- Maps auth.uid() -> User.role when Supabase Auth exists; otherwise returns NULL (plain Postgres / Prisma Postgres).
CREATE OR REPLACE FUNCTION public.current_app_role()
RETURNS text
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  r text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'User' AND column_name = 'supabaseUserId'
  ) THEN
    RETURN NULL;
  END IF;
  BEGIN
    EXECUTE $q$
      SELECT u.role::text
      FROM public."User" u
      WHERE u."supabaseUserId" = auth.uid()
      LIMIT 1
    $q$ INTO r;
    RETURN r;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN NULL;
  END;
END;
$$;

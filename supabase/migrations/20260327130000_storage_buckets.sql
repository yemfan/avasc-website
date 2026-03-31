-- Supabase Storage: default buckets (skipped if not using Supabase Storage / plain Postgres).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'storage' AND table_name = 'buckets'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES
      ('evidence-private', 'evidence-private', false),
      ('story-media-public', 'story-media-public', true),
      ('receipts-private', 'receipts-private', false)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$;

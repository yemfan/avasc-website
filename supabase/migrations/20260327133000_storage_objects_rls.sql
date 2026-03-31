-- Storage RLS (skipped when storage.objects is not present, e.g. Prisma Postgres without Supabase Storage).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'storage' AND table_name = 'objects'
  ) THEN
    RETURN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'authenticated_can_upload_evidence') THEN
    CREATE POLICY "authenticated_can_upload_evidence"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'evidence-private');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'authenticated_can_read_evidence_metadata') THEN
    CREATE POLICY "authenticated_can_read_evidence_metadata"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'evidence-private');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'public_can_read_story_media') THEN
    CREATE POLICY "public_can_read_story_media"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'story-media-public');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'authenticated_can_upload_story_media') THEN
    CREATE POLICY "authenticated_can_upload_story_media"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'story-media-public');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'authenticated_can_read_receipts') THEN
    CREATE POLICY "authenticated_can_read_receipts"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'receipts-private');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'service_can_upload_receipts') THEN
    CREATE POLICY "service_can_upload_receipts"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'receipts-private');
  END IF;
END
$$;

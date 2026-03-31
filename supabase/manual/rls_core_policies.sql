-- Row level security for victim-facing and public reads + staff full access.
-- Requires: public.current_app_role() (see migration 20260327131000_current_app_role.sql).
-- Run manually on Supabase when using Auth + RLS (skipped in automated migrations for non-Supabase Postgres).

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Case" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CaseIndicator" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."EvidenceFile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Story" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SupportRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ScamCluster" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ScamClusterCase" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ClusterIndicatorAggregate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Donation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AuditLog" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_read_own_profile"
ON public."User"
FOR SELECT
USING ("supabaseUserId" = auth.uid());

CREATE POLICY "user_update_own_profile"
ON public."User"
FOR UPDATE
USING ("supabaseUserId" = auth.uid());

CREATE POLICY "user_read_own_cases"
ON public."Case"
FOR SELECT
USING (
  "userId" IN (
    SELECT id FROM public."User" WHERE "supabaseUserId" = auth.uid()
  )
);

CREATE POLICY "user_insert_own_cases"
ON public."Case"
FOR INSERT
WITH CHECK (
  "userId" IN (
    SELECT id FROM public."User" WHERE "supabaseUserId" = auth.uid()
  )
);

CREATE POLICY "user_update_own_cases"
ON public."Case"
FOR UPDATE
USING (
  "userId" IN (
    SELECT id FROM public."User" WHERE "supabaseUserId" = auth.uid()
  )
);

CREATE POLICY "user_read_own_case_indicators"
ON public."CaseIndicator"
FOR SELECT
USING (
  "caseId" IN (
    SELECT c.id
    FROM public."Case" c
    JOIN public."User" u ON u.id = c."userId"
    WHERE u."supabaseUserId" = auth.uid()
  )
);

CREATE POLICY "user_read_own_evidence"
ON public."EvidenceFile"
FOR SELECT
USING (
  "caseId" IN (
    SELECT c.id
    FROM public."Case" c
    JOIN public."User" u ON u.id = c."userId"
    WHERE u."supabaseUserId" = auth.uid()
  )
);

CREATE POLICY "user_read_own_support_requests"
ON public."SupportRequest"
FOR SELECT
USING (
  "userId" IN (
    SELECT id FROM public."User" WHERE "supabaseUserId" = auth.uid()
  )
);

CREATE POLICY "public_read_published_clusters"
ON public."ScamCluster"
FOR SELECT
USING ("publicStatus" = 'PUBLISHED');

CREATE POLICY "public_read_public_cluster_indicators"
ON public."ClusterIndicatorAggregate"
FOR SELECT
USING (
  "isPublic" = true
  AND "scamClusterId" IN (
    SELECT id FROM public."ScamCluster" WHERE "publicStatus" = 'PUBLISHED'
  )
);

CREATE POLICY "public_read_published_cluster_links"
ON public."ScamClusterCase"
FOR SELECT
USING (
  "scamClusterId" IN (
    SELECT id FROM public."ScamCluster" WHERE "publicStatus" = 'PUBLISHED'
  )
);

CREATE POLICY "admin_full_user"
ON public."User"
FOR ALL
USING (public.current_app_role() IN ('admin', 'moderator'))
WITH CHECK (public.current_app_role() IN ('admin', 'moderator'));

CREATE POLICY "admin_full_case"
ON public."Case"
FOR ALL
USING (public.current_app_role() IN ('admin', 'moderator'))
WITH CHECK (public.current_app_role() IN ('admin', 'moderator'));

CREATE POLICY "admin_full_case_indicator"
ON public."CaseIndicator"
FOR ALL
USING (public.current_app_role() IN ('admin', 'moderator'))
WITH CHECK (public.current_app_role() IN ('admin', 'moderator'));

CREATE POLICY "admin_full_evidence"
ON public."EvidenceFile"
FOR ALL
USING (public.current_app_role() IN ('admin', 'moderator'))
WITH CHECK (public.current_app_role() IN ('admin', 'moderator'));

CREATE POLICY "admin_full_story"
ON public."Story"
FOR ALL
USING (public.current_app_role() IN ('admin', 'moderator'))
WITH CHECK (public.current_app_role() IN ('admin', 'moderator'));

CREATE POLICY "admin_full_comment"
ON public."Comment"
FOR ALL
USING (public.current_app_role() IN ('admin', 'moderator'))
WITH CHECK (public.current_app_role() IN ('admin', 'moderator'));

CREATE POLICY "admin_full_support_request"
ON public."SupportRequest"
FOR ALL
USING (public.current_app_role() IN ('admin', 'moderator'))
WITH CHECK (public.current_app_role() IN ('admin', 'moderator'));

CREATE POLICY "admin_full_cluster"
ON public."ScamCluster"
FOR ALL
USING (public.current_app_role() IN ('admin', 'moderator'))
WITH CHECK (public.current_app_role() IN ('admin', 'moderator'));

CREATE POLICY "admin_full_cluster_case"
ON public."ScamClusterCase"
FOR ALL
USING (public.current_app_role() IN ('admin', 'moderator'))
WITH CHECK (public.current_app_role() IN ('admin', 'moderator'));

CREATE POLICY "admin_full_cluster_indicator"
ON public."ClusterIndicatorAggregate"
FOR ALL
USING (public.current_app_role() IN ('admin', 'moderator'))
WITH CHECK (public.current_app_role() IN ('admin', 'moderator'));

CREATE POLICY "admin_full_donation"
ON public."Donation"
FOR ALL
USING (public.current_app_role() = 'admin')
WITH CHECK (public.current_app_role() = 'admin');

CREATE POLICY "admin_full_audit"
ON public."AuditLog"
FOR ALL
USING (public.current_app_role() IN ('admin', 'moderator'))
WITH CHECK (public.current_app_role() IN ('admin', 'moderator'));

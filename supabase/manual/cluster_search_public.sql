-- Run on Supabase (SQL editor) when public."ClusterIndicatorAggregate" exists.
-- Order: MV → indexes → refresh fn → search RPC → filter RPC.

-- --- from 20260327135000_public_scam_cluster_search_mv.sql
DROP MATERIALIZED VIEW IF EXISTS public.public_scam_cluster_search_mv;

CREATE MATERIALIZED VIEW public.public_scam_cluster_search_mv AS
WITH public_indicators AS (
  SELECT
    cia."scamClusterId" AS cluster_id,
    cia."indicatorType"::text AS indicator_type,
    cia."normalizedValue" AS normalized_value,
    coalesce(nullif(trim(cia."displayValue"), ''), cia."normalizedValue") AS display_value,
    cia."isVerified" AS is_verified,
    cia."linkedCaseCount" AS linked_case_count,
    cia."occurrenceCount" AS occurrence_count
  FROM public."ClusterIndicatorAggregate" cia
  JOIN public."ScamCluster" sc
    ON sc.id = cia."scamClusterId"
  WHERE cia."isPublic" = true
    AND sc."publicStatus" = 'PUBLISHED'
),
indicator_rollup AS (
  SELECT
    cluster_id,
    jsonb_agg(
      jsonb_build_object(
        'type', indicator_type,
        'normalizedValue', normalized_value,
        'displayValue', display_value,
        'isVerified', is_verified,
        'linkedCaseCount', linked_case_count,
        'occurrenceCount', occurrence_count
      )
      ORDER BY indicator_type, linked_case_count DESC, occurrence_count DESC
    ) AS indicators_json,
    string_agg(lower(display_value), ' ') AS indicator_search_text,
    array_agg(DISTINCT indicator_type) AS indicator_types
  FROM public_indicators
  GROUP BY cluster_id
),
case_counts AS (
  SELECT
    scc."scamClusterId" AS cluster_id,
    count(*)::int AS report_count
  FROM public."ScamClusterCase" scc
  GROUP BY scc."scamClusterId"
)
SELECT
  sc.id,
  sc.slug,
  sc."title",
  sc."scamType",
  sc.summary,
  sc."riskLevel"::text AS risk_level,
  sc."publicStatus"::text AS public_status,
  coalesce(cc.report_count, 0) AS report_count,
  sc."updatedAt" AS updated_at,
  coalesce(ir.indicators_json, '[]'::jsonb) AS indicators_json,
  coalesce(ir.indicator_types, array[]::text[]) AS indicator_types,
  lower(
    concat_ws(
      ' ',
      sc."title",
      sc."scamType",
      sc.summary,
      coalesce(ir.indicator_search_text, '')
    )
  ) AS search_text
FROM public."ScamCluster" sc
LEFT JOIN case_counts cc
  ON cc.cluster_id = sc.id
LEFT JOIN indicator_rollup ir
  ON ir.cluster_id = sc.id
WHERE sc."publicStatus" = 'PUBLISHED';

-- --- from 20260327136000_public_scam_cluster_search_mv_indexes.sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_public_scam_cluster_search_mv_id
  ON public.public_scam_cluster_search_mv (id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_public_scam_cluster_search_mv_slug
  ON public.public_scam_cluster_search_mv (slug);

CREATE INDEX IF NOT EXISTS idx_public_scam_cluster_search_mv_risk
  ON public.public_scam_cluster_search_mv (risk_level);

CREATE INDEX IF NOT EXISTS idx_public_scam_cluster_search_mv_report_count
  ON public.public_scam_cluster_search_mv (report_count DESC);

CREATE INDEX IF NOT EXISTS idx_public_scam_cluster_search_mv_updated
  ON public.public_scam_cluster_search_mv (updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_public_scam_cluster_search_mv_search_trgm
  ON public.public_scam_cluster_search_mv
  USING gin (search_text gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_public_scam_cluster_search_mv_indicator_types
  ON public.public_scam_cluster_search_mv
  USING gin (indicator_types);

-- --- from 20260327137000_refresh_public_scam_cluster_search_mv.sql
CREATE OR REPLACE FUNCTION public.refresh_public_scam_cluster_search_mv()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.public_scam_cluster_search_mv;
END;
$$;

REVOKE ALL ON FUNCTION public.refresh_public_scam_cluster_search_mv() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.refresh_public_scam_cluster_search_mv() TO postgres;
GRANT EXECUTE ON FUNCTION public.refresh_public_scam_cluster_search_mv() TO service_role;

COMMENT ON FUNCTION public.refresh_public_scam_cluster_search_mv() IS
  'Call this after cluster publish/unpublish, merge, or public indicator changes.';

-- --- from 20260327138000_search_public_scam_clusters.sql
CREATE OR REPLACE FUNCTION public.search_public_scam_clusters(
  p_query text DEFAULT NULL,
  p_scam_type text DEFAULT NULL,
  p_risk_level text DEFAULT NULL,
  p_indicator_type text DEFAULT NULL,
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  slug text,
  title text,
  scam_type text,
  summary text,
  risk_level text,
  report_count int,
  updated_at timestamptz,
  matched_indicators jsonb,
  rank_score numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  WITH base AS (
    SELECT *
    FROM public.public_scam_cluster_search_mv mv
    WHERE
      (p_scam_type IS NULL OR p_scam_type = '' OR p_scam_type = 'ALL' OR mv."scamType" = p_scam_type)
      AND (p_risk_level IS NULL OR p_risk_level = '' OR p_risk_level = 'ALL' OR mv.risk_level = p_risk_level)
      AND (
        p_indicator_type IS NULL
        OR p_indicator_type = ''
        OR p_indicator_type = 'ALL'
        OR mv.indicator_types @> ARRAY[p_indicator_type]
      )
  ),
  scored AS (
    SELECT
      mv.id,
      mv.slug,
      mv."title" AS title,
      mv."scamType" AS scam_type,
      mv.summary,
      mv.risk_level,
      mv.report_count,
      mv.updated_at,
      (
        SELECT coalesce(
          jsonb_agg(indicator_obj),
          '[]'::jsonb
        )
        FROM (
          SELECT indicator_obj
          FROM jsonb_array_elements(mv.indicators_json) AS indicator_obj
          WHERE
            p_query IS NULL
            OR p_query = ''
            OR lower(indicator_obj->>'displayValue') LIKE '%' || lower(p_query) || '%'
            OR lower(indicator_obj->>'normalizedValue') LIKE '%' || lower(p_query) || '%'
          LIMIT 5
        ) q
      ) AS matched_indicators,
      CASE
        WHEN p_query IS NULL OR p_query = '' THEN 0
        ELSE
          greatest(
            similarity(mv.search_text, lower(p_query)),
            similarity(lower(mv."title"), lower(p_query)) * 1.4,
            similarity(lower(mv."scamType"), lower(p_query)) * 1.1
          )
      END
      + least(mv.report_count, 10) * 0.01 AS rank_score
    FROM base mv
    WHERE
      p_query IS NULL
      OR p_query = ''
      OR mv.search_text LIKE '%' || lower(p_query) || '%'
      OR similarity(mv.search_text, lower(p_query)) > 0.08
  )
  SELECT
    id,
    slug,
    title,
    scam_type,
    summary,
    risk_level,
    report_count,
    updated_at,
    matched_indicators,
    rank_score
  FROM scored
  ORDER BY
    CASE WHEN p_query IS NULL OR p_query = '' THEN 0 ELSE 1 END DESC,
    rank_score DESC,
    updated_at DESC
  LIMIT greatest(p_limit, 1)
  OFFSET greatest(p_offset, 0);
$$;

REVOKE ALL ON FUNCTION public.search_public_scam_clusters(text, text, text, text, int, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_public_scam_clusters(text, text, text, text, int, int) TO anon;
GRANT EXECUTE ON FUNCTION public.search_public_scam_clusters(text, text, text, text, int, int) TO authenticated;

-- --- from 20260327139000_get_public_scam_cluster_filter_values.sql
CREATE OR REPLACE FUNCTION public.get_public_scam_cluster_filter_values()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT jsonb_build_object(
    'scamTypes',
      coalesce(
        (
          SELECT jsonb_agg(t.scam_type ORDER BY t.scam_type)
          FROM (
            SELECT DISTINCT "scamType" AS scam_type
            FROM public.public_scam_cluster_search_mv
          ) t
        ),
        '[]'::jsonb
      ),
    'riskLevels',
      coalesce(
        (
          SELECT jsonb_agg(t.risk_level ORDER BY t.risk_level)
          FROM (
            SELECT DISTINCT risk_level
            FROM public.public_scam_cluster_search_mv
          ) t
        ),
        '[]'::jsonb
      ),
    'indicatorTypes',
      coalesce(
        (
          SELECT jsonb_agg(t.indicator_type ORDER BY t.indicator_type)
          FROM (
            SELECT DISTINCT unnest(indicator_types) AS indicator_type
            FROM public.public_scam_cluster_search_mv
          ) t
        ),
        '[]'::jsonb
      )
  );
$$;

REVOKE ALL ON FUNCTION public.get_public_scam_cluster_filter_values() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_scam_cluster_filter_values() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_scam_cluster_filter_values() TO authenticated;

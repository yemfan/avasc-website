CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ScamCluster indexes
CREATE INDEX IF NOT EXISTS idx_sc_cluster_public_status
  ON public."ScamCluster" ("publicStatus");

CREATE INDEX IF NOT EXISTS idx_sc_cluster_risk_level
  ON public."ScamCluster" ("riskLevel");

CREATE INDEX IF NOT EXISTS idx_sc_cluster_scam_type
  ON public."ScamCluster" ("scamType");

CREATE INDEX IF NOT EXISTS idx_sc_cluster_updated_at
  ON public."ScamCluster" ("updatedAt" DESC);

CREATE INDEX IF NOT EXISTS idx_sc_cluster_slug
  ON public."ScamCluster" ("slug");

-- Trigram indexes for free-text search on cluster fields
CREATE INDEX IF NOT EXISTS idx_sc_cluster_title_trgm
  ON public."ScamCluster"
  USING gin (lower("title") gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_sc_cluster_summary_trgm
  ON public."ScamCluster"
  USING gin (lower("summary") gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_sc_cluster_scam_type_trgm
  ON public."ScamCluster"
  USING gin (lower("scamType") gin_trgm_ops);

-- ClusterIndicatorAggregate indexes (skip if table not present yet)
DO $$
BEGIN
  IF to_regclass('public."ClusterIndicatorAggregate"') IS NULL THEN
    RETURN;
  END IF;
  CREATE INDEX IF NOT EXISTS idx_sc_agg_cluster_id
    ON public."ClusterIndicatorAggregate" ("scamClusterId");
  CREATE INDEX IF NOT EXISTS idx_sc_agg_is_public
    ON public."ClusterIndicatorAggregate" ("isPublic");
  CREATE INDEX IF NOT EXISTS idx_sc_agg_indicator_type
    ON public."ClusterIndicatorAggregate" ("indicatorType");
  CREATE INDEX IF NOT EXISTS idx_sc_agg_cluster_public_type
    ON public."ClusterIndicatorAggregate" ("scamClusterId", "isPublic", "indicatorType");
  CREATE INDEX IF NOT EXISTS idx_sc_agg_norm_value_trgm
    ON public."ClusterIndicatorAggregate"
    USING gin (lower("normalizedValue") gin_trgm_ops);
  CREATE INDEX IF NOT EXISTS idx_sc_agg_display_value_trgm
    ON public."ClusterIndicatorAggregate"
    USING gin (lower(coalesce("displayValue", '')) gin_trgm_ops);
END
$$;

-- ScamClusterCase indexes for report counts / joins
CREATE INDEX IF NOT EXISTS idx_sc_cluster_case_cluster
  ON public."ScamClusterCase" ("scamClusterId");

CREATE INDEX IF NOT EXISTS idx_sc_cluster_case_case
  ON public."ScamClusterCase" ("caseId");

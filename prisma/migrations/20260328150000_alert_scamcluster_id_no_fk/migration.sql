-- Align `Alert.scamClusterId` with schema: optional UUID only (no FK to ScamCluster).
ALTER TABLE "Alert" DROP CONSTRAINT IF EXISTS "Alert_scamClusterId_fkey";

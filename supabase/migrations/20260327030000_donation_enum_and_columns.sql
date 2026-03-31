DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DonationType') THEN
    CREATE TYPE "DonationType" AS ENUM ('one_time', 'monthly');
  END IF;
END
$$;

ALTER TABLE "Donation"
  ALTER COLUMN "donorName" DROP NOT NULL;

ALTER TABLE "Donation"
  ALTER COLUMN "donationType" TYPE "DonationType"
  USING "donationType"::"DonationType";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'Donation_providerSessionId_key'
  ) THEN
    CREATE UNIQUE INDEX "Donation_providerSessionId_key" ON "Donation"("providerSessionId");
  END IF;
END
$$;

DROP INDEX IF EXISTS "Donation_donationType_createdAt_idx";
DROP INDEX IF EXISTS "Donation_donorEmail_createdAt_idx";

CREATE INDEX IF NOT EXISTS "Donation_donorEmail_idx" ON "Donation"("donorEmail");
CREATE INDEX IF NOT EXISTS "Donation_donationType_idx" ON "Donation"("donationType");

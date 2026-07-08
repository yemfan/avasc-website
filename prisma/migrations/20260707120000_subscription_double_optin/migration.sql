-- Double opt-in for email subscriptions.
-- confirmedAt: null until the subscriber clicks the confirmation link (broadcast sends require it).
-- confirmToken: single-use token embedded in the confirmation email.
-- unsubscribeToken: stable per-subscription token for one-click (RFC 8058) List-Unsubscribe.

ALTER TABLE "Subscription"
  ADD COLUMN IF NOT EXISTS "confirmedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "confirmToken" TEXT,
  ADD COLUMN IF NOT EXISTS "unsubscribeToken" TEXT;

-- Grandfather existing active subscribers so we do not silently stop their mail.
UPDATE "Subscription"
  SET "confirmedAt" = COALESCE("confirmedAt", "createdAt")
  WHERE "isActive" = true AND "confirmedAt" IS NULL;

-- Backfill unsubscribe tokens for every existing row.
UPDATE "Subscription"
  SET "unsubscribeToken" = gen_random_uuid()::text
  WHERE "unsubscribeToken" IS NULL;

ALTER TABLE "Subscription" ALTER COLUMN "unsubscribeToken" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_confirmToken_key" ON "Subscription"("confirmToken");
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_unsubscribeToken_key" ON "Subscription"("unsubscribeToken");

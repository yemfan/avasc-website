CREATE TABLE IF NOT EXISTS "Donation" (
  "id" TEXT PRIMARY KEY,
  "donorName" TEXT NOT NULL,
  "donorEmail" TEXT NOT NULL,
  "amount" INTEGER,
  "currency" TEXT DEFAULT 'usd',
  "paymentProvider" TEXT NOT NULL DEFAULT 'stripe',
  "donationType" TEXT NOT NULL,
  "providerSessionId" TEXT,
  "providerTransactionId" TEXT UNIQUE,
  "providerSubscriptionId" TEXT UNIQUE,
  "receiptNumber" TEXT UNIQUE,
  "receiptSentAt" TIMESTAMPTZ,
  "monthlyConfirmationSentAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Donation_donationType_createdAt_idx" ON "Donation"("donationType", "createdAt");
CREATE INDEX IF NOT EXISTS "Donation_donorEmail_createdAt_idx" ON "Donation"("donorEmail", "createdAt");

-- AVASC threat alerts, subscriptions, cluster follows, delivery audit (see prisma Alert / Subscription models).

CREATE TYPE "AvascAlertKind" AS ENUM ('CLUSTER_UPDATED', 'RISK_ESCALATED');

CREATE TYPE "AlertDeliveryChannel" AS ENUM ('SMS', 'EMAIL');

CREATE TYPE "AlertDeliveryStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED', 'SKIPPED', 'SUPPRESSED_RATE_LIMIT');

CREATE TABLE "Alert" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "kind" "AvascAlertKind" NOT NULL,
    "scamClusterId" UUID NOT NULL,
    "threatScore" INTEGER NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "confidenceScore" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Subscription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID,
    "email" VARCHAR(320),
    "phoneE164" VARCHAR(24),
    "emailOptIn" BOOLEAN NOT NULL DEFAULT false,
    "smsOptIn" BOOLEAN NOT NULL DEFAULT false,
    "digestDaily" BOOLEAN NOT NULL DEFAULT false,
    "digestWeekly" BOOLEAN NOT NULL DEFAULT true,
    "smsConsentAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "verificationToken" VARCHAR(64),
    "lastDailyDigestAt" TIMESTAMP(3),
    "lastWeeklyDigestAt" TIMESTAMP(3),
    "lastCriticalSmsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClusterSubscription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subscriptionId" UUID NOT NULL,
    "scamClusterId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClusterSubscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AlertDeliveryLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "alertId" UUID,
    "subscriptionId" UUID NOT NULL,
    "channel" "AlertDeliveryChannel" NOT NULL,
    "status" "AlertDeliveryStatus" NOT NULL,
    "provider" VARCHAR(32),
    "providerMessageId" VARCHAR(128),
    "errorMessage" TEXT,
    "summary" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertDeliveryLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Subscription_verificationToken_key" ON "Subscription"("verificationToken");

CREATE INDEX "Alert_scamClusterId_idx" ON "Alert"("scamClusterId");
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");
CREATE INDEX "Alert_riskLevel_idx" ON "Alert"("riskLevel");

CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_email_idx" ON "Subscription"("email");
CREATE INDEX "Subscription_phoneE164_idx" ON "Subscription"("phoneE164");
CREATE INDEX "Subscription_verifiedAt_idx" ON "Subscription"("verifiedAt");

CREATE UNIQUE INDEX "ClusterSubscription_subscriptionId_scamClusterId_key" ON "ClusterSubscription"("subscriptionId", "scamClusterId");
CREATE INDEX "ClusterSubscription_scamClusterId_idx" ON "ClusterSubscription"("scamClusterId");

CREATE INDEX "AlertDeliveryLog_subscriptionId_idx" ON "AlertDeliveryLog"("subscriptionId");
CREATE INDEX "AlertDeliveryLog_alertId_idx" ON "AlertDeliveryLog"("alertId");
CREATE INDEX "AlertDeliveryLog_createdAt_idx" ON "AlertDeliveryLog"("createdAt");
CREATE INDEX "AlertDeliveryLog_channel_status_idx" ON "AlertDeliveryLog"("channel", "status");

ALTER TABLE "Alert" ADD CONSTRAINT "Alert_scamClusterId_fkey" FOREIGN KEY ("scamClusterId") REFERENCES "ScamCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ClusterSubscription" ADD CONSTRAINT "ClusterSubscription_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClusterSubscription" ADD CONSTRAINT "ClusterSubscription_scamClusterId_fkey" FOREIGN KEY ("scamClusterId") REFERENCES "ScamCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AlertDeliveryLog" ADD CONSTRAINT "AlertDeliveryLog_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AlertDeliveryLog" ADD CONSTRAINT "AlertDeliveryLog_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

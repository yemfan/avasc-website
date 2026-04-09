-- Refactor alert stack to Subscription / ClusterSubscription / Alert / AlertDeliveryLog (v2).

DROP TABLE IF EXISTS "AlertDeliveryLog" CASCADE;
DROP TABLE IF EXISTS "ClusterSubscription" CASCADE;
DROP TABLE IF EXISTS "Subscription" CASCADE;
DROP TABLE IF EXISTS "Alert" CASCADE;

DROP TYPE IF EXISTS "AvascAlertKind" CASCADE;
DROP TYPE IF EXISTS "AlertDeliveryChannel" CASCADE;
DROP TYPE IF EXISTS "AlertDeliveryStatus" CASCADE;

CREATE TYPE "AlertChannel" AS ENUM ('SMS', 'EMAIL');

CREATE TABLE "Alert" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "riskLevel" TEXT,
    "scamClusterId" UUID,
    "score" INTEGER,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Subscription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT,
    "phone" TEXT,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "emailDaily" BOOLEAN NOT NULL DEFAULT false,
    "emailWeekly" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Subscription_email_key" ON "Subscription"("email");
CREATE UNIQUE INDEX "Subscription_phone_key" ON "Subscription"("phone");

CREATE TABLE "ClusterSubscription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clusterId" UUID NOT NULL,
    "subscriptionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClusterSubscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AlertDeliveryLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "alertId" UUID NOT NULL,
    "subscriptionId" UUID NOT NULL,
    "channel" "AlertChannel" NOT NULL,
    "status" TEXT NOT NULL,
    "providerMessageId" TEXT,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertDeliveryLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Alert_scamClusterId_idx" ON "Alert"("scamClusterId");
CREATE INDEX "Alert_alertType_idx" ON "Alert"("alertType");
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

CREATE UNIQUE INDEX "ClusterSubscription_clusterId_subscriptionId_key" ON "ClusterSubscription"("clusterId", "subscriptionId");
CREATE INDEX "ClusterSubscription_clusterId_idx" ON "ClusterSubscription"("clusterId");
CREATE INDEX "ClusterSubscription_subscriptionId_idx" ON "ClusterSubscription"("subscriptionId");

CREATE INDEX "AlertDeliveryLog_alertId_idx" ON "AlertDeliveryLog"("alertId");
CREATE INDEX "AlertDeliveryLog_subscriptionId_idx" ON "AlertDeliveryLog"("subscriptionId");
CREATE INDEX "AlertDeliveryLog_sentAt_idx" ON "AlertDeliveryLog"("sentAt");

ALTER TABLE "Alert" ADD CONSTRAINT "Alert_scamClusterId_fkey" FOREIGN KEY ("scamClusterId") REFERENCES "ScamCluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ClusterSubscription" ADD CONSTRAINT "ClusterSubscription_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "ScamCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClusterSubscription" ADD CONSTRAINT "ClusterSubscription_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AlertDeliveryLog" ADD CONSTRAINT "AlertDeliveryLog_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AlertDeliveryLog" ADD CONSTRAINT "AlertDeliveryLog_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

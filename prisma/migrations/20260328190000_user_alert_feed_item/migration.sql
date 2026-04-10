-- CreateTable
CREATE TABLE "UserAlertFeedItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subscriptionId" UUID NOT NULL,
    "alertId" UUID,
    "scamClusterId" UUID,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAlertFeedItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserAlertFeedItem" ADD CONSTRAINT "UserAlertFeedItem_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserAlertFeedItem" ADD CONSTRAINT "UserAlertFeedItem_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ScamCluster FK omitted (TEXT id vs UUID column); Prisma relation still enforced in app layer.

-- CreateIndex
CREATE INDEX "UserAlertFeedItem_subscriptionId_createdAt_idx" ON "UserAlertFeedItem"("subscriptionId", "createdAt");

CREATE INDEX "UserAlertFeedItem_subscriptionId_isRead_idx" ON "UserAlertFeedItem"("subscriptionId", "isRead");

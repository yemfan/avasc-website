-- CreateTable
CREATE TABLE "DigestRun" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "digestType" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DigestRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionDigestLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subscriptionId" UUID NOT NULL,
    "digestRunId" UUID NOT NULL,
    "digestType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorMessage" TEXT,

    CONSTRAINT "SubscriptionDigestLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubscriptionDigestLog" ADD CONSTRAINT "SubscriptionDigestLog_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SubscriptionDigestLog" ADD CONSTRAINT "SubscriptionDigestLog_digestRunId_fkey" FOREIGN KEY ("digestRunId") REFERENCES "DigestRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "SubscriptionDigestLog_subscriptionId_idx" ON "SubscriptionDigestLog"("subscriptionId");

CREATE INDEX "SubscriptionDigestLog_digestRunId_idx" ON "SubscriptionDigestLog"("digestRunId");

CREATE INDEX "SubscriptionDigestLog_sentAt_idx" ON "SubscriptionDigestLog"("sentAt");

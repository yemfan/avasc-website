-- CreateTable
CREATE TABLE "Briefing" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dek" TEXT,
    "category" TEXT NOT NULL DEFAULT 'this_week',
    "summary" TEXT,
    "bodyJson" JSONB NOT NULL,
    "sources" JSONB,
    "coverImageUrl" TEXT,
    "periodLabel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Briefing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Briefing_slug_key" ON "Briefing"("slug");

-- CreateIndex
CREATE INDEX "Briefing_category_publishedAt_idx" ON "Briefing"("category", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "Briefing_status_idx" ON "Briefing"("status");


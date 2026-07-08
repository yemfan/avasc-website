-- One auto-generated + auto-posted social post per day (themed weekly rotation).
CREATE TABLE "SocialDailyPost" (
  "id"        UUID NOT NULL,
  "postDate"  DATE NOT NULL,
  "theme"     TEXT NOT NULL,
  "posts"     JSONB NOT NULL,
  "linkUrl"   TEXT,
  "status"    TEXT NOT NULL DEFAULT 'generated',
  "results"   JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SocialDailyPost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SocialDailyPost_postDate_key" ON "SocialDailyPost" ("postDate");
CREATE INDEX "SocialDailyPost_postDate_idx" ON "SocialDailyPost" ("postDate");

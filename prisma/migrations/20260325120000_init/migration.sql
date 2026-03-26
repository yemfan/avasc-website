-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('victim', 'admin', 'moderator');

-- CreateEnum
CREATE TYPE "CaseVisibility" AS ENUM ('private', 'anonymized', 'public');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('draft', 'submitted', 'under_review', 'closed');

-- CreateEnum
CREATE TYPE "IndicatorType" AS ENUM ('phone', 'email', 'domain', 'wallet', 'other');

-- CreateEnum
CREATE TYPE "StoryStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'victim',
    "prefersAnonymousSubmit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "reporterUserId" UUID,
    "visibility" "CaseVisibility" NOT NULL DEFAULT 'private',
    "status" "CaseStatus" NOT NULL DEFAULT 'submitted',
    "scamType" TEXT NOT NULL,
    "amountCents" INTEGER,
    "currency" TEXT DEFAULT 'USD',
    "paymentMethod" TEXT,
    "occurredAtStart" TIMESTAMP(3),
    "occurredAtEnd" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "narrativePrivate" TEXT NOT NULL,
    "narrativePublic" TEXT,
    "supportRequested" BOOLEAN NOT NULL DEFAULT false,
    "isAnonymousSubmit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseIndicator" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" "IndicatorType" NOT NULL,
    "value" TEXT NOT NULL,
    "rawValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceFile" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScamEntity" (
    "id" TEXT NOT NULL,
    "type" "IndicatorType" NOT NULL,
    "normalizedValue" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScamEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseEntityLink" (
    "caseId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,

    CONSTRAINT "CaseEntityLink_pkey" PRIMARY KEY ("caseId","entityId")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "authorUserId" UUID,
    "status" "StoryStatus" NOT NULL DEFAULT 'pending',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "authorUserId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaseIndicator_type_value_idx" ON "CaseIndicator"("type", "value");

-- CreateIndex
CREATE INDEX "ScamEntity_normalizedValue_idx" ON "ScamEntity"("normalizedValue");

-- CreateIndex
CREATE UNIQUE INDEX "ScamEntity_type_normalizedValue_key" ON "ScamEntity"("type", "normalizedValue");

-- CreateIndex
CREATE INDEX "Comment_storyId_idx" ON "Comment"("storyId");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseIndicator" ADD CONSTRAINT "CaseIndicator_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceFile" ADD CONSTRAINT "EvidenceFile_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseEntityLink" ADD CONSTRAINT "CaseEntityLink_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseEntityLink" ADD CONSTRAINT "CaseEntityLink_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "ScamEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

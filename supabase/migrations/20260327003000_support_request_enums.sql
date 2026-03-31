-- Align with prisma/schema.prisma: SupportType and SupportRequestStatus (Postgres enum labels match Prisma)

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SupportType') THEN
    CREATE TYPE "SupportType" AS ENUM (
      'EMOTIONAL_SUPPORT',
      'REPORTING_HELP',
      'RECOVERY_GUIDANCE',
      'LEGAL_REFERRAL',
      'MEDIA_ADVOCACY',
      'GENERAL_HELP'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SupportRequestStatus') THEN
    CREATE TYPE "SupportRequestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');
  END IF;
END
$$;

ALTER TABLE "SupportRequest"
  ALTER COLUMN "supportType" TYPE "SupportType"
  USING (
    CASE
      WHEN "supportType" IN (
        'EMOTIONAL_SUPPORT',
        'REPORTING_HELP',
        'RECOVERY_GUIDANCE',
        'LEGAL_REFERRAL',
        'MEDIA_ADVOCACY',
        'GENERAL_HELP'
      ) THEN "supportType"::"SupportType"
      WHEN "supportType" = 'emotional' THEN 'EMOTIONAL_SUPPORT'::"SupportType"
      WHEN "supportType" = 'reporting' THEN 'REPORTING_HELP'::"SupportType"
      WHEN "supportType" = 'recovery' THEN 'RECOVERY_GUIDANCE'::"SupportType"
      WHEN "supportType" = 'legal' THEN 'LEGAL_REFERRAL'::"SupportType"
      WHEN "supportType" = 'media' THEN 'MEDIA_ADVOCACY'::"SupportType"
      WHEN "supportType" = 'emotional_support' THEN 'EMOTIONAL_SUPPORT'::"SupportType"
      WHEN "supportType" = 'reporting_help' THEN 'REPORTING_HELP'::"SupportType"
      WHEN "supportType" = 'recovery_guidance' THEN 'RECOVERY_GUIDANCE'::"SupportType"
      WHEN "supportType" = 'legal_referral_inquiry' THEN 'LEGAL_REFERRAL'::"SupportType"
      WHEN "supportType" = 'media_advocacy' THEN 'MEDIA_ADVOCACY'::"SupportType"
      ELSE 'GENERAL_HELP'::"SupportType"
    END
  );

ALTER TABLE "SupportRequest" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "SupportRequest"
  ALTER COLUMN "status" TYPE "SupportRequestStatus"
  USING (
    CASE
      WHEN "status" IN ('OPEN', 'IN_PROGRESS', 'CLOSED') THEN "status"::"SupportRequestStatus"
      WHEN LOWER("status") = 'open' THEN 'OPEN'::"SupportRequestStatus"
      WHEN LOWER("status") = 'pending' THEN 'OPEN'::"SupportRequestStatus"
      WHEN LOWER("status") = 'in_progress' THEN 'IN_PROGRESS'::"SupportRequestStatus"
      WHEN LOWER("status") = 'closed' THEN 'CLOSED'::"SupportRequestStatus"
      ELSE 'OPEN'::"SupportRequestStatus"
    END
  );

ALTER TABLE "SupportRequest"
  ALTER COLUMN "status" SET DEFAULT 'OPEN'::"SupportRequestStatus";

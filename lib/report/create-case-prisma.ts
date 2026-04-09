import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import {
  CaseStatus,
  CaseVisibility,
  IndicatorType,
  Prisma,
  SupportRequestStatus,
  UserRole,
} from "@prisma/client";
import { syncUserProfile } from "@/lib/auth/sync-user-profile";
import { processCaseForMatching } from "@/lib/clustering/process-case-for-matching";
import type { ParsedIndicator } from "@/lib/clustering/intake-cluster-engine";
import { normalizeIndicatorValue } from "@/lib/indicators";
import { prisma } from "@/lib/prisma";
import type { IndicatorType as ApiIndicatorType } from "@/lib/types/db";
import type { CreateCaseBody } from "./case-submission";

/** Stable placeholder identity for unauthenticated report submissions (same Postgres row for all). */
const ANONYMOUS_REPORTER_SUPABASE_ID = "00000000-0000-4000-8000-000000000001";
const ANONYMOUS_REPORTER_EMAIL = "anonymous.reporter@avasc.internal";

function mapVisibility(v: CreateCaseBody["visibility"]): CaseVisibility {
  switch (v) {
    case "anonymized":
      return CaseVisibility.anonymized_public;
    case "public":
      return CaseVisibility.public_story_candidate;
    default:
      return CaseVisibility.private;
  }
}

function mapReportIndicatorToPrisma(t: ApiIndicatorType): IndicatorType {
  const table: Record<ApiIndicatorType, IndicatorType> = {
    phone: IndicatorType.PHONE,
    email: IndicatorType.EMAIL,
    domain: IndicatorType.DOMAIN,
    wallet: IndicatorType.WALLET,
    tx_hash: IndicatorType.TX_HASH,
    social_handle: IndicatorType.SOCIAL_HANDLE,
    alias: IndicatorType.ALIAS,
    app_platform: IndicatorType.PLATFORM,
    other: IndicatorType.ALIAS,
  };
  return table[t] ?? IndicatorType.ALIAS;
}

function supplementalParsedIndicators(body: CreateCaseBody): ParsedIndicator[] {
  return body.indicators.map((ind) => {
    const type = mapReportIndicatorToPrisma(ind.type);
    const normalizedValue = normalizeIndicatorValue(ind.type, ind.value);
    return {
      type,
      rawValue: ind.value.trim(),
      normalizedValue,
      confidence: 0.93,
    };
  });
}

async function resolveReporterUserId(authUser: SupabaseAuthUser | null): Promise<string> {
  if (authUser?.email) {
    const row = await syncUserProfile(authUser);
    return row.id;
  }

  const anon = await prisma.user.upsert({
    where: { supabaseUserId: ANONYMOUS_REPORTER_SUPABASE_ID },
    create: {
      supabaseUserId: ANONYMOUS_REPORTER_SUPABASE_ID,
      email: ANONYMOUS_REPORTER_EMAIL,
      displayName: "Anonymous reporter",
      role: UserRole.victim,
      isAnonymousByDefault: true,
    },
    update: {},
  });
  return anon.id;
}

/**
 * Persists a victim report with Prisma, then runs the intake matching pipeline
 * (indicators, match cache, suggestions, optional auto-cluster).
 */
export async function createCaseWithIntakeMatching(
  body: CreateCaseBody,
  authUser: SupabaseAuthUser | null
): Promise<{ caseId: string }> {
  const userId = await resolveReporterUserId(authUser);

  const summary =
    body.summaryShort?.trim() ||
    body.narrativePrivate.trim().slice(0, 2000) ||
    body.title.trim();

  const jurisdiction = [body.jurisdictionCountry, body.jurisdictionState]
    .filter((x) => x && String(x).trim())
    .join(", ")
    .trim();

  const supportTypes = body.supportTypes ?? [];
  const supportRequested = body.supportRequested ?? supportTypes.length > 0;

  const caseRow = await prisma.$transaction(async (tx) => {
    const c = await tx.case.create({
      data: {
        userId,
        title: body.title.trim(),
        summary,
        fullNarrative: body.narrativePrivate.trim(),
        scamType: body.scamType.trim(),
        amountLost:
          body.amountCents != null
            ? new Prisma.Decimal(body.amountCents / 100)
            : null,
        currency: body.currency?.trim() || "USD",
        paymentMethod: body.paymentMethod?.trim() || null,
        incidentStartDate: body.occurredAtStart ? new Date(body.occurredAtStart) : null,
        incidentEndDate: body.occurredAtEnd ? new Date(body.occurredAtEnd) : null,
        initialContactChannel: body.initialContactChannel?.trim() || null,
        jurisdiction: jurisdiction || null,
        visibility: mapVisibility(body.visibility),
        status: CaseStatus.NEW,
        allowFollowUp: body.allowFollowUp ?? true,
        allowLawEnforcementReferral: body.allowLawEnforcementReferral ?? false,
        allowCaseMatching: body.allowCaseMatching ?? true,
        allowPublicAnonymizedUse: body.allowAnonymizedPublicSearch ?? false,
      },
    });

    if (supportRequested && supportTypes.length > 0) {
      await tx.supportRequest.createMany({
        data: supportTypes.map((supportType) => ({
          userId,
          caseId: c.id,
          supportType,
          status: SupportRequestStatus.OPEN,
          note: "Requested during report submission",
        })),
      });
    }

    return c;
  });

  const supplemental = supplementalParsedIndicators(body);

  if (caseRow.allowCaseMatching) {
    await processCaseForMatching(caseRow.id, {
      supplementalIndicators: supplemental.length ? supplemental : undefined,
    });
  } else {
    await prisma.case.update({
      where: { id: caseRow.id },
      data: { status: CaseStatus.PENDING_REVIEW },
    });
    if (supplemental.length) {
      await prisma.caseIndicator.deleteMany({ where: { caseId: caseRow.id } });
      await prisma.caseIndicator.createMany({
        data: supplemental.map((p) => ({
          caseId: caseRow.id,
          indicatorType: p.type,
          rawValue: p.rawValue,
          normalizedValue: p.normalizedValue,
          isPublic: false,
          isVerified: p.confidence >= 0.95,
          confidenceScore: Math.round(p.confidence * 100),
        })),
      });
    }
  }

  return { caseId: caseRow.id };
}

"use server";

import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/auth/require-role";
import { translateCaseForReview, type CaseReviewTranslation } from "@/lib/i18n/translate-case-review";

export type TranslateForReviewResult =
  | { ok: true; translation: CaseReviewTranslation }
  | { ok: false; error: string };

/** Moderator-initiated: redact PII, translate the narrative to English, cache it. */
export async function translateCaseForReviewAction(caseId: string): Promise<TranslateForReviewResult> {
  await requireRole([UserRole.admin, UserRole.moderator]);
  const res = await translateCaseForReview(caseId);
  if (!res.ok || !res.translation) {
    return { ok: false, error: res.error ?? "Translation unavailable." };
  }
  return { ok: true, translation: res.translation };
}

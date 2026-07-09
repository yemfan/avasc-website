"use server";

import { z } from "zod";
import { CaseStatus, CaseVisibility } from "@prisma/client";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import {
  adminCaseQuickAction,
  adminCreateClusterForCase,
  adminLinkCaseToCluster,
  adminSuggestClusterReview,
  adminUpdateCase,
  adminUpdateEvidenceReview,
  adminUpdateIndicator,
} from "../../_actions/cases";

const statusZ = z.nativeEnum(CaseStatus);
const visibilityZ = z.nativeEnum(CaseVisibility);

export async function submitCaseModeration(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const caseId = String(formData.get("caseId") ?? "");
  const statusRaw = formData.get("status");
  const visibilityRaw = formData.get("visibility");
  const internalNotes = formData.get("internalNotes");

  const payload: {
    caseId: string;
    status?: z.infer<typeof statusZ>;
    visibility?: z.infer<typeof visibilityZ>;
    internalNotes?: string | null;
  } = { caseId };
  if (typeof statusRaw === "string" && statusRaw.length) {
    const s = statusZ.safeParse(statusRaw);
    if (s.success) payload.status = s.data;
  }
  if (typeof visibilityRaw === "string" && visibilityRaw.length) {
    const v = visibilityZ.safeParse(visibilityRaw);
    if (v.success) payload.visibility = v.data;
  }
  if (typeof internalNotes === "string") {
    payload.internalNotes = internalNotes.length ? internalNotes : null;
  }

  await adminUpdateCase(payload);
}

export async function submitClusterLink(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const caseId = String(formData.get("caseId") ?? "");
  const clusterId = String(formData.get("clusterId") ?? "");
  await adminLinkCaseToCluster({ caseId, clusterId });
}

export async function submitCaseQuickAction(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const caseId = String(formData.get("caseId") ?? "");
  const intent = String(formData.get("intent") ?? "");
  await adminCaseQuickAction({ caseId, intent });
}

export async function submitIndicatorUpdate(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const indicatorId = String(formData.get("indicatorId") ?? "");
  const value = formData.get("value");
  const isPublicRaw = formData.get("isPublic");
  const confidence = formData.get("confidenceScore");
  const staffReviewRaw = formData.get("staffReview");

  let isPublic: boolean | undefined;
  if (isPublicRaw === "true") isPublic = true;
  if (isPublicRaw === "false") isPublic = false;

  let staffReview: "none" | "verified" | "suspicious" | undefined;
  if (staffReviewRaw === "none" || staffReviewRaw === "verified" || staffReviewRaw === "suspicious") {
    staffReview = staffReviewRaw;
  }

  await adminUpdateIndicator({
    indicatorId,
    ...(typeof value === "string" && value.length ? { value } : {}),
    ...(isPublic !== undefined ? { isPublic } : {}),
    ...(confidence !== null && confidence !== undefined && String(confidence).length
      ? { confidenceScore: Number(confidence) }
      : {}),
    ...(staffReview !== undefined ? { staffReview } : {}),
  });
}

export async function submitEvidenceReview(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const evidenceId = String(formData.get("evidenceId") ?? "");
  const staffReviewStatus = String(formData.get("staffReviewStatus") ?? "");
  if (staffReviewStatus !== "none" && staffReviewStatus !== "reviewed" && staffReviewStatus !== "needs_redaction") {
    return;
  }
  await adminUpdateEvidenceReview({ evidenceId, staffReviewStatus });
}

export async function submitCreateClusterFromCase(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const caseId = String(formData.get("caseId") ?? "");
  const title = formData.get("newClusterTitle");
  const slug = formData.get("newClusterSlug");
  await adminCreateClusterForCase({
    caseId,
    ...(typeof title === "string" && title.trim().length >= 2 ? { title: title.trim() } : {}),
    ...(typeof slug === "string" && slug.trim().length >= 2 ? { slug: slug.trim() } : {}),
  });
}

export async function submitSuggestCluster(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const caseId = String(formData.get("caseId") ?? "");
  await adminSuggestClusterReview({ caseId });
}

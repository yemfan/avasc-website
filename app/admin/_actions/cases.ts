"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  CaseStatus,
  CaseVisibility,
  ClusterPublicStatus,
  EvidenceRedactionStatus,
  RiskLevel,
} from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import { writeAuditLog } from "@/lib/admin/audit";
import { newRowId } from "@/lib/db/id";
import {
  caseQuickActionSchema,
  evidenceReviewSchema,
  indicatorUpdateSchema,
  linkClusterSchema,
  updateCaseCoreSchema,
} from "@/lib/admin/case-detail-schemas";

export async function adminUpdateCase(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = updateCaseCoreSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid payload" };
  }
  const prisma = getPrisma();
  const { caseId, ...rest } = parsed.data;
  const before = await prisma.case.findUnique({
    where: { id: caseId },
    select: { status: true, visibility: true },
  });
  if (!before) return { ok: false as const, error: "Case not found" };

  await prisma.case.update({
    where: { id: caseId },
    data: {
      ...(rest.status !== undefined ? { status: rest.status } : {}),
      ...(rest.visibility !== undefined ? { visibility: rest.visibility } : {}),
      ...(rest.internalNotes !== undefined ? { internalNotes: rest.internalNotes } : {}),
    },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "Case",
    entityId: caseId,
    action: "case.updated",
    metadata: { before, after: rest },
  });

  revalidatePath("/admin/cases");
  revalidatePath(`/admin/cases/${caseId}`);
  return { ok: true as const };
}

export async function adminCaseQuickAction(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = caseQuickActionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid payload" };
  }

  const prisma = getPrisma();
  const { caseId, intent } = parsed.data;
  const kase = await prisma.case.findUnique({
    where: { id: caseId },
    select: { status: true, visibility: true, internalNotes: true },
  });
  if (!kase) return { ok: false as const, error: "Case not found" };

  const stamp = new Date().toISOString();

  if (intent === "approve_anonymized") {
    await prisma.case.update({
      where: { id: caseId },
      data: {
        visibility: CaseVisibility.anonymized_public,
        status:
          kase.status === CaseStatus.CLOSED
            ? CaseStatus.CLOSED
            : CaseStatus.PENDING_REVIEW,
      },
    });
    await writeAuditLog(prisma, {
      actorUserId: ctx.userId,
      entityType: "Case",
      entityId: caseId,
      action: "case.moderation_approve_anonymized",
      metadata: { beforeVisibility: kase.visibility },
    });
  } else if (intent === "keep_private") {
    await prisma.case.update({
      where: { id: caseId },
      data: { visibility: CaseVisibility.private },
    });
    await writeAuditLog(prisma, {
      actorUserId: ctx.userId,
      entityType: "Case",
      entityId: caseId,
      action: "case.moderation_keep_private",
      metadata: { beforeVisibility: kase.visibility },
    });
  } else if (intent === "flag_escalation") {
    const line = `[${stamp}] Flagged for escalation.`;
    await prisma.case.update({
      where: { id: caseId },
      data: {
        status: CaseStatus.PENDING_REVIEW,
        internalNotes: kase.internalNotes ? `${kase.internalNotes}\n${line}` : line,
      },
    });
    await writeAuditLog(prisma, {
      actorUserId: ctx.userId,
      entityType: "Case",
      entityId: caseId,
      action: "case.moderation_flag_escalation",
      metadata: {},
    });
  } else if (intent === "mark_reviewed") {
    await prisma.case.update({
      where: { id: caseId },
      data: {
        status:
          kase.status === CaseStatus.CLOSED
            ? CaseStatus.CLOSED
            : CaseStatus.PENDING_REVIEW,
      },
    });
    await writeAuditLog(prisma, {
      actorUserId: ctx.userId,
      entityType: "Case",
      entityId: caseId,
      action: "case.mark_reviewed",
      metadata: { beforeStatus: kase.status },
    });
  }

  revalidatePath("/admin/cases");
  revalidatePath(`/admin/cases/${caseId}`);
  return { ok: true as const };
}

export async function adminLinkCaseToCluster(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = linkClusterSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const cluster = await prisma.scamCluster.findUnique({ where: { id: parsed.data.clusterId } });
  if (!cluster) return { ok: false as const, error: "Cluster not found" };

  await prisma.scamClusterCase.upsert({
    where: {
      scamClusterId_caseId: {
        scamClusterId: parsed.data.clusterId,
        caseId: parsed.data.caseId,
      },
    },
    create: {
      id: newRowId(),
      scamClusterId: parsed.data.clusterId,
      caseId: parsed.data.caseId,
    },
    update: {},
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "Case",
    entityId: parsed.data.caseId,
    action: "case.cluster_linked",
    metadata: { clusterId: parsed.data.clusterId },
  });

  revalidatePath("/admin/cases");
  revalidatePath(`/admin/cases/${parsed.data.caseId}`);
  revalidatePath("/admin/clusters");
  revalidatePath(`/admin/clusters/${parsed.data.clusterId}`);
  return { ok: true as const };
}

function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
  return base.length >= 2 ? base : "case-cluster";
}

const createClusterForCaseInput = z.object({
  caseId: z.string().min(1),
  title: z.string().min(2).max(200).optional(),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
});

export async function adminCreateClusterForCase(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = createClusterForCaseInput.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const kase = await prisma.case.findUnique({
    where: { id: parsed.data.caseId },
    select: { title: true, scamType: true },
  });
  if (!kase) return { ok: false as const, error: "Case not found" };

  const title = parsed.data.title ?? `Cluster: ${kase.title.slice(0, 120)}`;
  const slug = parsed.data.slug ?? slugifyTitle(kase.title);
  let candidate = slug;
  for (let i = 0; i < 30; i++) {
    const taken = await prisma.scamCluster.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!taken) break;
    candidate = `${slug}-${i + 1}`;
  }

  const clusterId = newRowId();
  const now = new Date();
  await prisma.scamCluster.create({
    data: {
      id: clusterId,
      title,
      slug: candidate,
      scamType: kase.scamType,
      summary: "",
      riskLevel: RiskLevel.MEDIUM,
      publicStatus: ClusterPublicStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.scamClusterCase.upsert({
    where: {
      scamClusterId_caseId: {
        scamClusterId: clusterId,
        caseId: parsed.data.caseId,
      },
    },
    create: {
      id: newRowId(),
      scamClusterId: clusterId,
      caseId: parsed.data.caseId,
    },
    update: {},
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "Case",
    entityId: parsed.data.caseId,
    action: "case.cluster_created_and_linked",
    metadata: { clusterId, slug: candidate },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "ScamCluster",
    entityId: clusterId,
    action: "cluster.created",
    metadata: { slug: candidate, fromCaseId: parsed.data.caseId },
  });

  revalidatePath("/admin/cases");
  revalidatePath(`/admin/cases/${parsed.data.caseId}`);
  revalidatePath("/admin/clusters");
  revalidatePath(`/admin/clusters/${clusterId}`);
  return { ok: true as const, clusterId };
}

const suggestClusterSchema = z.object({
  caseId: z.string().min(1),
});

export async function adminSuggestClusterReview(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = suggestClusterSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const kase = await prisma.case.findUnique({
    where: { id: parsed.data.caseId },
    select: { internalNotes: true },
  });
  if (!kase) return { ok: false as const, error: "Case not found" };

  const line = `[${new Date().toISOString()}] Cluster suggestion / merge review requested.`;
  await prisma.case.update({
    where: { id: parsed.data.caseId },
    data: {
      internalNotes: kase.internalNotes ? `${kase.internalNotes}\n${line}` : line,
    },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "Case",
    entityId: parsed.data.caseId,
    action: "case.cluster_suggestion_logged",
    metadata: {},
  });

  revalidatePath(`/admin/cases/${parsed.data.caseId}`);
  return { ok: true as const };
}

export async function adminUpdateIndicator(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = indicatorUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const ind = await prisma.caseIndicator.findUnique({
    where: { id: parsed.data.indicatorId },
    select: { caseId: true },
  });
  if (!ind) return { ok: false as const, error: "Indicator not found" };

  const trimmed = parsed.data.value?.trim();
  const isVerifiedPatch =
    parsed.data.staffReview === "verified"
      ? true
      : parsed.data.staffReview === "suspicious"
        ? false
        : undefined;

  await prisma.caseIndicator.update({
    where: { id: parsed.data.indicatorId },
    data: {
      ...(trimmed !== undefined
        ? { rawValue: trimmed, normalizedValue: trimmed }
        : {}),
      ...(parsed.data.isPublic !== undefined ? { isPublic: parsed.data.isPublic } : {}),
      ...(parsed.data.confidenceScore !== undefined
        ? { confidenceScore: parsed.data.confidenceScore }
        : {}),
      ...(isVerifiedPatch !== undefined ? { isVerified: isVerifiedPatch } : {}),
    },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "CaseIndicator",
    entityId: parsed.data.indicatorId,
    action: "indicator.updated",
    metadata: parsed.data,
  });

  revalidatePath(`/admin/cases/${ind.caseId}`);
  return { ok: true as const };
}

export async function adminUpdateEvidenceReview(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = evidenceReviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const row = await prisma.evidenceFile.findUnique({
    where: { id: parsed.data.evidenceId },
    select: { caseId: true },
  });
  if (!row) return { ok: false as const, error: "Evidence not found" };

  const review = parsed.data.staffReviewStatus;
  const evidenceData =
    review === "reviewed"
      ? { redactionStatus: EvidenceRedactionStatus.SAFE, isReviewed: true }
      : review === "needs_redaction"
        ? { redactionStatus: EvidenceRedactionStatus.NEEDS_REDACTION, isReviewed: true }
        : { redactionStatus: EvidenceRedactionStatus.NOT_REVIEWED, isReviewed: false };

  await prisma.evidenceFile.update({
    where: { id: parsed.data.evidenceId },
    data: evidenceData,
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "EvidenceFile",
    entityId: parsed.data.evidenceId,
    action: "evidence.staff_review_updated",
    metadata: { staffReviewStatus: review, caseId: row.caseId },
  });

  revalidatePath(`/admin/cases/${row.caseId}`);
  return { ok: true as const };
}

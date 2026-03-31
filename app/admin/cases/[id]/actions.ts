"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  CaseStatus,
  CaseVisibility,
  RecoveryStage,
  ClusterPublicStatus,
  RiskLevel,
  UserRole,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";
import { recomputeCaseMatches } from "@/lib/matching/recompute-case-matches";
import {
  submitCaseQuickAction,
} from "./form-actions";

const quickIntentZ = z.enum([
  "approve_anonymized",
  "keep_private",
  "flag_escalation",
  "mark_reviewed",
]);

const updateCaseModerationSchema = z.object({
  caseId: z.string().min(1),
  status: z.nativeEnum(CaseStatus),
  visibility: z.nativeEnum(CaseVisibility),
  recoveryStage: z.nativeEnum(RecoveryStage),
  internalNotes: z.string().nullable().optional(),
});

const assignCaseToClusterSchema = z.object({
  caseId: z.string().min(1),
  clusterId: z.string().min(1),
});

const removeCaseFromClusterSchema = z.object({
  caseId: z.string().min(1),
  clusterId: z.string().min(1),
});

const createClusterFromCaseSchema = z.object({
  caseId: z.string().min(1),
  title: z.string().min(3).max(200),
  scamType: z.string().min(2).max(100),
  summary: z.string().min(10).max(3000),
  publicStatus: z.nativeEnum(ClusterPublicStatus),
  riskLevel: z.nativeEnum(RiskLevel),
});

const updateIndicatorSchema = z.object({
  indicatorId: z.string().min(1),
  normalizedValue: z.string().min(1).max(1000),
  isPublic: z.enum(["true", "false"]),
  isVerified: z.enum(["true", "false"]),
});

const recomputeSchema = z.object({
  caseId: z.string().min(1),
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function ensureUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let counter = 1;

  while (
    await prisma.scamCluster.findUnique({
      where: { slug },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

async function requireAdminModerator() {
  await requireRole([UserRole.admin, UserRole.moderator]);
}

export async function runCaseQuickAction(caseId: string, intent: z.infer<typeof quickIntentZ>) {
  await requireAdminModerator();
  const parsedIntent = quickIntentZ.safeParse(intent);
  if (!parsedIntent.success) return;

  const fd = new FormData();
  fd.set("caseId", caseId);
  fd.set("intent", parsedIntent.data);
  await submitCaseQuickAction(fd);
}

export async function updateCaseModerationAction(formData: FormData) {
  const admin = await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = updateCaseModerationSchema.safeParse({
    caseId: formData.get("caseId"),
    status: formData.get("status"),
    visibility: formData.get("visibility"),
    recoveryStage: formData.get("recoveryStage"),
    internalNotes: formData.get("internalNotes"),
  });

  if (!parsed.success) {
    throw new Error("Invalid case moderation form submission.");
  }

  const { caseId, status, visibility, recoveryStage, internalNotes } =
    parsed.data;

  const existing = await prisma.case.findUnique({
    where: { id: caseId },
    select: { id: true, status: true, visibility: true, recoveryStage: true },
  });

  if (!existing) {
    throw new Error("Case not found.");
  }

  await prisma.case.update({
    where: { id: caseId },
    data: {
      status,
      visibility,
      recoveryStage,
      internalNotes: internalNotes || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      entityType: "Case",
      entityId: caseId,
      action: "CASE_MODERATION_UPDATED",
      metadataJson: {
        previous: {
          status: existing.status,
          visibility: existing.visibility,
          recoveryStage: existing.recoveryStage,
        },
        next: {
          status,
          visibility,
          recoveryStage,
        },
      },
    },
  });

  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath("/admin/cases");
}

/** Backward-compatible alias used by existing moderation card form action. */
export const saveCaseModeration = updateCaseModerationAction;

export async function assignCaseToClusterAction(formData: FormData) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = assignCaseToClusterSchema.safeParse({
    caseId: formData.get("caseId"),
    clusterId: formData.get("clusterId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid cluster assignment request.");
  }

  const { caseId, clusterId } = parsed.data;

  const [caseRecord, clusterRecord] = await Promise.all([
    prisma.case.findUnique({ where: { id: caseId }, select: { id: true, title: true } }),
    prisma.scamCluster.findUnique({
      where: { id: clusterId },
      select: { id: true, title: true },
    }),
  ]);

  if (!caseRecord || !clusterRecord) {
    throw new Error("Case or cluster not found.");
  }

  await prisma.scamClusterCase.upsert({
    where: {
      scamClusterId_caseId: {
        scamClusterId: clusterId,
        caseId,
      },
    },
    create: {
      scamClusterId: clusterId,
      caseId,
    },
    update: {},
  });

  await prisma.case.update({
    where: { id: caseId },
    data: {
      status: CaseStatus.CLUSTERED,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "Case",
      entityId: caseId,
      action: "CASE_ASSIGNED_TO_CLUSTER",
      metadataJson: {
        clusterId,
        clusterTitle: clusterRecord.title,
      },
    },
  });

  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath("/admin/cases");
  revalidatePath("/admin/clusters");
  revalidatePath(`/admin/clusters/${clusterId}`);
}

export async function removeCaseFromClusterAction(formData: FormData) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = removeCaseFromClusterSchema.safeParse({
    caseId: formData.get("caseId"),
    clusterId: formData.get("clusterId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid remove-from-cluster request.");
  }

  const { caseId, clusterId } = parsed.data;

  await prisma.scamClusterCase.deleteMany({
    where: {
      caseId,
      scamClusterId: clusterId,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "Case",
      entityId: caseId,
      action: "CASE_REMOVED_FROM_CLUSTER",
      metadataJson: {
        clusterId,
      },
    },
  });

  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath("/admin/clusters");
  revalidatePath(`/admin/clusters/${clusterId}`);
}

export async function createClusterFromCaseAction(formData: FormData) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = createClusterFromCaseSchema.safeParse({
    caseId: formData.get("caseId"),
    title: formData.get("title"),
    scamType: formData.get("scamType"),
    summary: formData.get("summary"),
    publicStatus: formData.get("publicStatus"),
    riskLevel: formData.get("riskLevel"),
  });

  if (!parsed.success) {
    throw new Error("Invalid create-cluster form submission.");
  }

  const { caseId, title, scamType, summary, publicStatus, riskLevel } =
    parsed.data;

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: { id: true, title: true },
  });

  if (!caseRecord) {
    throw new Error("Case not found.");
  }

  const baseSlug = slugify(title);
  const slug = await ensureUniqueSlug(baseSlug);

  const cluster = await prisma.scamCluster.create({
    data: {
      title,
      slug,
      scamType,
      summary,
      publicStatus,
      riskLevel,
      caseLinks: {
        create: {
          caseId,
        },
      },
    },
  });

  await prisma.case.update({
    where: { id: caseId },
    data: {
      status: CaseStatus.CLUSTERED,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "ScamCluster",
      entityId: cluster.id,
      action: "CLUSTER_CREATED_FROM_CASE",
      metadataJson: {
        sourceCaseId: caseId,
        clusterTitle: cluster.title,
        slug: cluster.slug,
      },
    },
  });

  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath("/admin/clusters");
  revalidatePath(`/admin/clusters/${cluster.id}`);
}

export async function updateIndicatorAction(formData: FormData) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = updateIndicatorSchema.safeParse({
    indicatorId: formData.get("indicatorId"),
    normalizedValue: formData.get("normalizedValue"),
    isPublic: formData.get("isPublic"),
    isVerified: formData.get("isVerified"),
  });

  if (!parsed.success) {
    throw new Error("Invalid indicator update submission.");
  }

  const { indicatorId, normalizedValue, isPublic, isVerified } = parsed.data;

  const indicator = await prisma.caseIndicator.findUnique({
    where: { id: indicatorId },
    select: {
      id: true,
      caseId: true,
      rawValue: true,
      normalizedValue: true,
      isPublic: true,
      isVerified: true,
      indicatorType: true,
    },
  });

  if (!indicator) {
    throw new Error("Indicator not found.");
  }

  const nextValues = {
    normalizedValue: normalizedValue.trim(),
    isPublic: isPublic === "true",
    isVerified: isVerified === "true",
  };

  await prisma.caseIndicator.update({
    where: { id: indicatorId },
    data: nextValues,
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "CaseIndicator",
      entityId: indicatorId,
      action: "INDICATOR_UPDATED",
      metadataJson: {
        caseId: indicator.caseId,
        indicatorType: indicator.indicatorType,
        rawValue: indicator.rawValue,
        previous: {
          normalizedValue: indicator.normalizedValue,
          isPublic: indicator.isPublic,
          isVerified: indicator.isVerified,
        },
        next: nextValues,
      },
    },
  });

  revalidatePath(`/admin/cases/${indicator.caseId}`);
  revalidatePath("/admin/cases");
}

export async function recomputeMatchesAction(formData: FormData) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = recomputeSchema.safeParse({
    caseId: formData.get("caseId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid recompute request.");
  }

  const { caseId } = parsed.data;

  const result = await recomputeCaseMatches(caseId);

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "Case",
      entityId: caseId,
      action: "CASE_MATCHES_RECOMPUTED",
      metadataJson: {
        matchesCreated: result.matchesCreated,
        suggestionsCreated: result.suggestionsCreated,
      },
    },
  });

  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath("/admin/cases");
}

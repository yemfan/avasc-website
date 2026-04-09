"use server";

import { revalidatePath } from "next/cache";
import {
  CaseStatus,
  ClusterPublicStatus,
  ClusterSuggestionType,
  RiskLevel,
  SuggestionStatus,
  UserRole,
} from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";
import {
  linkCaseToClusterInTransaction,
  processCaseForMatching,
  recomputeClusterIndicatorAggregates,
} from "@/lib/clustering/process-case-for-matching";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const saveIndicatorEditsSchema = z.object({
  caseId: z.string().uuid(),
  indicators: z.array(
    z.object({
      id: z.string().uuid(),
      isVerified: z.boolean(),
      isPublic: z.boolean(),
      normalizedValue: z.string().min(1).max(1000),
    })
  ),
});

const suggestionActionSchema = z.object({
  caseId: z.string().uuid(),
  suggestionId: z.string().uuid(),
});

const forceAssignSchema = z.object({
  caseId: z.string().uuid(),
  clusterId: z.string().uuid(),
});

const createClusterFromSuggestionSchema = z.object({
  caseId: z.string().uuid(),
  suggestionId: z.string().uuid(),
  title: z.string().min(3).max(200),
  scamType: z.string().min(2).max(120),
  summary: z.string().min(10).max(3000),
  riskLevel: z.nativeEnum(RiskLevel),
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function ensureUniqueSlugForTx(tx: Prisma.TransactionClient, baseSlug: string) {
  let slug = baseSlug;
  let counter = 1;

  while (await tx.scamCluster.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

function revalidateReviewPaths(caseId: string) {
  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath("/admin/cases");
  revalidatePath("/admin/clusters");
}

async function requireAdminModerator() {
  return requireRole([UserRole.admin, UserRole.moderator]);
}

// ---------------------------------------------------------------------------
// Public actions
// ---------------------------------------------------------------------------

export async function saveIndicatorEditsAction(input: z.infer<typeof saveIndicatorEditsSchema>) {
  const actor = await requireAdminModerator();
  const parsed = saveIndicatorEditsSchema.parse(input);

  await prisma.$transaction(async (tx) => {
    const ids = parsed.indicators.map((i) => i.id);
    const owned = await tx.caseIndicator.findMany({
      where: { id: { in: ids }, caseId: parsed.caseId },
      select: { id: true },
    });
    if (owned.length !== parsed.indicators.length) {
      throw new Error("One or more indicators do not belong to this case.");
    }

    for (const indicator of parsed.indicators) {
      await tx.caseIndicator.update({
        where: { id: indicator.id },
        data: {
          isVerified: indicator.isVerified,
          isPublic: indicator.isPublic,
          normalizedValue: indicator.normalizedValue.trim(),
        },
      });
    }

    const links = await tx.scamClusterCase.findMany({
      where: { caseId: parsed.caseId },
      select: { scamClusterId: true },
    });

    for (const link of links) {
      await recomputeClusterIndicatorAggregates(tx, link.scamClusterId);
    }

    await tx.auditLog.create({
      data: {
        actorUserId: actor.id,
        entityType: "Case",
        entityId: parsed.caseId,
        action: "CASE_INDICATORS_BATCH_UPDATED",
        metadataJson: { indicatorCount: parsed.indicators.length },
      },
    });
  });

  revalidateReviewPaths(parsed.caseId);
  return { success: true as const };
}

export async function approveClusterSuggestionAction(input: z.infer<typeof suggestionActionSchema>) {
  const actor = await requireAdminModerator();
  const parsed = suggestionActionSchema.parse(input);

  await prisma.$transaction(async (tx) => {
    const suggestion = await tx.clusterSuggestion.findUnique({
      where: { id: parsed.suggestionId },
    });

    if (!suggestion || suggestion.caseId !== parsed.caseId) {
      throw new Error("Suggestion not found for case.");
    }

    if (
      suggestion.suggestionType !== ClusterSuggestionType.ASSIGN_TO_EXISTING ||
      !suggestion.suggestedClusterId
    ) {
      throw new Error("Suggestion is not an assign-to-existing suggestion.");
    }

    await linkCaseToClusterInTransaction(tx, parsed.caseId, suggestion.suggestedClusterId);
    await recomputeClusterIndicatorAggregates(tx, suggestion.suggestedClusterId);

    await tx.clusterSuggestion.update({
      where: { id: suggestion.id },
      data: {
        status: SuggestionStatus.ACCEPTED,
        reviewedAt: new Date(),
      },
    });

    await tx.clusterSuggestion.updateMany({
      where: {
        caseId: parsed.caseId,
        id: { not: suggestion.id },
        status: SuggestionStatus.PENDING,
      },
      data: {
        status: SuggestionStatus.REJECTED,
        reviewedAt: new Date(),
      },
    });

    await tx.case.update({
      where: { id: parsed.caseId },
      data: { status: CaseStatus.CLUSTERED },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: actor.id,
        entityType: "ClusterSuggestion",
        entityId: suggestion.id,
        action: "CLUSTER_SUGGESTION_APPROVED_ASSIGN",
        metadataJson: { caseId: parsed.caseId, clusterId: suggestion.suggestedClusterId },
      },
    });
  });

  revalidateReviewPaths(parsed.caseId);
  return { success: true as const };
}

export async function rejectClusterSuggestionAction(input: z.infer<typeof suggestionActionSchema>) {
  const actor = await requireAdminModerator();
  const parsed = suggestionActionSchema.parse(input);

  const updated = await prisma.clusterSuggestion.updateMany({
    where: {
      id: parsed.suggestionId,
      caseId: parsed.caseId,
    },
    data: {
      status: SuggestionStatus.REJECTED,
      reviewedAt: new Date(),
    },
  });

  if (updated.count === 0) {
    throw new Error("Suggestion not found.");
  }

  await prisma.case.update({
    where: { id: parsed.caseId },
    data: { status: CaseStatus.PENDING_REVIEW },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "ClusterSuggestion",
      entityId: parsed.suggestionId,
      action: "CLUSTER_SUGGESTION_REJECTED",
      metadataJson: { caseId: parsed.caseId },
    },
  });

  revalidateReviewPaths(parsed.caseId);
  return { success: true as const };
}

export async function forceAssignCaseToClusterAction(input: z.infer<typeof forceAssignSchema>) {
  const actor = await requireAdminModerator();
  const parsed = forceAssignSchema.parse(input);

  await prisma.$transaction(async (tx) => {
    await linkCaseToClusterInTransaction(tx, parsed.caseId, parsed.clusterId);
    await recomputeClusterIndicatorAggregates(tx, parsed.clusterId);

    await tx.clusterSuggestion.updateMany({
      where: {
        caseId: parsed.caseId,
        status: SuggestionStatus.PENDING,
      },
      data: {
        status: SuggestionStatus.REJECTED,
        reviewedAt: new Date(),
      },
    });

    await tx.case.update({
      where: { id: parsed.caseId },
      data: { status: CaseStatus.CLUSTERED },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: actor.id,
        entityType: "Case",
        entityId: parsed.caseId,
        action: "CASE_FORCE_ASSIGNED_TO_CLUSTER",
        metadataJson: { clusterId: parsed.clusterId },
      },
    });
  });

  revalidateReviewPaths(parsed.caseId);
  return { success: true as const };
}

export async function createClusterFromSuggestionAction(input: z.infer<typeof createClusterFromSuggestionSchema>) {
  const actor = await requireAdminModerator();
  const parsed = createClusterFromSuggestionSchema.parse(input);
  const riskLevel = parsed.riskLevel as RiskLevel;

  const result = await prisma.$transaction(async (tx) => {
    const suggestion = await tx.clusterSuggestion.findUnique({
      where: { id: parsed.suggestionId },
    });

    if (!suggestion || suggestion.caseId !== parsed.caseId) {
      throw new Error("Suggestion not found for case.");
    }

    if (suggestion.suggestionType !== ClusterSuggestionType.CREATE_NEW) {
      throw new Error("Suggestion is not a create-new suggestion.");
    }

    const baseSlug = slugify(parsed.title);
    const slug = await ensureUniqueSlugForTx(tx, baseSlug);

    const cluster = await tx.scamCluster.create({
      data: {
        title: parsed.title,
        slug,
        scamType: parsed.scamType,
        summary: parsed.summary,
        riskLevel,
        publicStatus: ClusterPublicStatus.DRAFT,
      },
    });

    await linkCaseToClusterInTransaction(tx, parsed.caseId, cluster.id);
    await recomputeClusterIndicatorAggregates(tx, cluster.id);

    await tx.clusterSuggestion.update({
      where: { id: suggestion.id },
      data: {
        status: SuggestionStatus.ACCEPTED,
        reviewedAt: new Date(),
        suggestedClusterId: cluster.id,
      },
    });

    await tx.clusterSuggestion.updateMany({
      where: {
        caseId: parsed.caseId,
        id: { not: suggestion.id },
        status: SuggestionStatus.PENDING,
      },
      data: {
        status: SuggestionStatus.REJECTED,
        reviewedAt: new Date(),
      },
    });

    await tx.case.update({
      where: { id: parsed.caseId },
      data: { status: CaseStatus.CLUSTERED },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: actor.id,
        entityType: "ScamCluster",
        entityId: cluster.id,
        action: "CLUSTER_CREATED_FROM_SUGGESTION",
        metadataJson: { caseId: parsed.caseId, suggestionId: suggestion.id },
      },
    });

    return cluster;
  });

  revalidateReviewPaths(parsed.caseId);
  revalidatePath(`/admin/clusters/${result.id}`);

  return { success: true as const, clusterId: result.id };
}

export async function recomputeMatchingAction(input: { caseId: string }) {
  const actor = await requireAdminModerator();
  const caseId = z.string().uuid().parse(input.caseId);

  await processCaseForMatching(caseId);

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "Case",
      entityId: caseId,
      action: "CASE_INTAKE_PIPELINE_RECOMPUTED",
      metadataJson: { pipeline: "processCaseForMatching" },
    },
  });

  revalidateReviewPaths(caseId);
  return { success: true as const };
}

export async function approveAllHighConfidenceIndicatorsAction(input: { caseId: string }) {
  await requireAdminModerator();
  const caseId = z.string().uuid().parse(input.caseId);

  await prisma.caseIndicator.updateMany({
    where: {
      caseId,
      confidenceScore: { gte: 95 },
    },
    data: {
      isVerified: true,
    },
  });

  revalidateReviewPaths(caseId);
  return { success: true as const };
}

export async function rejectAllPendingSuggestionsAction(input: { caseId: string }) {
  await requireAdminModerator();
  const caseId = z.string().uuid().parse(input.caseId);

  await prisma.clusterSuggestion.updateMany({
    where: {
      caseId,
      status: SuggestionStatus.PENDING,
    },
    data: {
      status: SuggestionStatus.REJECTED,
      reviewedAt: new Date(),
    },
  });

  revalidateReviewPaths(caseId);
  return { success: true as const };
}

export async function getAdminCaseReviewData(caseId: string) {
  await requireAdminModerator();
  const id = z.string().uuid().parse(caseId);

  const data = await prisma.case.findUnique({
    where: { id },
    include: {
      indicators: {
        orderBy: [{ indicatorType: "asc" }, { confidenceScore: "desc" }],
      },
      clusterSuggestions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!data) return null;

  const topSuggestion = data.clusterSuggestions[0] ?? null;

  const matchCandidates = topSuggestion?.suggestedClusterId
    ? await prisma.scamCluster.findMany({
        where: { id: topSuggestion.suggestedClusterId },
        select: {
          id: true,
          title: true,
          scamType: true,
          riskLevel: true,
          publicStatus: true,
        },
      })
    : [];

  return {
    case: data,
    topSuggestion,
    matchCandidates,
  };
}

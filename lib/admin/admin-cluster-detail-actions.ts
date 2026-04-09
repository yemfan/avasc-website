"use server";

import { revalidatePath } from "next/cache";
import {
  ClusterPublicStatus,
  RiskLevel,
  UserRole,
} from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";
import { recomputeClusterIndicatorAggregates } from "@/lib/clustering/process-case-for-matching";

// ------------------------------------------------------------
// Schemas
// ------------------------------------------------------------

const saveClusterMetaSchema = z.object({
  clusterId: z.string().uuid(),
  title: z.string().min(3),
  slug: z.string().min(3),
  scamType: z.string().min(2),
  summary: z.string().min(10),
  riskLevel: z.nativeEnum(RiskLevel),
  publicStatus: z.nativeEnum(ClusterPublicStatus),
  redFlags: z.string().optional().default(""),
  commonScript: z.string().optional().default(""),
  safetyWarning: z.string().optional().default(""),
  recommendedNextStep: z.string().optional().default(""),
});

const saveClusterIndicatorEditsSchema = z.object({
  clusterId: z.string().uuid(),
  indicators: z.array(
    z.object({
      id: z.string().uuid(),
      displayValue: z.string().min(1),
      isPublic: z.boolean(),
      isVerified: z.boolean(),
    })
  ),
});

const setClusterPublicStatusSchema = z.object({
  clusterId: z.string().uuid(),
  publicStatus: z.nativeEnum(ClusterPublicStatus),
});

const mergeClustersSchema = z.object({
  sourceClusterId: z.string().uuid(),
  targetClusterId: z.string().uuid(),
});

const updateClusterFormSchema = z.object({
  clusterId: z.string().uuid(),
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  scamType: z.string().min(2).max(100),
  summary: z.string().min(10).max(5000),
  publicStatus: z.nativeEnum(ClusterPublicStatus),
  riskLevel: z.nativeEnum(RiskLevel),
  redFlags: z.string().optional().nullable(),
  commonScript: z.string().optional().nullable(),
  safetyWarning: z.string().optional().nullable(),
  recommendedNextStep: z.string().optional().nullable(),
});

// ------------------------------------------------------------
// Actions
// ------------------------------------------------------------

export async function updateClusterAction(formData: FormData) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = updateClusterFormSchema.safeParse({
    clusterId: formData.get("clusterId"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    scamType: formData.get("scamType"),
    summary: formData.get("summary"),
    publicStatus: formData.get("publicStatus"),
    riskLevel: formData.get("riskLevel"),
    redFlags: formData.get("redFlags"),
    commonScript: formData.get("commonScript"),
    safetyWarning: formData.get("safetyWarning"),
    recommendedNextStep: formData.get("recommendedNextStep"),
  });

  if (!parsed.success) {
    throw new Error("Invalid cluster update submission.");
  }

  const data = parsed.data;

  await saveClusterMetaAction(
    {
      clusterId: data.clusterId,
      title: data.title,
      slug: data.slug,
      scamType: data.scamType,
      summary: data.summary,
      riskLevel: data.riskLevel,
      publicStatus: data.publicStatus,
      redFlags: data.redFlags ?? "",
      commonScript: data.commonScript ?? "",
      safetyWarning: data.safetyWarning ?? "",
      recommendedNextStep: data.recommendedNextStep ?? "",
    },
    { actorUserId: actor.id, skipRequireRole: true }
  );
}

export async function saveClusterMetaAction(
  input: {
    clusterId: string;
    title: string;
    slug: string;
    scamType: string;
    summary: string;
    riskLevel: RiskLevel;
    publicStatus: ClusterPublicStatus;
    redFlags?: string;
    commonScript?: string;
    safetyWarning?: string;
    recommendedNextStep?: string;
  },
  options?: { actorUserId?: string; skipRequireRole?: boolean }
) {
  let actor: { id: string };
  if (options?.skipRequireRole) {
    if (!options.actorUserId) {
      throw new Error("Internal: actorUserId required when skipRequireRole is set.");
    }
    actor = { id: options.actorUserId };
  } else {
    actor = await requireRole([UserRole.admin, UserRole.moderator]);
  }

  const parsed = saveClusterMetaSchema.parse(input);

  const existingSlug = await prisma.scamCluster.findFirst({
    where: {
      slug: normalizeSlug(parsed.slug),
      id: { not: parsed.clusterId },
    },
    select: { id: true },
  });

  if (existingSlug) {
    throw new Error("Slug already exists on another cluster.");
  }

  const previous = await prisma.scamCluster.findUnique({
    where: { id: parsed.clusterId },
    select: {
      title: true,
      scamType: true,
      publicStatus: true,
      riskLevel: true,
      slug: true,
    },
  });

  if (!previous) {
    throw new Error("Cluster not found.");
  }

  if (parsed.publicStatus === ClusterPublicStatus.PUBLISHED) {
    await assertPublishReady(parsed.clusterId, {
      title: parsed.title.trim(),
      summary: parsed.summary.trim(),
    });
  }

  const nextSlug = normalizeSlug(parsed.slug);

  await prisma.scamCluster.update({
    where: { id: parsed.clusterId },
    data: {
      title: parsed.title.trim(),
      slug: nextSlug,
      scamType: parsed.scamType.trim(),
      summary: parsed.summary.trim(),
      riskLevel: parsed.riskLevel,
      publicStatus: parsed.publicStatus,
      redFlags: normalizeNullableText(parsed.redFlags),
      commonScript: normalizeNullableText(parsed.commonScript),
      safetyWarning: normalizeNullableText(parsed.safetyWarning),
      recommendedNextStep: normalizeNullableText(parsed.recommendedNextStep),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "ScamCluster",
      entityId: parsed.clusterId,
      action: "CLUSTER_UPDATED",
      metadataJson: {
        previous: {
          title: previous.title,
          scamType: previous.scamType,
          publicStatus: previous.publicStatus,
          riskLevel: previous.riskLevel,
          slug: previous.slug,
        },
        next: {
          title: parsed.title.trim(),
          scamType: parsed.scamType.trim(),
          publicStatus: parsed.publicStatus,
          riskLevel: parsed.riskLevel,
          slug: nextSlug,
        },
      },
    },
  });

  revalidateClusterPaths(parsed.clusterId, nextSlug);
}

export async function saveClusterIndicatorEditsAction(input: {
  clusterId: string;
  indicators: Array<{
    id: string;
    displayValue: string;
    isPublic: boolean;
    isVerified: boolean;
  }>;
}) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);
  const parsed = saveClusterIndicatorEditsSchema.parse(input);

  const ids = parsed.indicators.map((i) => i.id);
  const owned = await prisma.clusterIndicatorAggregate.findMany({
    where: {
      id: { in: ids },
      scamClusterId: parsed.clusterId,
    },
    select: { id: true },
  });

  if (owned.length !== ids.length) {
    throw new Error("One or more indicators do not belong to this cluster.");
  }

  await prisma.$transaction(async (tx) => {
    for (const indicator of parsed.indicators) {
      await tx.clusterIndicatorAggregate.update({
        where: { id: indicator.id },
        data: {
          displayValue: indicator.displayValue.trim(),
          isPublic: indicator.isPublic,
          isVerified: indicator.isVerified,
        },
      });
    }

    const publicIndicatorCount = await tx.clusterIndicatorAggregate.count({
      where: {
        scamClusterId: parsed.clusterId,
        isPublic: true,
      },
    });

    await tx.scamCluster.update({
      where: { id: parsed.clusterId },
      data: {
        publicIndicatorCount,
      },
    });
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "ScamCluster",
      entityId: parsed.clusterId,
      action: "CLUSTER_INDICATORS_BATCH_UPDATED",
      metadataJson: {
        indicatorCount: parsed.indicators.length,
      },
    },
  });

  const cluster = await prisma.scamCluster.findUnique({
    where: { id: parsed.clusterId },
    select: { slug: true, publicStatus: true },
  });

  revalidateClusterPaths(parsed.clusterId, cluster?.slug ?? null);
}

export async function setClusterPublicStatusAction(input: {
  clusterId: string;
  publicStatus: ClusterPublicStatus;
}) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);
  const parsed = setClusterPublicStatusSchema.parse(input);

  if (parsed.publicStatus === ClusterPublicStatus.PUBLISHED) {
    await assertPublishReady(parsed.clusterId);
  }

  const previous = await prisma.scamCluster.findUnique({
    where: { id: parsed.clusterId },
    select: { publicStatus: true, slug: true },
  });

  if (!previous) {
    throw new Error("Cluster not found.");
  }

  await prisma.scamCluster.update({
    where: { id: parsed.clusterId },
    data: {
      publicStatus: parsed.publicStatus,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "ScamCluster",
      entityId: parsed.clusterId,
      action: "CLUSTER_PUBLIC_STATUS_SET",
      metadataJson: {
        previous: previous.publicStatus,
        next: parsed.publicStatus,
      },
    },
  });

  revalidateClusterPaths(parsed.clusterId, previous.slug);
}

export async function mergeClustersAction(input: {
  sourceClusterId: string;
  targetClusterId: string;
}) {
  const actor = await requireRole([UserRole.admin]);
  const parsed = mergeClustersSchema.parse(input);

  if (parsed.sourceClusterId === parsed.targetClusterId) {
    throw new Error("Source cluster and target cluster cannot be the same.");
  }

  const slugRows = await prisma.scamCluster.findMany({
    where: { id: { in: [parsed.sourceClusterId, parsed.targetClusterId] } },
    select: { id: true, slug: true },
  });

  await prisma.$transaction(async (tx) => {
    const source = await tx.scamCluster.findUnique({
      where: { id: parsed.sourceClusterId },
      include: {
        caseLinks: true,
      },
    });

    const target = await tx.scamCluster.findUnique({
      where: { id: parsed.targetClusterId },
      include: {
        caseLinks: true,
      },
    });

    if (!source || !target) {
      throw new Error("Source or target cluster not found.");
    }

    for (const link of source.caseLinks) {
      await tx.scamClusterCase.upsert({
        where: {
          scamClusterId_caseId: {
            scamClusterId: target.id,
            caseId: link.caseId,
          },
        },
        create: {
          scamClusterId: target.id,
          caseId: link.caseId,
        },
        update: {},
      });
    }

    await tx.clusterSuggestion.updateMany({
      where: {
        suggestedClusterId: source.id,
      },
      data: {
        suggestedClusterId: target.id,
      },
    });

    await tx.scamClusterCase.deleteMany({
      where: { scamClusterId: source.id },
    });

    await recomputeClusterIndicatorAggregates(tx, target.id);
    await recomputeClusterIndicatorAggregates(tx, source.id);

    await tx.scamCluster.update({
      where: { id: source.id },
      data: {
        publicStatus: ClusterPublicStatus.DRAFT,
        title: `${source.title} [MERGED]`,
        summary: `Merged into cluster ${target.id}. ${source.summary}`,
        reportCountSnapshot: 0,
        publicIndicatorCount: 0,
      },
    });

    await tx.auditLog.createMany({
      data: [
        {
          actorUserId: actor.id,
          entityType: "ScamCluster",
          entityId: source.id,
          action: "CLUSTER_MERGED_INTO_TARGET",
          metadataJson: {
            targetClusterId: target.id,
            targetClusterTitle: target.title,
            sourceClusterTitle: source.title,
          },
        },
        {
          actorUserId: actor.id,
          entityType: "ScamCluster",
          entityId: target.id,
          action: "CLUSTER_RECEIVED_MERGE",
          metadataJson: {
            sourceClusterId: source.id,
            sourceClusterTitle: source.title,
            targetClusterTitle: target.title,
          },
        },
      ],
    });
  });

  for (const row of slugRows) {
    revalidateClusterPaths(row.id, row.slug);
  }

  return { success: true, targetClusterId: parsed.targetClusterId };
}

export async function refreshPublicSearchAction() {
  await requireRole([UserRole.admin]);

  await prisma.$executeRawUnsafe(
    `select public.refresh_public_scam_cluster_search_mv()`
  );

  revalidatePath("/database");
  return { success: true };
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

async function assertPublishReady(
  clusterId: string,
  overrides?: { title: string; summary: string }
) {
  const cluster = await prisma.scamCluster.findUnique({
    where: { id: clusterId },
    select: {
      title: true,
      summary: true,
    },
  });

  const title = overrides?.title ?? cluster?.title ?? "";
  const summary = overrides?.summary ?? cluster?.summary ?? "";

  const publicIndicatorCount = await prisma.clusterIndicatorAggregate.count({
    where: {
      scamClusterId: clusterId,
      isPublic: true,
    },
  });

  if (!title.trim() || !summary.trim()) {
    throw new Error("Cluster must have title and summary before publishing.");
  }

  if (publicIndicatorCount === 0) {
    throw new Error(
      "Cluster must have at least one public indicator before publishing."
    );
  }
}

function normalizeNullableText(value?: string | null) {
  const trimmed = (value ?? "").trim();
  return trimmed.length ? trimmed : null;
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function revalidateClusterPaths(clusterId: string, slug: string | null) {
  revalidatePath(`/admin/clusters/${clusterId}`);
  revalidatePath("/admin/clusters");
  revalidatePath("/database");
  if (slug) {
    revalidatePath(`/database/${slug}`);
  }
}

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";
import { recomputeClusterIndicatorAggregates } from "@/lib/clustering/process-case-for-matching";

const mergeClustersSchema = z.object({
  mergeSuggestionId: z.string().min(1),
  sourceClusterId: z.string().min(1),
  targetClusterId: z.string().min(1),
});

const SUGGESTION_PENDING = "PENDING";
const SUGGESTION_ACCEPTED = "ACCEPTED";
const SUGGESTION_REJECTED = "REJECTED";

export async function mergeClustersAction(formData: FormData) {
  const actor = await requireRole([UserRole.admin]);

  const parsed = mergeClustersSchema.safeParse({
    mergeSuggestionId: formData.get("mergeSuggestionId"),
    sourceClusterId: formData.get("sourceClusterId"),
    targetClusterId: formData.get("targetClusterId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid cluster merge request.");
  }

  const { mergeSuggestionId, sourceClusterId, targetClusterId } = parsed.data;

  if (sourceClusterId === targetClusterId) {
    throw new Error("Source and target cluster cannot be the same.");
  }

  // Optional Prisma delegates (merge models) — dynamic access when client shape varies.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- delegates are not in PrismaClient typings
  const prismaAny = prisma as unknown as Record<string, any>;
  if (!prismaAny.clusterMergeSuggestion) {
    throw new Error("Cluster merge models are not available in the current Prisma schema.");
  }

  const [sourceCluster, targetCluster, suggestion] = await Promise.all([
    prismaAny.scamCluster.findUnique({
      where: { id: sourceClusterId },
      include: {
        caseLinks: true,
        indicatorAggregates: true,
      },
    }),
    prismaAny.scamCluster.findUnique({
      where: { id: targetClusterId },
      include: {
        caseLinks: true,
        indicatorAggregates: true,
      },
    }),
    prismaAny.clusterMergeSuggestion.findUnique({
      where: { id: mergeSuggestionId },
    }),
  ]);

  if (!sourceCluster || !targetCluster || !suggestion) {
    throw new Error("Cluster or merge suggestion not found.");
  }

  await prisma.$transaction(async (tx) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- same as prismaAny above
    const txAny = tx as unknown as Record<string, any>;

    for (const link of sourceCluster.caseLinks) {
      await txAny.scamClusterCase.upsert({
        where: {
          scamClusterId_caseId: {
            scamClusterId: targetClusterId,
            caseId: link.caseId,
          },
        },
        create: {
          scamClusterId: targetClusterId,
          caseId: link.caseId,
        },
        update: {},
      });
    }

    await txAny.scamClusterCase.deleteMany({
      where: {
        scamClusterId: sourceClusterId,
      },
    });

    await recomputeClusterIndicatorAggregates(tx, targetClusterId);

    await txAny.clusterMergeSuggestion.update({
      where: { id: mergeSuggestionId },
      data: {
        status: SUGGESTION_ACCEPTED,
        reviewedAt: new Date(),
      },
    });

    await txAny.clusterMergeSuggestion.updateMany({
      where: {
        id: { not: mergeSuggestionId },
        status: SUGGESTION_PENDING,
        OR: [{ sourceClusterId }, { targetClusterId: sourceClusterId }],
      },
      data: {
        status: SUGGESTION_REJECTED,
        reviewedAt: new Date(),
      },
    });

    await txAny.auditLog.createMany({
      data: [
        {
          actorUserId: actor.id,
          entityType: "ScamCluster",
          entityId: sourceClusterId,
          action: "CLUSTER_MERGED_INTO_TARGET",
          metadataJson: {
            targetClusterId,
            targetClusterTitle: targetCluster.title,
            sourceClusterTitle: sourceCluster.title,
          },
        },
        {
          actorUserId: actor.id,
          entityType: "ScamCluster",
          entityId: targetClusterId,
          action: "CLUSTER_RECEIVED_MERGE",
          metadataJson: {
            sourceClusterId,
            sourceClusterTitle: sourceCluster.title,
            targetClusterTitle: targetCluster.title,
          },
        },
      ],
    });

    await txAny.scamCluster.delete({
      where: { id: sourceClusterId },
    });
  });

  revalidatePath(`/admin/clusters/${targetClusterId}`);
  revalidatePath(`/admin/clusters/${sourceClusterId}`);
  revalidatePath("/admin/clusters");
}

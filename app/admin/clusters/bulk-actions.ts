"use server";

import { z } from "zod";
import { ClusterPublicStatus, RiskLevel, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

const bulkUpdateSchema = z.object({
  clusterIds: z.array(z.string().min(1)).min(1),
  publicStatus: z.nativeEnum(ClusterPublicStatus).optional(),
  riskLevel: z.nativeEnum(RiskLevel).optional(),
});

export async function bulkUpdateClustersAction(formData: FormData) {
  const actor = await requireRole([UserRole.admin]);

  const clusterIds = formData.getAll("clusterIds").map(String);
  const publicStatusValue = formData.get("publicStatus");
  const riskLevelValue = formData.get("riskLevel");

  const parsed = bulkUpdateSchema.safeParse({
    clusterIds,
    publicStatus:
      typeof publicStatusValue === "string" && publicStatusValue.length > 0
        ? publicStatusValue
        : undefined,
    riskLevel:
      typeof riskLevelValue === "string" && riskLevelValue.length > 0
        ? riskLevelValue
        : undefined,
  });

  if (!parsed.success) {
    throw new Error("Invalid bulk cluster update request.");
  }

  const { clusterIds: ids, publicStatus, riskLevel } = parsed.data;

  if (!publicStatus && !riskLevel) {
    throw new Error("At least one bulk field must be selected.");
  }

  const existingClusters = await prisma.scamCluster.findMany({
    where: {
      id: { in: ids },
    },
    select: {
      id: true,
      title: true,
      publicStatus: true,
      riskLevel: true,
    },
  });

  if (existingClusters.length === 0) {
    throw new Error("No clusters found.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.scamCluster.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        ...(publicStatus ? { publicStatus } : {}),
        ...(riskLevel ? { riskLevel } : {}),
      },
    });

    await tx.auditLog.createMany({
      data: existingClusters.map((cluster) => ({
        actorUserId: actor.id,
        entityType: "ScamCluster",
        entityId: cluster.id,
        action: "CLUSTER_BULK_UPDATED",
        metadataJson: {
          previous: {
            publicStatus: cluster.publicStatus,
            riskLevel: cluster.riskLevel,
          },
          next: {
            publicStatus: publicStatus ?? cluster.publicStatus,
            riskLevel: riskLevel ?? cluster.riskLevel,
          },
          title: cluster.title,
        },
      })),
    });
  });

  revalidatePath("/admin/clusters");
}

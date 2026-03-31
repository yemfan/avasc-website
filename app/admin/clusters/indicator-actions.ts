"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ClusterPublicStatus, UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

const updateClusterIndicatorSchema = z.object({
  aggregateId: z.string().min(1),
  displayValue: z.string().max(1000).optional().nullable(),
  isPublic: z.enum(["true", "false"]),
  isVerified: z.enum(["true", "false"]),
});

export async function updateClusterIndicatorAction(formData: FormData) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = updateClusterIndicatorSchema.safeParse({
    aggregateId: formData.get("aggregateId"),
    displayValue: formData.get("displayValue"),
    isPublic: formData.get("isPublic"),
    isVerified: formData.get("isVerified"),
  });

  if (!parsed.success) {
    throw new Error("Invalid cluster indicator update submission.");
  }

  const { aggregateId, displayValue, isPublic, isVerified } = parsed.data;

  const aggregate = await prisma.clusterIndicatorAggregate.findUnique({
    where: { id: aggregateId },
    include: {
      scamCluster: {
        select: {
          id: true,
          slug: true,
          publicStatus: true,
          title: true,
        },
      },
    },
  });

  if (!aggregate) {
    throw new Error("Cluster indicator aggregate not found.");
  }

  const nextValues = {
    displayValue: displayValue?.trim() || null,
    isPublic: isPublic === "true",
    isVerified: isVerified === "true",
  };

  await prisma.clusterIndicatorAggregate.update({
    where: { id: aggregateId },
    data: nextValues,
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "ClusterIndicatorAggregate",
      entityId: aggregateId,
      action: "CLUSTER_INDICATOR_UPDATED",
      metadataJson: {
        clusterId: aggregate.scamClusterId,
        clusterTitle: aggregate.scamCluster.title,
        indicatorType: aggregate.indicatorType,
        normalizedValue: aggregate.normalizedValue,
        previous: {
          displayValue: aggregate.displayValue,
          isPublic: aggregate.isPublic,
          isVerified: aggregate.isVerified,
        },
        next: nextValues,
      },
    },
  });

  revalidatePath(`/admin/clusters/${aggregate.scamClusterId}`);
  revalidatePath("/admin/clusters");

  if (aggregate.scamCluster.publicStatus === ClusterPublicStatus.PUBLISHED) {
    revalidatePath(`/database/${aggregate.scamCluster.slug}`);
  }
}

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ClusterPublicStatus, RiskLevel, UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

const updateClusterSchema = z.object({
  clusterId: z.string().min(1),
  title: z.string().min(3).max(200),
  scamType: z.string().min(2).max(100),
  summary: z.string().min(10).max(5000),
  publicStatus: z.nativeEnum(ClusterPublicStatus),
  riskLevel: z.nativeEnum(RiskLevel),
  redFlags: z.string().optional().nullable(),
  commonScript: z.string().optional().nullable(),
  safetyWarning: z.string().optional().nullable(),
  recommendedNextStep: z.string().optional().nullable(),
});

export async function updateClusterAction(formData: FormData) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = updateClusterSchema.safeParse({
    clusterId: formData.get("clusterId"),
    title: formData.get("title"),
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

  const existing = await prisma.scamCluster.findUnique({
    where: { id: data.clusterId },
    select: {
      id: true,
      title: true,
      scamType: true,
      publicStatus: true,
      riskLevel: true,
    },
  });

  if (!existing) {
    throw new Error("Cluster not found.");
  }

  await prisma.scamCluster.update({
    where: { id: data.clusterId },
    data: {
      title: data.title,
      scamType: data.scamType,
      summary: data.summary,
      publicStatus: data.publicStatus,
      riskLevel: data.riskLevel,
      redFlags: data.redFlags || null,
      commonScript: data.commonScript || null,
      safetyWarning: data.safetyWarning || null,
      recommendedNextStep: data.recommendedNextStep || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "ScamCluster",
      entityId: data.clusterId,
      action: "CLUSTER_UPDATED",
      metadataJson: {
        previous: {
          title: existing.title,
          scamType: existing.scamType,
          publicStatus: existing.publicStatus,
          riskLevel: existing.riskLevel,
        },
        next: {
          title: data.title,
          scamType: data.scamType,
          publicStatus: data.publicStatus,
          riskLevel: data.riskLevel,
        },
      },
    },
  });

  revalidatePath(`/admin/clusters/${data.clusterId}`);
  revalidatePath("/admin/clusters");
}

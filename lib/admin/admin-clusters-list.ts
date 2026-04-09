"use server";

import { revalidatePath } from "next/cache";
import {
  ClusterPublicStatus,
  RiskLevel,
  UserRole,
} from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

function normalizeListQuery(input: {
  q?: string;
  status?: string;
  risk?: string;
  scamType?: string;
}) {
  const q = (input.q ?? "").trim();
  const scamType = (input.scamType ?? "").trim() || "ALL";

  const statusRaw = (input.status ?? "").trim() || "ALL";
  const status: "ALL" | ClusterPublicStatus =
    statusRaw === "ALL"
      ? "ALL"
      : z.nativeEnum(ClusterPublicStatus).safeParse(statusRaw).success
        ? (statusRaw as ClusterPublicStatus)
        : "ALL";

  const riskRaw = (input.risk ?? "").trim() || "ALL";
  const risk: "ALL" | RiskLevel =
    riskRaw === "ALL"
      ? "ALL"
      : z.nativeEnum(RiskLevel).safeParse(riskRaw).success
        ? (riskRaw as RiskLevel)
        : "ALL";

  return { q, status, risk, scamType };
}

const quickStatusSchema = z.object({
  clusterId: z.string().uuid(),
  publicStatus: z.nativeEnum(ClusterPublicStatus),
});

export async function getAdminClustersListData(input?: {
  q?: string;
  status?: string;
  risk?: string;
  scamType?: string;
}) {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = normalizeListQuery({
    q: input?.q,
    status: input?.status,
    risk: input?.risk,
    scamType: input?.scamType,
  });

  const and: Prisma.ScamClusterWhereInput[] = [];

  if (parsed.q) {
    and.push({
      OR: [
        { title: { contains: parsed.q, mode: "insensitive" } },
        { slug: { contains: parsed.q, mode: "insensitive" } },
        { summary: { contains: parsed.q, mode: "insensitive" } },
        { scamType: { contains: parsed.q, mode: "insensitive" } },
      ],
    });
  }

  if (parsed.status !== "ALL") {
    and.push({ publicStatus: parsed.status });
  }

  if (parsed.risk !== "ALL") {
    and.push({ riskLevel: parsed.risk });
  }

  if (parsed.scamType !== "ALL") {
    and.push({ scamType: parsed.scamType });
  }

  const where: Prisma.ScamClusterWhereInput = and.length ? { AND: and } : {};

  const [clusters, total, published, internal, draft, scamTypeRows] = await Promise.all([
    prisma.scamCluster.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { threatScore: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        scamType: true,
        summary: true,
        riskLevel: true,
        publicStatus: true,
        reportCountSnapshot: true,
        publicIndicatorCount: true,
        threatScore: true,
        updatedAt: true,
      },
      take: 100,
    }),
    prisma.scamCluster.count(),
    prisma.scamCluster.count({
      where: { publicStatus: ClusterPublicStatus.PUBLISHED },
    }),
    prisma.scamCluster.count({
      where: { publicStatus: ClusterPublicStatus.INTERNAL },
    }),
    prisma.scamCluster.count({
      where: { publicStatus: ClusterPublicStatus.DRAFT },
    }),
    prisma.scamCluster.findMany({
      distinct: ["scamType"],
      orderBy: { scamType: "asc" },
      select: { scamType: true },
    }),
  ]);

  return {
    clusters,
    stats: {
      total,
      published,
      internal,
      draft,
    },
    filterValues: {
      statuses: Object.values(ClusterPublicStatus) as ClusterPublicStatus[],
      risks: Object.values(RiskLevel) as RiskLevel[],
      scamTypes: scamTypeRows.map((s) => s.scamType).filter(Boolean),
    },
  };
}

export async function quickSetClusterPublicStatusAction(input: {
  clusterId: string;
  publicStatus: ClusterPublicStatus;
}) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);
  const parsed = quickStatusSchema.parse(input);

  if (parsed.publicStatus === ClusterPublicStatus.PUBLISHED) {
    const cluster = await prisma.scamCluster.findUnique({
      where: { id: parsed.clusterId },
      select: {
        id: true,
        title: true,
        summary: true,
      },
    });

    if (!cluster?.title?.trim() || !cluster?.summary?.trim()) {
      throw new Error("Cluster must have title and summary before publishing.");
    }

    const publicIndicatorCount = await prisma.clusterIndicatorAggregate.count({
      where: {
        scamClusterId: parsed.clusterId,
        isPublic: true,
      },
    });

    if (publicIndicatorCount === 0) {
      throw new Error("Cluster must have at least one public indicator before publishing.");
    }
  }

  await prisma.scamCluster.update({
    where: { id: parsed.clusterId },
    data: { publicStatus: parsed.publicStatus },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "ScamCluster",
      entityId: parsed.clusterId,
      action: "CLUSTER_PUBLIC_STATUS_QUICK_SET",
      metadataJson: {
        publicStatus: parsed.publicStatus,
      },
    },
  });

  revalidatePath("/admin/clusters");
  revalidatePath(`/admin/clusters/${parsed.clusterId}`);
  revalidatePath("/database");

  return { success: true as const };
}

"use server";

import { revalidatePath } from "next/cache";
import {
  ClusterPublicStatus,
  type Prisma,
  RiskLevel,
} from "@prisma/client";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/session";
import { canMergeClusters, canMutate } from "@/lib/admin/permissions";
import { writeAuditLog } from "@/lib/admin/audit";
import { newRowId } from "@/lib/db/id";

const updateClusterSchema = z.object({
  clusterId: z.string().min(1),
  title: z.string().min(2).max(200).optional(),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  scamType: z.string().min(1).max(120).optional(),
  summary: z.string().max(20000).optional(),
  riskLevel: z.string().max(40).optional(),
  publicStatus: z.string().max(40).optional(),
  commonScript: z.string().max(20000).optional().nullable(),
  redFlags: z.string().max(20000).optional().nullable(),
  safetyWarning: z.string().max(20000).optional().nullable(),
  recommendedNextStep: z.string().max(20000).optional().nullable(),
});

export async function adminUpdateCluster(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = updateClusterSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const { clusterId, title, slug, scamType, summary, riskLevel, publicStatus, ...rest } =
    parsed.data;

  const data: Prisma.ScamClusterUpdateInput = {};
  if (title !== undefined) data.title = title;
  if (slug !== undefined) data.slug = slug;
  if (scamType !== undefined) data.scamType = scamType;
  if (summary !== undefined) data.summary = summary;
  if (riskLevel !== undefined && riskLevel !== "") {
    const r = riskLevel as RiskLevel;
    if ((Object.values(RiskLevel) as string[]).includes(r)) data.riskLevel = r;
  }
  if (publicStatus !== undefined && publicStatus !== "") {
    const p = publicStatus as ClusterPublicStatus;
    if ((Object.values(ClusterPublicStatus) as string[]).includes(p)) data.publicStatus = p;
  }
  for (const [k, v] of Object.entries(rest)) {
    if (v === undefined) continue;
    (data as Record<string, string | null>)[k] = v === "" ? null : v;
  }

  await prisma.scamCluster.update({
    where: { id: clusterId },
    data,
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "ScamCluster",
    entityId: clusterId,
    action: "cluster.updated",
    metadata: data,
  });

  revalidatePath("/admin/clusters");
  revalidatePath(`/admin/clusters/${clusterId}`);
  return { ok: true as const };
}

const mergeSchema = z.object({
  sourceClusterId: z.string().min(1),
  targetClusterId: z.string().min(1),
});

export async function adminMergeClusters(input: unknown) {
  const ctx = await requireStaff();
  if (!canMergeClusters(ctx.role)) {
    return { ok: false as const, error: "Only administrators can merge clusters" };
  }
  const parsed = mergeSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };
  if (parsed.data.sourceClusterId === parsed.data.targetClusterId) {
    return { ok: false as const, error: "Source and target must differ" };
  }

  const prisma = getPrisma();
  const links = await prisma.scamClusterCase.findMany({
    where: { scamClusterId: parsed.data.sourceClusterId },
  });

  for (const link of links) {
    await prisma.scamClusterCase.upsert({
      where: {
        scamClusterId_caseId: {
          scamClusterId: parsed.data.targetClusterId,
          caseId: link.caseId,
        },
      },
      create: {
        id: newRowId(),
        scamClusterId: parsed.data.targetClusterId,
        caseId: link.caseId,
      },
      update: {},
    });
  }

  await prisma.scamClusterCase.deleteMany({
    where: { scamClusterId: parsed.data.sourceClusterId },
  });
  await prisma.scamCluster.delete({
    where: { id: parsed.data.sourceClusterId },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "ScamCluster",
    entityId: parsed.data.targetClusterId,
    action: "cluster.merged_into",
    metadata: { sourceClusterId: parsed.data.sourceClusterId },
  });

  revalidatePath("/admin/clusters");
  revalidatePath(`/admin/clusters/${parsed.data.targetClusterId}`);
  return { ok: true as const };
}

const createClusterSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  scamType: z.string().min(1).max(120),
  summary: z.string().max(20000).optional(),
  riskLevel: z.string().max(40).optional(),
});

export async function adminCreateCluster(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = createClusterSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const id = newRowId();
  const now = new Date();
  const rl = parsed.data.riskLevel
    ? (parsed.data.riskLevel as RiskLevel)
    : RiskLevel.MEDIUM;
  const risk =
    (Object.values(RiskLevel) as string[]).includes(rl) ? rl : RiskLevel.MEDIUM;

  await prisma.scamCluster.create({
    data: {
      id,
      title: parsed.data.title,
      slug: parsed.data.slug,
      scamType: parsed.data.scamType,
      summary: parsed.data.summary ?? "",
      riskLevel: risk,
      publicStatus: ClusterPublicStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "ScamCluster",
    entityId: id,
    action: "cluster.created",
    metadata: { slug: parsed.data.slug },
  });

  revalidatePath("/admin/clusters");
  return { ok: true as const, clusterId: id };
}

const removeCaseSchema = z.object({
  clusterId: z.string().min(1),
  caseId: z.string().min(1),
});

export async function adminRemoveCaseFromCluster(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = removeCaseSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  await prisma.scamClusterCase.deleteMany({
    where: {
      scamClusterId: parsed.data.clusterId,
      caseId: parsed.data.caseId,
    },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "ScamCluster",
    entityId: parsed.data.clusterId,
    action: "cluster.case_removed",
    metadata: { caseId: parsed.data.caseId },
  });

  revalidatePath(`/admin/clusters/${parsed.data.clusterId}`);
  return { ok: true as const };
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/session";
import { canPublishAlerts, canMutate } from "@/lib/admin/permissions";
import { writeAuditLog } from "@/lib/admin/audit";
import { newRowId } from "@/lib/db/id";

const alertSchema = z.object({
  title: z.string().min(2).max(200),
  summary: z.string().min(2).max(20000),
  scamType: z.string().min(1).max(120),
  severity: z.string().max(40).optional(),
});

export async function adminCreateAlert(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role) || !canPublishAlerts(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = alertSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const id = newRowId();
  const now = new Date();
  await prisma.scamAlert.create({
    data: {
      id,
      title: parsed.data.title,
      summary: parsed.data.summary,
      scamType: parsed.data.scamType,
      severity: parsed.data.severity ?? "info",
      published: false,
      createdAt: now,
    },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "ScamAlert",
    entityId: id,
    action: "alert.created",
    metadata: {},
  });

  revalidatePath("/admin/alerts");
  return { ok: true as const, alertId: id };
}

const publishSchema = z.object({
  alertId: z.string().min(1),
  published: z.boolean(),
});

export async function adminPublishAlert(input: unknown) {
  const ctx = await requireStaff();
  if (!canPublishAlerts(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = publishSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const now = new Date();
  await prisma.scamAlert.update({
    where: { id: parsed.data.alertId },
    data: {
      published: parsed.data.published,
      publishedAt: parsed.data.published ? now : null,
    },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "ScamAlert",
    entityId: parsed.data.alertId,
    action: parsed.data.published ? "alert.published" : "alert.unpublished",
    metadata: {},
  });

  revalidatePath("/admin/alerts");
  revalidatePath("/");
  return { ok: true as const };
}

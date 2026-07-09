"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ModerationStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import { writeAuditLog } from "@/lib/admin/audit";

const storySchema = z.object({
  storyId: z.string().min(1),
  status: z.enum(["pending", "approved", "rejected"]),
});

export async function adminModerateStory(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = storySchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const now = new Date();
  const publishedAt =
    parsed.data.status === "approved" ? now : null;

  const moderationStatus =
    parsed.data.status === "approved"
      ? ModerationStatus.APPROVED
      : parsed.data.status === "rejected"
        ? ModerationStatus.REJECTED
        : ModerationStatus.PENDING;

  await prisma.story.update({
    where: { id: parsed.data.storyId },
    data: {
      moderationStatus,
      publishedAt,
      updatedAt: now,
    },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "Story",
    entityId: parsed.data.storyId,
    action: `story.${parsed.data.status}`,
    metadata: {},
  });

  revalidatePath("/admin/stories");
  revalidatePath(`/admin/stories/${parsed.data.storyId}`);
  revalidatePath("/stories");
  return { ok: true as const };
}

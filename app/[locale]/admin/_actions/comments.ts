"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CommentModerationStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import { writeAuditLog } from "@/lib/admin/audit";

const commentSchema = z.object({
  commentId: z.string().min(1),
  status: z.enum(["pending", "approved", "rejected"]),
  flagReason: z.string().max(500).optional().nullable(),
});

export async function adminModerateComment(input: unknown) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) {
    return { ok: false as const, error: "Insufficient permissions" };
  }
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid payload" };

  const prisma = getPrisma();
  const moderationStatus =
    parsed.data.status === "approved"
      ? CommentModerationStatus.APPROVED
      : parsed.data.status === "rejected"
        ? CommentModerationStatus.REJECTED
        : CommentModerationStatus.PENDING;

  await prisma.comment.update({
    where: { id: parsed.data.commentId },
    data: {
      moderationStatus,
      flagReason:
        parsed.data.status === "rejected"
          ? (parsed.data.flagReason ?? "moderated")
          : null,
    },
  });

  await writeAuditLog(prisma, {
    actorUserId: ctx.userId,
    entityType: "Comment",
    entityId: parsed.data.commentId,
    action: `comment.${parsed.data.status}`,
    metadata: { flagReason: parsed.data.flagReason },
  });

  revalidatePath("/admin/comments");
  revalidatePath("/admin/stories");
  return { ok: true as const };
}

"use server";

import { z } from "zod";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import { adminModerateComment } from "../_actions/comments";

const statusZ = z.enum(["pending", "approved", "rejected"]);

export async function submitCommentModeration(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const commentId = String(formData.get("commentId") ?? "");
  const statusRaw = String(formData.get("status") ?? "");
  const flagReason = formData.get("flagReason");
  const status = statusZ.safeParse(statusRaw);
  if (!status.success) return;

  await adminModerateComment({
    commentId,
    status: status.data,
    flagReason: typeof flagReason === "string" && flagReason.length ? flagReason : null,
  });
}

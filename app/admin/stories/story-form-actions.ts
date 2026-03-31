"use server";

import { z } from "zod";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import { adminModerateStory } from "../_actions/stories";

const statusZ = z.enum(["pending", "approved", "rejected"]);

export async function submitStoryModeration(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const storyId = String(formData.get("storyId") ?? "");
  const statusRaw = String(formData.get("status") ?? "");
  const status = statusZ.safeParse(statusRaw);
  if (!status.success) return;

  await adminModerateStory({ storyId, status: status.data });
}

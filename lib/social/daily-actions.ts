"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/auth/require-role";
import { prisma } from "@/lib/prisma";
import { setSocialAutopilot } from "@/lib/social/settings";
import { postSavedDailyPost } from "@/lib/social/daily-run";

async function requireStaff() {
  await requireRole([UserRole.admin, UserRole.moderator]);
}

/** Flip the social auto-post mode. `on` is bound by the form; formData is unused. */
export async function setAutopilotFormAction(on: boolean, _formData: FormData): Promise<void> {
  void _formData;
  await requireStaff();
  await setSocialAutopilot(on);
  revalidatePath("/admin/social");
}

/** Approve a pending daily post: post it to configured platforms + publish to the blog. */
export async function approvePostFormAction(formData: FormData): Promise<void> {
  await requireStaff();
  const id = String(formData.get("id") ?? "");
  if (id) await postSavedDailyPost(id);
  revalidatePath("/admin/social");
  revalidatePath("/blog");
}

/** Reject a pending daily post (hidden from the blog, not posted). */
export async function rejectPostFormAction(formData: FormData): Promise<void> {
  await requireStaff();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.socialDailyPost.update({ where: { id }, data: { status: "rejected" } });
  revalidatePath("/admin/social");
  revalidatePath("/blog");
}

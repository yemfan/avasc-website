import type { PrismaClient } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { syncUserProfile } from "@/lib/auth/sync-user-profile";
import { getPrisma } from "@/lib/prisma";
import { commentContainsBlockedPattern } from "@/lib/comment-policy";
import { newRowId } from "@/lib/db/id";

export type PublicStoryComment = {
  id: string;
  body: string;
  createdAt: Date;
  authorLabel: string;
};

export async function getApprovedCommentsByStorySlug(
  prisma: PrismaClient,
  slug: string
): Promise<PublicStoryComment[]> {
  const story = await prisma.story.findFirst({
    where: { slug, moderationStatus: "APPROVED" },
    select: {
      comments: {
        where: { moderationStatus: "APPROVED" },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          body: true,
          createdAt: true,
          user: { select: { displayName: true } },
        },
      },
    },
  });
  if (!story) return [];
  return story.comments.map((c) => ({
    id: c.id,
    body: c.body,
    createdAt: c.createdAt,
    authorLabel: c.user?.displayName?.trim() || "Community member",
  }));
}

export async function submitStoryCommentBySlug(
  slug: string,
  body: string
): Promise<{ commentId: string; status: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const appUser = await syncUserProfile(user);

  const trimmed = body.trim();
  if (trimmed.length < 2 || trimmed.length > 4000) throw new Error("Comment must be 2-4000 characters.");
  if (commentContainsBlockedPattern(trimmed)) {
    throw new Error("Comments cannot contain URLs in this release.");
  }

  const prisma = getPrisma();
  const story = await prisma.story.findFirst({
    where: { slug, moderationStatus: "APPROVED" },
    select: { id: true },
  });
  if (!story) throw new Error("Not found");

  const comment = await prisma.comment.create({
    data: {
      id: newRowId(),
      storyId: story.id,
      userId: appUser.id,
      body: trimmed,
      moderationStatus: "PENDING",
    },
    select: { id: true, moderationStatus: true },
  });

  return { commentId: comment.id, status: comment.moderationStatus };
}

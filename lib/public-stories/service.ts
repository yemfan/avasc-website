import { ModerationStatus, type PrismaClient } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { syncUserProfile } from "@/lib/auth/sync-user-profile";
import { getPrisma } from "@/lib/prisma";
import { getServiceSupabase } from "@/lib/supabase/service-role";
import { newRowId } from "@/lib/db/id";
import type { CreatePublicStoryInput } from "./schemas";
import { defaultStorySlug, slugifyStoryTitle } from "./slug";

export type PublicStoryListItem = {
  id: string;
  slug: string;
  title: string;
  body: string;
  isAnonymous: boolean;
  createdAt: string;
};

export type PublicStoryDetail = {
  id: string;
  slug: string;
  title: string;
  body: string;
  isAnonymous: boolean;
  createdAt: Date;
};

export async function listApprovedPublicStories(limit = 50): Promise<PublicStoryListItem[]> {
  const db = getServiceSupabase();
  const { data, error } = await db
    .from("Story")
    .select("id, slug, title, body, isAnonymous, createdAt")
    .eq("status", "approved")
    .order("createdAt", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug ?? defaultStorySlug(row.id),
    title: row.title,
    body: row.body,
    isAnonymous: row.isAnonymous,
    createdAt: row.createdAt,
  }));
}

/** Privacy-safe detail lookup: only approved stories are publicly visible. */
export async function getApprovedStoryBySlug(prisma: PrismaClient, slug: string): Promise<PublicStoryDetail | null> {
  const story = await prisma.story.findFirst({
    where: { slug, moderationStatus: ModerationStatus.APPROVED },
    select: { id: true, slug: true, title: true, body: true, anonymityMode: true, createdAt: true },
  });
  if (!story) return null;
  return {
    id: story.id,
    slug: story.slug ?? defaultStorySlug(story.id),
    title: story.title,
    body: story.body,
    isAnonymous: story.anonymityMode,
    createdAt: story.createdAt,
  };
}

export async function createStorySubmission(input: CreatePublicStoryInput): Promise<{ storyId: string; status: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const appUser = await syncUserProfile(user);

  const prisma = getPrisma();
  const id = newRowId();
  const baseSlug = slugifyStoryTitle(input.title) || defaultStorySlug(id);
  const slug = `${baseSlug}-${id.slice(0, 8).toLowerCase()}`;

  const story = await prisma.story.create({
    data: {
      id,
      userId: appUser.id,
      slug,
      title: input.title,
      body: input.body,
      anonymityMode: input.isAnonymous ?? false,
      moderationStatus: "PENDING",
    },
    select: { id: true, moderationStatus: true },
  });
  return { storyId: story.id, status: story.moderationStatus };
}

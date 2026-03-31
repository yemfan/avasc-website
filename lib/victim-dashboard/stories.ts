import type { ModerationStatus, PrismaClient } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { newRowId } from "@/lib/db/id";
import type { SaveStoryInput } from "./schemas";
import { assertCaseOwnedByUser } from "./cases";
import { defaultStorySlug, slugifyStoryTitle } from "@/lib/public-stories";

/** Loaded for the story editor; ownership verified in the query. */
export type VictimStoryEditPayload = {
  id: string;
  title: string;
  body: string;
  videoUrl: string | null;
  linkedCaseId: string | null;
  isAnonymous: boolean;
};

export type VictimStoryRow = {
  id: string;
  title: string;
  status: ModerationStatus;
  isAnonymous: boolean;
  linkedCaseId: string | null;
  linkedCaseTitle: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function getUserStories(prisma: PrismaClient, userId: string): Promise<VictimStoryRow[]> {
  const rows = await prisma.story.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      moderationStatus: true,
      anonymityMode: true,
      caseId: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      case: { select: { title: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    status: r.moderationStatus,
    isAnonymous: r.anonymityMode,
    linkedCaseId: r.caseId,
    linkedCaseTitle: r.case?.title ?? null,
    publishedAt: r.publishedAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function getUserStoryForEdit(
  prisma: PrismaClient,
  userId: string,
  storyId: string
): Promise<VictimStoryEditPayload | null> {
  const s = await prisma.story.findFirst({
    where: { id: storyId, userId },
    select: {
      id: true,
      title: true,
      body: true,
      videoUrl: true,
      caseId: true,
      anonymityMode: true,
    },
  });
  if (!s) return null;
  return {
    id: s.id,
    title: s.title,
    body: s.body,
    videoUrl: s.videoUrl,
    linkedCaseId: s.caseId,
    isAnonymous: s.anonymityMode,
  };
}

export async function saveUserStory(userId: string, input: SaveStoryInput): Promise<string> {
  const prisma = getPrisma();
  if (input.linkedCaseId) {
    const ok = await assertCaseOwnedByUser(userId, input.linkedCaseId);
    if (!ok) throw new Error("Case not found or access denied");
  }

  const videoUrl = input.videoUrl?.trim() || null;

  if (input.id) {
    const existing = await prisma.story.findFirst({
      where: { id: input.id, userId },
      select: { id: true, moderationStatus: true },
    });
    if (!existing) throw new Error("Story not found");
    if (existing.moderationStatus === "APPROVED") {
      throw new Error("Approved stories can’t be edited here. Contact us if you need a change.");
    }
    await prisma.story.update({
      where: { id: input.id },
      data: {
        slug: `${slugifyStoryTitle(input.title) || defaultStorySlug(input.id)}-${input.id.slice(0, 8).toLowerCase()}`,
        title: input.title,
        body: input.body,
        videoUrl,
        caseId: input.linkedCaseId ?? null,
        anonymityMode: input.isAnonymous,
        moderationStatus: "PENDING",
        publishedAt: null,
      },
    });
    return input.id;
  }

  const id = newRowId();
  await prisma.story.create({
    data: {
      id,
      slug: `${slugifyStoryTitle(input.title) || defaultStorySlug(id)}-${id.slice(0, 8).toLowerCase()}`,
      userId,
      title: input.title,
      body: input.body,
      videoUrl,
      caseId: input.linkedCaseId ?? null,
      anonymityMode: input.isAnonymous,
      moderationStatus: "PENDING",
    },
  });
  return id;
}

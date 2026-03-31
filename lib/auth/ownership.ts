import { getPrisma } from "@/lib/prisma";

export async function assertOwnsCase(userId: string, caseId: string): Promise<boolean> {
  const prisma = getPrisma();
  const count = await prisma.case.count({ where: { id: caseId, userId } });
  return count > 0;
}

export async function assertOwnsStory(userId: string, storyId: string): Promise<boolean> {
  const prisma = getPrisma();
  const count = await prisma.story.count({ where: { id: storyId, userId } });
  return count > 0;
}

export async function assertOwnsSupportRequest(userId: string, supportRequestId: string): Promise<boolean> {
  const prisma = getPrisma();
  const count = await prisma.supportRequest.count({ where: { id: supportRequestId, userId } });
  return count > 0;
}

import { prisma } from "@/lib/prisma";

export async function getUserAlertCenter(subscriptionId: string) {
  return prisma.userAlertFeedItem.findMany({
    where: {
      subscriptionId,
    },
    include: {
      scamCluster: {
        select: {
          id: true,
          slug: true,
          title: true,
          riskLevel: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });
}

export async function getUserAlertUnreadCount(subscriptionId: string) {
  return prisma.userAlertFeedItem.count({
    where: { subscriptionId, isRead: false },
  });
}

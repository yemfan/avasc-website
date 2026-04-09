import { prisma } from "@/lib/prisma";

export async function getFollowedScams(subscriptionId: string) {
  return prisma.clusterSubscription.findMany({
    where: {
      subscriptionId,
      scamCluster: {
        publicStatus: "PUBLISHED",
      },
    },
    include: {
      scamCluster: {
        select: {
          id: true,
          slug: true,
          title: true,
          scamType: true,
          riskLevel: true,
          updatedAt: true,
          threatScore: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export type FollowedScamSubscriptionRow = Awaited<ReturnType<typeof getFollowedScams>>[number];

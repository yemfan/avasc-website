import { prisma } from "@/lib/prisma";
import { findSubscriptionByUserEmail } from "@/lib/alerts/subscription-by-user-email";

export async function unfollowClusterForUser(
  userEmail: string,
  clusterId: string
): Promise<{ ok: boolean }> {
  const sub = await findSubscriptionByUserEmail(userEmail);
  if (!sub) return { ok: false };

  await prisma.clusterSubscription.deleteMany({
    where: { subscriptionId: sub.id, clusterId },
  });

  return { ok: true };
}

import { prisma } from "@/lib/prisma";
import { findSubscriptionByUserEmail } from "@/lib/alerts/subscription-by-user-email";

export async function markUserAlertFeedItemRead(
  userEmail: string,
  feedItemId: string
): Promise<{ ok: boolean }> {
  const sub = await findSubscriptionByUserEmail(userEmail);
  if (!sub) return { ok: false };

  const result = await prisma.userAlertFeedItem.updateMany({
    where: { id: feedItemId, subscriptionId: sub.id },
    data: { isRead: true },
  });

  return { ok: result.count > 0 };
}

import { prisma } from "@/lib/prisma";

/** Subscription row matched to dashboard `User.email` (same convention as `/api/alerts/preferences`). */
export async function findSubscriptionByUserEmail(email: string) {
  return prisma.subscription.findFirst({
    where: { email },
  });
}

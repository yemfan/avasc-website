import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserSubscription() {
  const user = await requireUser();

  const subscription = await prisma.subscription.findFirst({
    where: {
      OR: [{ email: user.email.toLowerCase() }],
    },
  });

  return {
    user,
    subscription,
  };
}

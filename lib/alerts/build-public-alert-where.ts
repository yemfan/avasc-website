import type { Prisma } from "@prisma/client";

/**
 * Shared predicates for public outbound `Alert` queries (realtime ticker, homepage, daily cards).
 * DAILY branches include `isSent: true` so drafts are excluded.
 */
export function buildPublicAlertWhere(args: {
  type?: "REALTIME" | "DAILY";
  homepageOnly?: boolean;
}): Prisma.AlertWhereInput {
  const { type, homepageOnly } = args;

  const approved: Prisma.AlertWhereInput = { approvalStatus: "APPROVED" };

  if (homepageOnly && type === "REALTIME") {
    return {
      ...approved,
      isPublicVisible: true,
      isHomepageVisible: true,
      isRealtimeVisible: true,
      alertType: "REALTIME",
      riskLevel: { in: ["HIGH", "CRITICAL"] },
    };
  }

  if (homepageOnly && type === "DAILY") {
    return {
      ...approved,
      isPublicVisible: true,
      isHomepageVisible: true,
      isDailyFeedVisible: true,
      alertType: "DAILY",
      isSent: true,
    };
  }

  if (type === "REALTIME") {
    return {
      ...approved,
      isPublicVisible: true,
      isRealtimeVisible: true,
      alertType: "REALTIME",
      riskLevel: { in: ["HIGH", "CRITICAL"] },
    };
  }

  if (type === "DAILY") {
    return {
      ...approved,
      isPublicVisible: true,
      isDailyFeedVisible: true,
      alertType: "DAILY",
      isSent: true,
    };
  }

  return {
    ...approved,
    isPublicVisible: true,
  };
}

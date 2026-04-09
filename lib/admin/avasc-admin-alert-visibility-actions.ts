"use server";

/**
 * AVASC Admin Alert Visibility Loader + Actions
 * Powers /admin/alerts/visibility — search, filter, stats, and public visibility flags.
 */

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { UserRole } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

const adminAlertsQuerySchema = z.object({
  type: z.string().optional().default("ALL"),
  q: z.string().optional().default(""),
});

const setAlertVisibilitySchema = z.object({
  alertId: z.string().uuid(),
  isPublicVisible: z.boolean(),
  isRealtimeVisible: z.boolean(),
  isHomepageVisible: z.boolean(),
  isDailyFeedVisible: z.boolean(),
});

export async function getAdminAlertsListData(input?: { type?: string; q?: string }) {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = adminAlertsQuerySchema.parse(input ?? {});

  const andParts: Prisma.AlertWhereInput[] = [];

  if (parsed.type !== "ALL") {
    andParts.push({ alertType: parsed.type });
  }

  if (parsed.q.trim()) {
    const q = parsed.q.trim();
    andParts.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { message: { contains: q, mode: "insensitive" } },
        {
          scamCluster: {
            is: {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { slug: { contains: q, mode: "insensitive" } },
              ],
            },
          },
        },
      ],
    });
  }

  const where: Prisma.AlertWhereInput =
    andParts.length > 0 ? { AND: andParts } : {};

  const [alerts, total, homepageVisible, realtimeVisible, dailyFeedVisible] =
    await Promise.all([
      prisma.alert.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        take: 100,
        include: {
          scamCluster: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      }),
      prisma.alert.count(),
      prisma.alert.count({
        where: {
          approvalStatus: "APPROVED",
          isPublicVisible: true,
          isHomepageVisible: true,
        },
      }),
      prisma.alert.count({
        where: {
          approvalStatus: "APPROVED",
          isPublicVisible: true,
          isRealtimeVisible: true,
        },
      }),
      prisma.alert.count({
        where: {
          approvalStatus: "APPROVED",
          isPublicVisible: true,
          isDailyFeedVisible: true,
        },
      }),
    ]);

  return {
    alerts,
    stats: {
      total,
      homepageVisible,
      realtimeVisible,
      dailyFeedVisible,
    },
  };
}

export async function setAlertVisibilityAction(input: {
  alertId: string;
  isPublicVisible: boolean;
  isRealtimeVisible: boolean;
  isHomepageVisible: boolean;
  isDailyFeedVisible: boolean;
}) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = setAlertVisibilitySchema.parse(input);

  const isPublicVisible =
    parsed.isPublicVisible ||
    parsed.isRealtimeVisible ||
    parsed.isHomepageVisible ||
    parsed.isDailyFeedVisible;

  const previous = await prisma.alert.findUnique({
    where: { id: parsed.alertId },
    select: {
      isPublicVisible: true,
      isRealtimeVisible: true,
      isHomepageVisible: true,
      isDailyFeedVisible: true,
      title: true,
    },
  });

  if (!previous) {
    throw new Error("Alert not found.");
  }

  await prisma.alert.update({
    where: { id: parsed.alertId },
    data: {
      isPublicVisible,
      isRealtimeVisible: parsed.isRealtimeVisible,
      isHomepageVisible: parsed.isHomepageVisible,
      isDailyFeedVisible: parsed.isDailyFeedVisible,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "Alert",
      entityId: parsed.alertId,
      action: "ALERT_VISIBILITY_UPDATED",
      metadataJson: {
        title: previous.title,
        previous: {
          isPublicVisible: previous.isPublicVisible,
          isRealtimeVisible: previous.isRealtimeVisible,
          isHomepageVisible: previous.isHomepageVisible,
          isDailyFeedVisible: previous.isDailyFeedVisible,
        },
        next: {
          isPublicVisible,
          isRealtimeVisible: parsed.isRealtimeVisible,
          isHomepageVisible: parsed.isHomepageVisible,
          isDailyFeedVisible: parsed.isDailyFeedVisible,
        },
      },
    },
  });

  revalidatePath("/admin/alerts");
  revalidatePath("/admin/alerts/visibility");
  revalidatePath("/");
  revalidatePath("/database");

  return { success: true };
}

export async function setAlertVisibilityFormAction(formData: FormData) {
  const alertId = z.string().uuid().parse(formData.get("alertId"));

  await setAlertVisibilityAction({
    alertId,
    isPublicVisible: formData.get("isPublicVisible") === "on",
    isRealtimeVisible: formData.get("isRealtimeVisible") === "on",
    isHomepageVisible: formData.get("isHomepageVisible") === "on",
    isDailyFeedVisible: formData.get("isDailyFeedVisible") === "on",
  });
}

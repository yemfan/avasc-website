"use server";

/**
 * OneDrive import approval + imports list (handoff package §12).
 * Uses shared `prisma` + staff `requireRole` (package used a raw PrismaClient; auth is required here).
 */

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

const alertIdSchema = z.object({ alertId: z.string().uuid() });

const editSchema = z.object({
  alertId: z.string().uuid(),
  title: z.string().min(1).max(500),
  message: z.string().min(1).max(20000),
  scamClusterId: z.string().uuid().nullable().optional(),
});

function visibilityForApprovedType(alertType: string): {
  isPublicVisible: boolean;
  isRealtimeVisible: boolean;
  isHomepageVisible: boolean;
  isDailyFeedVisible: boolean;
  isSent: boolean;
} {
  if (alertType === "REALTIME") {
    return {
      isPublicVisible: true,
      isRealtimeVisible: true,
      isHomepageVisible: true,
      isDailyFeedVisible: false,
      isSent: false,
    };
  }
  if (alertType === "DAILY") {
    return {
      isPublicVisible: true,
      isRealtimeVisible: false,
      isHomepageVisible: true,
      isDailyFeedVisible: true,
      isSent: true,
    };
  }
  if (alertType === "WEEKLY") {
    return {
      isPublicVisible: true,
      isRealtimeVisible: false,
      isHomepageVisible: true,
      isDailyFeedVisible: false,
      isSent: true,
    };
  }
  return {
    isPublicVisible: true,
    isRealtimeVisible: false,
    isHomepageVisible: false,
    isDailyFeedVisible: false,
    isSent: false,
  };
}

export async function getAdminImportsListData() {
  await requireRole([UserRole.admin, UserRole.moderator]);

  return prisma.externalContentIngestion.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      linkedAlert: {
        select: {
          id: true,
          title: true,
          approvalStatus: true,
        },
      },
    },
  });
}

export async function approveImportedAlertFormAction(formData: FormData): Promise<void> {
  const alertId = z.string().uuid().parse(formData.get("alertId"));
  await approveImportedAlertAction({ alertId });
}

export async function rejectImportedAlertFormAction(formData: FormData): Promise<void> {
  const alertId = z.string().uuid().parse(formData.get("alertId"));
  await rejectImportedAlertAction({ alertId });
}

export async function approveImportedAlertAction(input: unknown) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);
  const { alertId } = alertIdSchema.parse(input);

  const alert = await prisma.alert.findUnique({
    where: { id: alertId },
    select: {
      id: true,
      alertType: true,
      approvalStatus: true,
    },
  });
  if (!alert) throw new Error("Alert not found.");
  if (alert.approvalStatus === "APPROVED") {
    return { success: true as const };
  }

  const vis = visibilityForApprovedType(alert.alertType);

  await prisma.$transaction(async (tx) => {
    await tx.alert.update({
      where: { id: alert.id },
      data: {
        approvalStatus: "APPROVED",
        approvedAt: new Date(),
        approvedByUserId: actor.id,
        ...vis,
      },
    });

    await tx.externalContentIngestion.updateMany({
      where: { linkedAlertId: alert.id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });
  });

  revalidatePath("/admin/alerts");
  revalidatePath("/admin/alerts/visibility");
  revalidatePath("/admin/imports");
  revalidatePath("/");
  revalidatePath("/database");
  return { success: true as const };
}

export async function rejectImportedAlertAction(input: unknown) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);
  const { alertId } = alertIdSchema.parse(input);

  await prisma.$transaction(async (tx) => {
    await tx.alert.update({
      where: { id: alertId },
      data: {
        approvalStatus: "REJECTED",
        approvedAt: new Date(),
        approvedByUserId: actor.id,
        isPublicVisible: false,
        isRealtimeVisible: false,
        isHomepageVisible: false,
        isDailyFeedVisible: false,
      },
    });

    await tx.externalContentIngestion.updateMany({
      where: { linkedAlertId: alertId },
      data: {
        status: "REJECTED",
        approvedAt: new Date(),
      },
    });
  });

  revalidatePath("/admin/alerts");
  revalidatePath("/admin/alerts/visibility");
  revalidatePath("/admin/imports");
  revalidatePath("/");
  revalidatePath("/database");
  return { success: true as const };
}

export async function editImportedAlertAction(input: unknown) {
  await requireRole([UserRole.admin, UserRole.moderator]);
  const parsed = editSchema.parse(input);

  await prisma.alert.update({
    where: { id: parsed.alertId },
    data: {
      title: parsed.title,
      message: parsed.message,
      ...(parsed.scamClusterId !== undefined
        ? { scamClusterId: parsed.scamClusterId }
        : {}),
    },
  });

  revalidatePath("/admin/alerts");
  revalidatePath("/admin/alerts/visibility");
  revalidatePath("/");
  revalidatePath("/database");
  return { success: true as const };
}

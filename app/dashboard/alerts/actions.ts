"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";

const markAlertReadSchema = z.object({
  feedItemId: z.string().uuid(),
});

const unfollowClusterSchema = z.object({
  clusterId: z.string().uuid(),
});

const saveAlertPreferencesSchema = z.object({
  phone: z.preprocess((v) => (typeof v === "string" ? v.trim() : ""), z.string()),
  email: z.preprocess(
    (v) => (typeof v === "string" ? v.trim().toLowerCase() : ""),
    z.union([z.literal(""), z.string().email()])
  ),
  smsEnabled: z.boolean(),
  emailDaily: z.boolean(),
  emailWeekly: z.boolean(),
});

function normalizePhone(phone?: string | null) {
  const value = phone?.trim().replace(/\s+/g, "") || "";
  return value || null;
}

function normalizeEmail(email?: string | null) {
  const value = email?.trim().toLowerCase() || "";
  return value || null;
}

async function getUserSubscriptionOrThrow(userEmail: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      email: userEmail.toLowerCase(),
    },
  });

  if (!subscription) {
    throw new Error("Subscription not found.");
  }

  return subscription;
}

export async function markAlertReadAction(formData: FormData) {
  const user = await requireUser();

  const rawId = formData.get("feedItemId");
  const parsed = markAlertReadSchema.safeParse({
    feedItemId: typeof rawId === "string" ? rawId : "",
  });

  if (!parsed.success) {
    throw new Error("Invalid alert read request.");
  }

  const subscription = await getUserSubscriptionOrThrow(user.email);

  await prisma.userAlertFeedItem.updateMany({
    where: {
      id: parsed.data.feedItemId,
      subscriptionId: subscription.id,
    },
    data: {
      isRead: true,
    },
  });

  revalidatePath("/dashboard/alerts");
  revalidatePath("/dashboard");
}

export async function markAllAlertsReadAction(_formData: FormData) {
  const user = await requireUser();

  const subscription = await prisma.subscription.findFirst({
    where: { email: user.email.toLowerCase() },
  });

  if (!subscription) {
    revalidatePath("/dashboard/alerts");
    revalidatePath("/dashboard");
    return;
  }

  await prisma.userAlertFeedItem.updateMany({
    where: { subscriptionId: subscription.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/dashboard/alerts");
  revalidatePath("/dashboard");
}

export async function unfollowClusterAction(formData: FormData) {
  const user = await requireUser();

  const rawClusterId = formData.get("clusterId");
  const parsed = unfollowClusterSchema.safeParse({
    clusterId: typeof rawClusterId === "string" ? rawClusterId : "",
  });

  if (!parsed.success) {
    throw new Error("Invalid unfollow request.");
  }

  const subscription = await getUserSubscriptionOrThrow(user.email);

  await prisma.clusterSubscription.deleteMany({
    where: {
      clusterId: parsed.data.clusterId,
      subscriptionId: subscription.id,
    },
  });

  revalidatePath("/dashboard/alerts/following");
  revalidatePath("/dashboard/alerts");
}

export async function saveAlertPreferencesAction(formData: FormData) {
  const user = await requireUser();

  const parsed = saveAlertPreferencesSchema.safeParse({
    phone: formData.get("phone"),
    email: formData.get("email"),
    smsEnabled: formData.get("smsEnabled") === "on",
    emailDaily: formData.get("emailDaily") === "on",
    emailWeekly: formData.get("emailWeekly") === "on",
  });

  if (!parsed.success) {
    throw new Error("Invalid alert preferences form.");
  }

  const email = normalizeEmail(parsed.data.email) ?? user.email.toLowerCase();
  const phone = normalizePhone(parsed.data.phone);

  if (parsed.data.smsEnabled && !phone) {
    throw new Error("Phone number is required for SMS alerts.");
  }

  if ((parsed.data.emailDaily || parsed.data.emailWeekly) && !email) {
    throw new Error("Email is required for email alerts.");
  }

  const existing = await prisma.subscription.findFirst({
    where: {
      email: user.email.toLowerCase(),
    },
  });

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: {
        userId: existing.userId ?? user.id,
        email,
        phone,
        smsEnabled: parsed.data.smsEnabled,
        emailDaily: parsed.data.emailDaily,
        emailWeekly: parsed.data.emailWeekly,
        isActive: true,
      },
    });
  } else {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        email,
        phone,
        smsEnabled: parsed.data.smsEnabled,
        emailDaily: parsed.data.emailDaily,
        emailWeekly: parsed.data.emailWeekly,
        isActive: true,
      },
    });
  }

  revalidatePath("/dashboard/alerts/preferences");
  revalidatePath("/dashboard/alerts");
}

export async function unsubscribeAllAlertsAction() {
  const user = await requireUser();

  const subscription = await prisma.subscription.findFirst({
    where: {
      email: user.email.toLowerCase(),
    },
  });

  if (!subscription) {
    revalidatePath("/dashboard/alerts/preferences");
    return;
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      isActive: false,
      smsEnabled: false,
      emailDaily: false,
      emailWeekly: false,
    },
  });

  revalidatePath("/dashboard/alerts/preferences");
  revalidatePath("/dashboard/alerts");
  revalidatePath("/dashboard/alerts/following");
}

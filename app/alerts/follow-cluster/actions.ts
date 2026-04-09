"use server";

import { prisma } from "@/lib/prisma";
import {
  followClusterSchema,
  type FollowClusterInput,
} from "@/lib/alerts/follow-cluster-schema";
import { PUBLIC_CLUSTER_STATUS } from "@/lib/public-database/constants";

export type FollowClusterState = {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof FollowClusterInput, string>>;
};

export const initialState: FollowClusterState = {
  success: false,
  message: "",
};

function checkboxOn(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || null;
}

function normalizePhone(phone?: string | null) {
  return phone?.trim().replace(/\s+/g, "") || null;
}

export async function followClusterAction(
  _prevState: FollowClusterState,
  formData: FormData
): Promise<FollowClusterState> {
  const parsed = followClusterSchema.safeParse({
    clusterId: formData.get("clusterId")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    smsEnabled: checkboxOn(formData, "smsEnabled"),
    emailDaily: checkboxOn(formData, "emailDaily"),
    emailWeekly: checkboxOn(formData, "emailWeekly"),
    smsConsent: checkboxOn(formData, "smsConsent"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: {
        clusterId: fieldErrors.clusterId?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
        smsEnabled: fieldErrors.smsEnabled?.[0],
        emailDaily: fieldErrors.emailDaily?.[0],
        emailWeekly: fieldErrors.emailWeekly?.[0],
        smsConsent: fieldErrors.smsConsent?.[0],
      },
    };
  }

  const cluster = await prisma.scamCluster.findUnique({
    where: { id: parsed.data.clusterId },
    select: { id: true, title: true, publicStatus: true },
  });

  if (!cluster || cluster.publicStatus !== PUBLIC_CLUSTER_STATUS) {
    return {
      success: false,
      message: "This scam profile is not available for subscription.",
    };
  }

  const email = normalizeEmail(parsed.data.email);
  const phone = normalizePhone(parsed.data.phone);

  let subscription = await prisma.subscription.findFirst({
    where: {
      OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
    },
  });

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        email,
        phone,
        smsEnabled: parsed.data.smsEnabled,
        emailDaily: parsed.data.emailDaily,
        emailWeekly: parsed.data.emailWeekly,
        isActive: true,
      },
    });
  } else {
    subscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        email: email ?? subscription.email,
        phone: phone ?? subscription.phone,
        smsEnabled: parsed.data.smsEnabled,
        emailDaily: parsed.data.emailDaily,
        emailWeekly: parsed.data.emailWeekly,
        isActive: true,
      },
    });
  }

  await prisma.clusterSubscription.upsert({
    where: {
      clusterId_subscriptionId: {
        clusterId: cluster.id,
        subscriptionId: subscription.id,
      },
    },
    create: {
      clusterId: cluster.id,
      subscriptionId: subscription.id,
    },
    update: {},
  });

  return {
    success: true,
    message: `You are now following updates for "${cluster.title}".`,
  };
}

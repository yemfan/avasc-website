import { NextResponse } from "next/server";
import { followClusterSchema } from "@/lib/alerts/api-schemas";
import { prisma } from "@/lib/prisma";
import { PUBLIC_CLUSTER_STATUS } from "@/lib/public-database/constants";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = followClusterSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { clusterId, email: emailRaw, phone: phoneRaw, emailDaily, emailWeekly, smsEnabled } =
    parsed.data;

  const emailNorm =
    emailRaw !== undefined && emailRaw !== "" ? emailRaw.trim().toLowerCase() : null;
  const phoneNorm =
    phoneRaw !== undefined && phoneRaw !== "" ? phoneRaw.trim() : null;

  const cluster = await prisma.scamCluster.findFirst({
    where: { id: clusterId, publicStatus: PUBLIC_CLUSTER_STATUS },
    select: { id: true },
  });
  if (!cluster) {
    return NextResponse.json({ error: "Pattern not found or not published" }, { status: 404 });
  }

  let sub = emailNorm
    ? await prisma.subscription.findFirst({ where: { email: emailNorm } })
    : null;
  if (!sub && phoneNorm) {
    sub = await prisma.subscription.findFirst({ where: { phone: phoneNorm } });
  }

  if (!sub) {
    sub = await prisma.subscription.create({
      data: {
        email: emailNorm,
        phone: phoneNorm,
        smsEnabled,
        emailDaily,
        emailWeekly,
        isActive: true,
      },
    });
  } else {
    sub = await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        email: emailNorm ?? sub.email,
        phone: phoneNorm ?? sub.phone,
        smsEnabled,
        emailDaily,
        emailWeekly,
        isActive: true,
      },
    });
  }

  await prisma.clusterSubscription.upsert({
    where: {
      clusterId_subscriptionId: { clusterId, subscriptionId: sub.id },
    },
    create: { clusterId, subscriptionId: sub.id },
    update: {},
  });

  return NextResponse.json({
    ok: true,
    subscriptionId: sub.id,
    following: true,
  });
}

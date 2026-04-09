import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Stop following a cluster for the subscription identified by email and/or phone.
 * Idempotent: returns ok if no matching subscription or link.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const body = json as { clusterId?: unknown; email?: unknown; phone?: unknown };
  const clusterId = typeof body.clusterId === "string" ? body.clusterId.trim() : "";
  const emailRaw = typeof body.email === "string" ? body.email : "";
  const phoneRaw = typeof body.phone === "string" ? body.phone : "";
  const email = emailRaw.trim().toLowerCase() || undefined;
  const phone = phoneRaw.trim() || undefined;

  if (!clusterId) {
    return NextResponse.json({ error: "clusterId required" }, { status: 400 });
  }

  if (!email && !phone) {
    return NextResponse.json({ error: "Email or phone required" }, { status: 400 });
  }

  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(clusterId)) {
    return NextResponse.json({ error: "Invalid clusterId" }, { status: 400 });
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      OR: [
        ...(email ? [{ email: { equals: email, mode: "insensitive" as const } }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    },
  });

  if (!subscription) {
    return NextResponse.json({ ok: true });
  }

  await prisma.clusterSubscription.deleteMany({
    where: {
      clusterId,
      subscriptionId: subscription.id,
    },
  });

  return NextResponse.json({ ok: true });
}

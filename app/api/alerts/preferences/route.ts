import { NextResponse } from "next/server";
import { updateAlertPreferencesForUserEmail } from "@/lib/alerts/update-alert-preferences";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = await prisma.subscription.findFirst({
    where: { email: user.email },
    select: {
      id: true,
      email: true,
      phone: true,
      smsEnabled: true,
      emailDaily: true,
      emailWeekly: true,
      isActive: true,
    },
  });

  return NextResponse.json({ subscription: sub });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await updateAlertPreferencesForUserEmail(user.email, json, { userId: user.id });
  if (!result.ok) {
    if (result.fieldErrors) {
      return NextResponse.json({ error: result.fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, subscriptionId: result.subscriptionId });
}

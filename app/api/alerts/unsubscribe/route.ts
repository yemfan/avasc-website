import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const body = json as { email?: unknown; phone?: unknown };
  const emailRaw = typeof body.email === "string" ? body.email : "";
  const phoneRaw = typeof body.phone === "string" ? body.phone : "";
  const email = emailRaw.trim().toLowerCase() || undefined;
  const phone = phoneRaw.trim() || undefined;

  if (!email && !phone) {
    return NextResponse.json({ error: "Email or phone required" }, { status: 400 });
  }

  await prisma.subscription.updateMany({
    where: {
      OR: [
        ...(email ? [{ email: { equals: email, mode: "insensitive" as const } }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    },
    data: {
      isActive: false,
      smsEnabled: false,
      emailDaily: false,
      emailWeekly: false,
    },
  });

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appBaseUrl } from "@/lib/subscriptions/links";

const OFF = {
  isActive: false,
  smsEnabled: false,
  emailDaily: false,
  emailWeekly: false,
} as const;

async function unsubscribeByToken(token: string): Promise<boolean> {
  const res = await prisma.subscription.updateMany({
    where: { unsubscribeToken: token },
    data: OFF,
  });
  return res.count > 0;
}

/** One-click unsubscribe link from an email (RFC 8058 List-Unsubscribe target, user-clickable). */
export async function GET(request: Request) {
  const base = appBaseUrl();
  const token = new URL(request.url).searchParams.get("token")?.trim();
  if (token) {
    await unsubscribeByToken(token);
    return NextResponse.redirect(`${base}/alerts?unsubscribe=success`);
  }
  return NextResponse.redirect(`${base}/alerts?unsubscribe=invalid`);
}

export async function POST(request: Request) {
  // RFC 8058 one-click: mailbox providers POST to the List-Unsubscribe URL (token in query),
  // with a form-encoded body, so handle the token before attempting to read JSON.
  const token = new URL(request.url).searchParams.get("token")?.trim();
  if (token) {
    await unsubscribeByToken(token);
    return NextResponse.json({ ok: true });
  }

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
    data: OFF,
  });

  return NextResponse.json({ ok: true });
}

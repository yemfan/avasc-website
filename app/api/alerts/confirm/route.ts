import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appBaseUrl } from "@/lib/subscriptions/links";

/**
 * Double opt-in confirmation landing. The token comes from the confirmation email.
 * On success we set confirmedAt, clear the single-use confirmToken, and redirect to
 * the alerts page with a status flag. Unknown/used tokens redirect with an error flag
 * (no token enumeration signal).
 */
export async function GET(request: Request) {
  const base = appBaseUrl();
  const token = new URL(request.url).searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.redirect(`${base}/alerts?confirm=invalid`);
  }

  const sub = await prisma.subscription.findUnique({ where: { confirmToken: token } });
  if (!sub) {
    return NextResponse.redirect(`${base}/alerts?confirm=invalid`);
  }

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      confirmedAt: sub.confirmedAt ?? new Date(),
      confirmToken: null,
      isActive: true,
    },
  });

  return NextResponse.redirect(`${base}/alerts?confirm=success`);
}

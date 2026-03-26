import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  await ensureAppUser(user);

  const appUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!appUser || appUser.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const cases = await prisma.case.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      scamType: true,
      status: true,
      visibility: true,
      reporterUserId: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ success: true, cases });
}

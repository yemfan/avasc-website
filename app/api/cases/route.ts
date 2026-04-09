import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { createCaseBodySchema } from "@/lib/report/case-submission";
import { createCaseWithIntakeMatching } from "@/lib/report/create-case-prisma";
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

  const profile = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
    select: { id: true },
  });

  if (!profile) {
    return NextResponse.json({ success: true, cases: [] });
  }

  const cases = await prisma.case.findMany({
    where: { userId: profile.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      scamType: true,
      status: true,
      visibility: true,
      createdAt: true,
      _count: { select: { supportRequests: true } },
    },
  });

  return NextResponse.json({
    success: true,
    cases: cases.map((c) => ({
      id: c.id,
      title: c.title,
      scamType: c.scamType,
      status: c.status,
      visibility: c.visibility,
      createdAt: c.createdAt,
      supportRequested: c._count.supportRequests > 0,
    })),
  });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const json = await req.json();
  const parsed = createCaseBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (authUser) await ensureAppUser(authUser);

  try {
    const { caseId } = await createCaseWithIntakeMatching(parsed.data, authUser);
    return NextResponse.json({ success: true, caseId });
  } catch (err) {
    console.error("[api/cases] POST failed", err);
    return NextResponse.json(
      { success: false, error: "Could not save your report. Please try again." },
      { status: 500 }
    );
  }
}

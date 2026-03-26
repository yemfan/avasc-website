import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { getServiceSupabase } from "@/lib/supabase/service-role";
import { getCaseDetailById } from "@/lib/db/case-detail";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  await ensureAppUser(user);

  const db = getServiceSupabase();
  const { data: appUser, error: ue } = await db.from("User").select("*").eq("id", user.id).maybeSingle();
  if (ue || !appUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const c = await getCaseDetailById(id);

  if (!c) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const isOwner = c.reporterUserId === user.id;
  const isStaff = appUser.role === "admin" || appUser.role === "moderator";
  if (!isOwner && !isStaff) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ success: true, case: c });
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { getServiceSupabase } from "@/lib/supabase/service-role";

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

  const db = getServiceSupabase();
  const { data: appUser, error: ue } = await db.from("User").select("role").eq("id", user.id).maybeSingle();
  if (ue) throw ue;
  if (!appUser || appUser.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const { data: cases, error } = await db
    .from("Case")
    .select("id, title, scamType, status, visibility, reporterUserId, createdAt")
    .order("createdAt", { ascending: false })
    .limit(100);
  if (error) throw error;

  return NextResponse.json({ success: true, cases: cases ?? [] });
}

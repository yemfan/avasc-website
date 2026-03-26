import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { getServiceSupabase } from "@/lib/supabase/service-role";
import { newRowId } from "@/lib/db/id";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(20).max(20000),
  isAnonymous: z.boolean().optional(),
});

export async function GET() {
  const db = getServiceSupabase();
  const { data: stories, error } = await db
    .from("Story")
    .select("id, title, body, isAnonymous, createdAt")
    .eq("status", "approved")
    .order("createdAt", { ascending: false })
    .limit(50);
  if (error) throw error;

  return NextResponse.json({ success: true, stories: stories ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  await ensureAppUser(user);

  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const db = getServiceSupabase();
  const id = newRowId();
  const now = new Date().toISOString();
  const { data: story, error } = await db
    .from("Story")
    .insert({
      id,
      authorUserId: user.id,
      title: parsed.data.title,
      body: parsed.data.body,
      isAnonymous: parsed.data.isAnonymous ?? false,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    })
    .select("id, status")
    .single();
  if (error) throw error;

  return NextResponse.json({ success: true, storyId: story.id, status: story.status });
}

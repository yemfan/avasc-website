import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { commentContainsBlockedPattern } from "@/lib/comment-policy";
import { getServiceSupabase } from "@/lib/supabase/service-role";
import { newRowId } from "@/lib/db/id";
import { getPrisma } from "@/lib/prisma";
import { getApprovedCommentsByStorySlug, submitStoryCommentBySlug } from "@/lib/public-stories";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  body: z.string().min(2).max(4000),
});

type RouteParams = { params: Promise<{ storyRef: string }> };

/** Story rows use `@db.Uuid`; slugs are not valid UUIDs, so this disambiguates POST handlers. */
const STORY_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_req: Request, { params }: RouteParams) {
  const { storyRef } = await params;
  const prisma = getPrisma();

  if (STORY_ID_RE.test(storyRef)) {
    const story = await prisma.story.findFirst({
      where: { id: storyRef, moderationStatus: "APPROVED" },
      select: {
        comments: {
          where: { moderationStatus: "APPROVED" },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            body: true,
            createdAt: true,
            user: { select: { displayName: true } },
          },
        },
      },
    });
    const comments = (story?.comments ?? []).map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt,
      authorLabel: c.user?.displayName?.trim() || "Community member",
    }));
    return NextResponse.json({ success: true, comments });
  }

  const comments = await getApprovedCommentsByStorySlug(prisma, storyRef);
  return NextResponse.json({ success: true, comments });
}

export async function POST(req: Request, { params }: RouteParams) {
  const { storyRef } = await params;
  if (STORY_ID_RE.test(storyRef)) {
    return postCommentByStoryId(req, storyRef);
  }

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  try {
    const created = await submitStoryCommentBySlug(storyRef, parsed.data.body);
    return NextResponse.json({ success: true, commentId: created.commentId, status: created.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not submit comment";
    if (message === "Unauthorized") return NextResponse.json({ success: false, error: message }, { status: 401 });
    if (message === "Not found") return NextResponse.json({ success: false, error: message }, { status: 404 });
    if (message.includes("cannot contain URLs") || message.includes("2-4000")) {
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

async function postCommentByStoryId(req: Request, storyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  await ensureAppUser(user);

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (commentContainsBlockedPattern(parsed.data.body)) {
    return NextResponse.json(
      { success: false, error: "Comments cannot contain URLs in this release." },
      { status: 400 }
    );
  }

  const db = getServiceSupabase();
  const { data: story, error: se } = await db.from("Story").select("id, status").eq("id", storyId).maybeSingle();
  if (se) throw se;
  if (!story || story.status !== "approved") {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const commentId = newRowId();
  const now = new Date().toISOString();
  const { data: comment, error: ce } = await db
    .from("Comment")
    .insert({
      id: commentId,
      storyId,
      authorUserId: user.id,
      body: parsed.data.body,
      status: "pending",
      createdAt: now,
    })
    .select("id, status")
    .single();
  if (ce) throw ce;

  return NextResponse.json({ success: true, commentId: comment.id, status: comment.status });
}

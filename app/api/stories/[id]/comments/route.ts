import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { commentContainsBlockedPattern } from "@/lib/comment-policy";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  body: z.string().min(2).max(4000),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: RouteParams) {
  const { id: storyId } = await params;

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

  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story || story.status !== "approved") {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: {
      storyId,
      authorUserId: user.id,
      body: parsed.data.body,
      status: "pending",
    },
  });

  return NextResponse.json({ success: true, commentId: comment.id, status: comment.status });
}

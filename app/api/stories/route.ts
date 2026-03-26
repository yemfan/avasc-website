import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(20).max(20000),
  isAnonymous: z.boolean().optional(),
});

export async function GET() {
  const stories = await prisma.story.findMany({
    where: { status: "approved" },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      body: true,
      isAnonymous: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ success: true, stories });
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

  const story = await prisma.story.create({
    data: {
      authorUserId: user.id,
      title: parsed.data.title,
      body: parsed.data.body,
      isAnonymous: parsed.data.isAnonymous ?? false,
      status: "pending",
    },
  });

  return NextResponse.json({ success: true, storyId: story.id, status: story.status });
}

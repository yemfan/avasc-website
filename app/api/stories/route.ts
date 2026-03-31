import { NextResponse } from "next/server";
import { createPublicStorySchema, createStorySubmission, listApprovedPublicStories } from "@/lib/public-stories";

export const dynamic = "force-dynamic";

export async function GET() {
  const stories = await listApprovedPublicStories(50);
  return NextResponse.json({ success: true, stories });
}

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = createPublicStorySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  try {
    const created = await createStorySubmission(parsed.data);
    return NextResponse.json({ success: true, storyId: created.storyId, status: created.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not submit story";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

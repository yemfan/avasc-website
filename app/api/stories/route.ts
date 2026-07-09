import { NextResponse } from "next/server";
import { getLocale } from "next-intl/server";
import { createPublicStorySchema, createStorySubmission, listApprovedPublicStories } from "@/lib/public-stories";
import { translateMany } from "@/lib/i18n/translate-content";
import type { Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const stories = await listApprovedPublicStories(50);

  // Translate approved (public) story content for the active locale; cached.
  try {
    const locale = (await getLocale()) as Locale;
    if (locale !== "en" && stories.length) {
      const translated = await translateMany(
        "story",
        locale,
        stories.map((s) => ({ id: s.id, fields: { title: s.title, body: s.body } })),
      );
      const localized = stories.map((s, i) => ({
        ...s,
        title: translated[i]?.title ?? s.title,
        body: translated[i]?.body ?? s.body,
      }));
      return NextResponse.json({ success: true, stories: localized });
    }
  } catch {
    // fall through to English
  }

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

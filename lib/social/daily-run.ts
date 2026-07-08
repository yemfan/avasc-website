import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { buildDailyContext, generateDailyPosts } from "@/lib/social/daily";
import { postToX, postToFacebook, type PostResult } from "@/lib/social/post";

export type DailyRunResult = {
  ok: boolean;
  date: string;
  theme?: string;
  status?: string;
  results?: Record<string, PostResult>;
  skipped?: boolean;
  error?: string;
};

function utcDateOnly(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/**
 * Generate today's themed post, save it, and auto-post to configured platforms.
 * Idempotent per day (unique postDate); pass `force` to regenerate/repost.
 */
export async function runDailySocialPost(opts?: { force?: boolean; date?: Date }): Promise<DailyRunResult> {
  const now = opts?.date ?? new Date();
  const postDate = utcDateOnly(now);
  const dateStr = postDate.toISOString().slice(0, 10);

  const existing = await prisma.socialDailyPost.findUnique({ where: { postDate } });
  if (existing && !opts?.force && (existing.status === "posted" || existing.status === "partial")) {
    return { ok: true, date: dateStr, theme: existing.theme, status: existing.status, skipped: true };
  }

  const ctx = await buildDailyContext(now);
  if (!ctx) return { ok: false, date: dateStr, error: "No content available for today's theme." };

  const posts = await generateDailyPosts(ctx);
  if (!posts.length) return { ok: false, date: dateStr, theme: ctx.theme.key, error: "Generation produced no posts." };

  const row = await prisma.socialDailyPost.upsert({
    where: { postDate },
    create: {
      postDate,
      theme: ctx.theme.key,
      posts: posts as unknown as Prisma.InputJsonValue,
      linkUrl: ctx.linkUrl,
      status: "generated",
    },
    update: {
      theme: ctx.theme.key,
      posts: posts as unknown as Prisma.InputJsonValue,
      linkUrl: ctx.linkUrl,
      status: "generated",
    },
  });

  const xPost = posts.find((p) => p.platform === "x");
  const fbPost = posts.find((p) => p.platform === "facebook");

  const results: Record<string, PostResult> = {};
  if (xPost) {
    let text = xPost.body;
    if (ctx.linkUrl && !text.includes(ctx.linkUrl)) text = `${text} ${ctx.linkUrl}`.trim();
    results.x = await postToX(text);
  }
  if (fbPost) {
    results.facebook = await postToFacebook(fbPost.body, ctx.linkUrl);
  }

  const attempted = Object.values(results).filter((r) => !r.skipped);
  const succeeded = attempted.filter((r) => r.ok);
  const status =
    attempted.length === 0
      ? "generated"
      : succeeded.length === attempted.length
        ? "posted"
        : succeeded.length > 0
          ? "partial"
          : "failed";

  await prisma.socialDailyPost.update({
    where: { id: row.id },
    data: { status, results: results as unknown as Prisma.InputJsonValue },
  });

  return { ok: true, date: dateStr, theme: ctx.theme.key, status, results };
}

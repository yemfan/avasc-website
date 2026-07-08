import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { appBaseUrl } from "@/lib/subscriptions/links";
import { buildDailyContext, generateDailyPosts } from "@/lib/social/daily";
import { postToX, postToFacebook, postToInstagram, type PostResult } from "@/lib/social/post";
import { getSocialAutopilot } from "@/lib/social/settings";
import type { SocialPost } from "@/lib/social/types";

export type DailyRunResult = {
  ok: boolean;
  date: string;
  theme?: string;
  status?: string;
  mode?: "autopilot" | "approval";
  results?: Record<string, PostResult>;
  skipped?: boolean;
  error?: string;
};

function utcDateOnly(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Post a day's copy to the configured platforms and compute the resulting status. */
async function attemptPost(
  posts: SocialPost[],
  linkUrl: string | null,
  postId: string
): Promise<{ status: string; results: Record<string, PostResult> }> {
  const xPost = posts.find((p) => p.platform === "x");
  const fbPost = posts.find((p) => p.platform === "facebook");
  const igPost = posts.find((p) => p.platform === "instagram");

  const results: Record<string, PostResult> = {};
  if (xPost) {
    let text = xPost.body;
    if (linkUrl && !text.includes(linkUrl)) text = `${text} ${linkUrl}`.trim();
    results.x = await postToX(text);
  }
  if (fbPost) {
    results.facebook = await postToFacebook(fbPost.body, linkUrl ?? undefined);
  }
  if (igPost) {
    // IG needs a public JPEG; the daily-image route renders one from this post.
    const imageUrl = `${appBaseUrl()}/api/social/daily-image/${postId}`;
    results.instagram = await postToInstagram(imageUrl, igPost.body);
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
  return { status, results };
}

/**
 * Generate today's themed post and either auto-post it (autopilot) or save it as
 * a draft awaiting approval. Idempotent per day; `force` regenerates.
 */
export async function runDailySocialPost(opts?: { force?: boolean; date?: Date }): Promise<DailyRunResult> {
  const now = opts?.date ?? new Date();
  const postDate = utcDateOnly(now);
  const dateStr = postDate.toISOString().slice(0, 10);

  const existing = await prisma.socialDailyPost.findUnique({ where: { postDate } });
  if (existing && !opts?.force && (existing.status === "posted" || existing.status === "partial" || existing.status === "pending")) {
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

  const autopilot = await getSocialAutopilot();
  if (!autopilot) {
    // Approval mode: hold as a draft; staff approve it to post + publish.
    await prisma.socialDailyPost.update({ where: { id: row.id }, data: { status: "pending" } });
    return { ok: true, date: dateStr, theme: ctx.theme.key, status: "pending", mode: "approval" };
  }

  const { status, results } = await attemptPost(posts, ctx.linkUrl, row.id);
  await prisma.socialDailyPost.update({
    where: { id: row.id },
    data: { status, results: results as unknown as Prisma.InputJsonValue },
  });
  return { ok: true, date: dateStr, theme: ctx.theme.key, status, mode: "autopilot", results };
}

/** Approve + post a saved (pending) daily post. Used by the admin approve action. */
export async function postSavedDailyPost(id: string): Promise<{ ok: boolean; status?: string; results?: Record<string, PostResult>; error?: string }> {
  const row = await prisma.socialDailyPost.findUnique({ where: { id } });
  if (!row) return { ok: false, error: "Post not found." };

  const posts = Array.isArray(row.posts) ? (row.posts as unknown as SocialPost[]) : [];
  if (!posts.length) return { ok: false, error: "This post has no content." };

  const { status, results } = await attemptPost(posts, row.linkUrl, row.id);
  await prisma.socialDailyPost.update({
    where: { id },
    data: { status, results: results as unknown as Prisma.InputJsonValue },
  });
  return { ok: true, status, results };
}

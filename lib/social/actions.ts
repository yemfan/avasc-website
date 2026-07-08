"use server";

/**
 * Staff-only social content generation. On-demand and NOT persisted: returns the
 * generated posts to the client for copy/paste. The briefing is the saved,
 * canonical content; social posts are ephemeral.
 */

import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/auth/require-role";
import { isAnthropicConfigured } from "@/lib/ai/anthropic";
import {
  getLatestPublishedBriefing,
  getPublishedBriefingBySlug,
} from "@/lib/briefings/queries";
import { generateSocialPosts } from "@/lib/social/generate";
import type { SocialPost } from "@/lib/social/types";

// NOTE: not exported — a `"use server"` file may only export async functions, and
// re-exporting a type becomes a runtime value export that crashes the route.
type GenerateSocialResult =
  | { ok: true; posts: SocialPost[]; briefingTitle: string; briefingSlug: string }
  | { ok: false; error: string };

/**
 * Generate social posts from a published briefing (defaults to the latest weekly
 * briefing when no slug is given). Staff-gated. Never throws for the common
 * not-configured / no-content cases — returns a friendly `{ ok:false, error }`.
 */
export async function generateSocialAction(slug?: string): Promise<GenerateSocialResult> {
  await requireRole([UserRole.admin, UserRole.moderator]);

  if (!isAnthropicConfigured()) {
    return {
      ok: false,
      error: "AI is not configured (ANTHROPIC_API_KEY missing). Set it in the environment to generate social posts.",
    };
  }

  const briefing = slug
    ? await getPublishedBriefingBySlug(slug)
    : await getLatestPublishedBriefing("weekly");

  if (!briefing) {
    return {
      ok: false,
      error: slug
        ? "That briefing was not found or is not published."
        : "No published briefing yet. Publish a briefing first, then generate social posts from it.",
    };
  }

  let posts: SocialPost[];
  try {
    posts = await generateSocialPosts(briefing);
  } catch (err) {
    console.error("[social] generate failed", err instanceof Error ? err.message : err);
    return { ok: false, error: "Social generation failed. Please try again." };
  }

  if (posts.length === 0) {
    return { ok: false, error: "The AI returned no usable posts. Please try again." };
  }

  return { ok: true, posts, briefingTitle: briefing.title, briefingSlug: briefing.slug };
}

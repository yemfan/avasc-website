"use server";

/**
 * Staff-only actions for the AVASC briefings admin pages.
 * Reuses the shared briefings engine (`publishBriefing`) — no generation logic here.
 */

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/auth/require-role";
import { isAnthropicConfigured } from "@/lib/ai/anthropic";
import { publishBriefing, type BriefingKind } from "@/lib/briefings/generate";

type GenerateBriefingResult = {
  ok: boolean;
  slug?: string;
  error?: string;
};

const ADMIN_PATH: Record<BriefingKind, string> = {
  weekly: "/admin/weekly-news",
  daily: "/admin/daily-news",
};

/**
 * Generate + publish a briefing of the given cadence. Staff-gated.
 * Never throws for the common "not configured / generation failed" cases —
 * returns a friendly `{ ok:false, error }` so the form can show it.
 */
export async function generateBriefingAction(kind: BriefingKind): Promise<GenerateBriefingResult> {
  await requireRole([UserRole.admin, UserRole.moderator]);

  if (!isAnthropicConfigured()) {
    return {
      ok: false,
      error: "AI is not configured (ANTHROPIC_API_KEY missing). Set it in the environment to generate briefings.",
    };
  }

  let slug: string | null;
  try {
    slug = await publishBriefing(kind);
  } catch (err) {
    console.error("[briefings] admin generate failed", err instanceof Error ? err.message : err);
    return { ok: false, error: "Briefing generation failed. Please try again." };
  }

  if (!slug) {
    return { ok: false, error: "Briefing generation failed (no content produced). Please try again." };
  }

  revalidatePath(ADMIN_PATH[kind]);
  revalidatePath("/briefings");

  return { ok: true, slug };
}

/**
 * `<form action>` wrapper: a server component binds `kind` and passes the FormData
 * along. Returns void so it's a valid form action. The revalidatePath inside
 * generateBriefingAction refreshes the page's briefing list after publish.
 */
export async function generateBriefingFormAction(kind: BriefingKind, formData: FormData): Promise<void> {
  void formData; // form actions receive FormData; this one needs only the bound `kind`.
  await generateBriefingAction(kind);
}

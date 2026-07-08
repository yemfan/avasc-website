import { NextResponse } from "next/server";

import { isAnthropicConfigured } from "@/lib/ai/anthropic";
import { suggestReportFields } from "@/lib/report/ai-fill";
import { MAX_ACCOUNT_CHARS } from "@/lib/report/scam-types";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const maxDuration = 45;

const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60_000;

/** Public AI-fill for the report form: free-text account -> suggested structured fields. */
export async function POST(request: Request) {
  if (!isAnthropicConfigured()) {
    return NextResponse.json(
      { ok: false, error: "AI assist is unavailable right now — you can fill the form in manually." },
      { status: 503 }
    );
  }

  const rl = rateLimit(`report-ai-fill:${getClientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "You're going a bit too quickly. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const account = typeof (body as { account?: unknown })?.account === "string"
    ? (body as { account: string }).account.trim().slice(0, MAX_ACCOUNT_CHARS)
    : "";

  if (account.length < 15) {
    return NextResponse.json(
      { ok: false, error: "Tell us a little more about what happened so we can fill the form." },
      { status: 400 }
    );
  }

  try {
    const fields = await suggestReportFields(account);
    if (!fields) {
      return NextResponse.json(
        { ok: false, error: "We couldn't draft the form just now. Please try again or fill it in manually." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, fields });
  } catch (err) {
    console.error("[report/ai-fill] failed", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}

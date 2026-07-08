import { NextResponse } from "next/server";

import { isAnthropicConfigured } from "@/lib/ai/anthropic";
import { analyzeScamCheck, type ScamCheckImage } from "@/lib/scam-check/analyze";
import { MAX_DESC_CHARS, MAX_IMAGES, MAX_IMAGE_BASE64_CHARS } from "@/lib/scam-check/types";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

// Vision + reasoning can take a little while; give it headroom.
export const maxDuration = 60;

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

const MEDIA_TYPES: Record<string, ScamCheckImage["mediaType"]> = {
  "image/png": "image/png",
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/webp": "image/webp",
  "image/gif": "image/gif",
};

/** Parse a `data:image/...;base64,...` URL into a Claude-ready image, or null if invalid/oversized. */
function parseDataUrl(value: unknown): ScamCheckImage | null {
  if (typeof value !== "string") return null;
  const m = value.match(/^data:([a-z/+.-]+);base64,([A-Za-z0-9+/=]+)$/i);
  if (!m) return null;
  const mediaType = MEDIA_TYPES[m[1].toLowerCase()];
  if (!mediaType) return null;
  const base64 = m[2];
  if (base64.length === 0 || base64.length > MAX_IMAGE_BASE64_CHARS) return null;
  return { mediaType, base64 };
}

export async function POST(request: Request) {
  if (!isAnthropicConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Scam Check is temporarily unavailable. You can still report a scam or browse our guides." },
      { status: 503 }
    );
  }

  const rl = rateLimit(`scam-check:${getClientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "You're checking a bit too quickly. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const b = body as { description?: unknown; images?: unknown };
  const description = typeof b.description === "string" ? b.description.trim().slice(0, MAX_DESC_CHARS) : "";
  const rawImages = Array.isArray(b.images) ? b.images.slice(0, MAX_IMAGES) : [];
  const images = rawImages.map(parseDataUrl).filter((x): x is ScamCheckImage => x !== null);

  if (rawImages.length > 0 && images.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Those images couldn't be read. Please upload PNG, JPG, WebP, or GIF screenshots." },
      { status: 400 }
    );
  }
  if (description.length < 10 && images.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Tell us a little about the situation, or upload a screenshot to check." },
      { status: 400 }
    );
  }

  try {
    const result = await analyzeScamCheck({ description, images });
    if (!result) {
      return NextResponse.json(
        { ok: false, error: "We couldn't complete the check just now. Please try again or report your case." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const status = typeof (err as { status?: unknown })?.status === "number" ? (err as { status: number }).status : 0;
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[scam-check] analysis failed", status, msg);
    // Claude returns 400 "Could not process image" for unreadable/degenerate uploads.
    if (status === 400 || /process image|image/i.test(msg)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "We couldn't read one of your screenshots. Try a clearer PNG or JPG, or just describe what happened in words.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}

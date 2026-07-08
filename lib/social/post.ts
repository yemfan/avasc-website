import { createHmac, randomBytes } from "node:crypto";

/**
 * Auto-post to social platforms. Each poster is gated on its own env tokens and
 * returns `skipped:true` when not configured, so the daily cron degrades
 * gracefully (generates + saves, posts only where credentials exist).
 *
 * Env required to actually post:
 *   X (Twitter):  X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
 *   Facebook:     FACEBOOK_PAGE_ID, FACEBOOK_PAGE_ACCESS_TOKEN
 * Instagram is text-incompatible (requires a hosted image) — a follow-up.
 */

export type PostResult = { ok: boolean; id?: string; error?: string; skipped?: boolean };

function rfc3986(value: string): string {
  return encodeURIComponent(value).replace(/[!*'()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** Post a tweet via X API v2 with OAuth 1.0a user context. */
export async function postToX(text: string): Promise<PostResult> {
  const apiKey = process.env.X_API_KEY?.trim();
  const apiSecret = process.env.X_API_SECRET?.trim();
  const accessToken = process.env.X_ACCESS_TOKEN?.trim();
  const accessSecret = process.env.X_ACCESS_SECRET?.trim();
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return { ok: false, skipped: true, error: "X not configured" };
  }

  const url = "https://api.twitter.com/2/tweets";
  const oauth: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };
  // Signature base uses only the oauth_* params (JSON body is excluded for OAuth1.0a).
  const paramString = Object.keys(oauth)
    .sort()
    .map((k) => `${rfc3986(k)}=${rfc3986(oauth[k])}`)
    .join("&");
  const baseString = `POST&${rfc3986(url)}&${rfc3986(paramString)}`;
  const signingKey = `${rfc3986(apiSecret)}&${rfc3986(accessSecret)}`;
  const signature = createHmac("sha1", signingKey).update(baseString).digest("base64");

  const header =
    "OAuth " +
    Object.entries({ ...oauth, oauth_signature: signature })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${rfc3986(k)}="${rfc3986(v)}"`)
      .join(", ");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: header, "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.slice(0, 280) }),
    });
    const json = (await res.json().catch(() => ({}))) as { data?: { id?: string }; detail?: string; title?: string };
    if (!res.ok) {
      return { ok: false, error: json.detail || json.title || `X error ${res.status}` };
    }
    return { ok: true, id: json.data?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "X request failed" };
  }
}

/** Post to a Facebook Page feed via the Graph API. */
export async function postToFacebook(message: string, link?: string): Promise<PostResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  if (!pageId || !token) {
    return { ok: false, skipped: true, error: "Facebook not configured" };
  }

  const body = new URLSearchParams({ message, access_token: token });
  if (link) body.set("link", link);

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(pageId)}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = (await res.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
    if (!res.ok) {
      return { ok: false, error: json.error?.message || `Facebook error ${res.status}` };
    }
    return { ok: true, id: json.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Facebook request failed" };
  }
}

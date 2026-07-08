import { createHmac, randomBytes } from "node:crypto";

/**
 * Auto-post to social platforms. Each poster is gated on its own env tokens and
 * returns `skipped:true` when not configured, so the daily cron degrades
 * gracefully (generates + saves, posts only where credentials exist).
 *
 * Env required to actually post:
 *   X (Twitter):  X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
 *   Facebook:     FACEBOOK_PAGE_ID, FACEBOOK_PAGE_ACCESS_TOKEN
 *   Instagram:    INSTAGRAM_USER_ID (+ INSTAGRAM_ACCESS_TOKEN, or reuse FACEBOOK_PAGE_ACCESS_TOKEN)
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

/**
 * Post to Instagram via the Graph API (2 steps: create media container from a
 * public JPEG image_url + caption, then publish it). Requires a business/creator
 * IG account linked to a Facebook Page.
 */
export async function postToInstagram(imageUrl: string, caption: string): Promise<PostResult> {
  const igUserId = process.env.INSTAGRAM_USER_ID?.trim();
  const token = (process.env.INSTAGRAM_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN)?.trim();
  if (!igUserId || !token) {
    return { ok: false, skipped: true, error: "Instagram not configured" };
  }

  const base = `https://graph.facebook.com/v21.0/${encodeURIComponent(igUserId)}`;
  try {
    // 1) Create the media container.
    const createBody = new URLSearchParams({ image_url: imageUrl, caption: caption.slice(0, 2200), access_token: token });
    const cRes = await fetch(`${base}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: createBody,
    });
    const cJson = (await cRes.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
    if (!cRes.ok || !cJson.id) {
      return { ok: false, error: cJson.error?.message || `Instagram container error ${cRes.status}` };
    }

    // 2) Publish the container.
    const pubBody = new URLSearchParams({ creation_id: cJson.id, access_token: token });
    const pRes = await fetch(`${base}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: pubBody,
    });
    const pJson = (await pRes.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
    if (!pRes.ok || !pJson.id) {
      return { ok: false, error: pJson.error?.message || `Instagram publish error ${pRes.status}` };
    }
    return { ok: true, id: pJson.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Instagram request failed" };
  }
}

import type { BriefingView } from "@/lib/briefings/queries";
import { appBaseUrl } from "@/lib/subscriptions/links";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Email subject line for a briefing broadcast. */
export function briefingEmailSubject(b: BriefingView): string {
  return b.title.slice(0, 200);
}

/**
 * Render a published briefing to email-safe HTML (inline styles, no external assets).
 * The per-subscriber unsubscribe footer is appended by the send primitive, not here.
 */
export function renderBriefingEmail(b: BriefingView): string {
  const base = appBaseUrl();
  const articleUrl = `${base}/briefings/${encodeURIComponent(b.slug)}`;

  const keyPoints =
    b.keyPoints.length > 0
      ? `<ul style="margin:0 0 24px; padding-left:20px; color:#374151; line-height:1.7;">
          ${b.keyPoints.map((k) => `<li style="margin:0 0 6px;">${escapeHtml(k)}</li>`).join("")}
        </ul>`
      : "";

  const sections = b.sections
    .map(
      (s) => `
        <h2 style="margin:24px 0 8px; font-size:18px; color:#111827;">${escapeHtml(s.heading)}</h2>
        ${s.paragraphs
          .map((p) => `<p style="margin:0 0 12px; color:#374151; line-height:1.7;">${escapeHtml(p)}</p>`)
          .join("")}
      `
    )
    .join("");

  const protect =
    b.protectYourself.length > 0
      ? `
        <div style="margin:24px 0; padding:16px 18px; background:#f0f9ff; border:1px solid #bae6fd; border-radius:12px;">
          <div style="font-weight:700; color:#0c4a6e; margin-bottom:8px;">How to protect yourself</div>
          <ul style="margin:0; padding-left:20px; color:#0c4a6e; line-height:1.7;">
            ${b.protectYourself.map((p) => `<li style="margin:0 0 6px;">${escapeHtml(p)}</li>`).join("")}
          </ul>
        </div>`
      : "";

  const sources =
    b.sources.length > 0
      ? `
        <div style="margin-top:24px; padding-top:16px; border-top:1px solid #e5e7eb;">
          <div style="font-weight:700; color:#111827; margin-bottom:8px; font-size:14px;">Sources</div>
          <ul style="margin:0; padding-left:20px; color:#6b7280; line-height:1.6; font-size:13px;">
            ${b.sources
              .map(
                (src) =>
                  `<li style="margin:0 0 4px;"><a href="${escapeHtml(src.url)}" style="color:#1d4ed8;">${escapeHtml(
                    src.publisher || src.title
                  )}</a></li>`
              )
              .join("")}
          </ul>
        </div>`
      : "";

  return `
<div style="background:#f8fafc; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
    <div style="padding:28px 32px; border-bottom:1px solid #e5e7eb;">
      ${b.periodLabel ? `<div style="text-transform:uppercase; letter-spacing:.05em; font-size:12px; color:#6b7280; margin-bottom:8px;">${escapeHtml(b.periodLabel)}</div>` : ""}
      <div style="font-size:24px; font-weight:800; color:#111827; line-height:1.3;">${escapeHtml(b.title)}</div>
      ${b.dek ? `<div style="margin-top:10px; color:#4b5563; font-size:15px; line-height:1.6;">${escapeHtml(b.dek)}</div>` : ""}
    </div>
    <div style="padding:32px;">
      ${b.summary ? `<p style="margin:0 0 20px; color:#374151; line-height:1.7;">${escapeHtml(b.summary)}</p>` : ""}
      ${keyPoints}
      ${sections}
      ${protect}
      <p style="margin:24px 0 0;">
        <a href="${articleUrl}" style="display:inline-block; background:#1d4ed8; color:#ffffff; text-decoration:none; padding:11px 20px; border-radius:10px; font-weight:600;">
          Read the full briefing
        </a>
      </p>
      ${sources}
    </div>
  </div>
</div>
`;
}

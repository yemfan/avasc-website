/**
 * Subscription link + footer helpers shared by the confirmation email and every
 * broadcast send (daily/weekly digests, briefings). Keeps double opt-in + CAN-SPAM
 * unsubscribe wiring in one place.
 */

export function appBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/** CAN-SPAM requires a physical mailing address in every commercial email. */
export function mailingAddress(): string {
  return (
    process.env.AVASC_MAILING_ADDRESS?.trim() ||
    "Association of Victims Against Cyber-Scams (AVASC)"
  );
}

export function confirmUrl(token: string): string {
  return `${appBaseUrl()}/api/alerts/confirm?token=${encodeURIComponent(token)}`;
}

/** One-click unsubscribe (GET) landing that flips the subscription off. */
export function unsubscribeUrl(token: string): string {
  return `${appBaseUrl()}/api/alerts/unsubscribe?token=${encodeURIComponent(token)}`;
}

/**
 * RFC 8058 one-click unsubscribe headers. `List-Unsubscribe-Post` lets mailbox
 * providers POST the unsubscribe without a browser round-trip.
 */
export function listUnsubscribeHeaders(token: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${unsubscribeUrl(token)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/** CAN-SPAM footer appended to every broadcast email (per-subscriber token). */
export function unsubscribeFooterHtml(token: string): string {
  const url = unsubscribeUrl(token);
  return `
    <div style="margin-top:28px;padding-top:16px;border-top:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;">
      <p style="margin:0 0 6px 0;">
        You are receiving this because you subscribed to AVASC scam alerts.
        <a href="${url}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>.
      </p>
      <p style="margin:0;">${escapeHtml(mailingAddress())}</p>
    </div>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

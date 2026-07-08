import { getResend } from "@/lib/email/resend-client";
import { confirmUrl, mailingAddress, unsubscribeUrl } from "@/lib/subscriptions/links";

type SendSubscriptionConfirmationInput = {
  to: string;
  confirmToken: string;
  unsubscribeToken: string;
  /** Human summary of what they signed up for, e.g. "daily and weekly scam briefings". */
  cadenceLabel: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildHtml(input: SendSubscriptionConfirmationInput) {
  const url = confirmUrl(input.confirmToken);
  const unsub = unsubscribeUrl(input.unsubscribeToken);
  return `
<div style="background:#f8fafc; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
    <div style="padding:28px 32px; border-bottom:1px solid #e5e7eb;">
      <div style="font-size:22px; font-weight:700; color:#111827;">Confirm your AVASC alerts</div>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 16px; color:#374151; line-height:1.7;">
        Thanks for signing up for <strong>${escapeHtml(input.cadenceLabel)}</strong> from the
        Association of Victims Against Cyber-Scams. Please confirm this email address to start receiving them.
      </p>
      <p style="margin:0 0 28px;">
        <a href="${url}" style="display:inline-block; background:#1d4ed8; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:10px; font-weight:600;">
          Confirm subscription
        </a>
      </p>
      <p style="margin:0 0 16px; color:#6b7280; line-height:1.6; font-size:13px;">
        If the button does not work, copy and paste this link:<br />
        <a href="${url}" style="color:#1d4ed8; word-break:break-all;">${url}</a>
      </p>
      <p style="margin:0; color:#6b7280; line-height:1.6; font-size:13px;">
        If you did not request this, you can ignore this email or
        <a href="${unsub}" style="color:#6b7280; text-decoration:underline;">unsubscribe</a>.
        No alerts are sent until you confirm.
      </p>
    </div>
    <div style="padding:16px 32px; border-top:1px solid #e5e7eb; color:#9ca3af; font-size:12px;">
      ${escapeHtml(mailingAddress())}
    </div>
  </div>
</div>
`;
}

function buildText(input: SendSubscriptionConfirmationInput) {
  return `Confirm your AVASC alerts

Thanks for signing up for ${input.cadenceLabel} from the Association of Victims Against Cyber-Scams.
Confirm this email address to start receiving them:

${confirmUrl(input.confirmToken)}

If you did not request this, ignore this email or unsubscribe:
${unsubscribeUrl(input.unsubscribeToken)}

No alerts are sent until you confirm.

${mailingAddress()}
`;
}

/** Sends the double opt-in confirmation email. Returns false if email isn't configured (no throw). */
export async function sendSubscriptionConfirmationEmail(
  input: SendSubscriptionConfirmationInput
): Promise<boolean> {
  const from = process.env.AVASC_FROM_EMAIL;
  if (!from || !process.env.RESEND_API_KEY) {
    return false;
  }

  const { error } = await getResend().emails.send({
    from,
    to: input.to,
    subject: "Confirm your AVASC scam alerts",
    html: buildHtml(input),
    text: buildText(input),
    tags: [{ name: "category", value: "subscription_confirmation" }],
  });

  return !error;
}

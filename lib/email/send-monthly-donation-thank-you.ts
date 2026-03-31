import { getResend } from "@/lib/email/resend-client";

type SendMonthlyDonationThankYouEmailInput = {
  to: string;
  donorName: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendMonthlyDonationThankYouEmail({
  to,
  donorName,
}: SendMonthlyDonationThankYouEmailInput) {
  const from = process.env.AVASC_FROM_EMAIL;
  if (!from) {
    throw new Error("Missing AVASC_FROM_EMAIL");
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const html = `
    <div style="background:#f8fafc; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
        <div style="padding:28px 32px;">
          <div style="font-size:24px; font-weight:700; color:#111827;">
            Thank you for becoming a monthly supporter of AVASC
          </div>
          <p style="margin:20px 0 0; color:#374151; line-height:1.7;">
            Dear ${escapeHtml(donorName)},
          </p>
          <p style="margin:16px 0 0; color:#374151; line-height:1.7;">
            Thank you for becoming a monthly supporter of AVASC. Your ongoing support helps us build tools for scam
            victims, strengthen scam awareness, and expand trusted recovery resources.
          </p>
          <p style="margin:16px 0 0; color:#374151; line-height:1.7;">
            AVASC is not a law firm and does not guarantee recovery. Your support helps us provide practical guidance,
            education, and safer reporting infrastructure for people impacted by fraud.
          </p>
          <p style="margin:20px 0 0; color:#374151; line-height:1.7;">
            With gratitude,<br />
            AVASC Team
          </p>
        </div>
      </div>
    </div>
  `;

  const text = `Dear ${donorName},

Thank you for becoming a monthly supporter of AVASC.

Your ongoing support helps us build tools for scam victims, strengthen scam awareness, and expand trusted recovery resources.

AVASC is not a law firm and does not guarantee recovery.

With gratitude,
AVASC Team`;

  const { data, error } = await getResend().emails.send({
    from,
    to,
    subject: "Thank you for supporting AVASC monthly",
    html,
    text,
    tags: [{ name: "category", value: "monthly_donation_thank_you" }],
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }

  return data;
}

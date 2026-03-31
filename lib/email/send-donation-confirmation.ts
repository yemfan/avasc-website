import { getResend } from "@/lib/email/resend-client";

type SendDonationConfirmationEmailInput = {
  to: string;
  donorName: string;
  amount: string;
  date: string;
  transactionId: string;
  paymentMethod: "Stripe" | "PayPal" | string;
  receiptNumber: string;
  pdfBuffer: Buffer;
  pdfFilename: string;
  is501c3: boolean;
  ein?: string;
};

function buildHtml(input: SendDonationConfirmationEmailInput) {
  const taxBlock = input.is501c3
    ? `
<p style="margin:16px 0 0; color:#374151; line-height:1.6;">
  <strong>Tax information:</strong><br />
  AVASC is a registered 501(c)(3) nonprofit organization under the Internal Revenue Code.
  ${input.ein ? ` Our EIN is ${input.ein}.` : ""}
  No goods or services were provided in exchange for this contribution.
  Therefore, the full amount of your donation may be tax-deductible as allowed by law.
</p>
`
    : `
<p style="margin:16px 0 0; color:#374151; line-height:1.6;">
  <strong>Tax information:</strong><br />
  AVASC is a nonprofit initiative. Donations may not be tax-deductible unless and until
  the organization has obtained the appropriate tax-exempt status or operates through a fiscal sponsor.
</p>
`;

  return `
<div style="background:#f8fafc; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
    <div style="padding:28px 32px; border-bottom:1px solid #e5e7eb;">
      <div style="font-size:24px; font-weight:700; color:#111827;">Thank you for supporting AVASC</div>
      <div style="margin-top:8px; color:#6b7280; font-size:14px;">
        Donation Receipt – ${input.receiptNumber}
      </div>
    </div>

    <div style="padding:32px;">
      <p style="margin:0 0 16px; color:#111827; line-height:1.7;">
        Dear ${escapeHtml(input.donorName)},
      </p>

      <p style="margin:0 0 16px; color:#374151; line-height:1.7;">
        Thank you for your generous contribution to AVASC.
        Attached is your PDF donation receipt for your records.
      </p>

      <p style="margin:0 0 20px; color:#374151; line-height:1.7;">
        Your support helps us assist scam victims, strengthen scam awareness,
        and build tools that help protect others from fraud.
      </p>

      <table style="width:100%; border-collapse:collapse; margin:20px 0;">
        <tr>
          <td style="padding:10px 12px; border:1px solid #e5e7eb; background:#f9fafb; font-weight:600;">Amount</td>
          <td style="padding:10px 12px; border:1px solid #e5e7eb;">${escapeHtml(input.amount)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border:1px solid #e5e7eb; background:#f9fafb; font-weight:600;">Date</td>
          <td style="padding:10px 12px; border:1px solid #e5e7eb;">${escapeHtml(input.date)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border:1px solid #e5e7eb; background:#f9fafb; font-weight:600;">Transaction ID</td>
          <td style="padding:10px 12px; border:1px solid #e5e7eb;">${escapeHtml(input.transactionId)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border:1px solid #e5e7eb; background:#f9fafb; font-weight:600;">Payment Method</td>
          <td style="padding:10px 12px; border:1px solid #e5e7eb;">${escapeHtml(input.paymentMethod)}</td>
        </tr>
      </table>

      ${taxBlock}

      <p style="margin:20px 0 0; color:#6b7280; line-height:1.6; font-size:14px;">
        AVASC is not a law firm and does not guarantee recovery.
      </p>
    </div>
  </div>
</div>
`;
}

function buildText(input: SendDonationConfirmationEmailInput) {
  const taxBlock = input.is501c3
    ? `Tax information:
AVASC is a registered 501(c)(3) nonprofit organization under the Internal Revenue Code.${input.ein ? ` EIN: ${input.ein}.` : ""}
No goods or services were provided in exchange for this contribution.
Therefore, the full amount of your donation may be tax-deductible as allowed by law.`
    : `Tax information:
AVASC is a nonprofit initiative. Donations may not be tax-deductible unless and until the organization has obtained the appropriate tax-exempt status or operates through a fiscal sponsor.`;

  return `Dear ${input.donorName},

Thank you for your generous contribution to AVASC.
Attached is your PDF donation receipt for your records.

Donation details
Receipt Number: ${input.receiptNumber}
Amount: ${input.amount}
Date: ${input.date}
Transaction ID: ${input.transactionId}
Payment Method: ${input.paymentMethod}

${taxBlock}

AVASC is not a law firm and does not guarantee recovery.
`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendDonationConfirmationEmail(input: SendDonationConfirmationEmailInput) {
  const from = process.env.AVASC_FROM_EMAIL;
  if (!from) {
    throw new Error("Missing AVASC_FROM_EMAIL");
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const { data, error } = await getResend().emails.send({
    from,
    to: input.to,
    subject: "Donation Receipt – Thank You for Supporting AVASC",
    html: buildHtml(input),
    text: buildText(input),
    attachments: [
      {
        filename: input.pdfFilename,
        content: input.pdfBuffer,
      },
    ],
    tags: [
      { name: "category", value: "donation_receipt" },
      { name: "receipt_number", value: input.receiptNumber },
    ],
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }

  return data;
}

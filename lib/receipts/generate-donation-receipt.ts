type GenerateDonationReceiptPdfParams = {
  organizationName: string;
  organizationAddress: string;
  donorName: string;
  donorEmail: string;
  amount: string;
  dateOfDonation: string;
  transactionId: string;
  paymentMethod: string;
  isMonthly: boolean;
  is501c3: boolean;
  ein: string;
  goodsOrServicesStatement: string;
  supportEmail: string;
  website: string;
  receiptNumber: string;
};

function escapePdfText(input: string): string {
  return input.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/** Minimal dependency-free PDF generator for donation receipts. */
export async function generateDonationReceiptPdf(params: GenerateDonationReceiptPdfParams): Promise<Buffer> {
  const lines = [
    params.organizationName,
    params.organizationAddress,
    "",
    `Receipt: ${params.receiptNumber}`,
    `Date: ${params.dateOfDonation}`,
    `Donor: ${params.donorName} <${params.donorEmail}>`,
    `Amount: ${params.amount}`,
    `Payment method: ${params.paymentMethod}`,
    `Transaction ID: ${params.transactionId}`,
    `Donation type: ${params.isMonthly ? "Monthly" : "One-time"}`,
    params.is501c3 ? `Tax status: 501(c)(3)${params.ein ? ` (EIN ${params.ein})` : ""}` : "Tax status: Non-501(c)(3)",
    "",
    params.goodsOrServicesStatement,
    "",
    `Support: ${params.supportEmail}`,
    `Website: ${params.website}`,
  ];

  const textOps = lines
    .map((line, index) => `BT /F1 11 Tf 54 ${770 - index * 18} Td (${escapePdfText(line)}) Tj ET`)
    .join("\n");

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
    `5 0 obj\n<< /Length ${Buffer.byteLength(textOps, "utf8")} >>\nstream\n${textOps}\nendstream\nendobj`,
  ];

  const header = "%PDF-1.4\n";
  let body = "";
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(Buffer.byteLength(header + body, "utf8"));
    body += `${obj}\n`;
  }

  const xrefOffset = Buffer.byteLength(header + body, "utf8");
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(header + body + xref + trailer, "utf8");
}

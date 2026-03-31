export type DonateLinks = {
  monthlyUrl: string | null;
  oneTimeUrl: string | null;
  paypalUrl: string | null;
};

function normalizeUrl(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed;
}

export function getDonateLinks(): DonateLinks {
  return {
    monthlyUrl: normalizeUrl(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_URL),
    oneTimeUrl: normalizeUrl(process.env.NEXT_PUBLIC_STRIPE_DONATE_URL),
    paypalUrl: normalizeUrl(process.env.NEXT_PUBLIC_PAYPAL_DONATE_URL),
  };
}

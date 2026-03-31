import { IndicatorType } from "@prisma/client";

/**
 * Low-level masking / shortening for normalized indicator values shown on public pages.
 * Policy is applied in `maskNormalizedValueForPublicDisplay` — extend there when adding types.
 */

/** Map DB / aggregate string `indicatorType` to Prisma enum; unknown → null (show raw value). */
export function parseIndicatorType(raw: string): IndicatorType | null {
  const n = raw.trim().toUpperCase().replace(/-/g, "_");
  const values = Object.values(IndicatorType) as string[];
  return values.includes(n) ? (n as IndicatorType) : null;
}

/**
 * Apply type-specific masking to a normalized stored value (never raw victim input).
 * Unknown types: show full normalized string (safest default for staff-defined buckets).
 */
export function maskNormalizedValueForPublicDisplay(
  indicatorType: string,
  normalizedValue: string
): string {
  const v = normalizedValue.trim();
  if (!v) return "—";

  const t = parseIndicatorType(indicatorType);
  if (!t) return v;

  switch (t) {
    case IndicatorType.DOMAIN:
    case IndicatorType.PLATFORM:
    case IndicatorType.ALIAS:
    case IndicatorType.COMPANY_NAME:
      return v;

    case IndicatorType.EMAIL:
      return maskEmail(v);

    case IndicatorType.PHONE:
      return maskPhone(v);

    case IndicatorType.BANK_ACCOUNT:
      return maskBankAccount(v);

    case IndicatorType.WALLET:
      return shortenMiddle(v, 6, 4);

    case IndicatorType.TX_HASH:
      return shortenMiddle(v, 8, 6);

    case IndicatorType.SOCIAL_HANDLE:
      return maskSocialHandle(v);

    default:
      return v;
  }
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");

  if (!local || !domain) return email;

  const maskedLocal =
    local.length <= 2
      ? `${local[0] ?? ""}*`
      : `${local.slice(0, 2)}${"*".repeat(Math.max(local.length - 2, 3))}`;

  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length <= 4) return phone;
  if (digits.length <= 7) {
    return `${"*".repeat(digits.length - 2)}${digits.slice(-2)}`;
  }

  const last4 = digits.slice(-4);
  const countryOrPrefix = digits.slice(0, Math.max(0, digits.length - 10));

  if (countryOrPrefix) {
    return `+${countryOrPrefix} (***) ***-${last4}`;
  }

  return `(***) ***-${last4}`;
}

export function maskBankAccount(value: string) {
  const cleaned = value.replace(/\s+/g, "");

  if (cleaned.length <= 4) return cleaned;

  return `${"*".repeat(Math.max(cleaned.length - 4, 4))}${cleaned.slice(-4)}`;
}

export function maskSocialHandle(value: string) {
  const handle = value.startsWith("@") ? value.slice(1) : value;

  if (handle.length <= 3) {
    return `@${handle[0] ?? ""}**`;
  }

  return `@${handle.slice(0, 3)}${"*".repeat(Math.max(handle.length - 3, 3))}`;
}

export function shortenMiddle(value: string, startVisible = 6, endVisible = 4) {
  if (!value) return value;
  if (value.length <= startVisible + endVisible + 3) return value;

  return `${value.slice(0, startVisible)}...${value.slice(-endVisible)}`;
}

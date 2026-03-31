import { IndicatorType } from "@prisma/client";

/**
 * Normalize user-supplied or raw indicator text for storage / matching.
 * Stored on `CaseIndicator.normalizedValue` for consistent exact matching.
 */
export function normalizeIndicatorValue(type: IndicatorType, rawValue: string): string {
  const raw = rawValue ?? "";
  switch (type) {
    case IndicatorType.EMAIL:
      return normalizeEmail(raw);
    case IndicatorType.DOMAIN:
      return normalizeDomain(raw);
    case IndicatorType.PHONE:
      return normalizePhone(raw);
    case IndicatorType.WALLET:
      return normalizeWallet(raw);
    case IndicatorType.TX_HASH:
      return normalizeTxHash(raw);
    case IndicatorType.SOCIAL_HANDLE:
      return normalizeSocialHandle(raw);
    case IndicatorType.ALIAS:
      return normalizeAlias(raw);
    case IndicatorType.PLATFORM:
      return normalizePlatform(raw);
    case IndicatorType.COMPANY_NAME:
    case IndicatorType.BANK_ACCOUNT:
    default:
      return normalizeGeneric(raw);
  }
}

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function normalizeDomain(raw: string): string {
  let s = raw.trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "");
  s = s.split("/")[0] ?? s;
  s = s.split(":")[0] ?? s;
  if (s.startsWith("www.")) s = s.slice(4);
  return s.replace(/\.$/, "").trim();
}

export function normalizePhone(raw: string): string {
  let s = raw.trim();
  s = s.replace(/[()\s.-]/g, "");
  if (s.startsWith("00")) s = `+${s.slice(2)}`;
  return s.toLowerCase();
}

export function normalizeWallet(raw: string): string {
  return raw.trim().toLowerCase();
}

export function normalizeTxHash(raw: string): string {
  return raw.trim().toLowerCase();
}

export function normalizeSocialHandle(raw: string): string {
  let s = raw.trim().toLowerCase();
  if (s.startsWith("@")) s = s.slice(1);
  s = s.split("/").filter(Boolean).pop() ?? s;
  return s.trim();
}

export function normalizeAlias(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

const PLATFORM_ALIASES: Record<string, string> = {
  "whats app": "whatsapp",
  whatsapp: "whatsapp",
  "wa": "whatsapp",
  telegram: "telegram",
  tg: "telegram",
  instagram: "instagram",
  ig: "instagram",
  facebook: "facebook",
  fb: "facebook",
};

export function normalizePlatform(raw: string): string {
  const base = raw.trim().toLowerCase().replace(/\s+/g, " ");
  return PLATFORM_ALIASES[base] ?? base;
}

export function normalizeGeneric(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isEmptyNormalized(value: string): boolean {
  return value.trim().length === 0;
}

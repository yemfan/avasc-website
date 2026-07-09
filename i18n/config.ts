/**
 * Supported locales for AVASC. Locale is stored in a `NEXT_LOCALE` cookie
 * (no URL routing) — the language switcher sets it and the site re-renders.
 * Adding a language = add an entry here + a `messages/<code>.json` file.
 */

export const locales = ["en", "es", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Native-name labels shown in the language switcher. */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  zh: "中文",
};

/** Short codes shown in the compact (mobile) switcher trigger. */
export const localeShortLabels: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  zh: "中文",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

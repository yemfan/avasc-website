import type { Metadata } from "next";

/**
 * Build canonical + hreflang alternates for a localized page.
 *
 * @param pathname the un-prefixed (English) path, e.g. `/guides/x` or `/`.
 * @returns a `Metadata["alternates"]` object where `en` / `x-default` point at
 *   the un-prefixed path and `es` / `zh` point at the locale-prefixed variants.
 *
 * With `localePrefix: "as-needed"` the default locale (`en`) has no prefix, so
 * its canonical/hreflang stays identical to the current URLs (SEO preserved).
 */
export function localeAlternates(pathname: string): Metadata["alternates"] {
  // Normalize so the root path doesn't produce `/es/` (trailing slash).
  const suffix = pathname === "/" ? "" : pathname;

  return {
    canonical: pathname,
    languages: {
      en: pathname,
      es: `/es${suffix}` || "/es",
      zh: `/zh${suffix}` || "/zh",
      "x-default": pathname,
    },
  };
}

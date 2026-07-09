import { defineRouting } from "next-intl/routing";

import { defaultLocale, locales } from "./config";

/**
 * Path-based locale routing for AVASC.
 *
 * `localePrefix: "as-needed"` means the default locale (`en`) has NO URL
 * prefix — English URLs stay identical (`/guides/...`) preserving existing
 * SEO/links — while `/es/...` and `/zh/...` are the new localized paths.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

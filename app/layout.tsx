import type { ReactNode } from "react";

/**
 * Minimal pass-through root layout.
 *
 * The real document shell (`<html>`/`<body>`, fonts, NextIntlClientProvider,
 * JSON-LD) lives in `app/[locale]/layout.tsx` so the `lang` attribute and
 * message catalog are locale-aware. With `localePrefix: "as-needed"` the
 * default locale renders at the root without a URL prefix, so unprefixed
 * requests still resolve through the `[locale]` segment.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

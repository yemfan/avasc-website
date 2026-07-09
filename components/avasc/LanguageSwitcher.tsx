"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Check, Globe } from "lucide-react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabels, localeShortLabels, defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils/cn";

/**
 * Top-right language switcher. Switches locale by PATH: it re-renders the
 * current page under the chosen locale prefix (`/es/...`, `/zh/...`; `en` is
 * un-prefixed). `usePathname` from `@/i18n/navigation` returns the path WITHOUT
 * the locale prefix, so `router.replace(pathname, { locale })` swaps only the
 * language while keeping the user on the same page.
 *
 * Uses a native <details> popover so it works without extra client state.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("language");
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const rawLocale = params?.locale;
  const activeLocale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  function choose(next: Locale) {
    if (next === activeLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <details className={cn("group relative", className)}>
      <summary
        className={cn(
          "inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-[var(--avasc-border)] px-3 py-2 text-sm font-medium text-[var(--avasc-text-primary)] transition-colors duration-150 hover:border-[var(--avasc-gold)]/50 hover:text-[var(--avasc-gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)] [&::-webkit-details-marker]:hidden",
          isPending && "opacity-60"
        )}
        aria-label={t("select")}
        title={t("label")}
      >
        <Globe className="h-4 w-4 shrink-0" aria-hidden />
        <span className="tabular-nums">{localeShortLabels[activeLocale]}</span>
      </summary>
      <div
        role="menu"
        className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-44 rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
      >
        {locales.map((code) => {
          const active = code === activeLocale;
          return (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={active}
              onClick={() => choose(code)}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--avasc-gold)]",
                active
                  ? "bg-[var(--avasc-bg-soft)] font-semibold text-[var(--avasc-gold-light)]"
                  : "text-[var(--avasc-text-secondary)] hover:bg-[var(--avasc-bg-soft)] hover:text-[var(--avasc-text-primary)]"
              )}
            >
              <span>{localeLabels[code]}</span>
              {active ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
    </details>
  );
}

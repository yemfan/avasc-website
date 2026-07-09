"use server";

import { cookies } from "next/headers";

import { defaultLocale, isLocale } from "@/i18n/config";

/** Persist the chosen locale in the `NEXT_LOCALE` cookie (1 year). */
export async function setLocaleAction(nextLocale: string): Promise<void> {
  const locale = isLocale(nextLocale) ? nextLocale : defaultLocale;
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

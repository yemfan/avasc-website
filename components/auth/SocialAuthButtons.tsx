"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

type Provider = "google" | "apple";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.86Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.99 11.99 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}

const LABELS: Record<Provider, string> = { google: "Continue with Google", apple: "Continue with Apple" };

/**
 * Google + Apple sign-in via Supabase OAuth. Redirects to /auth/callback, which
 * exchanges the code and syncs the profile. The providers must be enabled in the
 * Supabase dashboard for these to work.
 */
export function SocialAuthButtons({ next }: { next?: string }) {
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState("");

  async function signIn(provider: Provider) {
    setLoading(provider);
    setError("");
    const base = `${window.location.origin}/auth/callback`;
    const redirectTo = next ? `${base}?next=${encodeURIComponent(next)}` : base;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) {
      setError(error.message);
      setLoading(null);
    }
    // On success the browser is redirected to the provider — no further work here.
  }

  return (
    <div className="space-y-3">
      {(["google", "apple"] as const).map((provider) => (
        <button
          key={provider}
          type="button"
          onClick={() => signIn(provider)}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--avasc-border)] bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-60"
        >
          {provider === "google" ? <GoogleIcon /> : <AppleIcon />}
          {loading === provider ? "Redirecting…" : LABELS[provider]}
        </button>
      ))}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

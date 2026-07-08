"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

export function RegisterForm() {
  const supabase = createSupabaseBrowserClient();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setMessage("");

    const origin = window.location.origin;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          display_name: displayName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Registration successful. Please check your email to confirm your account.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-3 py-2 text-sm text-foreground placeholder:text-[var(--avasc-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--avasc-gold)]"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-3 py-2 text-sm text-foreground placeholder:text-[var(--avasc-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--avasc-gold)]"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-3 py-2 text-sm text-foreground placeholder:text-[var(--avasc-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--avasc-gold)]"
          placeholder="Create a password"
        />
      </div>

      {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[var(--avasc-gold)] px-4 py-2.5 text-sm font-semibold text-[var(--avasc-bg)] transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";

export function HomepageFooterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/alerts/public-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          smsEnabled: false,
          emailDaily: true,
          emailWeekly: false,
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };
      setMessage(data.message || "Done.");
      if (data.success) setEmail("");
    } catch {
      setMessage("Unable to subscribe right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[var(--avasc-bg-card)]/85 p-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-white">Daily scam news by email</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--avasc-text-secondary)]">
            New warnings and verified indicators—one concise message. Unsubscribe anytime.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <input
            id="footer-signup-email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-xl border border-white/[0.1] bg-[var(--avasc-bg)]/80 px-4 py-3 text-sm text-[var(--avasc-text-primary)] outline-none ring-offset-2 ring-offset-[var(--avasc-bg)] transition placeholder:text-[var(--avasc-text-muted)] focus:border-[var(--avasc-gold)]/50 focus:ring-2 focus:ring-[var(--avasc-gold)]/25"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-xl bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-6 py-3 text-sm font-semibold text-[#050A14] shadow-[0_8px_28px_-10px_rgba(201,148,60,0.5)] transition hover:brightness-[1.05] disabled:opacity-60"
          >
            {loading ? "Joining..." : "Subscribe"}
          </button>
        </form>
      </div>

      {message ? (
        <p className="mt-4 text-sm text-[var(--avasc-text-secondary)]">{message}</p>
      ) : null}
    </section>
  );
}

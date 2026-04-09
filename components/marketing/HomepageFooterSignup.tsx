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
    <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Get AVASC Daily Scam News</h3>
          <p className="mt-2 text-sm text-[var(--avasc-text-secondary)]">
            Receive new scam warnings and verified indicators by email.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex w-full max-w-xl gap-3">
          <input
            id="footer-signup-email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-[var(--avasc-text-primary)] outline-none transition focus:border-[var(--avasc-gold)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14] disabled:opacity-60"
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

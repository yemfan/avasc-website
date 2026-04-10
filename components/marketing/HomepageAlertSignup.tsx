"use client";

import { useState, type FormEvent } from "react";

type ApiState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string;
    phone?: string;
    smsEnabled?: string;
    emailDaily?: string;
    emailWeekly?: string;
  };
};

type HomepageAlertSignupProps = {
  /** When true, renders only the form card (for two-column marketing layouts). */
  embedded?: boolean;
};

export function HomepageAlertSignup({ embedded = false }: HomepageAlertSignupProps) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailDaily, setEmailDaily] = useState(true);
  const [emailWeekly, setEmailWeekly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<ApiState | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setState(null);

    try {
      const res = await fetch("/api/alerts/public-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          email,
          smsEnabled,
          emailDaily,
          emailWeekly,
        }),
      });

      const data = (await res.json()) as ApiState;
      setState(data);

      if (data.success) {
        setPhone("");
        setEmail("");
      }
    } catch {
      setState({
        success: false,
        message: "Unable to subscribe right now. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const form = (
        <form onSubmit={onSubmit} className={embedded ? "space-y-5" : "mt-8 space-y-5"}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white" htmlFor="home-alert-phone">
                Phone Number
              </label>
              <input
                id="home-alert-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+16265551234"
                className="w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-[var(--avasc-text-primary)] outline-none transition focus:border-[var(--avasc-gold)] focus:ring-2 focus:ring-[rgba(197,139,43,0.2)]"
              />
              {state?.errors?.phone ? (
                <p className="mt-2 text-sm text-red-400">{state.errors.phone}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white" htmlFor="home-alert-email">
                Email Address
              </label>
              <input
                id="home-alert-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-[var(--avasc-text-primary)] outline-none transition focus:border-[var(--avasc-gold)] focus:ring-2 focus:ring-[rgba(197,139,43,0.2)]"
              />
              {state?.errors?.email ? (
                <p className="mt-2 text-sm text-red-400">{state.errors.email}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3">
            <label className="flex items-start gap-3 rounded-xl border border-[var(--avasc-border)] bg-[rgba(5,10,20,0.55)] p-4">
              <input
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
                type="checkbox"
                className="mt-1"
              />
              <div>
                <div className="font-medium text-white">Realtime SMS Alerts</div>
                <div className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
                  Critical, high-confidence scam alerts only.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-[var(--avasc-border)] bg-[rgba(5,10,20,0.55)] p-4">
              <input
                checked={emailDaily}
                onChange={(e) => setEmailDaily(e.target.checked)}
                type="checkbox"
                className="mt-1"
              />
              <div>
                <div className="font-medium text-white">Daily Scam News</div>
                <div className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
                  New scams, verified indicators, and daily highlights.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-[var(--avasc-border)] bg-[rgba(5,10,20,0.55)] p-4">
              <input
                checked={emailWeekly}
                onChange={(e) => setEmailWeekly(e.target.checked)}
                type="checkbox"
                className="mt-1"
              />
              <div>
                <div className="font-medium text-white">Weekly Scam Intelligence</div>
                <div className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
                  Weekly trends, pattern analysis, and prevention insights.
                </div>
              </div>
            </label>
          </div>

          {state?.message ? (
            <div
              className={`rounded-xl border p-4 text-sm ${
                state.success
                  ? "border-green-500/30 bg-green-500/10 text-green-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {state.message}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14] shadow-[0_0_20px_rgba(197,139,43,0.18)] transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Subscribing..." : "Get Alerts"}
            </button>

            <p className="text-xs text-[var(--avasc-text-muted)]">No spam. Unsubscribe anytime.</p>
          </div>
        </form>
  );

  if (embedded) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[var(--avasc-bg-card)]/80 p-6 backdrop-blur-sm">{form}</div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(145deg,var(--avasc-bg-soft)_0%,#0a1628_50%,var(--avasc-blue)_100%)] p-8 shadow-[0_24px_70px_-28px_rgba(0,0,0,0.55)] sm:p-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 0% 100%, rgba(201, 148, 60, 0.1), transparent 55%)",
        }}
      />
      <div className="relative max-w-3xl">
        <div className="inline-flex rounded-full border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.08] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--avasc-gold-light)]">
          AVASC alert network
        </div>

        <h2 className="font-display mt-5 text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Stay protected in real time
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--avasc-text-secondary)]">
          Critical scam warnings by SMS, plus daily or weekly intelligence by email—opt in to what you need.
        </p>

        {form}
      </div>
    </section>
  );
}

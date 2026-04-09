"use client";

import { useActionState } from "react";
import { subscribeAction, type SubscribeState } from "@/app/alerts/subscribe/actions";

const initialState: SubscribeState = {
  success: false,
  message: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-red-400">{message}</p>;
}

export function SubscriptionForm() {
  const [state, formAction, pending] = useActionState(subscribeAction, initialState);

  return (
    <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
      <form action={formAction} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Choose your alerts</h2>
          <p className="mt-2 text-sm text-[var(--avasc-text-secondary)]">
            SMS is used for high-priority realtime alerts. Email is used for daily and weekly digests.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+16265551234"
              className="w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-[var(--avasc-text-primary)] outline-none transition focus:border-[var(--avasc-gold)] focus:ring-2 focus:ring-[rgba(197,139,43,0.2)]"
            />
            <FieldError message={state.errors?.phone} />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-[var(--avasc-text-primary)] outline-none transition focus:border-[var(--avasc-gold)] focus:ring-2 focus:ring-[rgba(197,139,43,0.2)]"
            />
            <FieldError message={state.errors?.email} />
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] p-4">
            <input type="checkbox" name="smsEnabled" className="mt-1" />
            <div>
              <div className="font-medium text-white">Realtime Scam Alerts by SMS</div>
              <div className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
                Only critical, high-confidence alerts.
              </div>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)]/80 p-4">
            <input type="checkbox" name="smsConsent" className="mt-1" />
            <div className="text-sm text-[var(--avasc-text-secondary)]">
              I consent to receive automated security SMS from AVASC for CRITICAL alerts only. Message &amp; data rates
              may apply. Required if realtime SMS is enabled.
            </div>
          </label>
          <FieldError message={state.errors?.smsConsent} />

          <label className="flex items-start gap-3 rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] p-4">
            <input type="checkbox" name="emailDaily" className="mt-1" />
            <div>
              <div className="font-medium text-white">Daily Scam News by Email</div>
              <div className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
                New scams, verified indicators, and daily highlights.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] p-4">
            <input type="checkbox" name="emailWeekly" className="mt-1" />
            <div>
              <div className="font-medium text-white">Weekly Scam Intelligence Report</div>
              <div className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
                Trends, pattern analysis, and prevention insights.
              </div>
            </div>
          </label>

          <FieldError
            message={
              state.errors?.smsEnabled ||
              state.errors?.emailDaily ||
              state.errors?.emailWeekly
            }
          />
        </div>

        {state.message ? (
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

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14] shadow-[0_0_20px_rgba(197,139,43,0.18)] transition hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Saving..." : "Subscribe"}
          </button>
        </div>

        <p className="text-xs text-[var(--avasc-text-muted)]">
          We do not sell your data. You can update or unsubscribe at any time.
        </p>
      </form>
    </section>
  );
}

"use client";

import { useState } from "react";
import { AvascButton } from "@/components/avasc/ui/AvascButton";

type Props = {
  clusterId: string;
  clusterTitle: string;
};

/**
 * Follow a published scam pattern (ClusterSubscription).
 */
export function FollowScamButton({ clusterId, clusterTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/alerts/follow-cluster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          clusterId,
          emailWeekly: true,
          emailDaily: false,
          smsEnabled,
          smsConsent: smsEnabled ? smsConsent : false,
          phone: phone.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { error?: unknown };
      if (!res.ok) {
        setStatus("err");
        setMessage(typeof data.error === "string" ? data.error : "Could not follow this pattern.");
        return;
      }
      setStatus("ok");
      setMessage(
        `You are following “${clusterTitle.slice(0, 80)}${clusterTitle.length > 80 ? "…" : ""}”.`
      );
      setOpen(false);
    } catch {
      setStatus("err");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Follow this pattern</p>
          <p className="text-xs text-muted-foreground">
            Get digests and optional CRITICAL SMS when this published pattern changes (high-confidence only).
          </p>
        </div>
        <AvascButton type="button" variant="secondary" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Follow"}
        </AvascButton>
      </div>
      {open ? (
        <form className="mt-4 space-y-3 border-t border-border pt-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="follow-email">
              Email
            </label>
            <input
              id="follow-email"
              required
              type="email"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="follow-phone">
              Mobile (E.164) for CRITICAL SMS
            </label>
            <input
              id="follow-phone"
              type="tel"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              placeholder="+15551234567"
            />
          </div>
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={smsEnabled}
              onChange={(ev) => setSmsEnabled(ev.target.checked)}
            />
            <span>Enable CRITICAL SMS for this pattern</span>
          </label>
          {smsEnabled ? (
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={smsConsent}
                onChange={(ev) => setSmsConsent(ev.target.checked)}
              />
              <span>I consent to receive automated CRITICAL SMS from AVASC for this pattern.</span>
            </label>
          ) : null}
          <AvascButton type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Saving…" : "Confirm follow"}
          </AvascButton>
        </form>
      ) : null}
      {message && !open ? (
        <p
          className={`mt-3 text-sm ${status === "err" ? "text-red-400" : "text-avasc-gold-light"}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

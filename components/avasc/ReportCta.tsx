import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";

type ReportCtaProps = {
  heading?: string;
  body?: string;
  className?: string;
};

/**
 * Prominent "report a scam" call-to-action. Placed at the end of articles and other
 * content pages so a reader who has been targeted always has a clear next step.
 * Dark-theme styled to read on the site background.
 */
export function ReportCta({
  heading = "Think you've been targeted by a scam?",
  body = "Reporting takes just a few minutes. It helps us warn others, strengthens the scam database, and connects you to recovery resources.",
  className = "",
}: ReportCtaProps) {
  return (
    <section
      className={`rounded-2xl border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.06] p-6 ${className}`}
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-[var(--avasc-gold-light)]" aria-hidden />
        <h2 className="text-lg font-semibold text-white">{heading}</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--avasc-text-secondary)]">{body}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/report"
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--avasc-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--avasc-bg)] transition hover:brightness-110"
        >
          Report a scam
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/recovery"
          className="inline-flex items-center rounded-full border border-[var(--avasc-border)] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[var(--avasc-gold)]/50"
        >
          Recovery resources
        </Link>
      </div>
    </section>
  );
}

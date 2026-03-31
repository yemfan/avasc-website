import Link from "next/link";

type ReportMatchingCaseCTAProps = {
  matchedProfileSlug: string;
  compact?: boolean;
};

export function ReportMatchingCaseCTA({
  matchedProfileSlug,
  compact = false,
}: ReportMatchingCaseCTAProps) {
  const reportHref = `/report?matchedProfile=${encodeURIComponent(matchedProfileSlug)}`;

  if (compact) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <p className="text-sm font-medium text-foreground">Does this look familiar?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Report your case to help us review similar scam patterns.
        </p>

        <div className="mt-3">
          <Link
            href={reportHref}
            className="inline-flex rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Report a Matching Case
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Does this look familiar?</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
        If this scam profile looks similar to what happened to you, you can submit your case for review. Your report can
        help identify patterns, support other victims, and strengthen scam prevention efforts.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={reportHref}
          className="inline-flex rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background"
        >
          Report a Matching Case
        </Link>

        <Link
          href="/dashboard/support"
          className="inline-flex rounded-lg border border-border px-5 py-3 text-sm font-medium text-foreground"
        >
          Get Support
        </Link>
      </div>
    </section>
  );
}

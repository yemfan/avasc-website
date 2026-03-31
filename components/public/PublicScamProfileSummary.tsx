import type { PublicScamProfile } from "@/lib/public-database/public-scam-profile-types";

export function PublicScamProfileSummary({ profile }: { profile: PublicScamProfile }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Summary</h2>
      <div className="max-w-none space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p className="text-base text-foreground">{profile.summary}</p>

        {profile.commonScript?.trim() ? (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">What people report</p>
            <p className="mt-2 text-sm text-foreground">{profile.commonScript}</p>
          </div>
        ) : null}

        {profile.redFlags?.trim() ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Warning signs</p>
            <p className="mt-2 whitespace-pre-wrap text-foreground">{profile.redFlags}</p>
          </div>
        ) : null}

        {profile.safetyWarning?.trim() ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-950 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100"
          >
            <p className="font-semibold">Safety warning</p>
            <p className="mt-2">{profile.safetyWarning}</p>
          </div>
        ) : null}

        {profile.recommendedNextStep?.trim() ? (
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Suggested next steps</p>
            <p className="mt-2 text-foreground">{profile.recommendedNextStep}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

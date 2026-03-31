import type { ReactNode } from "react";
import Link from "next/link";
import type { RelatedPublicScamProfile } from "@/lib/public-database/public-profile-types";

type RelatedPublicProfilesProps = {
  profiles: RelatedPublicScamProfile[];
};

export function RelatedPublicProfiles({ profiles }: RelatedPublicProfilesProps) {
  if (profiles.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Related Scam Profiles</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        These published profiles may share similar indicators or scam patterns.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {profiles.map((profile) => (
          <article key={profile.id} className="rounded-xl border border-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{profile.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{profile.scamType}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge>{profile.riskLevel}</Badge>
                <Badge variant="outline">{profile.reportCount} reports</Badge>
              </div>
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{profile.summary}</p>

            {profile.sharedIndicatorCount > 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Shared public indicators: {profile.sharedIndicatorCount}
              </p>
            ) : null}

            <div className="mt-4">
              <Link
                href={`/database/${profile.slug}`}
                className="inline-flex rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
              >
                View Related Profile
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "outline";
}) {
  const styles =
    variant === "outline"
      ? "border border-border bg-background text-foreground"
      : "bg-foreground text-background";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>{children}</span>
  );
}

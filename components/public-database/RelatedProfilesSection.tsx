import { ScamProfileCard } from "./ScamProfileCard";
import type { PublicScamProfileCard } from "@/lib/public-database/public-profile-types";

export function RelatedProfilesSection({ profiles }: { profiles: PublicScamProfileCard[] }) {
  if (profiles.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Similar patterns you can compare</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          These are other published summaries that share some clues or themes. Use them as a guide — your situation may
          still be different.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {profiles.map((p) => (
          <ScamProfileCard key={p.id} profile={p} />
        ))}
      </div>
    </section>
  );
}

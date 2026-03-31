import { ScamProfileCard } from "./ScamProfileCard";
import type { PublicScamProfileCard } from "@/lib/public-database/public-profile-types";
import { Sparkles } from "lucide-react";

export function TrendingProfilesSection({ profiles }: { profiles: PublicScamProfileCard[] }) {
  if (profiles.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-600" aria-hidden />
        <h2 className="text-lg font-semibold text-slate-900">Recently updated profiles</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {profiles.map((p) => (
          <ScamProfileCard key={p.id} profile={p} />
        ))}
      </div>
    </section>
  );
}

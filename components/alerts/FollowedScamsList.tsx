"use client";

import Link from "next/link";
import { unfollowClusterAction } from "@/app/dashboard/alerts/actions";
import type { FollowedScamSubscriptionRow } from "@/lib/alerts/get-followed-scams";

export function FollowedScamsList({ items }: { items: FollowedScamSubscriptionRow[] }) {
  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground shadow-sm">
        You are not following any scam profiles yet.
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold">{item.scamCluster.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.scamCluster.scamType}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Risk: {item.scamCluster.riskLevel} • Threat Score: {item.scamCluster.threatScore}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Last updated: {new Date(item.scamCluster.updatedAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/database/${item.scamCluster.slug}`}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
              >
                View Profile
              </Link>

              <form action={unfollowClusterAction}>
                <input type="hidden" name="clusterId" value={item.scamCluster.id} />
                <button
                  type="submit"
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-red-400"
                >
                  Unfollow
                </button>
              </form>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

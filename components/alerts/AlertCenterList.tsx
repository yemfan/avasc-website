import Link from "next/link";
import { markAlertReadAction } from "@/app/dashboard/alerts/actions";

export type AlertCenterListItem = {
  id: string;
  title: string;
  message: string;
  alertType: string;
  channel: string;
  isRead: boolean;
  createdAt: Date | string;
  scamCluster: { slug: string } | null;
};

export function AlertCenterList({ items }: { items: AlertCenterListItem[] }) {
  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground shadow-sm">
        No alerts yet.
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item.id}
          className={`rounded-2xl border border-border bg-background p-6 shadow-sm ${item.isRead ? "opacity-80" : ""}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.alertType} • {item.channel} • {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!item.isRead ? (
                <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">New</span>
              ) : null}

              {!item.isRead ? (
                <form action={markAlertReadAction}>
                  <input type="hidden" name="feedItemId" value={item.id} />
                  <button type="submit" className="rounded-lg border border-border px-3 py-2 text-xs font-medium">
                    Mark as Read
                  </button>
                </form>
              ) : null}
            </div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">{item.message}</p>

          {item.scamCluster ? (
            <div className="mt-4">
              <Link
                href={`/database/${item.scamCluster.slug}`}
                className="inline-flex rounded-lg border border-border px-4 py-2 text-sm font-medium"
              >
                View Scam Profile
              </Link>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

import { Link } from "@/i18n/navigation";

import {
  approveImportedAlertFormAction,
  editImportedAlertFormAction,
  rejectImportedAlertFormAction,
} from "@/lib/admin/avasc-import-approval-actions";
import { getReviewQueueOverview } from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

const fieldClass =
  "mt-1 w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-3 py-2 text-sm text-white placeholder:text-[var(--avasc-text-muted)] outline-none focus:border-[var(--avasc-gold)]/50 focus:ring-1 focus:ring-[var(--avasc-gold)]/30";

export default async function AdminReviewQueuePage() {
  const rows = await getReviewQueueOverview({ sourceType: "ONEDRIVE", take: 50 });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-sm text-[var(--avasc-text-muted)] transition-colors hover:text-[var(--avasc-gold-light)]"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-white">Review Queue</h1>
        <p className="mt-2 text-sm text-[var(--avasc-text-secondary)]">
          Approve or reject OneDrive-imported alerts before they appear on public AVASC surfaces.{" "}
          <Link href="/admin/alerts/visibility" className="text-[var(--avasc-gold-light)] hover:text-white">
            Alert surfaces
          </Link>
          .
        </p>
      </div>

      <div className="space-y-4">
        {rows.length === 0 ? (
          <div className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-8 text-sm text-[var(--avasc-text-secondary)]">
            No pending imported alerts.
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-white">{row.title}</h2>
                    <span className="inline-flex rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-medium text-[var(--avasc-gold-light)]">
                      {row.alertType}
                    </span>
                    {row.riskLevel ? (
                      <span className="inline-flex rounded-full border border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--avasc-text-secondary)]">
                        {row.riskLevel}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--avasc-text-secondary)]">{row.message}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--avasc-text-muted)]">
                    <span>Source: {row.sourceName ?? "Unknown"}</span>
                    <span aria-hidden>•</span>
                    <span>{new Date(row.createdAt).toLocaleString()}</span>
                    {row.scamClusterId ? (
                      <>
                        <span aria-hidden>•</span>
                        <Link
                          href={`/admin/clusters/${row.scamClusterId}`}
                          className="text-[var(--avasc-gold-light)] hover:text-white"
                        >
                          Cluster: {row.scamClusterSlug ?? row.scamClusterTitle ?? row.scamClusterId.slice(0, 8)}
                        </Link>
                      </>
                    ) : null}
                  </div>

                  {row.indicatorLabels.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--avasc-text-muted)]">
                        Public indicators
                      </p>
                      <ul className="mt-2 list-inside list-disc text-sm text-[var(--avasc-text-secondary)]">
                        {row.indicatorLabels.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  <form action={approveImportedAlertFormAction}>
                    <input type="hidden" name="alertId" value={row.id} />
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectImportedAlertFormAction}>
                    <input type="hidden" name="alertId" value={row.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/15"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>

              <form action={editImportedAlertFormAction} className="mt-6 space-y-3 border-t border-[var(--avasc-border)] pt-6">
                <input type="hidden" name="alertId" value={row.id} />
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--avasc-text-muted)]">
                  Edit before approve
                </p>
                <div>
                  <label htmlFor={`title-${row.id}`} className="text-xs font-medium text-[var(--avasc-text-secondary)]">
                    Title
                  </label>
                  <input
                    id={`title-${row.id}`}
                    name="title"
                    defaultValue={row.title}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor={`message-${row.id}`} className="text-xs font-medium text-[var(--avasc-text-secondary)]">
                    Summary / message
                  </label>
                  <textarea
                    id={`message-${row.id}`}
                    name="message"
                    defaultValue={row.message}
                    rows={5}
                    className={`${fieldClass} font-mono`}
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
                >
                  Save edits
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

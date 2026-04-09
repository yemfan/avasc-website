import React from "react";
import Link from "next/link";
import { Eye, EyeOff, Radio, Newspaper, Home, Save } from "lucide-react";

import {
  getAdminAlertsListData,
  setAlertVisibilityFormAction,
} from "@/lib/admin/avasc-admin-alert-visibility-actions";
import {
  approveImportedAlertFormAction,
  rejectImportedAlertFormAction,
} from "@/lib/admin/avasc-import-approval-actions";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";

type PageProps = {
  searchParams?: Promise<{
    type?: string;
    q?: string;
  }>;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function alertsVisibilityHref(type: string, q: string) {
  const p = new URLSearchParams();
  if (type !== "ALL") p.set("type", type);
  if (q.trim()) p.set("q", q.trim());
  const s = p.toString();
  return s ? `/admin/alerts/visibility?${s}` : "/admin/alerts/visibility";
}

function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "gold" | "success" | "danger" | "warning";
}) {
  const tones = {
    default: "border-slate-700 bg-slate-800 text-slate-300",
    gold: "border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] text-[var(--avasc-gold-light)]",
    success: "border-green-500/30 bg-green-500/15 text-green-400",
    danger: "border-red-500/30 bg-red-500/15 text-red-400",
    warning: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  };

  return (
    <span
      className={cx("inline-flex rounded-full border px-3 py-1 text-xs font-medium", tones[tone])}
    >
      {children}
    </span>
  );
}

function ActionButton({
  children,
  variant = "secondary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] text-[#050A14]",
    secondary: "border border-[var(--avasc-border)] text-white hover:border-[var(--avasc-gold)]",
    danger: "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/15",
    success: "bg-green-600 text-white hover:bg-green-500",
  };

  return (
    <button type="submit" className={cx("rounded-lg px-4 py-2 text-sm font-medium transition", styles[variant])}>
      {children}
    </button>
  );
}

function FilterTabs({ activeType, q }: { activeType?: string; q: string }) {
  const tabs = ["ALL", "REALTIME", "DAILY", "WEEKLY"] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab}
          href={alertsVisibilityHref(tab, q)}
          className={cx(
            "inline-flex rounded-full border px-3 py-1.5 text-xs font-medium transition",
            (activeType ?? "ALL") === tab
              ? "border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] text-[var(--avasc-gold-light)]"
              : "border-[var(--avasc-border)] text-[var(--avasc-text-secondary)] hover:border-[var(--avasc-gold)] hover:text-white"
          )}
        >
          {tab}
        </Link>
      ))}
    </div>
  );
}

async function AlertVisibilityForm({
  alert,
}: {
  alert: {
    id: string;
    title: string;
    alertType: string;
    riskLevel: string | null;
    isPublicVisible: boolean;
    isRealtimeVisible: boolean;
    isHomepageVisible: boolean;
    isDailyFeedVisible: boolean;
    createdAt: Date;
    approvalStatus: string;
    sourceType: string | null;
    sourceName: string | null;
    scamCluster?: { slug?: string | null; title?: string | null } | null;
  };
}) {
  return (
    <form
      action={setAlertVisibilityFormAction}
      className="space-y-4 rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]"
    >
      <input type="hidden" name="alertId" value={alert.id} />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-white">{alert.title}</h2>
            <Badge tone="gold">{alert.alertType}</Badge>
            {alert.riskLevel ? (
              <Badge
                tone={
                  alert.riskLevel === "CRITICAL" || alert.riskLevel === "HIGH"
                    ? "danger"
                    : alert.riskLevel === "MEDIUM"
                      ? "warning"
                      : "default"
                }
              >
                {alert.riskLevel}
              </Badge>
            ) : null}
            <Badge
              tone={
                alert.approvalStatus === "APPROVED"
                  ? "success"
                  : alert.approvalStatus === "REJECTED"
                    ? "danger"
                    : "warning"
              }
            >
              {alert.approvalStatus}
            </Badge>
            {alert.sourceType ? <Badge>{alert.sourceType}</Badge> : null}
            {alert.sourceName ? <Badge tone="gold">{alert.sourceName}</Badge> : null}
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--avasc-text-muted)]">
            <Badge>{new Date(alert.createdAt).toLocaleString()}</Badge>
            {alert.scamCluster?.title ? <Badge>{alert.scamCluster.title}</Badge> : null}
            {alert.scamCluster?.slug ? <Badge>{alert.scamCluster.slug}</Badge> : null}
          </div>
        </div>

        {alert.scamCluster?.slug ? (
          <Link
            href={`/database/${alert.scamCluster.slug}`}
            className="inline-flex items-center rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white hover:border-[var(--avasc-gold)]"
          >
            View Public Profile
          </Link>
        ) : null}
      </div>

      {alert.approvalStatus === "PENDING" ? (
        <div className="flex flex-wrap gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="w-full text-sm text-amber-100">
            This alert is pending approval. Approve to apply default visibility for its type, or reject to keep it off public surfaces.
          </p>
          <form action={approveImportedAlertFormAction}>
            <input type="hidden" name="alertId" value={alert.id} />
            <ActionButton variant="success">Approve</ActionButton>
          </form>
          <form action={rejectImportedAlertFormAction}>
            <input type="hidden" name="alertId" value={alert.id} />
            <ActionButton variant="danger">Reject</ActionButton>
          </form>
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
        <label className="flex items-start gap-3 rounded-2xl border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.02)] p-4">
          <input type="checkbox" name="isPublicVisible" defaultChecked={alert.isPublicVisible} className="mt-1" />
          <div>
            <div className="flex items-center gap-2 font-medium text-white">
              <Eye className="h-4 w-4" /> Public Visible
            </div>
            <div className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
              Eligible for public-facing surfaces.
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.02)] p-4">
          <input
            type="checkbox"
            name="isRealtimeVisible"
            defaultChecked={alert.isRealtimeVisible}
            className="mt-1"
          />
          <div>
            <div className="flex items-center gap-2 font-medium text-white">
              <Radio className="h-4 w-4" /> Realtime Ticker
            </div>
            <div className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
              Show in the rolling live alert strip.
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.02)] p-4">
          <input
            type="checkbox"
            name="isHomepageVisible"
            defaultChecked={alert.isHomepageVisible}
            className="mt-1"
          />
          <div>
            <div className="flex items-center gap-2 font-medium text-white">
              <Home className="h-4 w-4" /> Homepage Visible
            </div>
            <div className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
              Show inside homepage alert section.
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.02)] p-4">
          <input
            type="checkbox"
            name="isDailyFeedVisible"
            defaultChecked={alert.isDailyFeedVisible}
            className="mt-1"
          />
          <div>
            <div className="flex items-center gap-2 font-medium text-white">
              <Newspaper className="h-4 w-4" /> Daily Feed
            </div>
            <div className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
              Show in daily public alert cards.
            </div>
          </div>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <ActionButton variant="primary">
          <Save className="mr-2 inline h-4 w-4" />
          Save Visibility
        </ActionButton>
      </div>
    </form>
  );
}

export const dynamic = "force-dynamic";

export default async function AdminAlertVisibilityPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const type = params.type ?? "ALL";
  const q = params.q ?? "";

  const data = await getAdminAlertsListData({ type, q });

  return (
    <div className="space-y-8">
      <AdminBreadcrumbs
        items={[
          { label: "Overview", href: "/admin" },
          { label: "Alerts", href: "/admin/alerts" },
          { label: "Surfaces" },
        ]}
      />

      <section className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[#0F172A] to-[#0B1F3A] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
              <Radio className="h-3.5 w-3.5" />
              Admin Alert Visibility Controls
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Public Alert Surfaces</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--avasc-text-secondary)]">
              Decide which alerts appear in the realtime ticker, homepage alert section, and daily public alert feed. OneDrive
              imports start as pending — approve them here or from{" "}
              <Link href="/admin/imports" className="text-[var(--avasc-gold-light)] underline">
                Imports
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge>{data.stats.total} total</Badge>
            <Badge tone="gold">{data.stats.homepageVisible} homepage</Badge>
            <Badge tone="warning">{data.stats.realtimeVisible} realtime</Badge>
            <Badge tone="success">{data.stats.dailyFeedVisible} daily feed</Badge>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <form method="get" action="/admin/alerts/visibility" className="grid gap-4 lg:grid-cols-[1fr_auto]">
          {type !== "ALL" ? <input type="hidden" name="type" value={type} /> : null}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search alerts by title, cluster title, or message"
            className="w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14]"
          >
            Search
          </button>
        </form>

        <div className="mt-4">
          <FilterTabs activeType={type} q={q} />
        </div>
      </section>

      <div className="space-y-4">
        {data.alerts.length === 0 ? (
          <div className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-10 text-center text-[var(--avasc-text-secondary)]">
            No alerts found.
          </div>
        ) : (
          data.alerts.map((alert) => (
            <AlertVisibilityForm
              key={alert.id}
              alert={{
                id: alert.id,
                title: alert.title,
                alertType: alert.alertType,
                riskLevel: alert.riskLevel,
                isPublicVisible: alert.isPublicVisible,
                isRealtimeVisible: alert.isRealtimeVisible,
                isHomepageVisible: alert.isHomepageVisible,
                isDailyFeedVisible: alert.isDailyFeedVisible,
                createdAt: alert.createdAt,
                approvalStatus: alert.approvalStatus,
                sourceType: alert.sourceType,
                sourceName: alert.sourceName,
                scamCluster: alert.scamCluster
                  ? {
                      slug: alert.scamCluster.slug,
                      title: alert.scamCluster.title,
                    }
                  : null,
              }}
            />
          ))
        )}
      </div>

      <section className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(197,139,43,0.25)] bg-[rgba(197,139,43,0.08)]">
            <EyeOff className="h-5 w-5 text-[var(--avasc-gold-light)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Visibility rules</h2>
            <p className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
              Recommended: only high-confidence alerts should appear in realtime ticker or homepage public surfaces.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

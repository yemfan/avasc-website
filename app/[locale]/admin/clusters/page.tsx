import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
  Filter,
  Globe,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { ClusterPublicStatus, RiskLevel } from "@prisma/client";
import {
  getAdminClustersListData,
  quickSetClusterPublicStatusAction,
} from "@/lib/admin/avasc-admin-clusters-list-actions";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pick(sp: Record<string, string | string[] | undefined>, k: string): string | undefined {
  const v = sp[k];
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

function clustersListHref(
  parts: { q?: string; risk?: string; scamType?: string },
  nextStatus: string
) {
  const p = new URLSearchParams();
  if (parts.q?.trim()) p.set("q", parts.q.trim());
  if (nextStatus !== "ALL") p.set("status", nextStatus);
  if (parts.risk && parts.risk !== "ALL") p.set("risk", parts.risk);
  if (parts.scamType && parts.scamType !== "ALL") p.set("scamType", parts.scamType);
  const qs = p.toString();
  return qs ? `/admin/clusters?${qs}` : "/admin/clusters";
}

function statusLabel(s: ClusterPublicStatus) {
  switch (s) {
    case ClusterPublicStatus.PUBLISHED:
      return "Published";
    case ClusterPublicStatus.INTERNAL:
      return "Internal";
    default:
      return "Draft";
  }
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
    <span className={cx("inline-flex rounded-full border px-3 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const tone =
    level === RiskLevel.LOW ? "success" : level === RiskLevel.MEDIUM ? "warning" : "danger";
  return <Badge tone={tone}>{level}</Badge>;
}

function StatusBadge({ status }: { status: ClusterPublicStatus }) {
  const tone =
    status === ClusterPublicStatus.PUBLISHED
      ? "gold"
      : status === ClusterPublicStatus.INTERNAL
        ? "warning"
        : "default";
  return <Badge tone={tone}>{status}</Badge>;
}

function FilterChip({
  active,
  href,
  children,
}: {
  active?: boolean;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]",
        active
          ? "border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] text-[var(--avasc-gold-light)]"
          : "border-[var(--avasc-border)] text-[var(--avasc-text-secondary)] hover:border-[var(--avasc-gold)] hover:text-white"
      )}
    >
      {children}
    </Link>
  );
}

async function SearchAndFilterBar({
  q,
  status,
  risk,
  scamType,
  filterValues,
}: {
  q?: string;
  status?: string;
  risk?: string;
  scamType?: string;
  filterValues: {
    statuses: ClusterPublicStatus[];
    risks: RiskLevel[];
    scamTypes: string[];
  };
}) {
  return (
    <section className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--avasc-gold-light)]">
        <Filter className="h-4 w-4" aria-hidden />
        Search and Filter Clusters
      </div>

      <form
        className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_repeat(3,0.7fr)_auto]"
        method="get"
        action="/admin/clusters"
      >
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--avasc-text-muted)]"
            aria-hidden
          />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by title, slug, summary, or scam type"
            className="w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[var(--avasc-gold)] focus:ring-2 focus:ring-[rgba(197,139,43,0.2)]"
            autoComplete="off"
          />
        </div>

        <select
          name="status"
          defaultValue={status ?? "ALL"}
          className="rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none"
          aria-label="Filter by visibility"
        >
          <option value="ALL">All Statuses</option>
          {filterValues.statuses.map((item) => (
            <option key={item} value={item}>
              {statusLabel(item)}
            </option>
          ))}
        </select>

        <select
          name="risk"
          defaultValue={risk ?? "ALL"}
          className="rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none"
          aria-label="Filter by risk"
        >
          <option value="ALL">All Risks</option>
          {filterValues.risks.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          name="scamType"
          defaultValue={scamType ?? "ALL"}
          className="rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none"
          aria-label="Filter by scam type"
        >
          <option value="ALL">All Scam Types</option>
          {filterValues.scamTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-card)]"
        >
          Apply
        </button>
      </form>
    </section>
  );
}

function QuickStatusActions({
  clusterId,
  currentStatus,
}: {
  clusterId: string;
  currentStatus: ClusterPublicStatus;
}) {
  async function publishAction() {
    "use server";
    await quickSetClusterPublicStatusAction({
      clusterId,
      publicStatus: ClusterPublicStatus.PUBLISHED,
    });
  }

  async function internalAction() {
    "use server";
    await quickSetClusterPublicStatusAction({
      clusterId,
      publicStatus: ClusterPublicStatus.INTERNAL,
    });
  }

  async function draftAction() {
    "use server";
    await quickSetClusterPublicStatusAction({
      clusterId,
      publicStatus: ClusterPublicStatus.DRAFT,
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus !== ClusterPublicStatus.PUBLISHED ? (
        <form action={publishAction}>
          <button
            type="submit"
            className="inline-flex min-h-9 items-center rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs font-medium text-green-300 hover:bg-green-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Publish
          </button>
        </form>
      ) : null}

      {currentStatus !== ClusterPublicStatus.INTERNAL ? (
        <form action={internalAction}>
          <button
            type="submit"
            className="inline-flex min-h-9 items-center rounded-lg border border-[var(--avasc-border)] px-3 py-2 text-xs font-medium text-white hover:border-[var(--avasc-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)]"
          >
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Internal
          </button>
        </form>
      ) : null}

      {currentStatus !== ClusterPublicStatus.DRAFT ? (
        <form action={draftAction}>
          <button
            type="submit"
            className="inline-flex min-h-9 items-center rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <EyeOff className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Draft
          </button>
        </form>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <section className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(197,139,43,0.25)] bg-[rgba(197,139,43,0.08)]">
        <Search className="h-6 w-6 text-[var(--avasc-gold-light)]" aria-hidden />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">No clusters found</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--avasc-text-secondary)]">
        Try broadening your search or removing one of the active filters.
      </p>
    </section>
  );
}

export default async function AdminClustersPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const q = pick(params, "q") ?? "";
  const status = pick(params, "status") ?? "ALL";
  const risk = pick(params, "risk") ?? "ALL";
  const scamType = pick(params, "scamType") ?? "ALL";

  const staff = await requireStaff();
  const edit = canMutate(staff.role);

  const data = await getAdminClustersListData({ q, status, risk, scamType });

  const chipBase = { q, risk, scamType };
  const statusFilter = status;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[#0F172A] to-[#0B1F3A] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
              <Globe className="h-3.5 w-3.5" aria-hidden />
              Admin Cluster Management
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Scam Clusters</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--avasc-text-secondary)]">
              Review, filter, publish, and manage scam intelligence clusters across the AVASC system.
            </p>
          </div>

          <Link
            href="/admin/clusters/new"
            className="inline-flex min-h-11 items-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14] shadow-[0_0_20px_rgba(197,139,43,0.18)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden />
            New Cluster
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--avasc-text-secondary)]">
          <Badge>{data.stats.total} total</Badge>
          <Badge tone="gold">{data.stats.published} published</Badge>
          <Badge tone="warning">{data.stats.internal} internal</Badge>
          <Badge>{data.stats.draft} draft</Badge>
        </div>
      </section>

      <SearchAndFilterBar
        q={q}
        status={status}
        risk={risk}
        scamType={scamType}
        filterValues={data.filterValues}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-[var(--avasc-text-secondary)]">
          <span className="font-semibold text-white">{data.clusters.length}</span> clusters found
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip href={clustersListHref(chipBase, "ALL")} active={statusFilter === "ALL"}>
            All
          </FilterChip>
          <FilterChip
            href={clustersListHref(chipBase, ClusterPublicStatus.PUBLISHED)}
            active={statusFilter === ClusterPublicStatus.PUBLISHED}
          >
            Published
          </FilterChip>
          <FilterChip
            href={clustersListHref(chipBase, ClusterPublicStatus.INTERNAL)}
            active={statusFilter === ClusterPublicStatus.INTERNAL}
          >
            Internal
          </FilterChip>
          <FilterChip
            href={clustersListHref(chipBase, ClusterPublicStatus.DRAFT)}
            active={statusFilter === ClusterPublicStatus.DRAFT}
          >
            Draft
          </FilterChip>
        </div>
      </div>

      {data.clusters.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {data.clusters.map((cluster) => (
            <article
              key={cluster.id}
              className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-white">{cluster.title}</h2>
                    <StatusBadge status={cluster.publicStatus} />
                    <RiskBadge level={cluster.riskLevel} />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--avasc-text-muted)]">
                    <Badge>{cluster.scamType}</Badge>
                    <Badge>{cluster.reportCountSnapshot} cases</Badge>
                    <Badge>{cluster.publicIndicatorCount} public indicators</Badge>
                    <Badge>{cluster.threatScore} threat score</Badge>
                  </div>

                  <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--avasc-text-secondary)]">
                    {cluster.summary}
                  </p>

                  <div className="mt-4 text-xs text-[var(--avasc-text-muted)]">
                    Slug: <span className="font-mono text-white">{cluster.slug}</span>
                  </div>
                </div>

                <div className="w-full max-w-sm space-y-3 xl:w-[320px]">
                  {edit ? (
                    <QuickStatusActions clusterId={cluster.id} currentStatus={cluster.publicStatus} />
                  ) : (
                    <p className="text-xs text-[var(--avasc-text-muted)]">Quick visibility changes require editor access.</p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/clusters/${cluster.id}`}
                      className="inline-flex min-h-11 items-center rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white transition hover:border-[var(--avasc-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)]"
                    >
                      Open Cluster
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>

                    {cluster.publicStatus === ClusterPublicStatus.PUBLISHED ? (
                      <Link
                        href={`/database/${encodeURIComponent(cluster.slug)}`}
                        className="inline-flex min-h-11 items-center rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white transition hover:border-[var(--avasc-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)]"
                      >
                        Public View
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(197,139,43,0.25)] bg-[rgba(197,139,43,0.08)]">
            <AlertTriangle className="h-5 w-5 text-[var(--avasc-gold-light)]" aria-hidden />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Operational reminders</h2>
            <p className="mt-1 text-sm text-[var(--avasc-text-secondary)]">
              Keep public clusters privacy-safe, evidence-based, and refresh search after meaningful public-surface changes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

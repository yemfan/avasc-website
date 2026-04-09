import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  FileSearch,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { CaseStatus } from "@prisma/client";
import {
  getAdminCasesListData,
  quickSetCaseStatusAction,
} from "@/lib/admin/avasc-admin-cases-list-actions";

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

function casesListHref(
  parts: { q?: string; scamType?: string; suggestion?: string },
  nextStatus: string
) {
  const p = new URLSearchParams();
  if (parts.q?.trim()) p.set("q", parts.q.trim());
  if (nextStatus !== "ALL") p.set("status", nextStatus);
  if (parts.scamType && parts.scamType !== "ALL") p.set("scamType", parts.scamType);
  if (parts.suggestion && parts.suggestion !== "ALL") p.set("suggestion", parts.suggestion);
  const qs = p.toString();
  return qs ? `/admin/cases?${qs}` : "/admin/cases";
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

function StatusBadge({ status }: { status: CaseStatus }) {
  const tone =
    status === "CLUSTERED" || status === "PUBLISHED_ANONYMIZED"
      ? "gold"
      : status === "NEW"
        ? "warning"
        : status === "PENDING_REVIEW"
          ? "default"
          : status === "NEEDS_FOLLOW_UP"
            ? "danger"
            : "success";

  return (
    <Badge tone={tone}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
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
  scamType,
  suggestion,
  filterValues,
}: {
  q?: string;
  status?: string;
  scamType?: string;
  suggestion?: string;
  filterValues: {
    statuses: CaseStatus[];
    scamTypes: string[];
    suggestionStates: readonly ["HAS_PENDING", "NO_PENDING"];
  };
}) {
  return (
    <section className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--avasc-gold-light)]">
        <Filter className="h-4 w-4" aria-hidden />
        Search and Filter Cases
      </div>

      <form className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_repeat(3,0.75fr)_auto]" method="get" action="/admin/cases">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--avasc-text-muted)]"
            aria-hidden
          />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by title, summary, case ID, or scam type"
            className="w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[var(--avasc-gold)] focus:ring-2 focus:ring-[rgba(197,139,43,0.2)]"
            autoComplete="off"
          />
        </div>

        <select
          name="status"
          defaultValue={status ?? "ALL"}
          className="rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none"
          aria-label="Filter by status"
        >
          <option value="ALL">All Statuses</option>
          {filterValues.statuses.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
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

        <select
          name="suggestion"
          defaultValue={suggestion ?? "ALL"}
          className="rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none"
          aria-label="Filter by suggestion state"
        >
          <option value="ALL">All Suggestions</option>
          <option value="HAS_PENDING">Has pending suggestion</option>
          <option value="NO_PENDING">No pending suggestion</option>
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

async function QuickCaseStatusActions({
  caseId,
  currentStatus,
}: {
  caseId: string;
  currentStatus: CaseStatus;
}) {
  async function pendingAction() {
    "use server";
    await quickSetCaseStatusAction({ caseId, status: CaseStatus.PENDING_REVIEW });
  }

  async function followUpAction() {
    "use server";
    await quickSetCaseStatusAction({ caseId, status: CaseStatus.NEEDS_FOLLOW_UP });
  }

  async function clusteredAction() {
    "use server";
    await quickSetCaseStatusAction({ caseId, status: CaseStatus.CLUSTERED });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus !== "PENDING_REVIEW" ? (
        <form action={pendingAction}>
          <button
            type="submit"
            className="inline-flex min-h-9 items-center rounded-lg border border-[var(--avasc-border)] px-3 py-2 text-xs font-medium text-white hover:border-[var(--avasc-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)]"
          >
            Pending Review
          </button>
        </form>
      ) : null}

      {currentStatus !== "NEEDS_FOLLOW_UP" ? (
        <form action={followUpAction}>
          <button
            type="submit"
            className="inline-flex min-h-9 items-center rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            Follow-up
          </button>
        </form>
      ) : null}

      {currentStatus !== "CLUSTERED" ? (
        <form action={clusteredAction}>
          <button
            type="submit"
            className="inline-flex min-h-9 items-center rounded-lg border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-2 text-xs font-medium text-[var(--avasc-gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)]"
          >
            Clustered
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
        <FileSearch className="h-6 w-6 text-[var(--avasc-gold-light)]" aria-hidden />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">No cases found</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--avasc-text-secondary)]">
        Try broadening your search or removing one of the active filters.
      </p>
    </section>
  );
}

export default async function AdminCasesPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const q = pick(params, "q") ?? "";
  const status = pick(params, "status") ?? "ALL";
  const scamType = pick(params, "scamType") ?? "ALL";
  const suggestion = pick(params, "suggestion") ?? "ALL";

  const data = await getAdminCasesListData({ q, status, scamType, suggestion });

  const chipBase = { q, scamType, suggestion };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[#0F172A] to-[#0B1F3A] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Admin Case Review Queue
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Incoming Cases</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--avasc-text-secondary)]">
              Review submitted scam cases, inspect matching suggestions, and open case review workflows.
            </p>
          </div>

          <Link
            href="/report"
            className="inline-flex min-h-11 items-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14] shadow-[0_0_20px_rgba(197,139,43,0.18)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden />
            New Intake
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--avasc-text-secondary)]">
          <Badge>{data.stats.total} total</Badge>
          <Badge tone="warning">{data.stats.new} new</Badge>
          <Badge>{data.stats.pendingReview} pending review</Badge>
          <Badge tone="danger">{data.stats.followUp} follow-up</Badge>
          <Badge tone="gold">{data.stats.clustered} clustered</Badge>
        </div>
      </section>

      <SearchAndFilterBar
        q={q}
        status={status}
        scamType={scamType}
        suggestion={suggestion}
        filterValues={data.filterValues}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-[var(--avasc-text-secondary)]">
          <span className="font-semibold text-white">{data.cases.length}</span> cases found
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip href={casesListHref(chipBase, "ALL")} active={status === "ALL"}>
            All
          </FilterChip>
          <FilterChip href={casesListHref(chipBase, "NEW")} active={status === "NEW"}>
            New
          </FilterChip>
          <FilterChip href={casesListHref(chipBase, "PENDING_REVIEW")} active={status === "PENDING_REVIEW"}>
            Pending Review
          </FilterChip>
          <FilterChip href={casesListHref(chipBase, "NEEDS_FOLLOW_UP")} active={status === "NEEDS_FOLLOW_UP"}>
            Follow-up
          </FilterChip>
          <FilterChip href={casesListHref(chipBase, "CLUSTERED")} active={status === "CLUSTERED"}>
            Clustered
          </FilterChip>
        </div>
      </div>

      {data.cases.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {data.cases.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                    <StatusBadge status={item.status} />
                    {item.hasPendingSuggestion ? (
                      <Badge tone="gold">Has Suggestion</Badge>
                    ) : (
                      <Badge>No Suggestion</Badge>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--avasc-text-muted)]">
                    <Badge>{item.scamType}</Badge>
                    {item.amountLost != null ? (
                      <Badge>
                        <Wallet className="mr-1 inline h-3 w-3" aria-hidden />$
                        {Number(item.amountLost).toLocaleString()}
                      </Badge>
                    ) : null}
                    <Badge>{item.indicatorCount} indicators</Badge>
                    {item.topSuggestionType ? (
                      <Badge tone="gold">{String(item.topSuggestionType).replaceAll("_", " ")}</Badge>
                    ) : null}
                  </div>

                  <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--avasc-text-secondary)]">
                    {item.summary}
                  </p>

                  <div className="mt-4 text-xs text-[var(--avasc-text-muted)]">
                    Case ID: <span className="font-mono text-white">{item.id}</span> • Created:{" "}
                    <span className="text-white">{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="w-full max-w-sm space-y-3 xl:w-[340px]">
                  <QuickCaseStatusActions caseId={item.id} currentStatus={item.status} />

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/cases/${item.id}`}
                      className="inline-flex min-h-11 items-center rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white transition hover:border-[var(--avasc-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)]"
                    >
                      Open Review
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                      href={`/admin/cases/${item.id}/review-production`}
                      className="inline-flex min-h-11 items-center rounded-lg border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-4 py-2 text-sm font-medium text-[var(--avasc-gold-light)] transition hover:bg-[rgba(197,139,43,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)]"
                    >
                      Production review
                    </Link>
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
              Keep case review explainable, privacy-safe, and consistent with cluster moderation policies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

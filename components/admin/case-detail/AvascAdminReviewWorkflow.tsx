"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  Link2,
  RefreshCw,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { ReviewCaseDto } from "@/lib/admin/get-case-review-workflow-data";
import { markCaseNeedsFollowUpAction, runCaseQuickAction } from "@/app/admin/cases/[id]/actions";
import {
  approveAllHighConfidenceIndicatorsAction,
  approveClusterSuggestionAction,
  createClusterFromSuggestionAction,
  forceAssignCaseToClusterAction,
  recomputeMatchingAction,
  rejectClusterSuggestionAction,
  saveIndicatorEditsAction,
} from "@/app/admin/cases/[id]/review-actions";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type RiskLevel = ReviewCaseDto["matchCandidates"][number]["riskLevel"];
type Confidence = ReviewCaseDto["clusterSuggestion"]["confidenceLabel"];

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>;
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
  const tones: Record<RiskLevel, "success" | "warning" | "danger"> = {
    LOW: "success",
    MEDIUM: "warning",
    HIGH: "danger",
    CRITICAL: "danger",
  };
  return <Badge tone={tones[level]}>{level}</Badge>;
}

function ConfidenceBadge({ value }: { value: Confidence }) {
  const tone =
    value === "CRITICAL" || value === "HIGH" ? "gold" : value === "MEDIUM" ? "warning" : "default";
  return <Badge tone={tone}>{value}</Badge>;
}

function Section({
  title,
  subtitle,
  icon: Icon,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[rgba(197,139,43,0.25)] bg-[rgba(197,139,43,0.08)]">
            <Icon className="h-5 w-5 text-[var(--avasc-gold-light)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-[var(--avasc-text-secondary)]">{subtitle}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function TopHeader({ data }: { data: ReviewCaseDto }) {
  return (
    <section className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[#0F172A] to-[#0B1F3A] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Admin review workflow
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{data.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--avasc-text-secondary)]">{data.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
          <Badge tone="gold">{data.status}</Badge>
          <Badge>
            {data.amountLost != null ? `$${data.amountLost.toLocaleString()}` : "N/A"}
          </Badge>
          <Badge>{data.scamType}</Badge>
        </div>
      </div>
      <div className="mt-6 text-sm text-[var(--avasc-text-secondary)]">
        Case ID: <span className="font-mono text-white">{data.id}</span> • Created:{" "}
        <span className="text-white">{data.createdAt}</span>
      </div>
    </section>
  );
}

function IndicatorReviewTable({
  caseId,
  indicators,
  onSaved,
}: {
  caseId: string;
  indicators: ReviewCaseDto["extractedIndicators"];
  onSaved: () => void;
}) {
  const [rows, setRows] = useState(indicators);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(id: string, field: "isVerified" | "isPublic") {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: !row[field] } : row)));
  }

  async function saveAll() {
    setError(null);
    startTransition(async () => {
      try {
        await saveIndicatorEditsAction({
          caseId,
          indicators: rows.map((row) => ({
            id: row.id,
            isVerified: row.isVerified,
            isPublic: row.isPublic,
            normalizedValue: row.normalizedValue,
          })),
        });
        onSaved();
      } catch {
        setError("Could not save indicator edits.");
      }
    });
  }

  function approveAllHighConfidence() {
    setError(null);
    startTransition(async () => {
      try {
        await approveAllHighConfidenceIndicatorsAction({ caseId });
        onSaved();
      } catch {
        setError("Could not approve high-confidence indicators.");
      }
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={approveAllHighConfidence}
          className="rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white hover:border-[var(--avasc-gold)]"
        >
          Approve all high-confidence (≥95)
        </button>
      </div>
      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-[var(--avasc-border)]">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-300">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Raw Value</th>
              <th className="px-4 py-3">Normalized Value</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Public</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-[var(--avasc-divider)] align-top hover:bg-white/5"
              >
                <td className="px-4 py-4 font-medium text-white">{row.type}</td>
                <td className="break-all px-4 py-4 text-[var(--avasc-text-secondary)]">{row.rawValue}</td>
                <td className="break-all px-4 py-4 text-[var(--avasc-text-secondary)]">{row.normalizedValue}</td>
                <td className="px-4 py-4">
                  <Badge
                    tone={
                      row.confidenceScore >= 95 ? "gold" : row.confidenceScore >= 75 ? "warning" : "default"
                    }
                  >
                    {row.confidenceScore}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => toggle(row.id, "isVerified")}
                    className={cx(
                      "rounded-lg border px-3 py-2 text-xs font-medium",
                      row.isVerified
                        ? "border-green-500/30 bg-green-500/10 text-green-300"
                        : "border-[var(--avasc-border)] text-[var(--avasc-text-secondary)]"
                    )}
                  >
                    {row.isVerified ? "Verified" : "Mark verified"}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => toggle(row.id, "isPublic")}
                    className={cx(
                      "rounded-lg border px-3 py-2 text-xs font-medium",
                      row.isPublic
                        ? "border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] text-[var(--avasc-gold-light)]"
                        : "border-[var(--avasc-border)] text-[var(--avasc-text-secondary)]"
                    )}
                  >
                    {row.isPublic ? "Public" : "Keep private"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          disabled={pending || rows.length === 0}
          onClick={saveAll}
          className="rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white hover:border-[var(--avasc-gold)] disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save indicator edits"}
        </button>
      </div>
    </div>
  );
}

function MatchCandidatesPanel({
  caseId,
  items,
}: {
  caseId: string;
  items: ReviewCaseDto["matchCandidates"];
}) {
  const [selectedId, setSelectedId] = useState(items[0]?.clusterId ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const selected = useMemo(
    () => items.find((i) => i.clusterId === selectedId) ?? items[0],
    [items, selectedId]
  );

  function forceAssign() {
    if (!selected) return;
    setError(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        await forceAssignCaseToClusterAction({
          caseId,
          clusterId: selected.clusterId,
        });
        router.refresh();
      } catch {
        setError("Assignment failed.");
      }
    });
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--avasc-text-secondary)]">
        No cluster matches yet. Add indicators or run the intake matching pipeline.
      </p>
    );
  }

  return (
    <div>
      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          {items.map((item) => (
            <button
              key={item.clusterId}
              type="button"
              onClick={() => setSelectedId(item.clusterId)}
              className={cx(
                "w-full rounded-2xl border p-4 text-left transition",
                item.clusterId === selected?.clusterId
                  ? "border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)]"
                  : "border-[var(--avasc-border)] bg-[rgba(255,255,255,0.02)] hover:border-[var(--avasc-gold)]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="mt-1 text-xs text-[var(--avasc-text-muted)]">{item.scamType}</div>
                </div>
                <ConfidenceBadge value={item.confidenceLabel} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <RiskBadge level={item.riskLevel} />
                <Badge>
                  {item.totalScore} pts
                </Badge>
              </div>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="rounded-2xl border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.02)] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{selected.title}</h3>
                <p className="mt-1 text-sm text-[var(--avasc-text-secondary)]">{selected.scamType}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <RiskBadge level={selected.riskLevel} />
                <ConfidenceBadge value={selected.confidenceLabel} />
                <Badge>{selected.totalScore} score</Badge>
              </div>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold text-white">Matched indicator types</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.matchedIndicatorTypes.map((type) => (
                  <Badge key={type} tone="gold">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold text-white">Reasons</div>
              <ul className="mt-3 space-y-2 text-sm text-[var(--avasc-text-secondary)]">
                {selected.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avasc-gold)]" aria-hidden />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={forceAssign}
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-4 py-2 text-sm font-semibold text-[#050A14] disabled:opacity-50"
              >
                Force assign to cluster
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </button>
              <Link
                href={`/admin/clusters/${selected.clusterId}`}
                className="rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white hover:border-[var(--avasc-gold)]"
              >
                Open cluster detail
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-white">{label}</div>
      <input
        readOnly
        value={value}
        className="w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none"
      />
    </div>
  );
}

function SuggestionDecisionCard({
  caseId,
  suggestion,
  latestSuggestionId,
  latestSuggestionStatus,
  onUpdated,
}: {
  caseId: string;
  suggestion: ReviewCaseDto["clusterSuggestion"];
  latestSuggestionId: ReviewCaseDto["latestSuggestionId"];
  latestSuggestionStatus: ReviewCaseDto["latestSuggestionStatus"];
  onUpdated: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const canAct = Boolean(latestSuggestionId && latestSuggestionStatus === "PENDING");

  function approve() {
    if (!canAct || !latestSuggestionId) return;
    setError(null);
    startTransition(async () => {
      try {
        if (suggestion.suggestionType === "ASSIGN_TO_EXISTING") {
          await approveClusterSuggestionAction({ caseId, suggestionId: latestSuggestionId });
        } else {
          await createClusterFromSuggestionAction({
            caseId,
            suggestionId: latestSuggestionId,
            title: suggestion.suggestedTitle,
            scamType: suggestion.suggestedScamType,
            summary: suggestion.suggestedSummary,
            riskLevel: suggestion.suggestedRiskLevel as import("@prisma/client").RiskLevel,
          });
        }
        onUpdated();
      } catch {
        setError("Could not apply this suggestion.");
      }
    });
  }

  function reject() {
    if (!canAct || !latestSuggestionId) return;
    setError(null);
    startTransition(async () => {
      try {
        await rejectClusterSuggestionAction({ caseId, suggestionId: latestSuggestionId });
        onUpdated();
      } catch {
        setError("Could not reject this suggestion.");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.02)] p-5">
      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}
      {suggestion.suggestionType === "ASSIGN_TO_EXISTING" ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="gold">ASSIGN_TO_EXISTING</Badge>
            <ConfidenceBadge value={suggestion.confidenceLabel} />
            <Badge>{suggestion.fitScore} fit score</Badge>
          </div>
          <div className="mt-4 text-sm text-[var(--avasc-text-secondary)]">
            Suggested cluster ID:{" "}
            <span className="font-mono text-white">{suggestion.suggestedClusterId}</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-[var(--avasc-text-secondary)]">
            {suggestion.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avasc-gold)]" aria-hidden />
                {reason}
              </li>
            ))}
          </ul>
          {canAct ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={approve}
                className="rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-4 py-2 text-sm font-semibold text-[#050A14] disabled:opacity-50"
              >
                Approve assignment
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={reject}
                className="rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white hover:border-red-400/50 disabled:opacity-50"
              >
                Reject suggestion
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="warning">CREATE_NEW</Badge>
            <ConfidenceBadge value={suggestion.confidenceLabel} />
            <Badge>{suggestion.fitScore} fit score</Badge>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Suggested title" value={suggestion.suggestedTitle} />
            <Field label="Suggested scam type" value={suggestion.suggestedScamType} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Suggested risk level" value={suggestion.suggestedRiskLevel} />
            <Field label="Confidence" value={suggestion.confidenceLabel} />
          </div>
          <div className="mt-4">
            <div className="mb-2 text-sm font-medium text-white">Suggested summary</div>
            <textarea
              readOnly
              value={suggestion.suggestedSummary}
              rows={5}
              className="min-h-[120px] w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none"
            />
          </div>
          <ul className="mt-4 space-y-2 text-sm text-[var(--avasc-text-secondary)]">
            {suggestion.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avasc-gold)]" aria-hidden />
                {reason}
              </li>
            ))}
          </ul>
          {canAct ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={approve}
                className="rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-4 py-2 text-sm font-semibold text-[#050A14] disabled:opacity-50"
              >
                Create cluster from suggestion
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={reject}
                className="rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white hover:border-red-400/50 disabled:opacity-50"
              >
                Reject suggestion
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function ActionRail({
  caseId,
  onRecomputed,
}: {
  caseId: string;
  onRecomputed: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function runPipeline() {
    setError(null);
    startTransition(async () => {
      try {
        await recomputeMatchingAction({ caseId });
        onRecomputed();
      } catch {
        setError("Pipeline failed. Check logs.");
      }
    });
  }

  function followUp() {
    setError(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("caseId", caseId);
        await markCaseNeedsFollowUpAction(fd);
        onRecomputed();
      } catch {
        setError("Could not update status.");
      }
    });
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-2 text-sm text-red-300">{error}</p>
      ) : null}
      <section className="rounded-2xl border border-[var(--avasc-border)] bg-gradient-to-br from-[#0F172A] to-[#0B1F3A] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Review actions
        </div>
        <div className="mt-5 space-y-3">
          <button
            type="button"
            disabled={pending}
            onClick={runPipeline}
            className="w-full rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-4 py-3 text-sm font-semibold text-[#050A14] disabled:opacity-50"
          >
            {pending ? "Running…" : "Recompute matching (intake pipeline)"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={followUp}
            className="w-full rounded-lg border border-[var(--avasc-border)] px-4 py-3 text-sm font-medium text-white hover:border-[var(--avasc-gold)] disabled:opacity-50"
          >
            Mark needs follow-up
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[var(--avasc-text-muted)]">
          Intake pipeline re-extracts indicators from narrative text and may replace existing indicator rows.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--avasc-gold-light)]">
          <Database className="h-4 w-4" aria-hidden />
          Moderator notes
        </div>
        <textarea
          placeholder="Use the main case moderation card for structured notes and audit trail."
          disabled
          className="mt-4 min-h-[160px] w-full cursor-not-allowed rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-[var(--avasc-text-muted)] outline-none"
        />
      </section>

      <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--avasc-gold-light)]">
          <AlertTriangle className="h-4 w-4" aria-hidden />
          Safety guardrails
        </div>
        <ul className="mt-4 space-y-3 text-sm text-[var(--avasc-text-secondary)]">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avasc-gold)]" aria-hidden />
            Review extracted indicators before public exposure.
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avasc-gold)]" aria-hidden />
            Confirm exact-match clusters before force assignment.
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avasc-gold)]" aria-hidden />
            Keep victim-sensitive details private.
          </li>
        </ul>
      </section>
    </div>
  );
}

export type AvascAdminReviewWorkflowProps = {
  caseId: string;
  data: ReviewCaseDto;
};

export function AvascAdminReviewWorkflow({ caseId, data }: AvascAdminReviewWorkflowProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function refresh() {
    router.refresh();
  }

  return (
    <Container>
      <div className="space-y-8">
        <TopHeader data={data} />

        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Section
              title="Extracted indicators"
              subtitle="Review normalized indicators, verify confidence, and choose which values may become public in cluster aggregation later."
              icon={Link2}
            >
              <IndicatorReviewTable caseId={caseId} indicators={data.extractedIndicators} onSaved={refresh} />
            </Section>

            <Section
              title="Cluster match candidates"
              subtitle="Scored heuristic matches from shared indicators vs cluster aggregates (same engine as intake pipeline scoring)."
              icon={Search}
            >
              <MatchCandidatesPanel caseId={caseId} items={data.matchCandidates} />
            </Section>

            <Section
              title="Suggested decision"
              subtitle="Latest stored cluster suggestion, or a live engine recommendation when none exists yet."
              icon={ShieldCheck}
            >
              <SuggestionDecisionCard
                caseId={caseId}
                suggestion={data.clusterSuggestion}
                latestSuggestionId={data.latestSuggestionId}
                latestSuggestionStatus={data.latestSuggestionStatus}
                onUpdated={refresh}
              />
            </Section>

            <Section
              title="Final review actions"
              subtitle="Quick moderation shortcuts."
              icon={CheckCircle2}
              actions={
                <>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        await runCaseQuickAction(caseId, "mark_reviewed");
                        refresh();
                      });
                    }}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
                  >
                    Mark reviewed
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        const fd = new FormData();
                        fd.set("caseId", caseId);
                        await markCaseNeedsFollowUpAction(fd);
                        refresh();
                      });
                    }}
                    className="rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white hover:border-[var(--avasc-gold)] disabled:opacity-50"
                  >
                    Send to follow-up
                  </button>
                  <span className="inline-flex items-center rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300">
                    <XCircle className="mr-2 h-4 w-4" aria-hidden />
                    Use moderation card to reject / escalate
                  </span>
                </>
              }
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[var(--avasc-border)] p-5">
                  <div className="text-sm text-[var(--avasc-text-secondary)]">Indicators extracted</div>
                  <div className="mt-2 text-3xl font-bold text-white">{data.extractedIndicators.length}</div>
                </div>
                <div className="rounded-2xl border border-[var(--avasc-border)] p-5">
                  <div className="text-sm text-[var(--avasc-text-secondary)]">Top match score</div>
                  <div className="mt-2 text-3xl font-bold text-white">
                    {data.matchCandidates[0]?.totalScore ?? 0}
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--avasc-border)] p-5">
                  <div className="text-sm text-[var(--avasc-text-secondary)]">Suggested action</div>
                  <div className="mt-2 text-lg font-bold text-white">{data.clusterSuggestion.suggestionType}</div>
                </div>
              </div>
            </Section>
          </div>

          <ActionRail caseId={caseId} onRecomputed={refresh} />
        </div>
      </div>
    </Container>
  );
}

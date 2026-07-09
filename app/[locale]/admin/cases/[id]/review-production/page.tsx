import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { ClusterSuggestionType, type RiskLevel as PrismaRiskLevel, SuggestionStatus } from "@prisma/client";
import {
  approveAllHighConfidenceIndicatorsAction,
  approveClusterSuggestionAction,
  createClusterFromSuggestionAction,
  forceAssignCaseToClusterAction,
  getAdminCaseReviewData,
  recomputeMatchingAction,
  rejectAllPendingSuggestionsAction,
  rejectClusterSuggestionAction,
  saveIndicatorEditsAction,
} from "@/lib/admin/avasc-admin-review-server-actions";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type Confidence = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

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
      className={cx(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const tone =
    level === "LOW" ? "success" : level === "MEDIUM" ? "warning" : "danger";

  return <Badge tone={tone}>{level}</Badge>;
}

function ConfidenceBadge({ value }: { value: Confidence }) {
  const tone =
    value === "CRITICAL" || value === "HIGH"
      ? "gold"
      : value === "MEDIUM"
        ? "warning"
        : "default";

  return <Badge tone={tone}>{value}</Badge>;
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl">{children}</div>;
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(197,139,43,0.25)] bg-[rgba(197,139,43,0.08)]">
            <Icon className="h-5 w-5 text-[var(--avasc-gold-light)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-[var(--avasc-text-secondary)]">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ActionButton({
  children,
  variant = "secondary",
  type = "submit",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  type?: "submit" | "button";
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] text-[#050A14]",
    secondary:
      "border border-[var(--avasc-border)] text-white hover:border-[var(--avasc-gold)]",
    danger:
      "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/15",
    success: "bg-green-600 text-white hover:bg-green-500",
  };

  return (
    <button
      type={type}
      className={cx(
        "rounded-lg px-4 py-2 text-sm font-medium transition",
        styles[variant]
      )}
    >
      {children}
    </button>
  );
}

async function SaveIndicatorsForm({
  caseId,
  indicators,
}: {
  caseId: string;
  indicators: Array<{
    id: string;
    indicatorType: string;
    rawValue: string;
    normalizedValue: string;
    confidenceScore: number | null;
    isVerified: boolean;
    isPublic: boolean;
  }>;
}) {
  async function saveAction(formData: FormData) {
    "use server";

    const payload = indicators.map((indicator) => ({
      id: indicator.id,
      normalizedValue:
        (formData.get(`normalizedValue:${indicator.id}`) as string) || indicator.normalizedValue,
      isVerified: formData.get(`isVerified:${indicator.id}`) === "on",
      isPublic: formData.get(`isPublic:${indicator.id}`) === "on",
    }));

    await saveIndicatorEditsAction({
      caseId,
      indicators: payload,
    });
  }

  return (
    <form action={saveAction} className="space-y-4">
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
            {indicators.map((indicator) => (
              <tr
                key={indicator.id}
                className="border-t border-[var(--avasc-divider)] align-top hover:bg-white/5"
              >
                <td className="px-4 py-4 font-medium text-white">{indicator.indicatorType}</td>
                <td className="max-w-[260px] break-all px-4 py-4 text-[var(--avasc-text-secondary)]">
                  {indicator.rawValue}
                </td>
                <td className="px-4 py-4">
                  <input
                    name={`normalizedValue:${indicator.id}`}
                    defaultValue={indicator.normalizedValue}
                    className="w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-3 py-2 text-sm text-white outline-none"
                  />
                </td>
                <td className="px-4 py-4">
                  <Badge
                    tone={
                      (indicator.confidenceScore ?? 0) >= 95
                        ? "gold"
                        : (indicator.confidenceScore ?? 0) >= 75
                          ? "warning"
                          : "default"
                    }
                  >
                    {indicator.confidenceScore ?? 0}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <label className="inline-flex items-center gap-2 text-sm text-white">
                    <input
                      type="checkbox"
                      name={`isVerified:${indicator.id}`}
                      defaultChecked={indicator.isVerified}
                    />
                    Verified
                  </label>
                </td>
                <td className="px-4 py-4">
                  <label className="inline-flex items-center gap-2 text-sm text-white">
                    <input
                      type="checkbox"
                      name={`isPublic:${indicator.id}`}
                      defaultChecked={indicator.isPublic}
                    />
                    Public
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3">
        <ActionButton variant="primary">
          <Save className="mr-2 inline h-4 w-4" />
          Save Indicator Edits
        </ActionButton>
      </div>
    </form>
  );
}

async function ApproveAllHighConfidenceForm({ caseId }: { caseId: string }) {
  async function action() {
    "use server";
    await approveAllHighConfidenceIndicatorsAction({ caseId });
  }

  return (
    <form action={action}>
      <ActionButton type="submit">Approve All High-Confidence</ActionButton>
    </form>
  );
}

async function RecomputeForm({ caseId }: { caseId: string }) {
  async function action() {
    "use server";
    await recomputeMatchingAction({ caseId });
  }

  return (
    <form action={action}>
      <ActionButton type="submit">
        <RefreshCw className="mr-2 inline h-4 w-4" />
        Recompute Matching
      </ActionButton>
    </form>
  );
}

async function RejectAllSuggestionsForm({ caseId }: { caseId: string }) {
  async function action() {
    "use server";
    await rejectAllPendingSuggestionsAction({ caseId });
  }

  return (
    <form action={action}>
      <ActionButton type="submit" variant="danger">
        Reject All Pending Suggestions
      </ActionButton>
    </form>
  );
}

async function AssignSuggestionCard({
  caseId,
  suggestion,
  cluster,
  canAct,
}: {
  caseId: string;
  suggestion: {
    id: string;
    suggestedClusterId: string | null;
    fitScore: number | null;
    confidenceLabel: Confidence;
    reasonsJson: unknown;
  };
  cluster: {
    id: string;
    title: string;
    scamType: string;
    riskLevel: RiskLevel;
    publicStatus: string;
  } | null;
  canAct: boolean;
}) {
  const reasons = Array.isArray(suggestion.reasonsJson)
    ? (suggestion.reasonsJson as string[])
    : [];

  async function approveAction() {
    "use server";
    await approveClusterSuggestionAction({
      caseId,
      suggestionId: suggestion.id,
    });
  }

  async function rejectAction() {
    "use server";
    await rejectClusterSuggestionAction({
      caseId,
      suggestionId: suggestion.id,
    });
  }

  if (!cluster) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
        Suggested cluster could not be loaded.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.02)] p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="gold">ASSIGN_TO_EXISTING</Badge>
        <ConfidenceBadge value={suggestion.confidenceLabel} />
        <Badge>{suggestion.fitScore ?? 0} fit score</Badge>
      </div>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{cluster.title}</h3>
          <p className="mt-1 text-sm text-[var(--avasc-text-secondary)]">{cluster.scamType}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <RiskBadge level={cluster.riskLevel} />
          <Badge>{cluster.publicStatus}</Badge>
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-sm text-[var(--avasc-text-secondary)]">
        {reasons.map((reason, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" />
            {reason}
          </li>
        ))}
      </ul>

      {canAct ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <form action={approveAction}>
            <ActionButton type="submit" variant="success">
              Approve Assignment
            </ActionButton>
          </form>
          <form action={rejectAction}>
            <ActionButton type="submit" variant="danger">
              <XCircle className="mr-2 inline h-4 w-4" />
              Reject Suggestion
            </ActionButton>
          </form>
        </div>
      ) : (
        <p className="mt-6 text-sm text-[var(--avasc-text-muted)]">
          This suggestion is not pending review (already accepted or rejected).
        </p>
      )}
    </div>
  );
}

async function CreateClusterSuggestionCard({
  caseId,
  suggestion,
  canAct,
}: {
  caseId: string;
  suggestion: {
    id: string;
    suggestedTitle: string | null;
    suggestedScamType: string | null;
    suggestedSummary: string | null;
    suggestedRiskLevel: RiskLevel | null;
    fitScore: number | null;
    confidenceLabel: Confidence;
    reasonsJson: unknown;
  };
  canAct: boolean;
}) {
  const reasons = Array.isArray(suggestion.reasonsJson)
    ? (suggestion.reasonsJson as string[])
    : [];

  async function createAction(formData: FormData) {
    "use server";

    await createClusterFromSuggestionAction({
      caseId,
      suggestionId: suggestion.id,
      title: (formData.get("title") as string) || "Untitled Cluster",
      scamType: (formData.get("scamType") as string) || "Unknown Scam Pattern",
      summary:
        (formData.get("summary") as string) || "Emerging scam pattern pending public review.",
      riskLevel: ((formData.get("riskLevel") as string) || "MEDIUM") as PrismaRiskLevel,
    });
  }

  async function rejectAction() {
    "use server";
    await rejectClusterSuggestionAction({
      caseId,
      suggestionId: suggestion.id,
    });
  }

  return (
    <div className="rounded-2xl border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.02)] p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="warning">CREATE_NEW</Badge>
        <ConfidenceBadge value={suggestion.confidenceLabel} />
        <Badge>{suggestion.fitScore ?? 0} fit score</Badge>
      </div>

      <form action={createAction} className="mt-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-sm font-medium text-white">Suggested Title</div>
            <input
              name="title"
              defaultValue={suggestion.suggestedTitle ?? ""}
              className="w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none"
            />
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-white">Suggested Scam Type</div>
            <input
              name="scamType"
              defaultValue={suggestion.suggestedScamType ?? ""}
              className="w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-white">Suggested Summary</div>
          <textarea
            name="summary"
            defaultValue={suggestion.suggestedSummary ?? ""}
            className="min-h-[120px] w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none"
          />
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-white">Risk Level</div>
          <select
            name="riskLevel"
            defaultValue={suggestion.suggestedRiskLevel ?? "MEDIUM"}
            className="w-full rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-white outline-none md:w-64"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>

        <ul className="space-y-2 text-sm text-[var(--avasc-text-secondary)]">
          {reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" />
              {reason}
            </li>
          ))}
        </ul>

        {canAct ? (
          <div className="flex flex-wrap gap-3">
            <ActionButton type="submit" variant="success">
              <Database className="mr-2 inline h-4 w-4" />
              Create New Cluster
            </ActionButton>
          </div>
        ) : (
          <p className="text-sm text-[var(--avasc-text-muted)]">
            This suggestion is not pending review (already accepted or rejected).
          </p>
        )}
      </form>

      {canAct ? (
        <form action={rejectAction} className="mt-3">
          <ActionButton type="submit" variant="danger">
            Reject Suggestion
          </ActionButton>
        </form>
      ) : null}
    </div>
  );
}

async function ForceAssignForm({
  caseId,
  clusterId,
}: {
  caseId: string;
  clusterId: string;
}) {
  async function action() {
    "use server";
    await forceAssignCaseToClusterAction({ caseId, clusterId });
  }

  return (
    <form action={action}>
      <ActionButton type="submit" variant="primary">
        Force Assign to Cluster
        <ArrowRight className="ml-2 inline h-4 w-4" />
      </ActionButton>
    </form>
  );
}

export default async function AdminCaseReviewProductionPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getAdminCaseReviewData(id);

  if (!data?.case) {
    return (
      <Container>
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-red-300">Case not found.</div>
      </Container>
    );
  }

  const reviewCase = data.case;
  const topSuggestion = data.topSuggestion;
  const topMatchedCluster = data.matchCandidates?.[0] ?? null;
  const suggestionPending = topSuggestion?.status === SuggestionStatus.PENDING;

  return (
    <Container>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/cases"
              className="inline-flex items-center gap-2 text-sm text-[var(--avasc-text-secondary)] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cases
            </Link>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Review Workflow
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {reviewCase.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--avasc-text-secondary)]">
              {reviewCase.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
            <Badge tone="gold">{reviewCase.status}</Badge>
            <Badge>{reviewCase.scamType}</Badge>
            {reviewCase.amountLost ? (
              <Badge>${Number(reviewCase.amountLost).toLocaleString()}</Badge>
            ) : null}
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Section
              title="Extracted Indicators"
              subtitle="Review normalized indicators, verify confidence, and decide which values remain private or become eligible for public-safe cluster aggregation later."
              icon={Search}
              actions={<ApproveAllHighConfidenceForm caseId={reviewCase.id} />}
            >
              <SaveIndicatorsForm
                caseId={reviewCase.id}
                indicators={reviewCase.indicators.map((indicator) => ({
                  id: indicator.id,
                  indicatorType: indicator.indicatorType,
                  rawValue: indicator.rawValue,
                  normalizedValue: indicator.normalizedValue,
                  confidenceScore: indicator.confidenceScore,
                  isVerified: indicator.isVerified,
                  isPublic: indicator.isPublic,
                }))}
              />
            </Section>

            <Section
              title="Suggested Decision"
              subtitle="Approve the matching engine recommendation, reject it, or create a new cluster from the suggestion."
              icon={Database}
            >
              {!topSuggestion ? (
                <div className="rounded-2xl border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.02)] p-5 text-sm text-[var(--avasc-text-secondary)]">
                  No cluster suggestion available yet. Recompute matching to generate one.
                </div>
              ) : topSuggestion.suggestionType === ClusterSuggestionType.ASSIGN_TO_EXISTING ? (
                <AssignSuggestionCard
                  caseId={reviewCase.id}
                  suggestion={{
                    id: topSuggestion.id,
                    suggestedClusterId: topSuggestion.suggestedClusterId,
                    fitScore: topSuggestion.fitScore,
                    confidenceLabel: topSuggestion.confidenceLabel as Confidence,
                    reasonsJson: topSuggestion.reasonsJson,
                  }}
                  cluster={
                    topMatchedCluster
                      ? {
                          id: topMatchedCluster.id,
                          title: topMatchedCluster.title,
                          scamType: topMatchedCluster.scamType,
                          riskLevel: topMatchedCluster.riskLevel as RiskLevel,
                          publicStatus: topMatchedCluster.publicStatus,
                        }
                      : null
                  }
                  canAct={suggestionPending}
                />
              ) : (
                <CreateClusterSuggestionCard
                  caseId={reviewCase.id}
                  suggestion={{
                    id: topSuggestion.id,
                    suggestedTitle: topSuggestion.suggestedTitle,
                    suggestedScamType: topSuggestion.suggestedScamType,
                    suggestedSummary: topSuggestion.suggestedSummary,
                    suggestedRiskLevel: (topSuggestion.suggestedRiskLevel as RiskLevel | null) ?? "MEDIUM",
                    fitScore: topSuggestion.fitScore,
                    confidenceLabel: topSuggestion.confidenceLabel as Confidence,
                    reasonsJson: topSuggestion.reasonsJson,
                  }}
                  canAct={suggestionPending}
                />
              )}
            </Section>

            <Section
              title="Force Assignment"
              subtitle="Use this only when you want to override the engine recommendation and directly link the case to the selected cluster."
              icon={AlertTriangle}
              actions={
                topMatchedCluster ? (
                  <ForceAssignForm caseId={reviewCase.id} clusterId={topMatchedCluster.id} />
                ) : undefined
              }
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[var(--avasc-border)] p-5">
                  <div className="text-sm text-[var(--avasc-text-secondary)]">Indicators extracted</div>
                  <div className="mt-2 text-3xl font-bold text-white">{reviewCase.indicators.length}</div>
                </div>
                <div className="rounded-2xl border border-[var(--avasc-border)] p-5">
                  <div className="text-sm text-[var(--avasc-text-secondary)]">Suggestions generated</div>
                  <div className="mt-2 text-3xl font-bold text-white">
                    {reviewCase.clusterSuggestions.length}
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--avasc-border)] p-5">
                  <div className="text-sm text-[var(--avasc-text-secondary)]">Top fit score</div>
                  <div className="mt-2 text-3xl font-bold text-white">{topSuggestion?.fitScore ?? 0}</div>
                </div>
              </div>
            </Section>
          </div>

          <div className="space-y-4">
            <Section
              title="Review Actions"
              subtitle="Recompute, reject all pending suggestions, or continue moderation."
              icon={RefreshCw}
              actions={
                <div className="flex flex-wrap gap-3">
                  <RecomputeForm caseId={reviewCase.id} />
                  <RejectAllSuggestionsForm caseId={reviewCase.id} />
                </div>
              }
            >
              <div className="text-sm leading-7 text-[var(--avasc-text-secondary)]">
                Recompute matching after changing indicators, correcting normalization, or updating narrative details.
              </div>
            </Section>

            <Section title="Case Metadata" subtitle="Operational context for this review." icon={ShieldCheck}>
              <div className="space-y-3 text-sm text-[var(--avasc-text-secondary)]">
                <div>
                  Case ID: <span className="text-white">{reviewCase.id}</span>
                </div>
                <div>
                  Created:{" "}
                  <span className="text-white">{new Date(reviewCase.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  Scam Type: <span className="text-white">{reviewCase.scamType}</span>
                </div>
                <div>
                  Status: <span className="text-white">{reviewCase.status}</span>
                </div>
              </div>
            </Section>

            <Section
              title="Safety Guardrails"
              subtitle="Keep moderation decisions privacy-safe and explainable."
              icon={AlertTriangle}
            >
              <ul className="space-y-3 text-sm text-[var(--avasc-text-secondary)]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" />
                  Review extracted indicators before marking anything public.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" />
                  Confirm exact-match clusters before force assignment.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" />
                  Keep victim-sensitive details private and redact where needed.
                </li>
              </ul>
            </Section>
          </div>
        </div>
      </div>
    </Container>
  );
}

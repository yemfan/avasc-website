import type {
  CaseIndicator,
  CaseStatus,
  ClusterSuggestion,
  MatchStrengthLabel,
  RiskLevel,
  SuggestionStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  decideClusterAssignment,
  scoreCaseAgainstClusters,
  type ClusterCandidate,
  type ClusterDecision,
  type ClusterMatchScore,
  type ParsedIndicator,
} from "@/lib/clustering/intake-cluster-engine";
import { loadCaseAsIntakeForEngine, loadClusterCandidatesForEngine } from "@/lib/clustering/process-case-for-matching";

export type RiskLevelUi = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ConfidenceUi = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ExtractedIndicatorDto = {
  id: string;
  type: string;
  rawValue: string;
  normalizedValue: string;
  confidenceScore: number;
  isVerified: boolean;
  isPublic: boolean;
};

export type MatchCandidateDto = {
  clusterId: string;
  title: string;
  scamType: string;
  riskLevel: RiskLevelUi;
  publicStatus: "DRAFT" | "INTERNAL" | "PUBLISHED";
  totalScore: number;
  confidenceLabel: ConfidenceUi;
  matchedIndicatorTypes: string[];
  reasons: string[];
};

export type ClusterSuggestionDto =
  | {
      suggestionType: "ASSIGN_TO_EXISTING";
      suggestedClusterId: string;
      fitScore: number;
      confidenceLabel: ConfidenceUi;
      reasons: string[];
    }
  | {
      suggestionType: "CREATE_NEW";
      suggestedTitle: string;
      suggestedScamType: string;
      suggestedSummary: string;
      suggestedRiskLevel: RiskLevelUi;
      fitScore: number;
      confidenceLabel: ConfidenceUi;
      reasons: string[];
    };

export type ReviewCaseDto = {
  id: string;
  title: string;
  scamType: string;
  summary: string;
  amountLost?: number;
  status: CaseStatus;
  createdAt: string;
  extractedIndicators: ExtractedIndicatorDto[];
  matchCandidates: MatchCandidateDto[];
  clusterSuggestion: ClusterSuggestionDto;
  /** Present when the suggestion row is persisted; required for approve/reject server actions. */
  latestSuggestionId: string | null;
  latestSuggestionStatus: SuggestionStatus | null;
};

function parseReasonsJson(value: ClusterSuggestion["reasonsJson"]): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.filter((x): x is string => typeof x === "string");
  }
  return [];
}

function riskToUi(r: RiskLevel): RiskLevelUi {
  return r as RiskLevelUi;
}

function strengthToUi(m: MatchStrengthLabel): ConfidenceUi {
  return m as ConfidenceUi;
}

function mapClusterPublicStatus(s: ClusterCandidate["publicStatus"]): "DRAFT" | "INTERNAL" | "PUBLISHED" {
  return s as "DRAFT" | "INTERNAL" | "PUBLISHED";
}

function indicatorsToParsedForScore(rows: CaseIndicator[]): ParsedIndicator[] {
  return rows.map((r) => ({
    type: r.indicatorType,
    rawValue: r.rawValue,
    normalizedValue: r.normalizedValue,
    confidence: r.confidenceScore != null ? Math.min(1, r.confidenceScore / 100) : 0.85,
  }));
}

function scoredToMatchCandidates(
  scored: ClusterMatchScore[],
  clusters: ClusterCandidate[]
): MatchCandidateDto[] {
  const byId = new Map(clusters.map((c) => [c.clusterId, c]));
  return scored.slice(0, 25).map((s) => {
    const c = byId.get(s.clusterId);
    const reasons = [...new Set([...s.reasons, ...s.matchedIndicators.map((m) => m.reason)])];
    return {
      clusterId: s.clusterId,
      title: c?.title ?? s.clusterId,
      scamType: c?.scamType ?? "",
      riskLevel: riskToUi(c?.riskLevel ?? "MEDIUM"),
      publicStatus: c ? mapClusterPublicStatus(c.publicStatus) : "DRAFT",
      totalScore: s.totalScore,
      confidenceLabel: s.confidenceLabel,
      matchedIndicatorTypes: s.matchedIndicatorTypes.map(String),
      reasons,
    };
  });
}

function decisionToDto(decision: ClusterDecision, bestMatchScore: number): ClusterSuggestionDto {
  if (decision.action === "ASSIGN_TO_EXISTING") {
    return {
      suggestionType: "ASSIGN_TO_EXISTING",
      suggestedClusterId: decision.clusterId,
      fitScore: decision.score.totalScore,
      confidenceLabel: decision.score.confidenceLabel,
      reasons: decision.score.reasons,
    };
  }
  return {
    suggestionType: "CREATE_NEW",
    suggestedTitle: decision.suggestedTitle,
    suggestedScamType: decision.suggestedScamType,
    suggestedSummary: decision.suggestedSummary,
    suggestedRiskLevel: riskToUi(decision.suggestedRiskLevel),
    fitScore: bestMatchScore,
    confidenceLabel: bestMatchScore >= 45 ? "MEDIUM" : "LOW",
    reasons: decision.reasons,
  };
}

function suggestionRowToDto(row: ClusterSuggestion): ClusterSuggestionDto {
  const reasons = parseReasonsJson(row.reasonsJson);
  const fit = row.fitScore ?? 0;
  const conf = strengthToUi(row.confidenceLabel);

  if (row.suggestionType === "ASSIGN_TO_EXISTING") {
    return {
      suggestionType: "ASSIGN_TO_EXISTING",
      suggestedClusterId: row.suggestedClusterId ?? "",
      fitScore: fit,
      confidenceLabel: conf,
      reasons: reasons.length ? reasons : ["Stored cluster assignment suggestion."],
    };
  }

  return {
    suggestionType: "CREATE_NEW",
    suggestedTitle: row.suggestedTitle ?? "",
    suggestedScamType: row.suggestedScamType ?? "",
    suggestedSummary: row.suggestedSummary ?? "",
    suggestedRiskLevel: row.suggestedRiskLevel ? riskToUi(row.suggestedRiskLevel) : "MEDIUM",
    fitScore: fit,
    confidenceLabel: conf,
    reasons: reasons.length ? reasons : ["Stored new-cluster suggestion."],
  };
}

export async function getCaseReviewWorkflowData(caseId: string): Promise<ReviewCaseDto | null> {
  const [caseRow, indicatorRows, latestSuggestion] = await Promise.all([
    prisma.case.findUnique({
      where: { id: caseId },
      select: {
        id: true,
        title: true,
        scamType: true,
        summary: true,
        amountLost: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.caseIndicator.findMany({
      where: { caseId },
      orderBy: [{ indicatorType: "asc" }, { createdAt: "asc" }],
    }),
    prisma.clusterSuggestion.findFirst({
      where: { caseId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!caseRow) return null;

  const intake = await loadCaseAsIntakeForEngine(caseId);
  const clusters = await loadClusterCandidatesForEngine();

  const parsedForScore = indicatorsToParsedForScore(indicatorRows);
  const scored =
    intake && parsedForScore.length > 0
      ? scoreCaseAgainstClusters(parsedForScore, intake, clusters)
      : [];

  const matchCandidates = scoredToMatchCandidates(scored, clusters);

  let clusterSuggestion: ClusterSuggestionDto;
  if (latestSuggestion) {
    clusterSuggestion = suggestionRowToDto(latestSuggestion);
  } else if (intake && parsedForScore.length > 0) {
    const decision = decideClusterAssignment(intake, parsedForScore, scored);
    clusterSuggestion = decisionToDto(decision, scored[0]?.totalScore ?? 0);
  } else {
    clusterSuggestion = {
      suggestionType: "CREATE_NEW",
      suggestedTitle: caseRow.title,
      suggestedScamType: caseRow.scamType,
      suggestedSummary: caseRow.summary.slice(0, 500),
      suggestedRiskLevel: "MEDIUM",
      fitScore: 0,
      confidenceLabel: "LOW",
      reasons: ["Add indicators or run the intake matching pipeline to generate a suggestion."],
    };
  }

  const amountLost = caseRow.amountLost != null ? Number(caseRow.amountLost) : undefined;

  const extractedIndicators: ExtractedIndicatorDto[] = indicatorRows.map((r) => ({
    id: r.id,
    type: r.indicatorType,
    rawValue: r.rawValue,
    normalizedValue: r.normalizedValue,
    confidenceScore: r.confidenceScore ?? 0,
    isVerified: r.isVerified,
    isPublic: r.isPublic,
  }));

  return {
    id: caseRow.id,
    title: caseRow.title,
    scamType: caseRow.scamType,
    summary: caseRow.summary,
    amountLost: Number.isFinite(amountLost) ? amountLost : undefined,
    status: caseRow.status,
    createdAt: new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(caseRow.createdAt),
    extractedIndicators,
    matchCandidates,
    clusterSuggestion,
    latestSuggestionId: latestSuggestion?.id ?? null,
    latestSuggestionStatus: latestSuggestion?.status ?? null,
  };
}

/**
 * Prisma-backed pipeline: parse case text → persist indicators → score clusters → cache matches → suggestions → optional auto-link.
 */

import {
  CaseStatus,
  ClusterSuggestionType,
  type IndicatorType,
  MatchStrengthLabel,
  Prisma,
  type PrismaClient,
  RiskLevel,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  decideClusterAssignment,
  extractIndicatorsFromText,
  scoreCaseAgainstClusters,
  type ClusterCandidate,
  type ClusterMatchScore,
  type IntakeCaseInput,
  type ParsedIndicator,
} from "./intake-cluster-engine";

/** Stricter than engine assign threshold: auto-link only at high confidence. */
const AUTO_LINK_MIN_TOTAL_SCORE = 120;

const MAX_CLUSTERS_TO_SCORE = 500;
const MAX_CLUSTER_SEED_CASES = 5;
const MAX_MATCH_CACHE_CLUSTER_ROWS = 10;

type DbClient = PrismaClient | Prisma.TransactionClient;

function decimalToNumber(value: Prisma.Decimal | null | undefined): number | null {
  if (value == null) return null;
  return typeof value === "object" && "toNumber" in value ? value.toNumber() : Number(value);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type ProcessCaseMatchingOptions = {
  /** Merged with regex-extracted indicators (deduped by type + normalized value). */
  supplementalIndicators?: ParsedIndicator[];
};

function mergeParsedIndicators(
  extracted: ParsedIndicator[],
  supplemental: ParsedIndicator[]
): ParsedIndicator[] {
  const map = new Map<string, ParsedIndicator>();
  const keyOf = (p: ParsedIndicator) => `${p.type}\0${p.normalizedValue}`;
  for (const p of extracted) {
    map.set(keyOf(p), p);
  }
  for (const p of supplemental) {
    const k = keyOf(p);
    const prev = map.get(k);
    if (!prev || p.confidence > prev.confidence) {
      map.set(k, p);
    }
  }
  return [...map.values()];
}

export async function processCaseForMatching(caseId: string, options?: ProcessCaseMatchingOptions) {
  const intake = await loadCaseAsIntake(prisma, caseId);
  if (!intake) {
    throw new Error(`Case not found: ${caseId}`);
  }

  const existingClusters = await loadClusterCandidates(prisma);
  const parsedIndicators = mergeParsedIndicators(
    extractIndicatorsFromText(intake),
    options?.supplementalIndicators ?? []
  );

  await prisma.$transaction(async (tx) => {
    await replaceCaseIndicators(tx, caseId, parsedIndicators);

    const scoredMatches = scoreCaseAgainstClusters(parsedIndicators, intake, existingClusters);

    await replaceCaseMatchCache(tx, caseId, scoredMatches);

    const decision = decideClusterAssignment(intake, parsedIndicators, scoredMatches);

    await replaceClusterSuggestions(tx, caseId, decision, scoredMatches);

    if (decision.action === "ASSIGN_TO_EXISTING" && decision.score.totalScore >= AUTO_LINK_MIN_TOTAL_SCORE) {
      await linkCaseToClusterInTransaction(tx, caseId, decision.clusterId);
      await recomputeClusterIndicatorAggregates(tx, decision.clusterId);

      await tx.case.update({
        where: { id: caseId },
        data: { status: CaseStatus.CLUSTERED },
      });
    } else {
      await tx.case.update({
        where: { id: caseId },
        data: { status: CaseStatus.PENDING_REVIEW },
      });
    }
  });

  return { success: true as const, caseId };
}

export async function recomputeOpenCases(limit = 50) {
  const cases = await prisma.case.findMany({
    where: {
      status: {
        in: [CaseStatus.NEW, CaseStatus.PENDING_REVIEW, CaseStatus.NEEDS_FOLLOW_UP],
      },
    },
    select: { id: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  for (const item of cases) {
    await processCaseForMatching(item.id);
  }

  return { processed: cases.length };
}

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

/** Admin review UI + scoring: same intake text as the pipeline without mutating. */
export async function loadCaseAsIntakeForEngine(caseId: string): Promise<IntakeCaseInput | null> {
  return loadCaseAsIntake(prisma, caseId);
}

/** Published cluster aggregates for heuristic scoring (read-only). */
export async function loadClusterCandidatesForEngine(): Promise<ClusterCandidate[]> {
  return loadClusterCandidates(prisma);
}

async function loadCaseAsIntake(db: DbClient, caseId: string): Promise<IntakeCaseInput | null> {
  const row = await db.case.findUnique({
    where: { id: caseId },
    select: {
      id: true,
      title: true,
      scamType: true,
      summary: true,
      fullNarrative: true,
      paymentMethod: true,
      initialContactChannel: true,
      amountLost: true,
    },
  });

  if (!row) return null;

  const description = [row.fullNarrative, row.summary].filter(Boolean).join("\n\n").trim() || row.summary;

  return {
    caseId: row.id,
    title: row.title,
    scamType: row.scamType,
    summary: row.summary,
    description,
    evidenceRaw: row.fullNarrative ?? undefined,
    contactMethod: row.initialContactChannel ?? row.paymentMethod ?? undefined,
    amountLost: decimalToNumber(row.amountLost),
  };
}

async function loadClusterCandidates(db: DbClient): Promise<ClusterCandidate[]> {
  const clusters = await db.scamCluster.findMany({
    take: MAX_CLUSTERS_TO_SCORE,
    orderBy: { updatedAt: "desc" },
    include: {
      indicatorAggregates: {
        select: {
          indicatorType: true,
          normalizedValue: true,
          isVerified: true,
          linkedCaseCount: true,
        },
      },
      _count: {
        select: {
          caseLinks: true,
        },
      },
    },
  });

  return clusters.map((cluster) => ({
    clusterId: cluster.id,
    title: cluster.title,
    scamType: cluster.scamType,
    riskLevel: cluster.riskLevel,
    publicStatus: cluster.publicStatus,
    reportCount: cluster._count.caseLinks,
    indicators: cluster.indicatorAggregates.map((i) => ({
      type: i.indicatorType,
      normalizedValue: i.normalizedValue,
      isVerified: i.isVerified,
      linkedCaseCount: i.linkedCaseCount,
    })),
  }));
}

// ---------------------------------------------------------------------------
// CaseIndicator
// ---------------------------------------------------------------------------

async function replaceCaseIndicators(
  tx: Prisma.TransactionClient,
  caseId: string,
  indicators: ParsedIndicator[]
) {
  await tx.caseIndicator.deleteMany({ where: { caseId } });

  if (indicators.length === 0) return;

  await tx.caseIndicator.createMany({
    data: indicators.map((indicator) => ({
      caseId,
      indicatorType: indicator.type,
      rawValue: indicator.rawValue,
      normalizedValue: indicator.normalizedValue,
      isPublic: false,
      isVerified: indicator.confidence >= 0.95,
      confidenceScore: Math.round(indicator.confidence * 100),
    })),
  });
}

// ---------------------------------------------------------------------------
// CaseMatchCache (case ↔ seed cases from scored clusters)
// ---------------------------------------------------------------------------

async function replaceCaseMatchCache(
  tx: Prisma.TransactionClient,
  caseId: string,
  matches: ClusterMatchScore[]
) {
  await tx.caseMatchCache.deleteMany({
    where: {
      OR: [{ sourceCaseId: caseId }, { targetCaseId: caseId }],
    },
  });

  if (matches.length === 0) return;

  for (const match of matches.slice(0, MAX_MATCH_CACHE_CLUSTER_ROWS)) {
    const seedLinks = await tx.scamClusterCase.findMany({
      where: { scamClusterId: match.clusterId },
      select: { caseId: true },
      take: MAX_CLUSTER_SEED_CASES,
    });

    for (const link of seedLinks) {
      if (link.caseId === caseId) continue;

      const totalScore = Math.round(Math.min(match.totalScore, 2_147_483_647));

      await tx.caseMatchCache.upsert({
        where: {
          sourceCaseId_targetCaseId: {
            sourceCaseId: caseId,
            targetCaseId: link.caseId,
          },
        },
        create: {
          sourceCaseId: caseId,
          targetCaseId: link.caseId,
          totalScore,
          strengthLabel: mapConfidenceToMatchStrength(match.confidenceLabel),
          matchedIndicatorTypes: match.matchedIndicatorTypes.map((t) => String(t)),
          matchedIndicatorsJson: toJson(match.matchedIndicators),
          reasonsJson: toJson(match.reasons),
          isVisibleToVictim: false,
          isVisiblePublicly: false,
        },
        update: {
          totalScore,
          strengthLabel: mapConfidenceToMatchStrength(match.confidenceLabel),
          matchedIndicatorTypes: match.matchedIndicatorTypes.map((t) => String(t)),
          matchedIndicatorsJson: toJson(match.matchedIndicators),
          reasonsJson: toJson(match.reasons),
        },
      });
    }
  }
}

function mapConfidenceToMatchStrength(label: ClusterMatchScore["confidenceLabel"]): MatchStrengthLabel {
  switch (label) {
    case "CRITICAL":
      return MatchStrengthLabel.CRITICAL;
    case "HIGH":
      return MatchStrengthLabel.HIGH;
    case "MEDIUM":
      return MatchStrengthLabel.MEDIUM;
    default:
      return MatchStrengthLabel.LOW;
  }
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

// ---------------------------------------------------------------------------
// ClusterSuggestion
// ---------------------------------------------------------------------------

async function replaceClusterSuggestions(
  tx: Prisma.TransactionClient,
  caseId: string,
  decision: ReturnType<typeof decideClusterAssignment>,
  scoredMatches: ClusterMatchScore[]
) {
  await tx.clusterSuggestion.deleteMany({ where: { caseId } });

  if (decision.action === "ASSIGN_TO_EXISTING") {
    const top = decision.score;

    const seedCaseIds = (
      await tx.scamClusterCase.findMany({
        where: { scamClusterId: decision.clusterId },
        select: { caseId: true },
        take: MAX_CLUSTER_SEED_CASES,
      })
    ).map((s) => s.caseId);

    await tx.clusterSuggestion.create({
      data: {
        caseId,
        suggestionType: ClusterSuggestionType.ASSIGN_TO_EXISTING,
        suggestedClusterId: decision.clusterId,
        fitScore: Math.round(Math.min(top.totalScore, 2_147_483_647)),
        confidenceLabel: mapConfidenceToMatchStrength(top.confidenceLabel),
        reasonsJson: toJson(top.reasons),
        seedCaseIds,
      },
    });
    return;
  }

  await tx.clusterSuggestion.create({
    data: {
      caseId,
      suggestionType: ClusterSuggestionType.CREATE_NEW,
      suggestedTitle: decision.suggestedTitle,
      suggestedScamType: decision.suggestedScamType,
      suggestedSummary: decision.suggestedSummary,
      suggestedRiskLevel: decision.suggestedRiskLevel as RiskLevel,
      fitScore: scoredMatches[0] ? Math.round(scoredMatches[0].totalScore) : 0,
      confidenceLabel: mapNewClusterConfidence(scoredMatches[0]?.totalScore ?? 0),
      reasonsJson: toJson(decision.reasons),
      seedCaseIds: [],
    },
  });
}

function mapNewClusterConfidence(score: number): MatchStrengthLabel {
  if (score >= 90) return MatchStrengthLabel.HIGH;
  if (score >= 45) return MatchStrengthLabel.MEDIUM;
  if (score >= 20) return MatchStrengthLabel.LOW;
  return MatchStrengthLabel.LOW;
}

// ---------------------------------------------------------------------------
// Cluster link + aggregate refresh
// ---------------------------------------------------------------------------

/** Shared with admin review actions — link a case to a curated cluster. */
export async function linkCaseToClusterInTransaction(
  tx: Prisma.TransactionClient,
  caseId: string,
  clusterId: string
) {
  await tx.scamClusterCase.upsert({
    where: {
      scamClusterId_caseId: {
        scamClusterId: clusterId,
        caseId,
      },
    },
    create: {
      scamClusterId: clusterId,
      caseId,
    },
    update: {},
  });
}

/** Rebuild `ClusterIndicatorAggregate` rows from member case indicators. */
export async function recomputeClusterIndicatorAggregates(tx: Prisma.TransactionClient, clusterId: string) {
  const links = await tx.scamClusterCase.findMany({
    where: { scamClusterId: clusterId },
    select: { caseId: true },
  });

  const caseIds = links.map((l) => l.caseId);

  await tx.clusterIndicatorAggregate.deleteMany({
    where: { scamClusterId: clusterId },
  });

  if (caseIds.length === 0) {
    await tx.scamCluster.update({
      where: { id: clusterId },
      data: {
        reportCountSnapshot: 0,
        publicIndicatorCount: 0,
      },
    });
    return;
  }

  const indicators = await tx.caseIndicator.findMany({
    where: { caseId: { in: caseIds } },
    select: {
      id: true,
      indicatorType: true,
      normalizedValue: true,
      rawValue: true,
      isVerified: true,
      isPublic: true,
      caseId: true,
    },
  });

  const grouped = new Map<
    string,
    {
      indicatorType: IndicatorType;
      normalizedValue: string;
      displayValue: string;
      occurrenceCount: number;
      linkedCaseIds: Set<string>;
      isVerified: boolean;
      isPublic: boolean;
      sourceIndicatorIds: string[];
    }
  >();

  for (const indicator of indicators) {
    const key = `${indicator.indicatorType}:${indicator.normalizedValue}`;
    const existing = grouped.get(key) ?? {
      indicatorType: indicator.indicatorType,
      normalizedValue: indicator.normalizedValue,
      displayValue: indicator.normalizedValue || indicator.rawValue,
      occurrenceCount: 0,
      linkedCaseIds: new Set<string>(),
      isVerified: false,
      isPublic: false,
      sourceIndicatorIds: [] as string[],
    };

    existing.occurrenceCount += 1;
    existing.linkedCaseIds.add(indicator.caseId);
    existing.isVerified = existing.isVerified || indicator.isVerified;
    existing.isPublic = existing.isPublic || indicator.isPublic;
    existing.sourceIndicatorIds.push(indicator.id);

    grouped.set(key, existing);
  }

  const rows = [...grouped.values()];
  if (rows.length > 0) {
    await tx.clusterIndicatorAggregate.createMany({
      data: rows.map((item) => ({
        scamClusterId: clusterId,
        indicatorType: item.indicatorType,
        normalizedValue: item.normalizedValue,
        displayValue: item.displayValue,
        occurrenceCount: item.occurrenceCount,
        linkedCaseCount: item.linkedCaseIds.size,
        isPublic: item.isPublic,
        isVerified: item.isVerified,
        sourceIndicatorIds: item.sourceIndicatorIds,
      })),
    });
  }

  await tx.scamCluster.update({
    where: { id: clusterId },
    data: {
      reportCountSnapshot: caseIds.length,
      publicIndicatorCount: rows.filter((g) => g.isPublic).length,
    },
  });
}

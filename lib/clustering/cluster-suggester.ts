import { IndicatorType, type PrismaClient } from "@prisma/client";
import type { CaseMatchResult } from "@/lib/matching";
import { scoreCaseMatches } from "@/lib/matching";
import {
  CLUSTER_ASSIGNMENT_MIN_SCORE,
  MIN_CLUSTER_SIZE_FOR_AUTO_SUGGESTION,
  MAX_NEIGHBORS_FOR_NEW_CLUSTER_GRAPH,
  STRONG_EDGE_THRESHOLD,
} from "./cluster-config";
import {
  mergeUndirectedEdges,
  computeConnectedComponents as computeGraphComponents,
  componentContainingSeed,
} from "./cluster-graph";
import { computeClusterFitFromMatches, riskLevelFromSignals, hasStrongIndicatorSignal } from "./cluster-scorer";
import {
  filterCaseIdsNotInAnyCluster,
  getLinkedClusterIdsForCase,
} from "./cluster-queries";
import { suggestClusterTitle, suggestSlugHint } from "./cluster-title-generator";
import { buildClusterSummaryText } from "./cluster-summary";
import { isStructuralClusterEdge, isUsableMatchEdge, modeString } from "./cluster-utils";
import type {
  CaseClusterFitResult,
  ClusterGraph,
  ClusterMetadata,
  ClusterSuggestionBundle,
  ExistingClusterAssignmentSuggestion,
  NewClusterSuggestion,
} from "./cluster-types";

type GraphEdge = { a: string; b: string; weight: number };

const MAX_MATCH_ROWS = 220;
const MAX_CLUSTERS_TO_SCORE = 40;

function sliceMatches(matches: CaseMatchResult[]): CaseMatchResult[] {
  return matches.filter(isUsableMatchEdge).slice(0, MAX_MATCH_ROWS);
}

/**
 * Build a case↔case graph for the given node set using matcher scores as edge weights.
 * By default only **structural** edges (`isStructuralClusterEdge`) are included so weak platform-only
 * links cannot define components — matcher output is reused; no duplicate indicator math.
 */
export async function buildClusterGraph(
  prisma: PrismaClient,
  caseIds: string[],
  minEdgeWeight: number,
  options?: { structuralEdgesOnly?: boolean }
): Promise<ClusterGraph> {
  const structuralEdgesOnly = options?.structuralEdgesOnly ?? true;
  const set = new Set(caseIds);
  const raw: { a: string; b: string; weight: number }[] = [];

  for (const cid of caseIds) {
    const matches = sliceMatches(
      await scoreCaseMatches(prisma, cid, {
        mode: "internal",
        includeLowConfidence: true,
        suppressNoisyPlatformOnly: false,
      })
    );
    for (const m of matches) {
      if (!set.has(m.matchedCaseId)) continue;
      if (m.totalScore < minEdgeWeight) continue;
      if (structuralEdgesOnly && !isStructuralClusterEdge(m)) continue;
      raw.push({ a: cid, b: m.matchedCaseId, weight: m.totalScore });
    }
  }

  return { nodeIds: [...set], edges: mergeUndirectedEdges(raw) };
}

export async function scoreCaseAgainstCluster(
  prisma: PrismaClient,
  caseId: string,
  clusterId: string
): Promise<CaseClusterFitResult> {
  const cluster = await prisma.scamCluster.findUnique({
    where: { id: clusterId },
    select: { id: true, title: true, slug: true, scamType: true },
  });
  if (!cluster) {
    throw new Error(`Cluster not found: ${clusterId}`);
  }

  const membership = await prisma.scamClusterCase.findFirst({
    where: { caseId, scamClusterId: clusterId },
    select: { id: true },
  });

  const memberRows = await prisma.scamClusterCase.findMany({
    where: { scamClusterId: clusterId },
    select: { caseId: true },
  });
  const memberIds = memberRows.map((r) => r.caseId).filter((id) => id !== caseId);

  const matches = sliceMatches(
    await scoreCaseMatches(prisma, caseId, {
      mode: "internal",
      includeLowConfidence: true,
      suppressNoisyPlatformOnly: false,
    })
  ).filter((m) => memberIds.includes(m.matchedCaseId));

  const members = await prisma.case.findMany({
    where: { id: { in: memberIds } },
    select: { id: true, title: true, summary: true },
  });

  const sourceCase = await prisma.case.findUnique({
    where: { id: caseId },
    select: { id: true, scamType: true, title: true, summary: true },
  });
  if (!sourceCase) throw new Error("Case not found");

  const fit = computeClusterFitFromMatches({
    sourceCase,
    cluster,
    matchesToMembers: matches,
    memberSummaries: members,
  });

  return {
    caseId,
    clusterId: cluster.id,
    clusterTitle: cluster.title,
    clusterSlug: cluster.slug,
    clusterScamType: cluster.scamType,
    fitScore: fit.fitScore,
    confidenceLabel: fit.confidenceLabel,
    matchedCaseCount: fit.matchedCaseCount,
    strongMatchCount: fit.strongMatchCount,
    matchedIndicatorTypes: fit.matchedIndicatorTypes,
    reasons: fit.reasons,
    publicReadiness: fit.publicReadiness,
    alreadyInCluster: !!membership,
  };
}

export async function generateClusterMetadata(
  prisma: PrismaClient,
  caseIds: string[]
): Promise<ClusterMetadata> {
  const cases = await prisma.case.findMany({
    where: { id: { in: caseIds } },
    select: { id: true, scamType: true },
  });
  const indicators = await prisma.caseIndicator.findMany({
    where: { caseId: { in: caseIds } },
    select: { indicatorType: true },
  });
  const types = [...new Set(indicators.map((i) => i.indicatorType))];
  const dominant = modeString(cases.map((c) => c.scamType));
  const title = suggestClusterTitle(dominant, types);
  const summary = buildClusterSummaryText({
    reportCount: cases.length,
    dominantScamType: dominant,
    indicatorTypes: types,
  });
  const maxEdge = await estimateMaxInternalEdge(prisma, caseIds);
  const risk = riskLevelFromSignals({
    reportCount: cases.length,
    hasTxOrWallet: types.includes(IndicatorType.WALLET) || types.includes(IndicatorType.TX_HASH),
    maxEdgeScore: maxEdge,
  });

  return {
    seedCaseIds: caseIds,
    suggestedTitle: title,
    suggestedScamType: dominant,
    suggestedSummary: summary,
    riskLevel: risk,
    dominantScamType: dominant,
    reportCount: cases.length,
  };
}

async function estimateMaxInternalEdge(prisma: PrismaClient, caseIds: string[]): Promise<number> {
  let max = 0;
  const set = new Set(caseIds);
  for (const cid of caseIds.slice(0, 8)) {
    const matches = sliceMatches(
      await scoreCaseMatches(prisma, cid, {
        mode: "internal",
        includeLowConfidence: true,
        suppressNoisyPlatformOnly: false,
      })
    );
    for (const m of matches) {
      if (!set.has(m.matchedCaseId)) continue;
      if (m.totalScore > max) max = m.totalScore;
    }
  }
  return max;
}

export async function suggestNewClusterFromCase(
  prisma: PrismaClient,
  caseId: string
): Promise<NewClusterSuggestion | null> {
  const linked = await prisma.scamClusterCase.findFirst({ where: { caseId } });
  if (linked) return null;

  const source = await prisma.case.findUnique({
    where: { id: caseId },
    select: { id: true, scamType: true, title: true, summary: true },
  });
  if (!source) return null;

  const allMatches = sliceMatches(
    await scoreCaseMatches(prisma, caseId, {
      mode: "internal",
      includeLowConfidence: true,
      suppressNoisyPlatformOnly: false,
    })
  );

  const strong = allMatches.filter(
    (m) => m.totalScore >= STRONG_EDGE_THRESHOLD && isStructuralClusterEdge(m)
  );
  const neighborIds = [...new Set(strong.map((m) => m.matchedCaseId))].slice(
    0,
    MAX_NEIGHBORS_FOR_NEW_CLUSTER_GRAPH
  );

  const seedPool = [caseId, ...neighborIds];
  const unclustered = await filterCaseIdsNotInAnyCluster(prisma, seedPool);
  if (!unclustered.includes(caseId)) return null;

  const graph = await buildClusterGraph(prisma, unclustered, STRONG_EDGE_THRESHOLD, {
    structuralEdgesOnly: true,
  });
  const components = computeGraphComponents(graph);
  const comp = componentContainingSeed(components, caseId);

  if (comp.length < MIN_CLUSTER_SIZE_FOR_AUTO_SUGGESTION) return null;

  const hasStrongEdge = graph.edges.some(
    (e) => comp.includes(e.a) && comp.includes(e.b) && e.weight >= STRONG_EDGE_THRESHOLD
  );
  if (!hasStrongEdge) return null;

  const meta = await generateClusterMetadata(prisma, comp);
  const reasons: string[] = [
    `Found ${comp.length} unclustered case(s) in the same connected component using structural matcher links only (edge ≥ ${STRONG_EDGE_THRESHOLD}; excludes weak platform-only chains).`,
    `Suggested draft title and summary are deterministic — edit before publishing.`,
    "Do not publish without staff review of indicators and victim safety.",
  ];

  const edgeHighlights = graph.edges
    .filter((e: GraphEdge) => comp.includes(e.a) && comp.includes(e.b))
    .sort((a: GraphEdge, b: GraphEdge) => b.weight - a.weight)
    .slice(0, 6)
    .map((e: GraphEdge) => ({ caseA: e.a, caseB: e.b, matchScore: e.weight }));

  const confidenceLabel =
    meta.reportCount >= 3 && hasStrongIndicatorSignal(
      (await prisma.caseIndicator.findMany({
        where: { caseId: { in: comp } },
        select: { indicatorType: true },
      })).map((i) => i.indicatorType)
    )
      ? "HIGH"
      : "MEDIUM";

  return {
    seedCaseIds: comp,
    suggestedTitle: meta.suggestedTitle,
    suggestedSlugHint: suggestSlugHint(meta.suggestedTitle),
    suggestedScamType: meta.suggestedScamType,
    suggestedSummary: meta.suggestedSummary,
    riskLevel: meta.riskLevel,
    confidenceLabel,
    reasons,
    publicReadiness: "internal_only",
    edgeHighlights,
  };
}

async function pickClusterCandidates(
  prisma: PrismaClient,
  caseId: string,
  caseScamType: string
): Promise<{ id: string; title: string; slug: string; scamType: string }[]> {
  const matches = sliceMatches(
    await scoreCaseMatches(prisma, caseId, {
      mode: "internal",
      includeLowConfidence: true,
      suppressNoisyPlatformOnly: false,
    })
  );
  const relatedCaseIds = matches.map((m) => m.matchedCaseId);

  const overlap = await prisma.scamClusterCase.findMany({
    where: { caseId: { in: relatedCaseIds } },
    select: { scamClusterId: true },
    distinct: ["scamClusterId"],
  });
  const overlapIds = overlap.map((o) => o.scamClusterId);

  const or: { id?: { in: string[] }; scamType?: string }[] = [{ scamType: caseScamType }];
  if (overlapIds.length) {
    or.unshift({ id: { in: overlapIds } });
  }

  return prisma.scamCluster.findMany({
    where: { OR: or },
    take: MAX_CLUSTERS_TO_SCORE,
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, slug: true, scamType: true },
  });
}

export async function getClusterSuggestionForCase(
  prisma: PrismaClient,
  caseId: string
): Promise<ClusterSuggestionBundle> {
  const row = await prisma.case.findUnique({
    where: { id: caseId },
    select: { id: true, scamType: true, title: true, summary: true },
  });
  if (!row) throw new Error("Case not found");

  const alreadyLinkedClusterIds = await getLinkedClusterIdsForCase(prisma, caseId);

  const candidates = await pickClusterCandidates(prisma, caseId, row.scamType);
  const seen = new Set<string>();
  const existingClusterSuggestions: ExistingClusterAssignmentSuggestion[] = [];

  for (const c of candidates) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    if (alreadyLinkedClusterIds.includes(c.id)) continue;

    const fit = await scoreCaseAgainstCluster(prisma, caseId, c.id);
    if (fit.matchedCaseCount === 0 && fit.fitScore < 5) continue;

    existingClusterSuggestions.push({
      clusterId: c.id,
      clusterTitle: c.title,
      clusterSlug: c.slug,
      clusterScamType: c.scamType,
      fitScore: fit.fitScore,
      confidenceLabel: fit.confidenceLabel,
      matchedCaseCount: fit.matchedCaseCount,
      strongMatchCount: fit.strongMatchCount,
      matchedIndicatorTypes: fit.matchedIndicatorTypes,
      reasons: fit.reasons,
      publicReadiness: fit.publicReadiness,
    });
  }

  existingClusterSuggestions.sort((a, b) => b.fitScore - a.fitScore);

  const newClusterSuggestion = await suggestNewClusterFromCase(prisma, caseId);

  const top = existingClusterSuggestions[0];
  const summaryLine =
    top && top.fitScore >= CLUSTER_ASSIGNMENT_MIN_SCORE
      ? `Best existing cluster fit: “${top.clusterTitle}” (score ${top.fitScore.toFixed(0)}, ${top.confidenceLabel}).`
      : newClusterSuggestion
        ? `No strong cluster assignment yet; ${newClusterSuggestion.seedCaseIds.length} unclustered case(s) may form a new cluster (review draft).`
        : "No strong automated cluster assignment or new-cluster candidate yet — refine indicators or link manually.";

  return {
    caseId: row.id,
    caseScamType: row.scamType,
    caseTitle: row.title,
    alreadyLinkedClusterIds,
    existingClusterSuggestions,
    newClusterSuggestion,
    summaryLine,
  };
}

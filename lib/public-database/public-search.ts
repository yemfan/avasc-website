import type { IndicatorType, Prisma, PrismaClient } from "@prisma/client";
import {
  normalizeAlias,
  normalizeDomain,
  normalizeEmail,
  normalizePhone,
  normalizePlatform,
  normalizeSocialHandle,
  normalizeTxHash,
  normalizeWallet,
} from "@/lib/matching/indicator-normalizers";
import { PUBLIC_CLUSTER_STATUS } from "./constants";
import {
  batchDominantCaseFields,
  batchPublicIndicatorPreviews,
  getClusterDateBounds,
} from "./public-search-batch";
import { normalizePublicRiskLevel } from "./public-risk";
import type {
  PublicScamProfileCard,
  PublicSearchMatchTier,
  PublicSearchParams,
} from "./public-profile-types";
import { publicSearchParamsSchema } from "./public-profile-types";

const MAX_IN_MEMORY = 400;

function candidateTypeToIndicatorType(t: string): IndicatorType {
  const m: Record<string, IndicatorType> = {
    email: "EMAIL",
    phone: "PHONE",
    domain: "DOMAIN",
    wallet: "WALLET",
    tx_hash: "TX_HASH",
    social_handle: "SOCIAL_HANDLE",
    alias: "ALIAS",
    app_platform: "PLATFORM",
    other: "ALIAS",
  };
  return m[t] ?? (t.toUpperCase() as IndicatorType);
}

function searchParamIndicatorToEnum(
  t: NonNullable<PublicSearchParams["indicatorType"]>
): IndicatorType {
  return candidateTypeToIndicatorType(t);
}

function buildIndicatorCandidatesFromQuery(q: string): { type: string; value: string }[] {
  const t = q.trim();
  if (!t) return [];

  const out: { type: string; value: string }[] = [];

  if (t.includes("@")) {
    out.push({ type: "email", value: normalizeEmail(t) });
  }

  if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,24}$/i.test(t)) {
    out.push({ type: "domain", value: normalizeDomain(t) });
  }

  if (/^(0x)?[a-fA-F0-9]{48,}$/.test(t) || /^(0x)?[a-fA-F0-9]{40,}$/.test(t)) {
    const w = normalizeWallet(t);
    out.push({ type: "wallet", value: w });
    out.push({ type: "tx_hash", value: normalizeTxHash(t) });
  }

  if (/^\+?[\d\s().-]{8,22}$/.test(t)) {
    out.push({ type: "phone", value: normalizePhone(t) });
  }

  out.push({ type: "social_handle", value: normalizeSocialHandle(t) });
  out.push({ type: "alias", value: normalizeAlias(t) });
  out.push({ type: "app_platform", value: normalizePlatform(t) });

  const seen = new Set<string>();
  return out.filter((o) => {
    if (!o.value) return false;
    const k = `${o.type}:${o.value}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function findClusterIdsByIndicatorQuery(
  prisma: PrismaClient,
  q: string,
  restrictType: IndicatorType | undefined
): Promise<Map<string, PublicSearchMatchTier>> {
  const map = new Map<string, PublicSearchMatchTier>();
  const candidates = buildIndicatorCandidatesFromQuery(q);
  if (candidates.length === 0) return map;

  const filtered = restrictType
    ? candidates.filter((c) => candidateTypeToIndicatorType(c.type) === restrictType)
    : candidates;
  if (filtered.length === 0) return map;

  const rows = await prisma.caseIndicator.findMany({
    where: {
      isPublic: true,
      OR: filtered.map((c) => ({
        indicatorType: candidateTypeToIndicatorType(c.type),
        normalizedValue: c.value,
      })),
    },
    select: { caseId: true },
    take: 600,
  });

  const caseIds = [...new Set(rows.map((r) => r.caseId))];
  if (caseIds.length === 0) return map;

  const links = await prisma.scamClusterCase.findMany({
    where: { caseId: { in: caseIds } },
    select: { scamClusterId: true },
  });

  const published = await prisma.scamCluster.findMany({
    where: {
      id: { in: [...new Set(links.map((l) => l.scamClusterId))] },
      publicStatus: PUBLIC_CLUSTER_STATUS,
    },
    select: { id: true },
  });
  const pubSet = new Set(published.map((p) => p.id));

  for (const l of links) {
    if (!pubSet.has(l.scamClusterId)) continue;
    if (!map.has(l.scamClusterId)) map.set(l.scamClusterId, "indicator_exact");
  }

  return map;
}

async function findClusterIdsByText(prisma: PrismaClient, q: string): Promise<Map<string, PublicSearchMatchTier>> {
  const map = new Map<string, PublicSearchMatchTier>();
  if (!q.trim()) return map;

  const rows = await prisma.scamCluster.findMany({
    where: {
      publicStatus: PUBLIC_CLUSTER_STATUS,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, title: true, summary: true, slug: true },
    take: 200,
  });

  const lower = q.toLowerCase();
  for (const r of rows) {
    let tier: PublicSearchMatchTier = "summary";
    if (r.title.toLowerCase().includes(lower)) tier = "title";
    else if (r.slug.toLowerCase().includes(lower)) tier = "slug";
    const prev = map.get(r.id);
    const rank = (t: PublicSearchMatchTier) =>
      t === "title" || t === "slug" ? 3 : t === "summary" ? 2 : 1;
    if (!prev || rank(tier) > rank(prev)) map.set(r.id, tier);
  }

  return map;
}

function mergeMatchMaps(
  a: Map<string, PublicSearchMatchTier>,
  b: Map<string, PublicSearchMatchTier>
): Map<string, PublicSearchMatchTier> {
  const rank = (t: PublicSearchMatchTier) => {
    switch (t) {
      case "indicator_exact":
        return 5;
      case "title":
        return 4;
      case "slug":
        return 3;
      case "summary":
        return 2;
      default:
        return 1;
    }
  };
  const out = new Map(a);
  for (const [id, tier] of b) {
    const prev = out.get(id);
    if (!prev || rank(tier) > rank(prev)) out.set(id, tier);
  }
  return out;
}

function scoreResult(
  tier: PublicSearchMatchTier,
  risk: ReturnType<typeof normalizePublicRiskLevel>,
  reportCount: number,
  updatedAt: Date
): number {
  const tierScore =
    tier === "indicator_exact"
      ? 1000
      : tier === "title"
        ? 220
        : tier === "slug"
          ? 180
          : tier === "summary"
            ? 110
            : 0;
  const riskBonus =
    risk === "CRITICAL" ? 40 : risk === "HIGH" ? 30 : risk === "MEDIUM" ? 15 : 5;
  const volume = Math.min(reportCount * 3, 60);
  const recency = Math.min(20, (Date.now() - updatedAt.getTime()) / (86400000 * 30));
  return tierScore + riskBonus + volume + (20 - recency);
}

function buildClusterWhereFromFilters(params: PublicSearchParams): Prisma.ScamClusterWhereInput {
  const w: Prisma.ScamClusterWhereInput = {
    publicStatus: PUBLIC_CLUSTER_STATUS,
  };

  if (params.scamType?.trim()) {
    w.scamType = { equals: params.scamType.trim(), mode: "insensitive" };
  }

  if (params.riskLevel) {
    w.riskLevel = params.riskLevel;
  }

  const caseScoped: Prisma.CaseWhereInput = {};
  if (params.paymentMethod?.trim()) {
    caseScoped.paymentMethod = { equals: params.paymentMethod.trim(), mode: "insensitive" };
  }
  if (params.platform?.trim()) {
    caseScoped.initialContactChannel = { equals: params.platform.trim(), mode: "insensitive" };
  }
  if (params.country?.trim()) {
    caseScoped.jurisdiction = { equals: params.country.trim(), mode: "insensitive" };
  }

  if (Object.keys(caseScoped).length > 0) {
    w.caseLinks = { some: { case: caseScoped } };
  }

  return w;
}

export type PublicSearchResult = {
  items: PublicScamProfileCard[];
  total: number;
  page: number;
  pageSize: number;
};

function excerpt(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function parseSearchParamsRecord(raw: Record<string, string | string[] | undefined>): PublicSearchParams {
  const flat: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    flat[k] = Array.isArray(v) ? v[0] : v;
  }
  return publicSearchParamsSchema.parse(flat);
}

function sortCards(
  cards: PublicScamProfileCard[],
  sort: PublicSearchParams["sort"],
  hasQuery: boolean
): PublicScamProfileCard[] {
  const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 } as const;
  const copy = [...cards];
  if (sort === "relevance" && hasQuery) {
    copy.sort((a, b) => b.relevanceScore - a.relevanceScore);
  } else if (sort === "risk") {
    copy.sort((a, b) => order[b.riskLevel] - order[a.riskLevel] || b.reportCount - a.reportCount);
  } else if (sort === "reports") {
    copy.sort((a, b) => b.reportCount - a.reportCount || b.lastUpdatedAt.localeCompare(a.lastUpdatedAt));
  } else {
    copy.sort((a, b) => b.lastUpdatedAt.localeCompare(a.lastUpdatedAt));
  }
  return copy;
}

/** Paginated / rich-card search driven by URL search params (Prisma). */
export async function searchPublicScamProfilesWithPrisma(
  prisma: PrismaClient,
  raw: Record<string, string | string[] | undefined>
): Promise<PublicSearchResult> {
  const params = parseSearchParamsRecord(raw);
  const q = params.q?.trim() ?? "";

  const baseWhere = buildClusterWhereFromFilters(params);

  let matchMap = new Map<string, PublicSearchMatchTier>();

  if (q.length > 0) {
    const textMap = await findClusterIdsByText(prisma, q);
    const indMap = await findClusterIdsByIndicatorQuery(
      prisma,
      q,
      params.indicatorType ? searchParamIndicatorToEnum(params.indicatorType) : undefined
    );
    matchMap = mergeMatchMaps(textMap, indMap);
    const ids = [...matchMap.keys()];
    if (ids.length === 0) {
      return { items: [], total: 0, page: params.page, pageSize: params.pageSize };
    }
    baseWhere.id = { in: ids };
  }

  const total = await prisma.scamCluster.count({ where: baseWhere });

  const select = {
    id: true,
    slug: true,
    title: true,
    scamType: true,
    riskLevel: true,
    summary: true,
    updatedAt: true,
    commonScript: true,
    _count: { select: { caseLinks: true } },
  } as const;

  let rows = [] as Array<{
    id: string;
    slug: string;
    title: string;
    scamType: string;
    riskLevel: string;
    summary: string;
    updatedAt: Date;
    commonScript: string | null;
    _count: { caseLinks: number };
  }>;

  const useDbPagination =
    q.length === 0 && (params.sort === "recent" || params.sort === "reports");

  if (useDbPagination) {
    const skip = (params.page - 1) * params.pageSize;
    rows = await prisma.scamCluster.findMany({
      where: baseWhere,
      select,
      orderBy:
        params.sort === "reports"
          ? { caseLinks: { _count: "desc" } }
          : { updatedAt: "desc" },
      skip,
      take: params.pageSize,
    });
  } else {
    rows = await prisma.scamCluster.findMany({
      where: baseWhere,
      select,
      take: MAX_IN_MEMORY,
      orderBy: { updatedAt: "desc" },
    });
  }

  const ids = rows.map((r) => r.id);
  const [bounds, previews, dominants] = await Promise.all([
    getClusterDateBounds(prisma, ids),
    batchPublicIndicatorPreviews(prisma, ids, 4),
    batchDominantCaseFields(prisma, ids),
  ]);

  const cards: PublicScamProfileCard[] = rows.map((c) => {
    const n = c._count.caseLinks;
    const risk = normalizePublicRiskLevel(c.riskLevel);
    const tier: PublicSearchMatchTier = matchMap.get(c.id) ?? "browse";
    const relevanceScore = scoreResult(tier, risk, n, c.updatedAt);
    const b = bounds.get(c.id);
    const dom = dominants.get(c.id);

    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      scamType: c.scamType,
      riskLevel: risk,
      summaryExcerpt: excerpt(c.summary, 220),
      reportCount: n,
      firstReportedAt: b?.first ?? null,
      lastReportedAt: b?.last ?? null,
      lastUpdatedAt: c.updatedAt.toISOString(),
      indicatorPreview: previews.get(c.id) ?? [],
      dominantPlatforms: dom?.platforms ?? [],
      dominantPaymentMethods: dom?.payments ?? [],
      relevanceScore,
      matchTier: tier,
    };
  });

  const sorted = useDbPagination ? cards : sortCards(cards, params.sort, q.length > 0);

  if (useDbPagination) {
    return {
      items: sorted,
      total,
      page: params.page,
      pageSize: params.pageSize,
    };
  }

  const start = (params.page - 1) * params.pageSize;
  const paged = sorted.slice(start, start + params.pageSize);

  return {
    items: paged,
    total,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export function isClusterPublic(cluster: { publicStatus: string }): boolean {
  return cluster.publicStatus === PUBLIC_CLUSTER_STATUS;
}

export { searchPublicScamProfiles } from "./public-scam-search";

import type { IndicatorType, PrismaClient } from "@prisma/client";
import { getPublicIndicatorDisplayValue } from "./public-indicator-display";

export async function getClusterDateBounds(
  prisma: PrismaClient,
  clusterIds: string[]
): Promise<Map<string, { first: string | null; last: string | null }>> {
  const out = new Map<string, { first: string | null; last: string | null }>();
  if (clusterIds.length === 0) return out;

  const rows = await prisma.scamClusterCase.findMany({
    where: { scamClusterId: { in: clusterIds } },
    select: {
      scamClusterId: true,
      case: { select: { createdAt: true } },
    },
  });

  for (const r of rows) {
    const d = r.case.createdAt;
    const cur = out.get(r.scamClusterId);
    if (!cur) {
      out.set(r.scamClusterId, { first: d.toISOString(), last: d.toISOString() });
    } else {
      const first = cur.first ? new Date(cur.first) : d;
      const last = cur.last ? new Date(cur.last) : d;
      if (d < first) cur.first = d.toISOString();
      if (d > last) cur.last = d.toISOString();
    }
  }
  return out;
}

/**
 * Up to `takePerCluster` masked indicator previews per cluster (deduped).
 */
export async function batchPublicIndicatorPreviews(
  prisma: PrismaClient,
  clusterIds: string[],
  takePerCluster: number
): Promise<Map<string, { type: IndicatorType; displayValue: string }[]>> {
  const map = new Map<string, { type: IndicatorType; displayValue: string }[]>();
  if (clusterIds.length === 0) return map;

  const links = await prisma.scamClusterCase.findMany({
    where: { scamClusterId: { in: clusterIds } },
    select: { scamClusterId: true, caseId: true },
  });

  const caseToClusters = new Map<string, string[]>();
  for (const l of links) {
    const arr = caseToClusters.get(l.caseId) ?? [];
    arr.push(l.scamClusterId);
    caseToClusters.set(l.caseId, arr);
  }

  const caseIds = [...caseToClusters.keys()];
  if (caseIds.length === 0) return map;

  const inds = await prisma.caseIndicator.findMany({
    where: {
      caseId: { in: caseIds },
      isPublic: true,
    },
    select: { caseId: true, indicatorType: true, normalizedValue: true },
    take: 2000,
  });

  for (const cid of clusterIds) {
    map.set(cid, []);
  }

  const seenPerCluster = new Map<string, Set<string>>();

  for (const ind of inds) {
    const clusters = caseToClusters.get(ind.caseId);
    if (!clusters) continue;
    const k = `${ind.indicatorType}::${ind.normalizedValue}`;
    for (const clusterId of clusters) {
      const list = map.get(clusterId) ?? [];
      if (list.length >= takePerCluster) continue;
      const seen = seenPerCluster.get(clusterId) ?? new Set<string>();
      if (seen.has(k)) continue;
      seen.add(k);
      seenPerCluster.set(clusterId, seen);
      list.push({
        type: ind.indicatorType,
        displayValue: getPublicIndicatorDisplayValue({
          indicatorType: ind.indicatorType,
          normalizedValue: ind.normalizedValue,
          displayValue: null,
          isPublic: true,
        }),
      });
      map.set(clusterId, list);
    }
  }

  return map;
}

/**
 * Dominant payment + platform strings from cases in clusters (for cards).
 */
export async function batchDominantCaseFields(
  prisma: PrismaClient,
  clusterIds: string[]
): Promise<
  Map<string, { payments: string[]; platforms: string[] }>
> {
  const out = new Map<string, { payments: Map<string, number>; platforms: Map<string, number> }>();
  if (clusterIds.length === 0) return new Map();

  const rows = await prisma.case.findMany({
    where: { clusterLinks: { some: { scamClusterId: { in: clusterIds } } } },
    select: {
      paymentMethod: true,
      initialContactChannel: true,
      clusterLinks: { select: { scamClusterId: true } },
    },
  });

  for (const r of rows) {
    for (const l of r.clusterLinks) {
      const cid = l.scamClusterId;
      let slot = out.get(cid);
      if (!slot) {
        slot = { payments: new Map(), platforms: new Map() };
        out.set(cid, slot);
      }
      if (r.paymentMethod?.trim()) {
        const k = r.paymentMethod.trim();
        slot.payments.set(k, (slot.payments.get(k) ?? 0) + 1);
      }
      if (r.initialContactChannel?.trim()) {
        const k = r.initialContactChannel.trim();
        slot.platforms.set(k, (slot.platforms.get(k) ?? 0) + 1);
      }
    }
  }

  const result = new Map<string, { payments: string[]; platforms: string[] }>();
  for (const [cid, v] of out) {
    const payments = [...v.payments.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([s]) => s)
      .slice(0, 3);
    const platforms = [...v.platforms.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([s]) => s)
      .slice(0, 3);
    result.set(cid, { payments, platforms });
  }
  return result;
}

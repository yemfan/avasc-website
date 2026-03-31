import { ClusterPublicStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { PublicDatabaseFiltersData } from "@/lib/public-database/public-search-types";

export async function getPublicDatabaseFilters(): Promise<PublicDatabaseFiltersData> {
  const [clusters, indicators] = await Promise.all([
    prisma.scamCluster.findMany({
      where: {
        publicStatus: ClusterPublicStatus.PUBLISHED,
      },
      select: {
        scamType: true,
        riskLevel: true,
      },
    }),
    prisma.clusterIndicatorAggregate.findMany({
      where: {
        isPublic: true,
        scamCluster: {
          publicStatus: ClusterPublicStatus.PUBLISHED,
        },
      },
      select: {
        indicatorType: true,
      },
    }),
  ]);

  const scamTypes = Array.from(new Set(clusters.map((c) => c.scamType))).sort();
  const riskLevels = Array.from(new Set(clusters.map((c) => c.riskLevel))).sort();
  const indicatorTypes = Array.from(new Set(indicators.map((i) => i.indicatorType))).sort();

  return {
    scamTypes,
    riskLevels,
    indicatorTypes,
  };
}

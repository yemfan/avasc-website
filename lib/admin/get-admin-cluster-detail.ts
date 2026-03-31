import { prisma } from "@/lib/prisma";

export async function getAdminClusterDetail(clusterId: string) {
  const record = await prisma.scamCluster.findUnique({
    where: { id: clusterId },
    include: {
      caseLinks: {
        include: {
          case: {
            select: {
              id: true,
              title: true,
              scamType: true,
              status: true,
              visibility: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  displayName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          linkedAt: "desc",
        },
      },
      indicatorAggregates: {
        orderBy: [{ indicatorType: "asc" }, { normalizedValue: "asc" }],
      },
    },
  });

  if (!record) return null;

  return {
    ...record,
    sourceMerges: [] as Array<{
      id: string;
      sourceClusterId: string;
      targetClusterId: string;
      interconnectScore: number;
      confidenceLabel: string;
      reasonsJson: unknown[];
      status: string;
      createdAt: Date;
      targetCluster: {
        id: string;
        title: string;
        scamType: string;
        publicStatus: string;
        riskLevel: string;
      };
    }>,
    targetMerges: [] as Array<{
      id: string;
      sourceClusterId: string;
      targetClusterId: string;
      interconnectScore: number;
      confidenceLabel: string;
      reasonsJson: unknown[];
      status: string;
      createdAt: Date;
      sourceCluster: {
        id: string;
        title: string;
        scamType: string;
        publicStatus: string;
        riskLevel: string;
      };
    }>,
  };
}

export type AdminClusterDetail = NonNullable<
  Awaited<ReturnType<typeof getAdminClusterDetail>>
>;

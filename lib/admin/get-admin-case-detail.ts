import { prisma } from "@/lib/prisma";

export async function getAdminCaseDetail(caseId: string) {
  const record = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      user: true,
      indicators: {
        orderBy: [{ indicatorType: "asc" }, { createdAt: "asc" }],
      },
      evidenceFiles: {
        orderBy: { createdAt: "desc" },
      },
      supportRequests: {
        include: {
          user: true,
          assignedTo: true,
        },
        orderBy: { createdAt: "desc" },
      },
      stories: {
        orderBy: { createdAt: "desc" },
      },
      clusterLinks: {
        include: {
          scamCluster: true,
        },
      },
    },
  });

  if (!record) return null;

  const allClusters = await prisma.scamCluster.findMany({
    orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      scamType: true,
      publicStatus: true,
      riskLevel: true,
    },
  });

  return {
    ...record,
    allClusters,
    clusterSuggestions: [] as Array<{
      id: string;
      suggestedCluster: {
        id: string;
        title: string;
        scamType: string;
        publicStatus: string;
        riskLevel: string;
      };
      createdAt: Date;
    }>,
    sourceMatches: [] as Array<{
      id: string;
      totalScore: number;
      computedAt: Date;
      targetCase: {
        id: string;
        title: string;
        scamType: string;
        status: (typeof record)["status"];
        visibility: (typeof record)["visibility"];
        createdAt: Date;
      };
    }>,
  };
}

export type AdminCaseDetail = NonNullable<Awaited<ReturnType<typeof getAdminCaseDetail>>>;

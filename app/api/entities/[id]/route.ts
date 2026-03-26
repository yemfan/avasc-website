import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

/** Public scam profile — indicators aggregated; case narratives only if public/anonymized. */
export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;

  const entity = await prisma.scamEntity.findUnique({
    where: { id },
    include: {
      caseLinks: {
        include: {
          case: {
            select: {
              id: true,
              title: true,
              scamType: true,
              visibility: true,
              narrativePublic: true,
              createdAt: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!entity) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const relatedCases = entity.caseLinks.map((l) => {
    const c = l.case;
    const safe =
      c.visibility === "public" || c.visibility === "anonymized"
        ? {
            id: c.id,
            title: c.title,
            scamType: c.scamType,
            summary: c.narrativePublic,
            createdAt: c.createdAt,
          }
        : {
            id: c.id,
            title: "Report on file (details restricted)",
            scamType: c.scamType,
            summary: null as string | null,
            createdAt: c.createdAt,
          };
    return safe;
  });

  return NextResponse.json({
    success: true,
    entity: {
      id: entity.id,
      type: entity.type,
      normalizedValue: entity.normalizedValue,
      riskScore: entity.riskScore,
      reportCount: entity.reportCount,
      lastSeenAt: entity.lastSeenAt,
    },
    relatedCases,
  });
}

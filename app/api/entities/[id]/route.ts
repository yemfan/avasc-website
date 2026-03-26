import { NextResponse } from "next/server";
import { getScamEntityPublicById } from "@/lib/db/entity-detail";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

/** Public scam profile — indicators aggregated; case narratives only if public/anonymized. */
export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;

  const raw = await getScamEntityPublicById(id);

  if (!raw) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const entity = raw;
  const relatedCases = (entity.caseLinks as { caseId: string; case: Record<string, unknown> }[]).map((l) => {
    const c = l.case;
    const visibility = c.visibility as string;
    const safe =
      visibility === "public" || visibility === "anonymized"
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

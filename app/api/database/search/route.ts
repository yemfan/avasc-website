import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceSupabase } from "@/lib/supabase/service-role";
import { normalizeIndicatorValue } from "@/lib/indicators";
import type { IndicatorType } from "@/lib/types/db";
import { INDICATOR_TYPES } from "@/lib/report/case-submission";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  q: z.string().max(200).optional(),
  type: z.enum(INDICATOR_TYPES).optional(),
  scamType: z.string().max(120).optional(),
});

/** Public search — aggregated entities only; case list filtered by scam type when provided. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    scamType: searchParams.get("scamType") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid query" }, { status: 400 });
  }

  const { q, type, scamType } = parsed.data;
  const term = q?.trim();
  const db = getServiceSupabase();

  let entityQuery = db
    .from("ScamEntity")
    .select("id, type, normalizedValue, riskScore, reportCount, lastSeenAt")
    .order("riskScore", { ascending: false })
    .order("reportCount", { ascending: false })
    .limit(50);

  if (type) {
    entityQuery = entityQuery.eq("type", type);
  }

  if (term) {
    const pattern =
      type && term
        ? `%${normalizeIndicatorValue(type as IndicatorType, term)}%`
        : `%${term.toLowerCase()}%`;
    entityQuery = entityQuery.ilike("normalizedValue", pattern);
  }

  const { data: entities, error: ee } = await entityQuery;
  if (ee) throw ee;

  let casesPreview: { id: string; title: string; scamType: string; createdAt: string }[] = [];
  if (scamType?.trim()) {
    const st = scamType.trim();
    const { data: cases, error: ce } = await db
      .from("Case")
      .select("id, title, scamType, createdAt")
      .ilike("scamType", st)
      .in("visibility", ["public", "anonymized"])
      .order("createdAt", { ascending: false })
      .limit(20);
    if (ce) throw ce;
    casesPreview = (cases ?? []) as typeof casesPreview;
  }

  return NextResponse.json({
    success: true,
    entities: entities ?? [],
    casesPreview,
  });
}

import { getServiceSupabase } from "@/lib/supabase/service-role";
import { normalizeIndicatorValue } from "@/lib/indicators";
import { riskScoreFromReportCount } from "@/lib/risk";
import { newRowId } from "@/lib/db/id";
import type { IndicatorType } from "@/lib/types/db";

/** Upsert `ScamEntity` rows and link them to a case once; refresh risk scores. */
export async function linkCaseIndicatorsToEntities(caseId: string) {
  const db = getServiceSupabase();
  const { data: indicators, error: ie } = await db.from("CaseIndicator").select("*").eq("caseId", caseId);
  if (ie) throw ie;

  for (const ind of indicators ?? []) {
    const normalized = normalizeIndicatorValue(ind.type as IndicatorType, ind.value as string);
    if (!normalized) continue;

    const { data: found } = await db
      .from("ScamEntity")
      .select("*")
      .eq("type", ind.type as string)
      .eq("normalizedValue", normalized)
      .maybeSingle();

    let entity = found;
    const now = new Date().toISOString();

    if (!entity) {
      const id = newRowId();
      const { data: created, error: ce } = await db
        .from("ScamEntity")
        .insert({
          id,
          type: ind.type as string,
          normalizedValue: normalized,
          reportCount: 0,
          riskScore: 0,
          lastSeenAt: now,
          createdAt: now,
          updatedAt: now,
        })
        .select()
        .single();
      if (ce) throw ce;
      entity = created;
    }

    if (!entity) continue;

    const { data: existingLink } = await db
      .from("CaseEntityLink")
      .select("caseId")
      .eq("caseId", caseId)
      .eq("entityId", entity.id as string)
      .maybeSingle();
    if (existingLink) continue;

    const { error: le } = await db.from("CaseEntityLink").insert({ caseId, entityId: entity.id as string });
    if (le) throw le;

    const prevCount = (entity.reportCount as number) ?? 0;
    const nextCount = prevCount + 1;
    const { error: ue1 } = await db
      .from("ScamEntity")
      .update({
        reportCount: nextCount,
        lastSeenAt: now,
        updatedAt: now,
      })
      .eq("id", entity.id as string);
    if (ue1) throw ue1;

    const { error: ue2 } = await db
      .from("ScamEntity")
      .update({ riskScore: riskScoreFromReportCount(nextCount) })
      .eq("id", entity.id as string);
    if (ue2) throw ue2;
  }
}

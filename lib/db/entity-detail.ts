import { getServiceSupabase } from "@/lib/supabase/service-role";

/** ScamEntity + caseLinks + Case rows (subset) for public entity page / API. */
export async function getScamEntityPublicById(entityId: string) {
  const db = getServiceSupabase();
  const { data: entity, error: ee } = await db.from("ScamEntity").select("*").eq("id", entityId).maybeSingle();
  if (ee || !entity) return null;

  const { data: links, error: le } = await db.from("CaseEntityLink").select("caseId").eq("entityId", entityId);
  if (le) throw le;
  const caseIds = [...new Set((links ?? []).map((l) => l.caseId))];
  if (!caseIds.length) {
    return { ...entity, caseLinks: [] as { caseId: string; case: Record<string, unknown> }[] };
  }

  const { data: cases, error: ce } = await db
    .from("Case")
    .select("id, title, scamType, visibility, narrativePublic, createdAt")
    .in("id", caseIds);
  if (ce) throw ce;
  const caseById = new Map((cases ?? []).map((row) => [row.id as string, row]));

  return {
    ...entity,
    caseLinks: caseIds
      .map((caseId) => {
        const row = caseById.get(caseId);
        if (!row) return null;
        return { caseId, case: row };
      })
      .filter(Boolean) as { caseId: string; case: Record<string, unknown> }[],
  };
}

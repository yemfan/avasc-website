import { getServiceSupabase } from "@/lib/supabase/service-role";

/** Loads Case + indicators + evidence + entity links + entities (Prisma `include` parity). */
export async function getCaseDetailById(caseId: string) {
  const db = getServiceSupabase();
  const { data: c, error: ce } = await db.from("Case").select("*").eq("id", caseId).maybeSingle();
  if (ce || !c) return null;

  const [indRes, evRes, linkRes] = await Promise.all([
    db.from("CaseIndicator").select("*").eq("caseId", caseId),
    db.from("EvidenceFile").select("*").eq("caseId", caseId),
    db.from("CaseEntityLink").select("caseId, entityId").eq("caseId", caseId),
  ]);

  if (indRes.error) throw indRes.error;
  if (evRes.error) throw evRes.error;
  if (linkRes.error) throw linkRes.error;

  const links = linkRes.data ?? [];
  const entityIds = [...new Set(links.map((l) => l.entityId))];
  let entities: Record<string, unknown>[] = [];
  if (entityIds.length) {
    const { data: ent, error: ee } = await db.from("ScamEntity").select("*").in("id", entityIds);
    if (ee) throw ee;
    entities = (ent ?? []) as Record<string, unknown>[];
  }
  const entityById = new Map(entities.map((e) => [e.id as string, e]));

  return {
    ...c,
    indicators: indRes.data ?? [],
    evidence: evRes.data ?? [],
    entityLinks: links
      .map((l) => {
        const entity = entityById.get(l.entityId);
        if (!entity) return null;
        return { caseId: l.caseId, entityId: l.entityId, entity };
      })
      .filter(Boolean) as { caseId: string; entityId: string; entity: Record<string, unknown> }[],
  };
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { linkCaseIndicatorsToEntities } from "@/lib/entity-linking";
import { normalizeIndicatorValue } from "@/lib/indicators";
import { getServiceSupabase } from "@/lib/supabase/service-role";
import { newRowId } from "@/lib/db/id";
import { createCaseBodySchema } from "@/lib/report/case-submission";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  await ensureAppUser(user);

  const db = getServiceSupabase();
  const { data: cases, error } = await db
    .from("Case")
    .select("id, title, scamType, status, visibility, supportRequested, createdAt")
    .eq("reporterUserId", user.id)
    .order("createdAt", { ascending: false });
  if (error) throw error;

  return NextResponse.json({ success: true, cases: cases ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const json = await req.json();
  const parsed = createCaseBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (user) await ensureAppUser(user);

  const reporterUserId = user?.id ?? null;
  const db = getServiceSupabase();
  const caseId = newRowId();
  const now = new Date().toISOString();

  const supportTypes = data.supportTypes ?? [];
  const supportRequested = data.supportRequested ?? supportTypes.length > 0;

  const { error: ce } = await db.from("Case").insert({
    id: caseId,
    reporterUserId,
    title: data.title,
    summaryShort: data.summaryShort ?? null,
    scamType: data.scamType,
    amountCents: data.amountCents ?? null,
    currency: data.currency ?? "USD",
    paymentMethod: data.paymentMethod ?? null,
    occurredAtStart: data.occurredAtStart ? data.occurredAtStart : null,
    occurredAtEnd: data.occurredAtEnd ? data.occurredAtEnd : null,
    narrativePrivate: data.narrativePrivate,
    narrativePublic: data.narrativePublic ?? null,
    initialContactChannel: data.initialContactChannel ?? null,
    jurisdictionCountry: data.jurisdictionCountry ?? null,
    jurisdictionState: data.jurisdictionState ?? null,
    allowFollowUp: data.allowFollowUp ?? true,
    allowLawEnforcementReferral: data.allowLawEnforcementReferral ?? false,
    allowCaseMatching: data.allowCaseMatching ?? true,
    allowAnonymizedPublicSearch: data.allowAnonymizedPublicSearch ?? false,
    storyVisibilityCandidate: data.storyVisibilityCandidate ?? false,
    visibility: data.visibility,
    supportRequested,
    supportTypes: supportTypes.length ? supportTypes : null,
    isAnonymousSubmit: data.isAnonymousSubmit ?? false,
    status: "submitted",
    createdAt: now,
    updatedAt: now,
  });
  if (ce) throw ce;

  if (data.indicators.length) {
    const rows = data.indicators.map((ind) => ({
      id: newRowId(),
      caseId,
      type: ind.type,
      value: normalizeIndicatorValue(ind.type, ind.value),
      rawValue: ind.value,
      createdAt: now,
    }));
    const { error: indErr } = await db.from("CaseIndicator").insert(rows);
    if (indErr) throw indErr;
  }

  if (reporterUserId && supportTypes.length > 0) {
    const supportRows = supportTypes.map((supportType) => ({
      id: newRowId(),
      userId: reporterUserId,
      caseId,
      supportType,
      status: "open",
      submittedNote: "Requested during report submission",
      notes: "Requested during report submission",
      createdAt: now,
      updatedAt: now,
    }));
    const { error: srErr } = await db.from("SupportRequest").insert(supportRows);
    if (srErr) throw srErr;
  }

  await linkCaseIndicatorsToEntities(caseId);

  return NextResponse.json({ success: true, caseId });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { linkCaseIndicatorsToEntities } from "@/lib/entity-linking";
import { normalizeIndicatorValue } from "@/lib/indicators";
import { getServiceSupabase } from "@/lib/supabase/service-role";
import { newRowId } from "@/lib/db/id";

export const dynamic = "force-dynamic";

const createCaseSchema = z.object({
  title: z.string().min(3).max(200),
  scamType: z.string().min(2).max(120),
  amountCents: z.number().int().nonnegative().optional(),
  currency: z.string().max(8).optional(),
  paymentMethod: z.string().max(120).optional(),
  occurredAtStart: z.string().datetime().optional(),
  occurredAtEnd: z.string().datetime().optional(),
  narrativePrivate: z.string().min(20).max(20000),
  narrativePublic: z.string().max(8000).optional(),
  visibility: z.enum(["private", "anonymized", "public"]).default("private"),
  supportRequested: z.boolean().optional(),
  isAnonymousSubmit: z.boolean().optional(),
  indicators: z
    .array(
      z.object({
        type: z.enum(["phone", "email", "domain", "wallet", "other"]),
        value: z.string().min(2).max(500),
      })
    )
    .max(50),
});

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
  const parsed = createCaseSchema.safeParse(json);
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

  const { error: ce } = await db.from("Case").insert({
    id: caseId,
    reporterUserId,
    title: data.title,
    scamType: data.scamType,
    amountCents: data.amountCents ?? null,
    currency: data.currency ?? "USD",
    paymentMethod: data.paymentMethod ?? null,
    occurredAtStart: data.occurredAtStart ? data.occurredAtStart : null,
    occurredAtEnd: data.occurredAtEnd ? data.occurredAtEnd : null,
    narrativePrivate: data.narrativePrivate,
    narrativePublic: data.narrativePublic ?? null,
    visibility: data.visibility,
    supportRequested: data.supportRequested ?? false,
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

  await linkCaseIndicatorsToEntities(caseId);

  return NextResponse.json({ success: true, caseId });
}

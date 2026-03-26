import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { getServiceSupabase } from "@/lib/supabase/service-role";
import { newRowId } from "@/lib/db/id";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  caseId: z.string().min(1),
  storageKey: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  await ensureAppUser(user);

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { caseId, storageKey, mimeType, sizeBytes } = parsed.data;

  if (!storageKey.startsWith(`evidence/${caseId}/`)) {
    return NextResponse.json({ success: false, error: "Invalid storage key" }, { status: 400 });
  }

  const db = getServiceSupabase();
  const { data: c, error: ce } = await db.from("Case").select("reporterUserId").eq("id", caseId).maybeSingle();
  if (ce) throw ce;
  if (!c || c.reporterUserId !== user.id) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const bucket = process.env.S3_BUCKET_AVASC ?? "unknown";
  const id = newRowId();
  const now = new Date().toISOString();

  const { data: file, error: fe } = await db
    .from("EvidenceFile")
    .insert({
      id,
      caseId,
      storageKey,
      bucket,
      mimeType,
      sizeBytes,
      createdAt: now,
    })
    .select("id")
    .single();
  if (fe) throw fe;

  return NextResponse.json({ success: true, evidenceId: file.id });
}

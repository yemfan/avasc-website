import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { prisma } from "@/lib/prisma";
import { presignEvidencePut } from "@/lib/s3";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  caseId: z.string().min(1),
  fileName: z.string().min(1).max(200),
  contentType: z.string().min(1).max(200),
  contentLength: z.number().int().positive().max(20 * 1024 * 1024),
});

export async function POST(req: Request) {
  if (!process.env.S3_BUCKET_AVASC) {
    return NextResponse.json(
      { success: false, error: "File uploads are not configured (S3_BUCKET_AVASC)." },
      { status: 503 }
    );
  }

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

  const { caseId, fileName, contentType, contentLength } = parsed.data;

  const c = await prisma.case.findUnique({ where: { id: caseId } });
  if (!c || c.reporterUserId !== user.id) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
  const key = `evidence/${caseId}/${randomUUID()}-${safeName}`;

  const uploadUrl = await presignEvidencePut({
    key,
    contentType,
    contentLength,
  });

  return NextResponse.json({
    success: true,
    uploadUrl,
    storageKey: key,
    bucket: process.env.S3_BUCKET_AVASC,
  });
}

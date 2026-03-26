import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { linkCaseIndicatorsToEntities } from "@/lib/entity-linking";
import { normalizeIndicatorValue } from "@/lib/indicators";
import { prisma } from "@/lib/prisma";

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

  const cases = await prisma.case.findMany({
    where: { reporterUserId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      scamType: true,
      status: true,
      visibility: true,
      supportRequested: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ success: true, cases });
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

  const created = await prisma.case.create({
    data: {
      reporterUserId,
      title: data.title,
      scamType: data.scamType,
      amountCents: data.amountCents,
      currency: data.currency ?? "USD",
      paymentMethod: data.paymentMethod,
      occurredAtStart: data.occurredAtStart ? new Date(data.occurredAtStart) : undefined,
      occurredAtEnd: data.occurredAtEnd ? new Date(data.occurredAtEnd) : undefined,
      narrativePrivate: data.narrativePrivate,
      narrativePublic: data.narrativePublic ?? null,
      visibility: data.visibility,
      supportRequested: data.supportRequested ?? false,
      isAnonymousSubmit: data.isAnonymousSubmit ?? false,
      status: "submitted",
    },
  });

  if (data.indicators.length) {
    await prisma.caseIndicator.createMany({
      data: data.indicators.map((ind) => ({
        caseId: created.id,
        type: ind.type,
        value: normalizeIndicatorValue(ind.type, ind.value),
        rawValue: ind.value,
      })),
    });
  }

  await linkCaseIndicatorsToEntities(created.id);

  return NextResponse.json({ success: true, caseId: created.id });
}

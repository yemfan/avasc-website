import { NextResponse } from "next/server";
import { z } from "zod";
import type { IndicatorType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeIndicatorValue } from "@/lib/indicators";

const querySchema = z.object({
  q: z.string().max(200).optional(),
  type: z.enum(["phone", "email", "domain", "wallet", "other"]).optional(),
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

  const where: Prisma.ScamEntityWhereInput = {};

  if (type) {
    where.type = type as IndicatorType;
  }

  if (term) {
    if (type) {
      const normalized = normalizeIndicatorValue(type as IndicatorType, term);
      where.normalizedValue = { contains: normalized, mode: "insensitive" };
    } else {
      where.normalizedValue = { contains: term.toLowerCase(), mode: "insensitive" };
    }
  }

  const entities = await prisma.scamEntity.findMany({
    where,
    orderBy: [{ riskScore: "desc" }, { reportCount: "desc" }],
    take: 50,
    select: {
      id: true,
      type: true,
      normalizedValue: true,
      riskScore: true,
      reportCount: true,
      lastSeenAt: true,
    },
  });

  let casesPreview: { id: string; title: string; scamType: string; createdAt: Date }[] = [];
  if (scamType?.trim()) {
    casesPreview = await prisma.case.findMany({
      where: {
        scamType: { equals: scamType.trim(), mode: "insensitive" },
        OR: [{ visibility: "public" }, { visibility: "anonymized" }],
      },
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        scamType: true,
        createdAt: true,
      },
    });
  }

  return NextResponse.json({
    success: true,
    entities,
    casesPreview,
  });
}

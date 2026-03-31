import { NextResponse } from "next/server";
import { searchPublicScamProfilesWithPrisma } from "@/lib/public-database";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * JSON API for programmatic search — same privacy rules as the public page (published clusters only).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw: Record<string, string | string[] | undefined> = {};
  searchParams.forEach((value, key) => {
    raw[key] = value;
  });

  try {
    const prisma = getPrisma();
    const result = await searchPublicScamProfilesWithPrisma(prisma, raw);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Search failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";

import { getPublicAlerts } from "@/lib/alerts/avasc-alert-section-api-and-loader";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type");
    const limitParam = searchParams.get("limit");

    const type =
      typeParam === "REALTIME" || typeParam === "DAILY"
        ? typeParam
        : undefined;

    const limit = limitParam ? Number(limitParam) : undefined;

    const items = await getPublicAlerts({
      type,
      limit,
    });

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to load alerts.",
      },
      { status: 500 }
    );
  }
}

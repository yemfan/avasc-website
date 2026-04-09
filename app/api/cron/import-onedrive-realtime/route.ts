import { NextResponse } from "next/server";

import { requireCronSecret } from "@/lib/alerts/cron-auth";
import { importOneDriveFeed } from "@/lib/feeds/onedrive-importer";

export async function GET(request: Request) {
  const denied = requireCronSecret(request);
  if (denied) return denied;

  const result = await importOneDriveFeed("REALTIME");
  return NextResponse.json({ success: true, ok: true, result });
}

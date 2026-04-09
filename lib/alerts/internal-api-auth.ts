import { NextResponse } from "next/server";

/**
 * Internal triggers (e.g. evaluate cluster for realtime alert). Send `Authorization: Bearer <INTERNAL_API_SECRET>`.
 */
export function requireInternalApiSecret(request: Request): NextResponse | null {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "INTERNAL_API_SECRET is not configured" }, { status: 500 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

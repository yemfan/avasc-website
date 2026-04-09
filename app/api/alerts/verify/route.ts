import { NextResponse } from "next/server";

/** Legacy verify links: subscriptions no longer use email tokens. */
export async function GET() {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return NextResponse.redirect(`${base}/alerts?verify=legacy`);
}

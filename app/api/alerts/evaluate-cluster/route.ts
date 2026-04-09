import { NextResponse } from "next/server";
import { evaluateClusterForAlert } from "@/lib/alerts/evaluate-cluster-for-alert";
import { requireInternalApiSecret } from "@/lib/alerts/internal-api-auth";

/**
 * Trigger realtime alert evaluation for a cluster (metrics persist, optional SMS broadcast).
 * `Authorization: Bearer $INTERNAL_API_SECRET`
 */
export async function POST(request: Request) {
  const denied = requireInternalApiSecret(request);
  if (denied) return denied;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const body = json as { clusterId?: unknown };
  const clusterId = typeof body.clusterId === "string" ? body.clusterId.trim() : "";

  if (!clusterId) {
    return NextResponse.json({ error: "clusterId required" }, { status: 400 });
  }

  try {
    const result = await evaluateClusterForAlert(clusterId);
    return NextResponse.json({ success: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message === "Cluster not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    throw e;
  }
}

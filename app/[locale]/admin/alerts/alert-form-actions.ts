"use server";

import { requireStaff } from "@/lib/admin/session";
import { canMutate, canPublishAlerts } from "@/lib/admin/permissions";
import { adminCreateAlert, adminPublishAlert } from "../_actions/alerts";

export async function submitCreateAlert(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role) || !canPublishAlerts(ctx.role)) return;

  await adminCreateAlert({
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    scamType: String(formData.get("scamType") ?? ""),
    severity: String(formData.get("severity") ?? "") || undefined,
  });
}

export async function submitPublishAlert(formData: FormData) {
  const ctx = await requireStaff();
  if (!canPublishAlerts(ctx.role)) return;

  const alertId = String(formData.get("alertId") ?? "");
  const published = String(formData.get("published") ?? "") === "true";
  await adminPublishAlert({ alertId, published });
}

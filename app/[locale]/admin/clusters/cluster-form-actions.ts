"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaff } from "@/lib/admin/session";
import { canMergeClusters, canMutate } from "@/lib/admin/permissions";
import {
  adminCreateCluster,
  adminMergeClusters,
  adminRemoveCaseFromCluster,
  adminUpdateCluster,
} from "../_actions/clusters";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function nullableText(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  if (typeof v !== "string" || !v.trim()) return null;
  return v;
}

export async function submitClusterEditor(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  await adminUpdateCluster({
    clusterId: str(formData, "clusterId"),
    title: str(formData, "title"),
    slug: str(formData, "slug"),
    scamType: str(formData, "scamType"),
    summary: str(formData, "summary"),
    riskLevel: str(formData, "riskLevel"),
    publicStatus: str(formData, "publicStatus"),
    commonScript: nullableText(formData, "commonScript"),
    redFlags: nullableText(formData, "redFlags"),
    safetyWarning: nullableText(formData, "safetyWarning"),
    recommendedNextStep: nullableText(formData, "recommendedNextStep"),
  });
}

export async function submitClusterMerge(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMergeClusters(ctx.role)) return;

  const sourceClusterId = String(formData.get("sourceClusterId") ?? "");
  const targetClusterId = String(formData.get("targetClusterId") ?? "");
  const res = await adminMergeClusters({ sourceClusterId, targetClusterId });
  if (res.ok) {
    redirect(`/admin/clusters/${targetClusterId}`);
  }
}

export async function submitRemoveCaseFromCluster(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const clusterId = String(formData.get("clusterId") ?? "");
  const caseId = String(formData.get("caseId") ?? "");
  await adminRemoveCaseFromCluster({ clusterId, caseId });
}

const createSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  scamType: z.string().min(1),
  summary: z.string().optional(),
  riskLevel: z.string().optional(),
});

export async function submitCreateCluster(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const parsed = createSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    scamType: String(formData.get("scamType") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    riskLevel: String(formData.get("riskLevel") ?? "") || undefined,
  });
  if (!parsed.success) return;

  await adminCreateCluster(parsed.data);
}

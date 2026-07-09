"use server";

import { SupportRequestStatus } from "@prisma/client";
import { z } from "zod";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import { adminUpdateSupportRequest } from "../_actions/support";

export async function submitSupportUpdate(formData: FormData) {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "").trim();
  const noteRaw = String(formData.get("note") ?? "");
  const assignedRaw = String(formData.get("assignedToId") ?? "").trim();

  const payload: {
    id: string;
    status?: SupportRequestStatus;
    note?: string | null;
    assignedToId?: string | null;
  } = { id };

  if (status.length) {
    const parsedStatus = z.nativeEnum(SupportRequestStatus).safeParse(status);
    if (parsedStatus.success) payload.status = parsedStatus.data;
  }
  payload.note = noteRaw.length ? noteRaw : null;

  if (assignedRaw.length === 0) {
    payload.assignedToId = null;
  } else {
    const p = z.string().uuid().safeParse(assignedRaw);
    if (p.success) payload.assignedToId = p.data;
  }

  await adminUpdateSupportRequest(payload);
}

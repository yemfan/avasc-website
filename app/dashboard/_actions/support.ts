"use server";

import { revalidatePath } from "next/cache";
import { createSupportRequest, createSupportRequestSchema, requireAuthUser } from "@/lib/victim-dashboard";

export async function submitSupportRequestAction(input: unknown) {
  const user = await requireAuthUser();
  const parsed = createSupportRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Please check the form fields." };
  }
  try {
    await createSupportRequest(user.id, parsed.data);
    revalidatePath("/dashboard/support");
    revalidatePath("/dashboard");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Could not submit request." };
  }
}

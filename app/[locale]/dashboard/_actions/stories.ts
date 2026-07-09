"use server";

import { revalidatePath } from "next/cache";
import { requireAuthUser, saveUserStory, saveStorySchema } from "@/lib/victim-dashboard";

export async function saveStoryAction(input: unknown) {
  const user = await requireAuthUser();
  const parsed = saveStorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }
  try {
    const id = await saveUserStory(user.id, parsed.data);
    revalidatePath("/dashboard/stories");
    revalidatePath("/dashboard");
    return { ok: true as const, id };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Could not save story." };
  }
}

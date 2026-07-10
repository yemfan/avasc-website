"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import { getPrisma } from "@/lib/prisma";

export type SaveTranslationResult = { ok: true } | { ok: false; error: string };

const fieldsZ = z.record(z.string(), z.string());

/**
 * Save a human-authored native translation for a ContentTranslation row.
 * Pins it (`isHuman = true`) so the machine translator never overwrites it, and
 * clears the `stale` flag. The English `sourceHash` is left untouched so that a
 * later change to the English source re-flags this row for review.
 */
export async function saveHumanTranslationAction(
  id: string,
  fields: Record<string, string>
): Promise<SaveTranslationResult> {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return { ok: false, error: "You don't have permission to edit translations." };

  const parsed = fieldsZ.safeParse(fields);
  if (!parsed.success) return { ok: false, error: "Invalid translation fields." };

  const prisma = getPrisma();
  try {
    await prisma.contentTranslation.update({
      where: { id },
      data: { fields: parsed.data, isHuman: true, stale: false },
    });
  } catch {
    return { ok: false, error: "Could not save — the translation row may no longer exist." };
  }

  revalidatePath("/admin/translations");
  revalidatePath(`/admin/translations/${id}`);
  return { ok: true };
}

/**
 * Revert a human-authored row back to the machine track: unpin it and mark it
 * stale so the next public view in that locale re-generates a fresh machine
 * translation from the current English source.
 */
export async function revertToMachineAction(id: string): Promise<SaveTranslationResult> {
  const ctx = await requireStaff();
  if (!canMutate(ctx.role)) return { ok: false, error: "You don't have permission to edit translations." };

  const prisma = getPrisma();
  try {
    await prisma.contentTranslation.update({
      where: { id },
      // Force a re-translate on next view by breaking the source-hash match.
      data: { isHuman: false, stale: false, sourceHash: "reverted" },
    });
  } catch {
    return { ok: false, error: "Could not revert — the translation row may no longer exist." };
  }

  revalidatePath("/admin/translations");
  revalidatePath(`/admin/translations/${id}`);
  return { ok: true };
}

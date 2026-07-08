import { prisma } from "@/lib/prisma";

const AUTOPILOT_KEY = "social_autopilot";

/**
 * Social auto-post mode. Default false = APPROVAL required (the safe default —
 * the daily cron generates a draft that staff approve before it posts).
 * true = autopilot (posts automatically).
 */
export async function getSocialAutopilot(): Promise<boolean> {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: AUTOPILOT_KEY } });
    return row?.value === true;
  } catch {
    return false;
  }
}

export async function setSocialAutopilot(on: boolean): Promise<void> {
  await prisma.appSetting.upsert({
    where: { key: AUTOPILOT_KEY },
    create: { key: AUTOPILOT_KEY, value: on },
    update: { value: on },
  });
}

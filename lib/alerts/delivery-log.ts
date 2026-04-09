import type { Prisma, PrismaClient } from "@prisma/client";
import type { AlertChannel } from "@prisma/client";

export type DeliveryLogInput = {
  alertId: string;
  subscriptionId: string;
  channel: AlertChannel;
  /** Typically `SENT` or `FAILED` (per schema contract). */
  status: string;
  providerMessageId?: string | null;
  errorMessage?: string | null;
};

export async function createDeliveryLog(
  prisma: PrismaClient | Prisma.TransactionClient,
  input: DeliveryLogInput
): Promise<void> {
  await prisma.alertDeliveryLog.create({
    data: {
      alertId: input.alertId,
      subscriptionId: input.subscriptionId,
      channel: input.channel,
      status: input.status,
      providerMessageId: input.providerMessageId ?? null,
      errorMessage: input.errorMessage ?? null,
    },
  });
}

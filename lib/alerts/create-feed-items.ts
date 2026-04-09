import { prisma } from "@/lib/prisma";

export async function createAlertFeedItem(args: {
  subscriptionId: string;
  alertId?: string;
  scamClusterId?: string;
  title: string;
  message: string;
  alertType: string;
  channel: string;
}) {
  await prisma.userAlertFeedItem.create({
    data: {
      subscriptionId: args.subscriptionId,
      alertId: args.alertId ?? null,
      scamClusterId: args.scamClusterId ?? null,
      title: args.title,
      message: args.message,
      alertType: args.alertType,
      channel: args.channel,
      isRead: false,
    },
  });
}

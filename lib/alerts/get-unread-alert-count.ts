import { getUserAlertUnreadCount } from "@/lib/alerts/get-user-alert-center";

export async function getUnreadAlertCount(subscriptionId: string) {
  return getUserAlertUnreadCount(subscriptionId);
}

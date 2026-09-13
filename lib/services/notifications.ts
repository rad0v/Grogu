/** Mock notifications service. */

import { useGroguStore } from "@/lib/store/grogu-store";

export async function markRead(id: string): Promise<void> {
  useGroguStore.getState().markNotificationRead(id);
}

export async function markAllRead(userId: string): Promise<void> {
  useGroguStore.getState().markAllNotificationsRead(userId);
}

import { apiFetch } from '@/lib/api';

export type AppNotification = {
  id: string;
  type: string;
  titre: string;
  corps: string | null;
  data: Record<string, unknown> | null;
  est_lue: boolean;
  lue_at: string | null;
  created_at: string;
};

export async function fetchNotifications(
  token: string,
  opts?: { limit?: number; unreadOnly?: boolean },
): Promise<{ items: AppNotification[]; unread_count: number }> {
  const qs = new URLSearchParams();
  if (opts?.limit) qs.set('limit', String(opts.limit));
  if (opts?.unreadOnly) qs.set('unread', '1');
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch(`/api/notifications${suffix}`, { method: 'GET', token });
}

export async function fetchUnreadCount(token: string): Promise<number> {
  const res = await apiFetch<{ unread_count: number }>('/api/notifications/unread-count', {
    method: 'GET',
    token,
  });
  return res.unread_count ?? 0;
}

export async function markNotificationRead(token: string, notificationId: string): Promise<void> {
  await apiFetch(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
    token,
    jsonBody: {},
  });
}

export async function markAllNotificationsRead(token: string): Promise<void> {
  await apiFetch('/api/notifications/read-all', {
    method: 'PATCH',
    token,
    jsonBody: {},
  });
}

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';

import { getSessionToken } from '@/lib/auth';
import { fetchUnreadCount } from '@/lib/notifications-api';

/**
 * Compteur de notifications non lues.
 *
 * - Rafraîchi à chaque focus écran
 * - Rafraîchi automatiquement toutes les 45 secondes
 * - Rafraîchi instantanément quand une notification push est reçue en foreground
 */
export function useUnreadNotifications() {
  const [count, setCount] = useState(0);
  const listenerRef = useRef<Notifications.EventSubscription | null>(null);

  const refresh = useCallback(async () => {
    try {
      const token = await getSessionToken();
      if (!token) {
        setCount(0);
        return;
      }
      setCount(await fetchUnreadCount(token));
    } catch {
      setCount(0);
    }
  }, []);

  // Rafraîchir quand une notification arrive en foreground
  useEffect(() => {
    listenerRef.current = Notifications.addNotificationReceivedListener(() => {
      void refresh();
    });
    return () => {
      listenerRef.current?.remove();
    };
  }, [refresh]);

  // Rafraîchir à chaque focus + polling 45s
  useFocusEffect(
    useCallback(() => {
      void refresh();
      const id = setInterval(() => void refresh(), 45000);
      return () => clearInterval(id);
    }, [refresh]),
  );

  return { unreadCount: count, refreshUnread: refresh };
}

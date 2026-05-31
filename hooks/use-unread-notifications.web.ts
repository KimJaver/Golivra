import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { getSessionToken } from '@/lib/auth';
import { fetchUnreadCount } from '@/lib/notifications-api';

/** Web : pas de listener push natif ; compteur via API au focus. */
export function useUnreadNotifications() {
  const [count, setCount] = useState(0);

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

  useFocusEffect(
    useCallback(() => {
      void refresh();
      const id = setInterval(() => void refresh(), 45000);
      return () => clearInterval(id);
    }, [refresh]),
  );

  return { unreadCount: count, refreshUnread: refresh };
}

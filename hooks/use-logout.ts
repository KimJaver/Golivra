import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { logoutLocal } from '@/lib/auth';
import { saveCart } from '@/lib/cart-local';
import { navigateToAuthAfterLogout } from '@/lib/app-navigation';

type Options = {
  /** Vide aussi le panier local (client). */
  clearCart?: boolean;
};

export function useLogout(options: Options = { clearCart: true }) {
  const [loggingOut, setLoggingOut] = useState(false);

  const performLogout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await logoutLocal();
      if (options.clearCart !== false) {
        await saveCart(null);
      }
      navigateToAuthAfterLogout();
    } catch {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Déconnexion', 'Impossible de se déconnecter. Réessayez.');
    } finally {
      setLoggingOut(false);
    }
  }, [loggingOut, options.clearCart]);

  const confirmLogout = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se déconnecter', style: 'destructive', onPress: () => void performLogout() },
      ],
      { cancelable: true },
    );
  }, [performLogout]);

  return { confirmLogout, performLogout, loggingOut };
}

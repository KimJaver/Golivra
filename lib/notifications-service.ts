/**
 * Service de notifications push GoLivra.
 *
 * Gère :
 *  - La demande de permission (iOS + Android 13+)
 *  - La récupération et l'enregistrement du token Expo Push
 *  - L'écoute des notifications reçues (foreground) et des taps (background / killed)
 *  - La navigation après tap
 *
 * Usage :
 *   import { initializeNotifications, setupNotificationListeners } from '@/lib/notifications-service';
 */

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { router } from 'expo-router';

import { registerPushToken } from '@/lib/push-token-api';
import { hrefCourierMission } from '@/lib/courier-nav';
import { VENDOR_HREF } from '@/lib/vendor-nav';

// ─── Handler foreground ───────────────────────────────────────────────────────
// Configure comment afficher les notifs quand l'app est au premier plan.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

// ─── Permission ───────────────────────────────────────────────────────────────

/**
 * Demande la permission pour les notifications (iOS + Android 13+).
 * Vérifie d'abord le statut existant pour ne pas afficher le dialog inutilement.
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return 'granted';

    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowDisplayInCarPlay: false,
        allowCriticalAlerts: false,
        allowAnnouncements: false,
      },
    });

    return status as NotificationPermissionStatus;
  } catch (err) {
    console.warn('[notifications] requestPermission error:', err);
    return 'denied';
  }
}

// ─── Token ────────────────────────────────────────────────────────────────────

/**
 * Récupère le token Expo Push pour cet appareil.
 * Ne fonctionne que sur un appareil physique (pas sur émulateur).
 *
 * @returns ExponentPushToken[xxx] ou null si indisponible
 */
export async function getExpoPushToken(): Promise<string | null> {
  // Les push ne fonctionnent pas sur web ou simulateur
  if (Platform.OS === 'web') return null;

  try {
    const projectId: string | undefined =
      Constants.expoConfig?.extra?.eas?.projectId ??
      (Constants.easConfig as { projectId?: string } | undefined)?.projectId;

    if (!projectId) {
      console.warn('[notifications] projectId EAS introuvable — token impossible sans build EAS ou Expo Go connecté.');
    }

    const { data } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    return data;
  } catch (err) {
    // Sur simulateur, cette erreur est normale
    console.warn('[notifications] getExpoPushToken error (normal sur simulateur):', err);
    return null;
  }
}

// ─── Android channel ──────────────────────────────────────────────────────────

/**
 * Crée le channel Android par défaut.
 * Sans channel, les notifications ne s'affichent pas sur Android 8+.
 */
async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('golivra-default', {
    name: 'GoLivra',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#0E86D4',
    sound: 'default',
    enableVibrate: true,
    showBadge: true,
  });
}

// ─── Initialisation ───────────────────────────────────────────────────────────

/**
 * Initialise complètement le système de notifications push.
 *
 * Séquence :
 *  1. Créer le channel Android
 *  2. Demander la permission
 *  3. Récupérer le token Expo
 *  4. Enregistrer le token dans le backend
 *
 * @returns Le statut de permission final
 */
export async function initializeNotifications(): Promise<NotificationPermissionStatus> {
  // 1. Channel Android (no-op sur iOS)
  await ensureAndroidChannel();

  // 2. Permission
  const permission = await requestNotificationPermission();

  if (permission !== 'granted') {
    console.log('[notifications] Permission refusée:', permission);
    return permission;
  }

  console.log('[notifications] ✅ Permission accordée');

  // 3. Token
  const token = await getExpoPushToken();

  if (!token) {
    console.log('[notifications] ⚠️ Pas de token (simulateur ou erreur réseau)');
    return permission;
  }

  console.log('[notifications] 📱 Token obtenu:', token);

  // 4. Enregistrement backend (fire-and-forget)
  void (async () => {
    try {
      await registerPushToken(token, Platform.OS as 'ios' | 'android' | 'web');
      console.log('[notifications] ✅ Token enregistré dans le backend');
    } catch (err) {
      console.warn('[notifications] ❌ Erreur enregistrement token:', err);
    }
  })();

  return permission;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

type NotifData = Record<string, unknown> | null | undefined;

function getAction(data: NotifData): string | null {
  if (!data || typeof data !== 'object') return null;
  const a = (data as { action?: unknown }).action;
  return typeof a === 'string' ? a : null;
}

function getLivraisonId(data: NotifData): string | null {
  if (!data || typeof data !== 'object') return null;
  const id = (data as { livraison_id?: unknown }).livraison_id;
  return typeof id === 'string' ? id : null;
}

/**
 * Navigue vers le bon écran en fonction des données de la notification.
 * Appelé lors d'un tap sur une notification (background ou killed).
 */
export function handleNotificationNavigation(data: NotifData): void {
  const action = getAction(data);

  if (action === 'open_delivery') {
    const livId = getLivraisonId(data);
    if (livId) {
      router.push(hrefCourierMission(livId));
      return;
    }
    router.push('/courier/missions');
    return;
  }

  if (action === 'courier_missions') {
    router.push('/courier/missions');
    return;
  }

  if (action === 'vendor_orders') {
    router.push(VENDOR_HREF.ordersTab);
    return;
  }

  if (action === 'open_orders') {
    router.push('/(tabs)/explore');
    return;
  }

  // Fallback
  router.push('/notifications');
}

// ─── Listeners ────────────────────────────────────────────────────────────────

/**
 * Configure les listeners de notifications.
 *
 * - `onReceived` : appelé quand une notification arrive en foreground
 * - `onResponse` : appelé quand l'utilisateur tape sur une notification
 *                  (app en background ou killed)
 *
 * @returns Fonction de nettoyage (à appeler dans le useEffect cleanup)
 */
export function setupNotificationListeners(
  onReceived?: (notification: Notifications.Notification) => void,
  onResponse?: (response: Notifications.NotificationResponse) => void,
): () => void {
  const subReceived = Notifications.addNotificationReceivedListener((notification) => {
    console.log('[notifications] 🔔 Reçue:', notification.request.content.title);
    onReceived?.(notification);
  });

  const subResponse = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('[notifications] 👆 Tappée:', response.notification.request.content.title);
    const data = response.notification.request.content.data;
    handleNotificationNavigation(data as NotifData);
    onResponse?.(response);
  });

  return () => {
    subReceived.remove();
    subResponse.remove();
  };
}

/**
 * Vérifie si l'app a été ouverte via un tap sur une notification (état killed).
 * À appeler au démarrage de l'app, une seule fois.
 */
export async function handleInitialNotification(): Promise<void> {
  try {
    const response = await Notifications.getLastNotificationResponseAsync();
    if (response) {
      console.log('[notifications] 🚀 App ouverte depuis une notification');
      const data = response.notification.request.content.data;
      // Petit délai pour laisser le routeur s'initialiser
      setTimeout(() => {
        handleNotificationNavigation(data as NotifData);
      }, 500);
    }
  } catch (err) {
    console.warn('[notifications] handleInitialNotification error:', err);
  }
}

/**
 * Annule toutes les notifications locales en attente.
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.dismissAllNotificationsAsync();
  } catch (err) {
    console.warn('[notifications] cancelAll error:', err);
  }
}

/**
 * Envoie une notification locale immédiate (pour tests en dev).
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: true },
    trigger: null,
  });
}
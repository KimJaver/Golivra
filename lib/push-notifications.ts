/**
 * @deprecated Ce fichier est un doublon de `notifications-service.ts`.
 * Il est conservé uniquement pour compatibilité transitoire.
 * Utiliser `notifications-service.ts` directement.
 *
 * TODO: Supprimer ce fichier une fois toutes les références migrées.
 */

export {
  initializeNotifications as initializePushNotifications,
  requestNotificationPermission,
  getExpoPushToken as getNotificationToken,
  sendLocalNotification as sendTestNotification,
} from '@/lib/notifications-service';
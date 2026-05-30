/**
 * API client pour enregistrer/désinscrire les tokens push côté backend.
 */

import { apiFetch } from '@/lib/api';
import { getSessionToken } from '@/lib/auth';

/**
 * Enregistre le token push de l'appareil dans le backend.
 * À appeler après obtention du token Expo.
 *
 * @param expoPushToken - ExponentPushToken[xxx]
 * @param platform      - 'ios' | 'android' | 'web'
 */
export async function registerPushToken(
  expoPushToken: string,
  platform: 'ios' | 'android' | 'web',
): Promise<void> {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return;

  await apiFetch('/api/notifications/register-token', {
    method: 'POST',
    token: sessionToken,
    jsonBody: { expoPushToken, platform },
  });
}

/**
 * Supprime le token push du backend (à appeler au logout).
 *
 * @param expoPushToken - ExponentPushToken[xxx]
 */
export async function unregisterPushToken(expoPushToken: string): Promise<void> {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return;

  await apiFetch('/api/notifications/unregister-token', {
    method: 'DELETE',
    token: sessionToken,
    jsonBody: { expoPushToken },
  });
}

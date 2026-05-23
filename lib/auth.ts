import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiFetch } from '@/lib/api';

const TOKEN_KEY = 'golivra_session_token';

export type AuthUser = {
  id: string;
  nom: string;
  telephone: string;
  imageUrl?: string | null;
  /** L’API peut renvoyer un nombre (JSON) ; on accepte les deux. */
  roleId: string | number;
  /** Nom du rôle PostgreSQL (ex. client, restaurateur, commercant). */
  role?: string | null;
};

export type AuthSession = {
  token: string;
  expireLe: string;
  user: AuthUser;
};

export async function getSessionToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setSessionToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearSessionToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export async function registerAccount(payload: {
  nom: string;
  telephone: string;
  motDePasse: string;
  otpCode: string;
  role: 'client' | 'restaurateur' | 'commercant';
  imageUrl?: string | null;
}): Promise<AuthSession> {
  return apiFetch<AuthSession>('/api/auth/register', {
    method: 'POST',
    jsonBody: payload,
  });
}

export async function loginAccount(payload: {
  telephone: string;
  motDePasse: string;
}): Promise<AuthSession> {
  return apiFetch<AuthSession>('/api/auth/login', {
    method: 'POST',
    jsonBody: payload,
  });
}

export async function logoutRemote(token: string): Promise<void> {
  await apiFetch('/api/auth/logout', {
    method: 'POST',
    token,
    jsonBody: {},
  });
}

export async function resetPassword(payload: {
  telephone: string;
  otpCode: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    jsonBody: payload,
  });
}

export async function logoutLocal(): Promise<void> {
  const token = await getSessionToken();
  try {
    const { clearClientDataCache } = await import('@/lib/client-data');
    clearClientDataCache();
  } catch {
    /* ignore */
  }
  if (token) {
    void logoutRemote(token).catch(() => {
      /* réseau lent ou hors ligne : on déconnecte quand même localement */
    });
  }
  await clearSessionToken();
}

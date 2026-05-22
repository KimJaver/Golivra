import AsyncStorage from '@react-native-async-storage/async-storage';

import { getSessionToken } from '@/lib/auth';
import { fetchFavorites, syncFavoritesRemote, toggleFavoriteRemote } from '@/lib/favorites-api';

const STORAGE_KEY = 'golivra_client_favorites_v1';

async function readIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

async function writeIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export async function getFavoriteEnterpriseIds(): Promise<string[]> {
  const token = await getSessionToken();
  if (token) {
    try {
      const remote = await fetchFavorites(token);
      const ids = remote.enterprise_ids ?? [];
      await writeIds(ids);
      return ids;
    } catch {
      /* fallback local */
    }
  }
  return readIds();
}

export async function isFavoriteEnterprise(id: string): Promise<boolean> {
  const ids = await getFavoriteEnterpriseIds();
  return ids.includes(id);
}

/** Ajoute ou retire l’ID ; renvoie true si désormais favori. */
export async function toggleFavoriteEnterpriseId(
  id: string,
  enterpriseType?: 'restaurant' | 'boutique',
): Promise<boolean> {
  const token = await getSessionToken();
  if (token) {
    try {
      const res = await toggleFavoriteRemote(token, id, enterpriseType);
      const ids = await readIds();
      const next = res.favori ? [...new Set([...ids, id])] : ids.filter((x) => x !== id);
      await writeIds(next);
      return res.favori;
    } catch {
      /* fallback local */
    }
  }

  const ids = await readIds();
  const has = ids.includes(id);
  const next = has ? ids.filter((x) => x !== id) : [...ids, id];
  await writeIds(next);
  return !has;
}

/** Synchronise les favoris locaux vers le serveur après connexion. */
export async function syncFavoritesWithServer(): Promise<void> {
  const token = await getSessionToken();
  if (!token) return;
  const local = await readIds();
  try {
    const remote = await syncFavoritesRemote(token, local);
    await writeIds(remote.enterprise_ids ?? []);
  } catch {
    /* ignore */
  }
}

import { apiFetch } from '@/lib/api';

export type FavoriteEnterprise = {
  enterprise_id: string;
  type: 'restaurant' | 'boutique';
  nom: string | null;
  statut?: string | null;
  est_ouvert?: boolean | null;
  favorited_at?: string;
};

export async function fetchFavorites(token: string): Promise<{
  items: FavoriteEnterprise[];
  enterprise_ids: string[];
}> {
  return apiFetch('/api/favorites', { method: 'GET', token });
}

export async function toggleFavoriteRemote(
  token: string,
  enterpriseId: string,
  enterpriseType?: 'restaurant' | 'boutique',
): Promise<{ enterprise_id: string; favori: boolean }> {
  return apiFetch('/api/favorites/toggle', {
    method: 'POST',
    token,
    jsonBody: { enterpriseId, enterpriseType },
  });
}

export async function syncFavoritesRemote(token: string, enterpriseIds: string[]): Promise<{
  items: FavoriteEnterprise[];
  enterprise_ids: string[];
}> {
  return apiFetch('/api/favorites/sync', {
    method: 'POST',
    token,
    jsonBody: { enterpriseIds },
  });
}

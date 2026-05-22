import { apiFetch } from '@/lib/api';
import { invalidateEnterprisesCache } from '@/lib/client-data';

export type PendingReview = {
  sous_commande_id: string;
  commande_id: string;
  enterprise_id: string;
  enterprise_type: 'restaurant' | 'boutique';
  enterprise_nom: string | null;
};

export type ReviewSubmitResult = {
  id: string;
  note: number;
  enterprise_id: string;
  enterprise_type: 'restaurant' | 'boutique';
  note_moyenne: number;
  nb_avis: number;
};

export async function fetchPendingReviews(token: string): Promise<PendingReview[]> {
  const data = await apiFetch<PendingReview[]>('/api/reviews/pending', { method: 'GET', token });
  return Array.isArray(data) ? data : [];
}

export async function submitEnterpriseReview(
  token: string,
  sousCommandeId: string,
  note: number,
  commentaire?: string | null,
): Promise<ReviewSubmitResult> {
  const result = await apiFetch<ReviewSubmitResult>('/api/reviews', {
    method: 'POST',
    token,
    jsonBody: {
      sousCommandeId,
      note,
      ...(commentaire?.trim() ? { commentaire: commentaire.trim() } : {}),
    },
  });
  invalidateEnterprisesCache();
  return result;
}

import { apiFetch } from '@/lib/api';

export type CourierMission = {
  id: string;
  statut: string;
  type_livraison?: 'commande' | 'externe';
  sous_commande_id?: string | null;
  created_at: string;
  attribuee_at?: string | null;
  livree_at?: string | null;
  adresse_livraison: string;
  adresse_retrait?: string;
  commande?: { id: string; numero: string; statut: string } | null;
  client_nom?: string | null;
  client_telephone?: string | null;
  commerce_nom?: string | null;
  montant_total?: number | null;
  note?: string | null;
  /** Course en attente d'acceptation (non encore assignée au livreur). */
  ouverte?: boolean;
};

export type CourierProfile = {
  livreur: {
    id: string;
    type_vehicule?: string | null;
    est_disponible?: boolean;
    est_approuve?: boolean;
    nb_livraisons_total?: number;
    nb_livraisons_reussies?: number;
    plaque_immatriculation?: string | null;
  };
  utilisateur: {
    id: string;
    nom: string | null;
    telephone: string | null;
    email?: string | null;
    imageUrl?: string | null;
    est_actif?: boolean;
  };
  entreprise?: { id: string; nom: string; telephone?: string | null } | null;
  resume?: {
    missions_actives: number;
    missions_aujourdhui: number;
    total_historique: number;
    reussies_historique: number;
  };
};

export async function fetchCourierProfile(token: string): Promise<CourierProfile> {
  return apiFetch<CourierProfile>('/api/delivery/courier/me', { method: 'GET', token });
}

export async function fetchCourierMissions(
  token: string,
  status?: string,
): Promise<CourierMission[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  const data = await apiFetch<CourierMission[]>(`/api/delivery/courier/missions${qs}`, {
    method: 'GET',
    token,
  });
  return Array.isArray(data) ? data : [];
}

export async function setCourierAvailability(token: string, disponible: boolean): Promise<void> {
  await apiFetch('/api/delivery/courier/availability', {
    method: 'PATCH',
    token,
    jsonBody: { disponible },
  });
}

export async function acceptCourierMission(token: string, deliveryId: string): Promise<CourierMission> {
  return apiFetch<CourierMission>(`/api/delivery/courier/accept/${deliveryId}`, {
    method: 'POST',
    token,
    jsonBody: {},
  });
}

export async function advanceCourierMission(token: string, deliveryId: string): Promise<CourierMission> {
  return apiFetch<CourierMission>(`/api/delivery/courier/advance/${deliveryId}`, {
    method: 'POST',
    token,
    jsonBody: {},
  });
}

export async function completeCourierMission(token: string, deliveryId: string): Promise<CourierMission> {
  return apiFetch<CourierMission>(`/api/delivery/courier/complete/${deliveryId}`, {
    method: 'POST',
    token,
    jsonBody: {},
  });
}

export { courierMissionStatusLabel as missionStatutLabel } from '@/lib/ux-copy';

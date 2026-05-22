import { fetchEnterpriseByIdCached, fetchProductsForEnterpriseCached } from '@/lib/client-data';

export type EnterprisePublic = {
  id: string;
  nom: string | null;
  type: 'restaurant' | 'boutique';
  description?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  image_url?: string | null;
  ouvert?: boolean;
  categorie_id?: string | null;
  categorie_nom?: string | null;
  delai_preparation_min?: number;
  delai_livraison_min?: number;
  livraison_propre?: boolean;
  frais_livraison?: number;
  note_moyenne?: number;
  nb_avis?: number;
  /** Présent si l’API le renvoie : hors `active`, le commerce n’apparaît pas sur le marketplace public. */
  statut_moderation?: 'en_attente' | 'active' | 'suspendu' | string | null;
};

export type ProductPublic = {
  id: string;
  entreprise_id: string;
  nom: string | null;
  description?: string | null;
  prix: number | string;
  stock: number | string;
  image_url?: string | null;
};

export async function fetchEnterpriseById(id: string, force = false): Promise<EnterprisePublic> {
  return fetchEnterpriseByIdCached(id, force);
}

export async function fetchProductsForEnterprise(enterpriseId: string, force = false): Promise<ProductPublic[]> {
  return fetchProductsForEnterpriseCached(enterpriseId, force);
}

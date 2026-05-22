/**
 * Types de livraison GoLivra (colonne DB `type_livraison`).
 * - commande → livraison interne (depuis commande client)
 * - externe → livraison externe (créée par boutique / restaurant)
 */
export type LivraisonDbType = 'commande' | 'externe';

export const DB_TYPE_INTERNE: LivraisonDbType = 'commande';
export const DB_TYPE_EXTERNE: LivraisonDbType = 'externe';

export function typeLabel(dbType: string | null | undefined): string {
  return dbType === 'externe' ? 'Livraison externe' : 'Livraison interne';
}

export function payeurLabel(dbType: string | null | undefined): string {
  return dbType === 'externe' ? 'Commerce' : 'Client';
}

import { QUARTIERS_BRAZZAVILLE } from '@/constants/quartiers-brazzaville';

/** Champs alignés sur la table `adresses` (schéma v3) — sans GPS. */
export type DeliveryAddressFields = {
  quartier: string;
  ligne1: string;
  instructions?: string | null;
  point_reperes?: string | null;
  ville?: string;
  pays?: string;
};

export function formatDeliveryAddressText(fields: DeliveryAddressFields): string {
  const parts = [
    fields.quartier?.trim(),
    fields.ligne1?.trim(),
    fields.point_reperes?.trim(),
    fields.instructions?.trim(),
    fields.ville?.trim() || 'Brazzaville',
    fields.pays?.trim() || 'Congo',
  ].filter(Boolean);
  return parts.join(' · ');
}

export function isDeliveryAddressComplete(fields: Partial<DeliveryAddressFields>): boolean {
  const q = String(fields.quartier || '').trim();
  const l = String(fields.ligne1 || '').trim();
  return Boolean(q) && l.length >= 4;
}

/** Reprend un quartier existant ou propose « Autre » si seule l’adresse texte est connue. */
export function quartierForForm(stored: string | null | undefined, hasLigne1: boolean): string {
  const q = String(stored || '').trim();
  if (q && (QUARTIERS_BRAZZAVILLE as readonly string[]).includes(q)) return q;
  if (q) return q;
  if (hasLigne1) return 'Autre';
  return '';
}

export function snapshotFromFields(fields: DeliveryAddressFields) {
  return {
    quartier: fields.quartier.trim(),
    ligne1: fields.ligne1.trim(),
    instructions: fields.instructions?.trim() || null,
    point_reperes: fields.point_reperes?.trim() || null,
    ville: fields.ville?.trim() || 'Brazzaville',
    pays: fields.pays?.trim() || 'Congo',
  };
}

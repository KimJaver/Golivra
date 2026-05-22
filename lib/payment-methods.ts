/** Méthodes de paiement client (schéma `methode_paiement`). */
export const CLIENT_PAYMENT_METHODS = [
  { id: 'airtel_money' as const, label: 'Airtel Money', shortLabel: 'Airtel' },
  { id: 'mtn_money' as const, label: 'MTN Mobile Money', shortLabel: 'MTN' },
] as const;

export type ClientPaymentMethodId = (typeof CLIENT_PAYMENT_METHODS)[number]['id'];

export function isClientPaymentMethod(value: string): value is ClientPaymentMethodId {
  return value === 'airtel_money' || value === 'mtn_money';
}

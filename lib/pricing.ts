import { apiFetch } from '@/lib/api';

/** Valeurs affichées si l’API tarifs n’est pas encore chargée. */
export const FALLBACK_DELIVERY_FEE_FCFA = 1000;
export const FALLBACK_MIN_ORDER_FCFA = 1000;

export type PublicPricing = {
  frais_livraison_base_fcfa: number;
  frais_livraison_min_fcfa: number;
  frais_livraison_max_fcfa: number;
  montant_min_commande_fcfa: number;
};

/** Snapshot utilisé avant chargement API ou si l’API échoue. */
export const DEFAULT_PUBLIC_PRICING: PublicPricing = {
  frais_livraison_base_fcfa: FALLBACK_DELIVERY_FEE_FCFA,
  frais_livraison_min_fcfa: FALLBACK_DELIVERY_FEE_FCFA,
  frais_livraison_max_fcfa: 2500,
  montant_min_commande_fcfa: FALLBACK_MIN_ORDER_FCFA,
};

let cached: PublicPricing | null = null;
let cacheAt = 0;
const CACHE_MS = 60_000;

function toPricing(raw: Record<string, unknown>): PublicPricing {
  const base = Number(raw.frais_livraison_base_fcfa);
  const minFee = Number(raw.frais_livraison_min_fcfa);
  const maxFee = Number(raw.frais_livraison_max_fcfa);
  const minOrder = Number(raw.montant_min_commande_fcfa);
  const baseFcfa = Number.isFinite(base) && base > 0 ? Math.round(base) : FALLBACK_DELIVERY_FEE_FCFA;
  const minFcfa = Number.isFinite(minFee) && minFee > 0 ? Math.round(minFee) : FALLBACK_DELIVERY_FEE_FCFA;
  const maxFcfa = Number.isFinite(maxFee) && maxFee > 0 ? Math.round(maxFee) : 2500;
  const minOrderFcfa =
    Number.isFinite(minOrder) && minOrder > 0 ? Math.round(minOrder) : FALLBACK_MIN_ORDER_FCFA;

  return {
    frais_livraison_base_fcfa: Math.max(baseFcfa, FALLBACK_DELIVERY_FEE_FCFA),
    frais_livraison_min_fcfa: Math.max(minFcfa, FALLBACK_DELIVERY_FEE_FCFA),
    frais_livraison_max_fcfa: Math.max(maxFcfa, FALLBACK_DELIVERY_FEE_FCFA),
    montant_min_commande_fcfa: Math.max(minOrderFcfa, FALLBACK_MIN_ORDER_FCFA),
  };
}

export async function fetchPublicPricing(force = false): Promise<PublicPricing> {
  const now = Date.now();
  if (!force && cached && now < cacheAt) return cached;
  try {
    const data = await apiFetch<Record<string, unknown>>('/api/orders/pricing-config', { method: 'GET' });
    cached = toPricing(data);
    cacheAt = now + CACHE_MS;
    return cached;
  } catch {
    return { ...DEFAULT_PUBLIC_PRICING };
  }
}

/**
 * Frais affichés pour un commerce.
 * Les valeurs en base sous le minimum plateforme (ex. ancien défaut 500 FCFA) sont remplacées par le tarif public.
 */
export function displayDeliveryFeeFcfa(
  commerceFee: number | null | undefined,
  pricing: PublicPricing = DEFAULT_PUBLIC_PRICING,
): number {
  const min = pricing.frais_livraison_min_fcfa;
  const base = pricing.frais_livraison_base_fcfa;
  const max = pricing.frais_livraison_max_fcfa;
  const fromCommerce = Number(commerceFee);
  if (Number.isFinite(fromCommerce) && fromCommerce > 0) {
    const fee = Math.round(fromCommerce);
    if (fee < min) return base;
    if (fee > max) return max;
    return fee;
  }
  return base;
}

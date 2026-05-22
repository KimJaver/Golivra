import { apiFetch } from '@/lib/api';

export type PromoValidation = {
  ok: boolean;
  code: string;
  code_promo_id: string;
  description: string | null;
  type_remise: string;
  valeur: number;
  remise: number;
  order_subtotal: number;
  delivery_total: number;
  total: number;
};

export type PromoSegmentInput = {
  entrepriseId: string;
  establishmentType: 'restaurant' | 'boutique';
};

export async function validatePromoCode(
  token: string,
  code: string,
  opts: {
    orderSubtotal: number;
    deliveryTotal: number;
    segments: PromoSegmentInput[];
  },
): Promise<PromoValidation> {
  return apiFetch<PromoValidation>('/api/promo/validate', {
    method: 'POST',
    token,
    jsonBody: {
      code,
      orderSubtotal: opts.orderSubtotal,
      deliveryTotal: opts.deliveryTotal,
      segments: opts.segments,
    },
  });
}

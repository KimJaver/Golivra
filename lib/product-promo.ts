import type { ProductPublic } from '@/lib/catalog';

export type ProductPricing = {
  basePrice: number;
  displayPrice: number;
  promoActive: boolean;
  promoPrice: number | null;
  promoDebutAt: Date | null;
  promoFinAt: Date | null;
  discountPercent: number | null;
};

function numPrice(value: number | string | null | undefined): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function parsePromoDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Fin de journée inclusive pour les dates saisies sans heure (AAAA-MM-JJ). */
function promoEndInclusive(fin: Date): Date {
  const end = new Date(fin);
  if (
    end.getUTCHours() === 0 &&
    end.getUTCMinutes() === 0 &&
    end.getUTCSeconds() === 0 &&
    end.getUTCMilliseconds() === 0
  ) {
    end.setUTCHours(23, 59, 59, 999);
  }
  return end;
}

const dateFmt = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function formatDay(d: Date): string {
  return dateFmt.format(d);
}

/** Libellé durée promo pour l’interface client. */
export function formatPromoDurationLabel(
  debut: Date | null,
  fin: Date | null,
): string | null {
  if (debut && fin) {
    const sameMonth = debut.getMonth() === fin.getMonth() && debut.getFullYear() === fin.getFullYear();
    if (sameMonth) {
      return `Du ${debut.getDate()} au ${formatDay(fin)}`;
    }
    return `Du ${formatDay(debut)} au ${formatDay(fin)}`;
  }
  if (fin) return `Jusqu'au ${formatDay(fin)}`;
  if (debut) return `À partir du ${formatDay(debut)}`;
  return null;
}

export function resolveProductPricing(
  product: Pick<
    ProductPublic,
    'prix' | 'prix_promo' | 'promo_debut_at' | 'promo_fin_at'
  >,
  now: Date = new Date(),
): ProductPricing {
  const basePrice = numPrice(product.prix);
  const promoPriceRaw = product.prix_promo;
  const promoPrice =
    promoPriceRaw != null && Number.isFinite(Number(promoPriceRaw)) ? Number(promoPriceRaw) : null;

  const promoDebutAt = parsePromoDate(product.promo_debut_at);
  const promoFinAt = parsePromoDate(product.promo_fin_at);

  let promoActive = promoPrice != null && promoPrice > 0 && promoPrice < basePrice;
  if (promoActive && promoDebutAt && now < promoDebutAt) promoActive = false;
  if (promoActive && promoFinAt && now > promoEndInclusive(promoFinAt)) promoActive = false;

  const displayPrice = promoActive && promoPrice != null ? promoPrice : basePrice;
  const discountPercent =
    promoActive && promoPrice != null && basePrice > 0
      ? Math.round(((basePrice - promoPrice) / basePrice) * 100)
      : null;

  return {
    basePrice,
    displayPrice,
    promoActive,
    promoPrice: promoActive ? promoPrice : null,
    promoDebutAt: promoActive ? promoDebutAt : null,
    promoFinAt: promoActive ? promoFinAt : null,
    discountPercent,
  };
}

/** Prix unitaire à facturer (promo active si applicable). */
export function getEffectiveUnitPrice(
  product: Pick<
    ProductPublic,
    'prix' | 'prix_promo' | 'promo_debut_at' | 'promo_fin_at'
  >,
  now?: Date,
): number {
  return resolveProductPricing(product, now).displayPrice;
}

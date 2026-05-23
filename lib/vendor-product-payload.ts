import type { ProductOptionGroup, VendorProductFormValues } from '@/lib/vendor-product-types';
import { generateProductReference, parseTagsText } from '@/lib/vendor-product-types';

export type VendorProductApiBody = {
  nom: string;
  description?: string;
  prix: number;
  prixPromo?: number | null;
  stock?: number | null;
  stockIllimite?: boolean;
  imageUrl?: string;
  imagesUrls?: string[];
  categorieId?: string | null;
  estEnVedette?: boolean;
  estDisponible?: boolean;
  reference?: string;
  unite?: string;
  options?: ProductOptionGroup[] | null;
  tags?: string[];
  promoDebutAt?: string | null;
  promoFinAt?: string | null;
  typeProduit?: string;
  etatProduit?: string;
  marque?: string;
  poidsKg?: number | null;
  dimensions?: { l?: number; w?: number; h?: number } | null;
};

function numOrNull(raw: string): number | null {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function cleanOptionGroups(groups: ProductOptionGroup[]): ProductOptionGroup[] | null {
  const cleaned = groups
    .map((g) => ({
      nom: g.nom.trim(),
      requis: g.requis !== false,
      choix: g.choix
        .map((c) => ({
          label: c.label.trim(),
          prix_sup: Number(c.prix_sup) || 0,
        }))
        .filter((c) => c.label),
    }))
    .filter((g) => g.nom && g.choix.length);
  return cleaned.length ? cleaned : null;
}

export function buildProductApiBody(
  values: VendorProductFormValues,
  uploaded: { mainUrl?: string; galleryUrls: string[] },
): VendorProductApiBody {
  const prix = Number(values.prix);
  const prixPromo = values.prixPromo.trim() ? Number(values.prixPromo) : null;
  const allUrls = [
    ...(uploaded.mainUrl ? [uploaded.mainUrl] : []),
    ...uploaded.galleryUrls.filter((u) => u !== uploaded.mainUrl),
  ];

  const l = numOrNull(values.longueurCm);
  const w = numOrNull(values.largeurCm);
  const h = numOrNull(values.hauteurCm);
  const dimensions =
    l || w || h
      ? {
          ...(l ? { l } : {}),
          ...(w ? { w } : {}),
          ...(h ? { h } : {}),
        }
      : undefined;

  const poids = values.poidsKg.trim() ? Number(values.poidsKg) : null;

  return {
    nom: values.nom.trim(),
    description: values.description.trim() || undefined,
    prix,
    prixPromo: prixPromo && prixPromo > 0 ? prixPromo : null,
    stockIllimite: values.stockIllimite,
    stock: values.stockIllimite ? null : values.stock.trim() ? Math.max(0, Math.floor(Number(values.stock))) : 0,
    imageUrl: uploaded.mainUrl,
    imagesUrls: allUrls.length ? allUrls : undefined,
    categorieId: values.categorieId,
    estEnVedette: values.enVedette,
    estDisponible: values.estDisponible,
    reference: values.reference.trim() || generateProductReference(),
    unite: values.unite.trim() || 'pièce',
    options: cleanOptionGroups(values.optionGroups),
    tags: parseTagsText(values.tagsText),
    promoDebutAt: values.promoDebutAt.trim() || null,
    promoFinAt: values.promoFinAt.trim() || null,
    typeProduit: values.typeProduit,
    etatProduit: values.etatProduit,
    marque: values.marque.trim() || undefined,
    ...(poids && Number.isFinite(poids) && poids > 0 ? { poidsKg: poids } : {}),
    ...(dimensions ? { dimensions } : {}),
  };
}

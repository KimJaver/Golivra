/** Groupe d’options / variantes (taille, couleur, format…). */
export type ProductOptionGroup = {
  nom: string;
  requis?: boolean;
  choix: { label: string; prix_sup?: number }[];
};

export type ProductDimensions = {
  l?: number;
  w?: number;
  h?: number;
};

export type ProductTypeKind = 'physique' | 'numerique' | 'service';
export type ProductCondition = 'neuf' | 'occasion' | 'reconditionne';

export type ArticleCategory = {
  id: string;
  nom: string;
  description?: string | null;
  ordre?: number;
  est_active?: boolean;
};

export type VendorProductFormValues = {
  nom: string;
  description: string;
  categorieId: string | null;
  marque: string;
  typeProduit: ProductTypeKind;
  etatProduit: ProductCondition;
  prix: string;
  prixPromo: string;
  promoDebutAt: string;
  promoFinAt: string;
  stock: string;
  stockIllimite: boolean;
  reference: string;
  unite: string;
  poidsKg: string;
  longueurCm: string;
  largeurCm: string;
  hauteurCm: string;
  estDisponible: boolean;
  enVedette: boolean;
  tagsText: string;
  optionGroups: ProductOptionGroup[];
  mainImageUri: string | null;
  mainImageDataUrl: string | null;
  gallery: { uri: string; dataUrl: string }[];
};

export const UNITE_CHOICES = ['pièce', 'kg', 'litre', 'carton', 'paquet', 'lot'] as const;

export const DEFAULT_PRODUCT_FORM: VendorProductFormValues = {
  nom: '',
  description: '',
  categorieId: null,
  marque: '',
  typeProduit: 'physique',
  etatProduit: 'neuf',
  prix: '',
  prixPromo: '',
  promoDebutAt: '',
  promoFinAt: '',
  stock: '',
  stockIllimite: false,
  reference: '',
  unite: 'pièce',
  poidsKg: '',
  longueurCm: '',
  largeurCm: '',
  hauteurCm: '',
  estDisponible: true,
  enVedette: false,
  tagsText: '',
  optionGroups: [],
  mainImageUri: null,
  mainImageDataUrl: null,
  gallery: [],
};

export function generateProductReference(): string {
  return `GLV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export function parseTagsText(text: string): string[] {
  return text
    .split(/[,;]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

export function tagsToText(tags: string[] | undefined | null): string {
  if (!tags?.length) return '';
  return tags.join(', ');
}

export function emptyOptionGroup(): ProductOptionGroup {
  return { nom: '', requis: true, choix: [{ label: '', prix_sup: 0 }] };
}

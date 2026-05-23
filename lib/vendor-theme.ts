/**
 * Thème et libellés espace vendeur selon le type d’établissement (restaurant vs boutique).
 */

import { AppPaletteDark, AppPaletteLight, GOLIVRA_GREEN, type AppPalette } from '@/constants/app-palette';

export type VendorCommerceType = 'boutique' | 'restaurant';

export type VendorPalette = {
  primary: string;
  primaryDeep: string;
  primarySoft: string;
  gradient: readonly [string, string];
  trackStroke: string;
  tabBarInactive: string;
  onlinePillBg: string;
  onlinePillBorder: string;
  thumbPhBg: string;
};

function vendorPaletteFromApp(p: AppPalette): VendorPalette {
  return {
    primary: p.primary,
    primaryDeep: p.primaryDeep,
    primarySoft: p.primarySoft,
    gradient: [p.primary, p.primaryDeep] as const,
    trackStroke: p.primaryMuted,
    tabBarInactive: p.tabInactive,
    onlinePillBg: p.successSoft,
    onlinePillBorder: p.border,
    thumbPhBg: p.primarySoft,
  };
}

const GOLIVRA_VENDOR_LIGHT = vendorPaletteFromApp(AppPaletteLight);
const GOLIVRA_VENDOR_DARK = vendorPaletteFromApp(AppPaletteDark);

export function vendorPalette(_type: VendorCommerceType, isDark = false): VendorPalette {
  return isDark ? GOLIVRA_VENDOR_DARK : GOLIVRA_VENDOR_LIGHT;
}

/** @deprecated Utiliser `colors.primary` — conservé pour imports existants. */
export const VENDOR_BRAND_GREEN = GOLIVRA_GREEN;

export type VendorUiLabels = {
  productsTab: string;
  productsHeader: string;
  profileHeader: string;
  dashboardRevenueLabel: string;
  dashboardStatCards: { value: string; label: string }[];
  dashboardExtra?: { title: string; lines: { value: string; label: string }[] };
  orderListFilters: { key: 'all' | 'prep' | 'ship'; label: string }[];
  productTabs: { key: 'all' | 'on' | 'off'; label: string }[];
  addProductFab: string;
  orderArticlesTitle: string;
  orderPrimaryCta: string;
  preparationHeader: string;
};

export function vendorLabels(type: VendorCommerceType): VendorUiLabels {
  if (type === 'restaurant') {
    return {
      productsTab: 'Menu',
      productsHeader: 'GESTION MENU',
      profileHeader: 'MON RESTAURANT',
      dashboardRevenueLabel: "Chiffre du jour",
      dashboardStatCards: [
        { value: '12', label: 'Commandes' },
        { value: '6', label: 'En préparation' },
        { value: '3', label: 'Prêtes' },
      ],
      dashboardExtra: {
        title: 'Performance du jour',
        lines: [
          { value: '15', label: 'Livraisons' },
          { value: '4,6', label: 'Note moy.' },
        ],
      },
      orderListFilters: [
        { key: 'all', label: 'En cours' },
        { key: 'prep', label: 'Préparation' },
        { key: 'ship', label: 'Livraison' },
      ],
      productTabs: [
        { key: 'all', label: 'Plats' },
        { key: 'on', label: 'En carte' },
        { key: 'off', label: 'Indisponibles' },
      ],
      addProductFab: 'Ajouter un plat',
      orderArticlesTitle: 'Plats',
      orderPrimaryCta: 'Commencer la préparation',
      preparationHeader: 'SUIVI PRÉPARATION',
    };
  }
  return {
    productsTab: 'Produits',
    productsHeader: 'GESTION PRODUITS',
    profileHeader: 'MA BOUTIQUE',
    dashboardRevenueLabel: "Revenus aujourd'hui",
    dashboardStatCards: [
      { value: '28', label: 'Commandes' },
      { value: '7', label: 'En préparation' },
      { value: '6', label: 'En livraison' },
    ],
    dashboardExtra: {
      title: 'Catalogue',
      lines: [
        { value: '150', label: 'En ligne' },
        { value: '7', label: 'Stock faible' },
      ],
    },
    orderListFilters: [
      { key: 'all', label: 'Toutes' },
      { key: 'prep', label: 'À préparer' },
      { key: 'ship', label: 'En livraison' },
    ],
    productTabs: [
      { key: 'all', label: 'Tous' },
      { key: 'on', label: 'En ligne' },
      { key: 'off', label: 'Hors ligne' },
    ],
    addProductFab: 'Ajouter un produit',
    orderArticlesTitle: 'Produits',
    orderPrimaryCta: 'Préparer la commande',
    preparationHeader: 'SUIVI EXPÉDITION',
  };
}

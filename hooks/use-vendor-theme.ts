import { useMemo } from 'react';

import { useVendor } from '@/contexts/vendor-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { vendorLabels, vendorPalette, type VendorCommerceType, type VendorPalette, type VendorUiLabels } from '@/lib/vendor-theme';
import { countsFromOrders } from '@/lib/vendor-types';

export type VendorTheme = {
  commerceType: VendorCommerceType;
  palette: VendorPalette;
  labels: VendorUiLabels;
};

export function useVendorTheme(): VendorTheme {
  const { shop, orders, products } = useVendor();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const commerceType: VendorCommerceType = shop?.type === 'restaurant' ? 'restaurant' : 'boutique';

  return useMemo(() => {
    const baseLabels = vendorLabels(commerceType);
    const counts = countsFromOrders(orders);
    const onlineProducts = products.filter((p) => p.enLigne).length;
    const lowStock = products.filter((p) => p.stock <= 5).length;

    const dashboardStatCards =
      commerceType === 'restaurant'
        ? [
            { value: String(counts.all), label: 'Commandes' },
            { value: String(counts.prep), label: 'En préparation' },
            { value: String(counts.prete), label: 'Prêtes' },
          ]
        : [
            { value: String(counts.all), label: 'Commandes' },
            { value: String(counts.prep), label: 'À traiter' },
            { value: String(counts.ship), label: 'En livraison' },
          ];

    const dashboardExtra =
      commerceType === 'restaurant'
        ? {
            title: 'Performance du jour',
            lines: [
              { value: String(orders.filter((o) => o.statut === 'livree').length), label: 'Livrées' },
              { value: String(products.length), label: 'Plats au menu' },
            ],
          }
        : {
            title: 'Catalogue',
            lines: [
              { value: String(onlineProducts), label: 'En ligne' },
              { value: String(lowStock), label: 'Stock faible' },
            ],
          };

    return {
      commerceType,
      palette: vendorPalette(commerceType, isDark),
      labels: {
        ...baseLabels,
        dashboardStatCards,
        dashboardExtra,
      },
    };
  }, [commerceType, orders, products, isDark]);
}

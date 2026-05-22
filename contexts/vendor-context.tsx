import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getSessionToken } from '@/lib/auth';
import { fetchMyEnterprises, type EnterpriseCreated } from '@/lib/enterprise';
import { resolveRemoteImageUrl } from '@/lib/images';
import {
  fetchVendorOrders,
  fetchVendorProducts,
} from '@/lib/vendor-api';
import type { VendorCommerceType } from '@/lib/vendor-theme';
import type { VendorOrder, VendorProduct, VendorShop } from '@/lib/vendor-types';

type VendorContextValue = {
  loading: boolean;
  shop: VendorShop | null;
  orders: VendorOrder[];
  products: VendorProduct[];
  pendingModeration: boolean;
  refresh: () => Promise<void>;
  setProducts: React.Dispatch<React.SetStateAction<VendorProduct[]>>;
};

const VendorContext = createContext<VendorContextValue | null>(null);

function mapEnterpriseToShop(e: EnterpriseCreated): VendorShop {
  const type: VendorCommerceType = e.type === 'restaurant' ? 'restaurant' : 'boutique';
  return {
    id: e.id,
    type,
    nom: e.nom || 'Mon commerce',
    categorie: e.categorie_nom || (type === 'restaurant' ? 'Restaurant' : 'Boutique'),
    enLigne: e.statut_moderation === 'active' && e.ouvert === true,
    avatar: resolveRemoteImageUrl(e.image_url),
    description: e.description ?? null,
    telephone: e.telephone ?? null,
    adresse: e.adresse ?? null,
    adresse_quartier: e.adresse_quartier ?? null,
    adresse_ville: e.adresse_ville ?? null,
    latitude: e.latitude ?? null,
    longitude: e.longitude ?? null,
    statut_moderation: e.statut_moderation ?? null,
    livraison_propre: e.livraison_propre === true,
  };
}

export function VendorProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<VendorShop | null>(null);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [products, setProducts] = useState<VendorProduct[]>([]);

  const refresh = useCallback(async () => {
    const token = await getSessionToken();
    if (!token) {
      setShop(null);
      setOrders([]);
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const enterprises = await fetchMyEnterprises(token);
      const primary = enterprises[0] ?? null;
      if (!primary) {
        setShop(null);
        setOrders([]);
        setProducts([]);
        setLoading(false);
        return;
      }

      const mapped = mapEnterpriseToShop(primary);
      setShop(mapped);

      const [ordersData, productsData] = await Promise.all([
        fetchVendorOrders(token).catch(() => [] as VendorOrder[]),
        fetchVendorProducts(token, primary.id).catch(() => [] as VendorProduct[]),
      ]);

      setOrders(ordersData);
      setProducts(productsData);
    } catch {
      setShop(null);
      setOrders([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh().catch(() => {
      setShop(null);
      setOrders([]);
      setProducts([]);
      setLoading(false);
    });
  }, [refresh]);

  const pendingModeration = shop?.statut_moderation === 'en_attente';

  const value = useMemo(
    () => ({
      loading,
      shop,
      orders,
      products,
      pendingModeration,
      refresh,
      setProducts,
    }),
    [loading, shop, orders, products, pendingModeration, refresh],
  );

  return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>;
}

export function useVendor() {
  const ctx = useContext(VendorContext);
  if (!ctx) throw new Error('useVendor must be used within VendorProvider');
  return ctx;
}

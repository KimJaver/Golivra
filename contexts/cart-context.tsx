import { useEffect, type ReactNode } from 'react';
import { create } from 'zustand';

import {
  getCartItemCount,
  getCartSync,
  hydrateCart,
  subscribeCart,
  syncCartWithServer,
  type CartState,
} from '@/lib/cart-local';

type CartStore = {
  cart: CartState | null;
  itemCount: number;
  hydrated: boolean;
  syncFromMemory: () => void;
  hydrate: () => Promise<void>;
};

export const useCart = create<CartStore>((set, get) => ({
  cart: getCartSync(),
  itemCount: getCartItemCount(getCartSync()),
  hydrated: false,
  syncFromMemory: () => {
    const cart = getCartSync();
    set({ cart, itemCount: getCartItemCount(cart) });
  },
  hydrate: async () => {
    if (get().hydrated) {
      get().syncFromMemory();
      return;
    }
    const cart = await hydrateCart();
    set({ cart, itemCount: getCartItemCount(cart), hydrated: true });
  },
}));

if (typeof global !== 'undefined') {
  (global as { updateCartState?: () => void }).updateCartState = () => {
    useCart.getState().syncFromMemory();
  };
  (global as { updateCartCount?: (count: number) => void }).updateCartCount = (count: number) => {
    useCart.setState({ itemCount: count });
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const store = useCart.getState();
    void store.hydrate().then(() => {
      void syncCartWithServer().then(() => store.syncFromMemory());
    });

    const unsubscribe = subscribeCart(() => {
      store.syncFromMemory();
    });

    return unsubscribe;
  }, []);

  return <>{children}</>;
}

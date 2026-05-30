import { useEffect, type ReactNode } from 'react';
import { create } from 'zustand';

import { getCartItemCount, loadCart, subscribeCart } from '@/lib/cart-local';

type CartStore = {
  itemCount: number;
  refreshCart: () => Promise<void>;
};

export const useCart = create<CartStore>((set) => ({
  itemCount: 0,
  refreshCart: async () => {
    const cart = await loadCart();
    const newCount = getCartItemCount(cart);
    set({ itemCount: newCount });
  },
}));

// Expose global pour mise à jour immédiate depuis cart-local
if (typeof global !== 'undefined') {
  (global as any).updateCartCount = (count: number) => {
    useCart.setState({ itemCount: count });
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const store = useCart.getState();
    void store.refreshCart();
    
    const unsubscribe = subscribeCart(() => {
      void store.refreshCart();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getCartItemCount, loadCart, subscribeCart } from '@/lib/cart-local';

type CartContextValue = {
  itemCount: number;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [itemCount, setItemCount] = useState(0);

  const refreshCart = useCallback(async () => {
    const cart = await loadCart();
    setItemCount(getCartItemCount(cart));
  }, []);

  useEffect(() => {
    void refreshCart();
    return subscribeCart(() => {
      void refreshCart();
    });
  }, [refreshCart]);

  const value = useMemo(() => ({ itemCount, refreshCart }), [itemCount, refreshCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart doit être utilisé dans CartProvider');
  }
  return ctx;
}

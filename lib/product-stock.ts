/** Cap pratique quand le stock n'est pas suivi (plats, articles illimités). */
export const UNLIMITED_STOCK_CAP = 9999;

export type ProductStockFields = {
  stock?: number | string | null;
  stock_illimite?: boolean;
  est_disponible?: boolean;
};

export function isStockUnlimited(p: ProductStockFields): boolean {
  return p.stock_illimite === true || p.stock === null || p.stock === undefined;
}

export function isProductOrderable(p: ProductStockFields): boolean {
  if (p.est_disponible === false) return false;
  if (isStockUnlimited(p)) return true;
  const n = Math.floor(Number(p.stock));
  return Number.isFinite(n) && n > 0;
}

export function effectiveStockCap(p: ProductStockFields): number {
  if (p.est_disponible === false) return 0;
  if (isStockUnlimited(p)) return UNLIMITED_STOCK_CAP;
  const n = Math.floor(Number(p.stock));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Libellé client ; `null` = ne pas afficher de ligne stock. */
export function stockDisplayLabel(p: ProductStockFields): string | null {
  if (isStockUnlimited(p)) return null;
  const n = Math.floor(Number(p.stock));
  if (n <= 0) return 'Rupture de stock';
  return `Stock : ${n}`;
}

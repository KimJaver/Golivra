/** @deprecated Utiliser vendor-types.ts — conservé pour compatibilité imports */
export type {
  VendorOrder,
  VendorOrderLine,
  VendorOrderStatus,
  VendorProduct,
  VendorShop,
  VendorStats,
} from '@/lib/vendor-types';

export {
  countsFromOrders,
  computeVendorStats,
} from '@/lib/vendor-types';

import type { LucideIcon } from 'lucide-react-native';
import {
  BookOpen,
  Coffee,
  Dumbbell,
  Flame,
  Home,
  Leaf,
  MoreHorizontal,
  Pill,
  Pizza,
  Shirt,
  ShoppingBasket,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  UtensilsCrossed,
} from 'lucide-react-native';

export function iconForEnterpriseCategory(nom: string, segment: 'restaurant' | 'boutique'): LucideIcon {
  const n = nom.trim().toLowerCase();

  if (segment === 'restaurant') {
    if (n.includes('pizza') || n.includes('pasta')) return Pizza;
    if (n.includes('fast')) return Flame;
    if (n.includes('grill') || n.includes('broch')) return Flame;
    if (n.includes('boulanger') || n.includes('pâtiss') || n.includes('patiss')) return Coffee;
    if (n.includes('jus') || n.includes('boisson')) return Coffee;
    if (n.includes('asiat')) return UtensilsCrossed;
    if (n.includes('végét') || n.includes('veget')) return Leaf;
    if (n.includes('africain')) return UtensilsCrossed;
    if (n === 'autre') return MoreHorizontal;
    return UtensilsCrossed;
  }

  if (n.includes('épicerie') || n.includes('epicerie') || n.includes('aliment')) return ShoppingBasket;
  if (n.includes('pharmac')) return Pill;
  if (n.includes('supermarch')) return ShoppingCart;
  if (n.includes('mode') || n.includes('vêtement') || n.includes('vetement')) return Shirt;
  if (n.includes('électron') || n.includes('electron')) return Smartphone;
  if (n.includes('beauté') || n.includes('beaute') || n.includes('soin')) return Sparkles;
  if (n.includes('maison') || n.includes('déco') || n.includes('deco')) return Home;
  if (n.includes('librairie') || n.includes('papeter')) return BookOpen;
  if (n.includes('sport')) return Dumbbell;
  if (n === 'autre') return MoreHorizontal;
  return Store;
}

export function accentForEnterpriseCategory(nom: string, segment: 'restaurant' | 'boutique'): string {
  const n = nom.trim().toLowerCase();
  if (segment === 'restaurant') {
    if (n.includes('pizza')) return '#E85D04';
    if (n.includes('fast') || n.includes('grill')) return '#DC2626';
    if (n.includes('jus') || n.includes('boisson')) return '#0284C7';
    if (n.includes('végét') || n.includes('veget')) return '#16A34A';
    if (n.includes('asiat')) return '#7C3AED';
    return '#0B6B45';
  }
  if (n.includes('pharmac')) return '#0891B2';
  if (n.includes('électron') || n.includes('electron')) return '#4F46E5';
  if (n.includes('mode')) return '#DB2777';
  if (n.includes('sport')) return '#EA580C';
  return '#0B6B45';
}

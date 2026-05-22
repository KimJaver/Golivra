import type { Href } from 'expo-router';

/** Rôles professionnels (accès espace vendeur). */
export function isMerchantRole(role: string | null | undefined): boolean {
  return role === 'restaurateur' || role === 'commercant';
}

/** Livreur GoLivra (espace courses). */
export function isCourierRole(role: string | null | undefined): boolean {
  return role === 'livreur';
}

/** Route d’accueil après connexion selon le rôle. */
export function homeHrefForRole(role: string | null | undefined): Href {
  if (isMerchantRole(role)) return '/vendor';
  if (isCourierRole(role)) return '/courier';
  return '/(tabs)';
}

/**
 * Arrondissements / quartiers de Brazzaville (sélection structurée).
 * L’adresse détaillée (texte libre) précise le lieu dans l’arrondissement choisi.
 */
export const QUARTIERS_BRAZZAVILLE = [
  'Centre-ville',
  'Bacongo',
  'Makelekele',
  'Moungali',
  'Ouenzé',
  'Poto-Poto',
  'Talangaï',
  'Mfilou',
  'Madibou',
  'Djiri',
  'Autre',
] as const;

export type QuartierBrazzaville = (typeof QUARTIERS_BRAZZAVILLE)[number];

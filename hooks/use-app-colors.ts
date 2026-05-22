import { useAppTheme } from '@/contexts/app-theme-context';
import type { AppPalette } from '@/constants/app-palette';

/** Tokens couleur du thème actif (clair ou sombre). */
export function useAppColors(): AppPalette {
  return useAppTheme().colors;
}

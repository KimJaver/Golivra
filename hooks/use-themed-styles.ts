import { useMemo } from 'react';

import type { AppPalette } from '@/constants/app-palette';
import { useAppColors } from '@/hooks/use-app-colors';

/** Styles dépendants du thème (clair / sombre) — recalculés quand la palette change. */
export function useThemedStyles<T>(factory: (colors: AppPalette) => T): T {
  const colors = useAppColors();
  return useMemo(() => factory(colors), [colors]);
}

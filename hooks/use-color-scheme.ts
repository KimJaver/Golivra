import { useAppThemeOptional } from '@/contexts/app-theme-context';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ColorSchemeName = 'light' | 'dark';

export function useColorScheme(): ColorSchemeName {
  const ctx = useAppThemeOptional();
  if (ctx) return ctx.colorScheme;
  const system = useSystemColorScheme();
  return system === 'dark' ? 'dark' : 'light';
}

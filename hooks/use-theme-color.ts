import { useAppColors } from '@/hooks/use-app-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeColorKey = 'text' | 'background';

const PALETTE_KEYS: Record<ThemeColorKey, keyof ReturnType<typeof useAppColors>> = {
  text: 'text',
  background: 'background',
};

export function useThemeColor(props: { light?: string; dark?: string }, colorName: ThemeColorKey) {
  const theme = useColorScheme() ?? 'light';
  const colors = useAppColors();
  const colorFromProps = props[theme];

  if (colorFromProps !== undefined) {
    return colorFromProps;
  }
  return colors[PALETTE_KEYS[colorName]];
}

import { Platform } from 'react-native';

import { AppPaletteDark, AppPaletteLight } from '@/constants/app-palette';

export const Colors = {
  light: {
    text: AppPaletteLight.text,
    background: AppPaletteLight.background,
    tint: AppPaletteLight.primary,
    icon: AppPaletteLight.textMuted,
    tabIconDefault: AppPaletteLight.tabInactive,
    tabIconSelected: AppPaletteLight.primary,
  },
  dark: {
    text: AppPaletteDark.text,
    background: AppPaletteDark.background,
    tint: AppPaletteDark.primary,
    icon: AppPaletteDark.textMuted,
    tabIconDefault: AppPaletteDark.tabInactive,
    tabIconSelected: AppPaletteDark.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

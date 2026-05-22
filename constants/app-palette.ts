/**
 * Palette GoLivra — clair + sombre (inspiré Supabase : fond noir/gris, accents vert lumineux).
 */

export type ColorSchemeName = 'light' | 'dark';

export type AppPalette = {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryBright: string;
  primaryDeep: string;
  primarySoft: string;
  primaryMuted: string;
  onPrimary: string;
  success: string;
  successSoft: string;
  error: string;
  errorSoft: string;
  warning: string;
  warningSoft: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabInactive: string;
  inputBg: string;
  inputBorder: string;
  placeholder: string;
  overlay: string;
  heroGlow: string;
  statusBar: 'light' | 'dark';
};

/** Vert marque GoLivra — unique référence pour toute l’application. */
export const GOLIVRA_GREEN = '#0B6B45';
export const GOLIVRA_GREEN_DEEP = '#0C4F36';

/** Ombre / halo associés au vert (pas une autre teinte de vert). */
export const GOLIVRA_BRAND_SHADOW = '#0C3020';

export function rgbaBrand(alpha: number): string {
  return `rgba(11, 107, 69, ${alpha})`;
}

/** Dégradé FAB / bannières : uniquement la famille du vert marque. */
export function brandGradient3(colors: AppPalette): readonly [string, string, string] {
  return [colors.primaryDeep, colors.primary, colors.primaryDeep] as const;
}

export const AppPaletteLight: AppPalette = {
  background: '#FFFFFF',
  backgroundAlt: '#F6FAF7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F4F6F5',
  border: '#E8F2EC',
  borderStrong: '#D6E6DC',
  text: '#11181C',
  textSecondary: '#355245',
  textMuted: '#6A8578',
  textInverse: '#FFFFFF',
  primary: GOLIVRA_GREEN,
  primaryBright: GOLIVRA_GREEN,
  primaryDeep: GOLIVRA_GREEN_DEEP,
  primarySoft: '#EAF4EE',
  primaryMuted: rgbaBrand(0.12),
  onPrimary: '#FFFFFF',
  success: GOLIVRA_GREEN,
  successSoft: '#ECFDF3',
  error: '#B42318',
  errorSoft: '#FEF3F2',
  warning: '#9A6B2E',
  warningSoft: '#FFF6D8',
  tabBarBg: 'rgba(255,255,255,0.92)',
  tabBarBorder: '#E8F2EC',
  tabInactive: '#6A8075',
  inputBg: '#FFFFFF',
  inputBorder: '#ECF4EF',
  placeholder: '#95ACA0',
  overlay: 'rgba(12, 48, 32, 0.45)',
  heroGlow: '#EAF4EE',
  statusBar: 'dark',
};

export const AppPaletteDark: AppPalette = {
  background: '#0B0C0E',
  backgroundAlt: '#101214',
  surface: '#15171A',
  surfaceElevated: '#1C1F24',
  surfaceMuted: '#121416',
  border: '#2A2F36',
  borderStrong: '#363C45',
  text: '#EDEDEF',
  textSecondary: '#C4C8CC',
  textMuted: '#8B939C',
  textInverse: '#0B0C0E',
  primary: GOLIVRA_GREEN,
  primaryBright: GOLIVRA_GREEN,
  primaryDeep: GOLIVRA_GREEN_DEEP,
  primarySoft: rgbaBrand(0.15),
  primaryMuted: rgbaBrand(0.2),
  onPrimary: '#FFFFFF',
  success: GOLIVRA_GREEN,
  successSoft: rgbaBrand(0.12),
  error: '#F87171',
  errorSoft: 'rgba(248, 113, 113, 0.12)',
  warning: '#FBBF24',
  warningSoft: 'rgba(251, 191, 36, 0.12)',
  tabBarBg: 'rgba(15, 17, 20, 0.94)',
  tabBarBorder: '#2A2F36',
  tabInactive: '#7A848E',
  inputBg: '#1C1F24',
  inputBorder: '#2A2F36',
  placeholder: '#6B7280',
  overlay: 'rgba(0, 0, 0, 0.65)',
  heroGlow: rgbaBrand(0.08),
  statusBar: 'light',
};

export function paletteForScheme(scheme: ColorSchemeName): AppPalette {
  return scheme === 'dark' ? AppPaletteDark : AppPaletteLight;
}

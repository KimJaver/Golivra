import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { router } from 'expo-router';
import { Platform } from 'react-native';

import type { AppPalette } from '@/constants/app-palette';

/** Options stack partagées — navigation fluide type apps grand public. */
export function stackScreenOptions(colors: AppPalette): NativeStackNavigationOptions {
  return {
    headerShown: false,
    animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
    gestureEnabled: true,
    fullScreenGestureEnabled: Platform.OS === 'ios',
    animationDuration: 280,
    contentStyle: { backgroundColor: colors.background },
  };
}

export function stackTabRootOptions(): NativeStackNavigationOptions {
  return {
    animation: 'none',
    gestureEnabled: false,
  };
}

export function stackAuthOptions(): NativeStackNavigationOptions {
  return {
    animation: 'fade',
    animationDuration: 220,
    gestureEnabled: false,
  };
}

export function stackModalOptions(colors: AppPalette): NativeStackNavigationOptions {
  return {
    presentation: 'modal',
    animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'fade_from_bottom',
    gestureEnabled: true,
    contentStyle: { backgroundColor: colors.background },
  };
}

/** Réinitialise la pile puis ouvre la connexion (après déconnexion). */
export function navigateToAuthAfterLogout(): void {
  try {
    router.dismissAll();
  } catch {
    /* ignore */
  }
  router.replace('/auth');
}

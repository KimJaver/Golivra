import * as Sentry from '@sentry/react-native';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import 'react-native-reanimated';

import { AppThemeProvider, useAppTheme } from '@/contexts/app-theme-context';
import { stackAuthOptions, stackScreenOptions } from '@/lib/app-navigation';

// Initialisation de Sentry pour le suivi des erreurs
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === 'production',
});

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigation() {
  const { colors, isDark } = useAppTheme();

  const navTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.primary,
      },
    }),
    [isDark, colors],
  );

  return (
    <NavThemeProvider value={navTheme}>
      <Stack screenOptions={stackScreenOptions(colors)}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" options={stackAuthOptions()} />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="signup" options={stackAuthOptions()} />
        <Stack.Screen name="signup/choose" options={stackAuthOptions()} />
        <Stack.Screen name="signup/client" options={stackAuthOptions()} />
        <Stack.Screen name="signup/restaurant" options={stackAuthOptions()} />
        <Stack.Screen name="signup/boutique" options={stackAuthOptions()} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade', animationDuration: 200 }} />
        <Stack.Screen name="vendor" options={{ animation: 'fade', animationDuration: 200 }} />
        <Stack.Screen name="courier" options={{ animation: 'fade', animationDuration: 200 }} />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="account-settings" />
        <Stack.Screen name="my-addresses" />
        <Stack.Screen name="payment-methods" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="how-multi-delivery" />
        <Stack.Screen name="order-deliveries-summary" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
      <StatusBar style={colors.statusBar} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootNavigation />
    </AppThemeProvider>
  );
}

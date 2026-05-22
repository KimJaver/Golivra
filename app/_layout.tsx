import * as Sentry from '@sentry/react-native';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import 'react-native-reanimated';

import { AppThemeProvider, useAppTheme } from '@/contexts/app-theme-context';

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
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="signup/choose" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="signup/client" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="signup/restaurant" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="signup/boutique" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="vendor" options={{ headerShown: false }} />
        <Stack.Screen name="courier" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="account-settings" options={{ headerShown: false }} />
        <Stack.Screen name="my-addresses" options={{ headerShown: false }} />
        <Stack.Screen name="payment-methods" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="how-multi-delivery" options={{ headerShown: false }} />
        <Stack.Screen name="order-deliveries-summary" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
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

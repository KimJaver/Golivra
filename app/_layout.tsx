import * as Sentry from '@sentry/react-native';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import 'react-native-reanimated';

import { AppThemeProvider, useAppTheme } from '@/contexts/app-theme-context';
import { stackAuthOptions, stackScreenOptions } from '@/lib/app-navigation';
import {
  initializeNotifications,
  setupNotificationListeners,
  handleInitialNotification,
} from '@/lib/notifications-service';

const sentryDsn =
  process.env.EXPO_PUBLIC_SENTRY_DSN?.trim() ||
  String((Constants.expoConfig?.extra as { sentryDsn?: string } | undefined)?.sentryDsn ?? '').trim();

Sentry.init({
  dsn: sentryDsn || undefined,
  tracesSampleRate: 1.0,
  enabled: Boolean(sentryDsn) && !__DEV__,
});

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigation() {
  const { colors, isDark } = useAppTheme();

  // ── Initialisation des notifications push au démarrage ──────────────────
  useEffect(() => {
    // Initialise permission + channel Android + enregistrement token
    void initializeNotifications();

    // Gère le cas où l'app est ouverte depuis une notification (état killed)
    void handleInitialNotification();

    // Configure les listeners foreground + tap (background)
    const cleanup = setupNotificationListeners(
      // Notification reçue en foreground (optionnel : logique supplémentaire)
      (_notification) => {
        // Ex : rafraîchir le badge ou le compteur non lu
      },
      // Notification tappée (navigation gérée automatiquement dans setupNotificationListeners)
      (_response) => {},
    );

    return cleanup;
  }, []);

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


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
});

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <RootNavigation />
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(RootLayout);


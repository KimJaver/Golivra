import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { CourierProvider } from '@/contexts/courier-context';
import { useAppTheme } from '@/contexts/app-theme-context';

export default function CourierRootLayout() {
  const { colors } = useAppTheme();

  return (
    <CourierProvider>
      <StatusBar style={colors.statusBar} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.backgroundAlt },
        }}>
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="mission/[id]" />
      </Stack>
    </CourierProvider>
  );
}

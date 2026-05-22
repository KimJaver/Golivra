import { Stack } from 'expo-router';

import { CourierProvider } from '@/contexts/courier-context';

export default function CourierRootLayout() {
  return (
    <CourierProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="mission/[id]" />
      </Stack>
    </CourierProvider>
  );
}

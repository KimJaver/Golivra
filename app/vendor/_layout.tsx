import { Stack } from 'expo-router';

import { VendorProvider } from '@/contexts/vendor-context';

export default function VendorRootLayout() {
  return (
    <VendorProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="order/[id]" />
        <Stack.Screen name="preparation/[id]" />
        <Stack.Screen name="add-product" />
        <Stack.Screen name="stock/[id]" />
        <Stack.Screen name="statistics" />
        <Stack.Screen name="delivery" />
        <Stack.Screen name="create-external-delivery" />
        <Stack.Screen name="wallet" />
        <Stack.Screen name="catalog" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="shop-info" />
        <Stack.Screen name="shop-addresses" />
        <Stack.Screen name="shop-payments" />
        <Stack.Screen name="shop-settings" />
        <Stack.Screen name="help-center" />
      </Stack>
    </VendorProvider>
  );
}

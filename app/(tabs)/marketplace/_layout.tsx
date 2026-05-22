import { Stack } from 'expo-router';

import { GOLIVRA_GREEN } from '@/constants/app-palette';
import { useAppColors } from '@/hooks/use-app-colors';

export default function MarketplaceStackLayout() {
  const colors = useAppColors();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[enterpriseId]"
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: 'Retour',
          headerTintColor: GOLIVRA_GREEN,
          headerStyle: { backgroundColor: colors.surface },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}

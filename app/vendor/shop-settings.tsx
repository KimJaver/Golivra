import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeModePicker } from '@/components/theme-mode-picker';
import { VendorScreenHeader } from '@/components/vendor-screen-header';
import { ThemedView } from '@/components/themed-view';

export default function VendorShopSettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.screen}>
      <VendorScreenHeader title="Apparence" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20, paddingHorizontal: 18, gap: 16 }}>
        <ThemeModePicker
          title="Thème de l'application"
          hint="Mode clair, sombre ou selon les réglages du téléphone."
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});

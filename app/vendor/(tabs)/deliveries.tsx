import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VendorDeliveryPanel } from '@/components/vendor-delivery-panel';
import { VendorTabHeader } from '@/components/vendor-tab-header';
import { ThemedView } from '@/components/themed-view';
import { VENDOR_TAB_BAR_PADDING_BOTTOM } from '@/constants/vendor-layout';
import { useAppColors } from '@/hooks/use-app-colors';

export default function VendorDeliveriesTabScreen() {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();
  const bottom = Math.max(insets.bottom, 10) + VENDOR_TAB_BAR_PADDING_BOTTOM;

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      <VendorTabHeader title="LIVRAISONS" />
      <ScrollView contentContainerStyle={{ paddingBottom: bottom }}>
        <VendorDeliveryPanel embedded />
      </ScrollView>
    </ThemedView>
  );
}

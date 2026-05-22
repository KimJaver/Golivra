import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useVendorTheme } from '@/hooks/use-vendor-theme';

type Props = {
  title: string;
  right?: React.ReactNode;
};

/** En-tête pour les onglets vendeur (sans flèche retour). */
export function VendorTabHeader({ title, right }: Props) {
  const insets = useSafeAreaInsets();
  const { palette } = useVendorTheme();
  return (
    <View style={[styles.row, { paddingTop: Math.max(insets.top, 8) }]}>
      <ThemedText type="defaultSemiBold" style={[styles.title, { color: palette.primaryDeep }]} numberOfLines={2}>
        {title}
      </ThemedText>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  right: { minWidth: 44, alignItems: 'flex-end' },
});

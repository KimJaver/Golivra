import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { brandGradient3, GOLIVRA_BRAND_SHADOW } from '@/constants/app-palette';
import { LUCIDE_STROKE } from '@/constants/icons';
import { useAppColors } from '@/hooks/use-app-colors';

type Props = {
  label: string;
  bottom: number;
  onPress: () => void;
};

function triggerHaptic() {
  if (process.env.EXPO_OS === 'ios') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

/** FAB ajout plat / produit (onglet Menu ou Produits vendeur). */
export function VendorAddProductFab({ label, bottom, onPress }: Props) {
  const colors = useAppColors();

  return (
    <View style={[styles.host, { bottom }]} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => {
          triggerHaptic();
          onPress();
        }}
        style={({ pressed }) => [styles.press, pressed && styles.pressPressed]}>
        <View
          style={[
            styles.labelChip,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: GOLIVRA_BRAND_SHADOW,
            },
          ]}>
          <ThemedText style={[styles.labelText, { color: colors.text }]} numberOfLines={1}>
            {label}
          </ThemedText>
        </View>
        <LinearGradient
          colors={brandGradient3(colors)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fab, { borderColor: colors.surface }]}>
          <Plus size={28} color={colors.onPrimary} strokeWidth={LUCIDE_STROKE} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const FAB_SIZE = 58;

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    right: 18,
    left: 18,
    alignItems: 'flex-end',
    zIndex: 30,
  },
  press: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: '100%',
  },
  pressPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  labelChip: {
    flexShrink: 1,
    maxWidth: '72%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '800',
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: GOLIVRA_BRAND_SHADOW,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 12,
  },
});

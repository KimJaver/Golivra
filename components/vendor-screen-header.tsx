import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { LUCIDE_STROKE } from '@/constants/icons';
import { useAppColors } from '@/hooks/use-app-colors';
import { useVendorTheme } from '@/hooks/use-vendor-theme';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
};

export function VendorScreenHeader({ title, subtitle, right, onBack }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { palette } = useVendorTheme();
  const colors = useAppColors();

  return (
    <View style={[styles.row, { paddingTop: Math.max(insets.top, 8) }]}>
      <Pressable
        style={styles.backBtn}
        onPress={onBack ?? (() => router.back())}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Retour">
        <ChevronLeft size={28} color={palette.primaryDeep} strokeWidth={LUCIDE_STROKE} />
      </Pressable>
      <View style={styles.titleWrap}>
        <ThemedText type="defaultSemiBold" style={[styles.title, { color: palette.primaryDeep }]} numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      <View style={styles.rightSlot}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 10,
    minHeight: 48,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  rightSlot: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
    minHeight: 44,
  },
});

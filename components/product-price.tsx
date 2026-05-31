import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { ProductPublic } from '@/lib/catalog';
import { formatFcfa } from '@/lib/format';
import { formatPromoDurationLabel, resolveProductPricing } from '@/lib/product-promo';
import { useAppColors } from '@/hooks/use-app-colors';

type Props = {
  product: Pick<ProductPublic, 'prix' | 'prix_promo' | 'promo_debut_at' | 'promo_fin_at'>;
  size?: 'sm' | 'md';
  showDuration?: boolean;
  showBadge?: boolean;
};

export function ProductPrice({
  product,
  size = 'md',
  showDuration = true,
  showBadge = false,
}: Props) {
  const colors = useAppColors();
  const pricing = resolveProductPricing(product);
  const duration = showDuration
    ? formatPromoDurationLabel(pricing.promoDebutAt, pricing.promoFinAt)
    : null;

  const priceSize = size === 'sm' ? 14 : 15;
  const oldSize = size === 'sm' ? 12 : 13;
  const durationSize = size === 'sm' ? 11 : 12;

  if (!pricing.promoActive) {
    return (
      <ThemedText style={[styles.regularPrice, { color: colors.primary, fontSize: priceSize }]}>
        {formatFcfa(pricing.basePrice)}
      </ThemedText>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {showBadge && pricing.discountPercent != null && pricing.discountPercent > 0 ? (
          <View style={[styles.badge, { backgroundColor: colors.success }]}>
            <ThemedText style={[styles.badgeText, { color: colors.onPrimary }]}>
              −{pricing.discountPercent}%
            </ThemedText>
          </View>
        ) : null}
        <ThemedText style={[styles.promoPrice, { color: colors.success, fontSize: priceSize }]}>
          {formatFcfa(pricing.displayPrice)}
        </ThemedText>
        <ThemedText style={[styles.oldPrice, { color: colors.textMuted, fontSize: oldSize }]}>
          {formatFcfa(pricing.basePrice)}
        </ThemedText>
      </View>
      {duration ? (
        <ThemedText style={[styles.duration, { color: colors.textMuted, fontSize: durationSize }]}>
          {duration}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 6, gap: 2 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  regularPrice: { fontWeight: '800', marginTop: 6 },
  promoPrice: { fontWeight: '800' },
  oldPrice: { fontWeight: '600', textDecorationLine: 'line-through' },
  duration: { fontWeight: '500', marginTop: 2 },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { fontSize: 11, fontWeight: '800' },
});

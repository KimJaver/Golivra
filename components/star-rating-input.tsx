import { Pressable, StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { LUCIDE_STROKE } from '@/constants/icons';

const GOLD = '#F59E0B';

type Props = {
  value: number;
  onChange: (note: number) => void;
  disabled?: boolean;
  size?: number;
  label?: string;
};

export function StarRatingInput({ value, onChange, disabled, size = 32, label }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <ThemedText style={styles.label}>{label}</ThemedText> : null}
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= value;
          return (
            <Pressable
              key={n}
              disabled={disabled}
              onPress={() => onChange(n)}
              hitSlop={6}
              style={({ pressed }) => [styles.starBtn, pressed && !disabled && styles.starPressed]}>
              <Star
                size={size}
                color={GOLD}
                fill={filled ? GOLD : 'transparent'}
                strokeWidth={LUCIDE_STROKE}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starBtn: {
    padding: 2,
  },
  starPressed: {
    opacity: 0.85,
    transform: [{ scale: 1.08 }],
  },
});

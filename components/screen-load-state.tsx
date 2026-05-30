import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useAppColors } from '@/hooks/use-app-colors';

type Props = {
  loading?: boolean;
  message?: string;
  compact?: boolean;
  style?: ViewStyle;
};

/** Indicateur de chargement discret (sans message d’erreur rouge). */
export function ScreenLoadState({ loading = true, message = 'Chargement…', compact, style }: Props) {
  const colors = useAppColors();
  if (!loading) return null;

  return (
    <View style={[compact ? styles.compact : styles.box, style]}>
      <ActivityIndicator size={compact ? 'small' : 'large'} color={colors.primary} />
      {message ? (
        <ThemedText style={[styles.text, { color: colors.textMuted }]}>{message}</ThemedText>
      ) : null}
    </View>
  );
}

type EmptyProps = {
  title: string;
  body?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

/** État vide ou erreur réseau — style neutre, pas de rouge alarmant. */
export function ScreenEmptyState({ title, body, onRetry, retryLabel = 'Réessayer' }: EmptyProps) {
  const colors = useAppColors();

  return (
    <View style={styles.empty}>
      <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>{title}</ThemedText>
      {body ? (
        <ThemedText style={[styles.emptyBody, { color: colors.textMuted }]}>{body}</ThemedText>
      ) : null}
      {onRetry ? (
        <Pressable
          style={[styles.retry, { backgroundColor: colors.primary }]}
          onPress={onRetry}>
          <ThemedText style={[styles.retryText, { color: colors.onPrimary }]}>{retryLabel}</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 12,
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  text: { fontSize: 14 },
  empty: {
    alignItems: 'center',
    padding: 24,
    gap: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  emptyBody: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  retry: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { fontWeight: '800' },
});

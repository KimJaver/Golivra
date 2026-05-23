import { LogOut } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { LUCIDE_STROKE } from '@/constants/icons';
import { useAppColors } from '@/hooks/use-app-colors';
import { useLogout } from '@/hooks/use-logout';

type Props = {
  clearCart?: boolean;
  variant?: 'filled' | 'ghost';
};

export function AppLogoutButton({ clearCart, variant = 'ghost' }: Props) {
  const colors = useAppColors();
  const { confirmLogout, loggingOut } = useLogout({ clearCart });

  const filled = variant === 'filled';

  return (
    <Pressable
      onPress={confirmLogout}
      disabled={loggingOut}
      style={({ pressed }) => [
        styles.btn,
        filled
          ? { backgroundColor: colors.errorSoft, borderColor: colors.error }
          : { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && !loggingOut && { opacity: 0.88 },
        loggingOut && styles.disabled,
      ]}
      android_ripple={{ color: filled ? 'rgba(220,38,38,0.12)' : colors.primaryMuted }}>
      <View style={styles.inner}>
        {loggingOut ? (
          <ActivityIndicator size="small" color={colors.error} />
        ) : (
          <LogOut size={18} color={colors.error} strokeWidth={LUCIDE_STROKE} />
        )}
        <ThemedText style={[styles.label, { color: colors.error }]}>
          {loggingOut ? 'Déconnexion…' : 'Se déconnecter'}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.65,
  },
});

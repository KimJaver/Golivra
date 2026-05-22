import { useRouter } from 'expo-router';
import { ChevronRight, Lock, User } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VendorScreenHeader } from '@/components/vendor-screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LUCIDE_STROKE } from '@/constants/icons';
import { useAppColors } from '@/hooks/use-app-colors';
import { useVendorTheme } from '@/hooks/use-vendor-theme';

export default function VendorShopSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useAppColors();
  const { palette } = useVendorTheme();

  const row = (icon: ReactNode, title: string, sub: string, onPress: () => void) => (
    <Pressable style={({ pressed }) => [styles.row, { backgroundColor: pressed ? colors.primarySoft : colors.surface }]} onPress={onPress}>
      <View style={[styles.ico, { backgroundColor: colors.primarySoft, borderColor: colors.borderStrong }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold" style={[styles.t, { color: colors.text }]}>{title}</ThemedText>
        <ThemedText style={[styles.sub, { color: colors.textMuted }]}>{sub}</ThemedText>
      </View>
      <ChevronRight size={20} color={colors.textMuted} strokeWidth={LUCIDE_STROKE} />
    </Pressable>
  );

  return (
    <ThemedView style={styles.screen}>
      <VendorScreenHeader title="Paramètres" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          {row(<User size={20} color={palette.primary} strokeWidth={LUCIDE_STROKE} />, 'Profil personnel', 'Nom, téléphone, photo de profil', () => router.push('/account-settings'))}
          <View style={[styles.div, { backgroundColor: colors.border }]} />
          {row(<Lock size={20} color={palette.primary} strokeWidth={LUCIDE_STROKE} />, 'Mot de passe', 'Modifier votre mot de passe de connexion', () => router.push('/account-settings'))}
        </View>
        <ThemedText style={[styles.note, { color: colors.textMuted }]}>Les notifications push et le mode sombre seront ajoutés lorsque les préférences utilisateur seront disponibles côté API.</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  card: { marginHorizontal: 18, marginTop: 8, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  ico: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  t: { fontSize: 15 },
  sub: { fontSize: 12, marginTop: 2 },
  div: { height: StyleSheet.hairlineWidth, marginLeft: 64 },
  note: { marginHorizontal: 22, marginTop: 16, fontSize: 12, lineHeight: 18 },
});

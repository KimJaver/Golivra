import { ChevronDown } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VendorScreenHeader } from '@/components/vendor-screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LUCIDE_STROKE } from '@/constants/icons';
import { useVendor } from '@/contexts/vendor-context';
import { useAppColors } from '@/hooks/use-app-colors';
import { useVendorTheme } from '@/hooks/use-vendor-theme';
import { formatFcfa } from '@/lib/format';
import { computeVendorStats } from '@/lib/vendor-types';

const PERIODS = [
  { days: 7, label: '7 jours' },
  { days: 30, label: '30 jours' },
  { days: 90, label: '90 jours' },
] as const;

export default function VendorStatisticsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();
  const { orders, products } = useVendor();
  const { palette } = useVendorTheme();
  const [periodDays, setPeriodDays] = useState(7);
  const [pickerOpen, setPickerOpen] = useState(false);

  const periodLabel = PERIODS.find((p) => p.days === periodDays)?.label ?? `${periodDays} jours`;
  const stats = useMemo(
    () => computeVendorStats(orders, products, periodDays),
    [orders, products, periodDays],
  );

  return (
    <ThemedView style={styles.screen}>
      <VendorScreenHeader
        title="STATISTIQUES"
        right={
          <Pressable style={styles.dd} hitSlop={8} onPress={() => setPickerOpen(true)}>
            <ThemedText style={[styles.ddTxt, { color: colors.text }]}>{periodLabel}</ThemedText>
            <ChevronDown size={18} color={colors.text} strokeWidth={LUCIDE_STROKE} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: insets.bottom + 20 }}>
        <View style={[styles.bigCard, { backgroundColor: colors.primarySoft }]}>
          <ThemedText style={[styles.revLab, { color: colors.textSecondary }]}>Revenus ({periodLabel})</ThemedText>
          <ThemedText style={[styles.revVal, { color: colors.text }]}>{formatFcfa(stats.revenus7j)}</ThemedText>
          <ThemedText style={[styles.trend, { color: colors.success }]}>{stats.revenusTrend}</ThemedText>
        </View>
        <View style={styles.row2}>
          <View style={[styles.smallCard, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
            <ThemedText style={[styles.sLab, { color: colors.textSecondary }]}>Commandes</ThemedText>
            <ThemedText style={[styles.sVal, { color: colors.text }]}>{stats.commandes}</ThemedText>
            <ThemedText style={[styles.sTrend, { color: colors.success }]}>{stats.commandesTrend}</ThemedText>
          </View>
          <View style={[styles.smallCard, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
            <ThemedText style={[styles.sLab, { color: colors.textSecondary }]}>Produits vendus</ThemedText>
            <ThemedText style={[styles.sVal, { color: colors.text }]}>{stats.produitsVendus}</ThemedText>
            <ThemedText style={[styles.sTrend, { color: colors.success }]}>{stats.produitsTrend}</ThemedText>
          </View>
        </View>
        <ThemedText type="defaultSemiBold" style={[styles.h, { color: colors.text }]}>
          Top produits
        </ThemedText>
        {stats.topProduits.length === 0 ? (
          <ThemedText style={[styles.empty, { color: colors.textMuted }]}>Pas encore de ventes enregistrées.</ThemedText>
        ) : (
          stats.topProduits.map((t) => (
            <View key={t.nom} style={[styles.topRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.miniThumb, { backgroundColor: colors.surfaceMuted }]} />
              <ThemedText style={{ flex: 1, fontWeight: '700', color: colors.text }}>{t.nom}</ThemedText>
              <ThemedText style={[styles.ventes, { color: colors.textMuted }]}>{t.ventes} ventes</ThemedText>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.modalBg} onPress={() => setPickerOpen(false)}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            {PERIODS.map((p) => (
              <Pressable
                key={p.days}
                style={[styles.modalRow, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setPeriodDays(p.days);
                  setPickerOpen(false);
                }}>
                <ThemedText style={[styles.modalRowText, { color: colors.text }]}>{p.label}</ThemedText>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  dd: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ddTxt: { fontWeight: '800', fontSize: 13 },
  bigCard: { borderRadius: 16, padding: 18, marginBottom: 14 },
  revLab: { fontSize: 13, fontWeight: '700' },
  revVal: { fontSize: 28, fontWeight: '800', marginTop: 6 },
  trend: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  row2: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  smallCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sLab: { fontSize: 12, fontWeight: '700' },
  sVal: { fontSize: 22, fontWeight: '800', marginTop: 6 },
  sTrend: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  h: { fontSize: 16, marginBottom: 12 },
  empty: { fontSize: 14, marginBottom: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  miniThumb: { width: 40, height: 40, borderRadius: 8 },
  ventes: { fontSize: 13, fontWeight: '700' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 },
  modalCard: { borderRadius: 16, overflow: 'hidden' },
  modalRow: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth },
  modalRowText: { fontSize: 16, fontWeight: '700' },
});

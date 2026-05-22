import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VendorTabHeader } from '@/components/vendor-tab-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LUCIDE_STROKE } from '@/constants/icons';
import { VENDOR_TAB_BAR_PADDING_BOTTOM } from '@/constants/vendor-layout';
import { useVendor } from '@/contexts/vendor-context';
import { useAppColors } from '@/hooks/use-app-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useVendorTheme } from '@/hooks/use-vendor-theme';
import { useRealtimeOrders } from '@/hooks/use-realtime-orders';
import { formatFcfa } from '@/lib/format';
import { getSessionToken } from '@/lib/auth';
import { livraisonStatutLabel } from '@/lib/vendor-api';
import type { VendorPalette } from '@/lib/vendor-theme';
import type { VendorOrder, VendorOrderStatus } from '@/lib/vendor-types';
import { hrefVendorOrder } from '@/lib/vendor-nav';

type FilterKey = 'all' | 'prep' | 'ship';

function statusLabel(s: VendorOrderStatus): string {
  const m: Record<VendorOrderStatus, string> = {
    en_attente: 'Nouvelle',
    acceptee: 'Acceptée',
    a_preparer: 'À préparer',
    en_preparation: 'En préparation',
    prete: 'Prête — GoLivra',
    en_livraison: 'En livraison GoLivra',
    livree: 'Livrée',
    annulee: 'Annulée',
  };
  return m[s];
}

function statusStyle(s: VendorOrderStatus, colors: ReturnType<typeof useAppColors>) {
  switch (s) {
    case 'en_attente':
      return { bg: colors.warningSoft, text: colors.warning };
    case 'acceptee':
    case 'a_preparer':
      return { bg: colors.successSoft, text: colors.success };
    case 'en_preparation':
      return { bg: colors.warningSoft, text: colors.warning };
    case 'prete':
      return { bg: colors.successSoft, text: colors.primaryDeep };
    case 'en_livraison':
      return { bg: colors.primarySoft, text: colors.primary };
    case 'livree':
      return { bg: colors.successSoft, text: colors.primaryDeep };
    case 'annulee':
      return { bg: colors.errorSoft, text: colors.error };
    default:
      return { bg: colors.surfaceMuted, text: colors.textSecondary };
  }
}

function matchesFilter(o: VendorOrder, f: FilterKey): boolean {
  if (f === 'all') return true;
  if (f === 'prep')
    return (
      o.statut === 'en_attente' ||
      o.statut === 'a_preparer' ||
      o.statut === 'en_preparation' ||
      o.statut === 'prete'
    );
  if (f === 'ship') return o.statut === 'en_livraison';
  return true;
}

export default function VendorOrdersTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useAppColors();
  const colorScheme = useColorScheme();
  const { orders, refresh, shop } = useVendor();
  const { palette, labels } = useVendorTheme();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [token, setToken] = useState<string | null>(null);
  const bottom = Math.max(insets.bottom, 10) + VENDOR_TAB_BAR_PADDING_BOTTOM;

  // Récupérer le token au montage
  useEffect(() => {
    getSessionToken().then(setToken);
  }, []);

  // --- REALTIME: Écoute les nouvelles commandes ---
  useRealtimeOrders({
    enterpriseId: shop?.id || null,
    refreshOrders: refresh,
    token,
  });

  const counts = useMemo(() => {
    const all = orders.filter((o) => matchesFilter(o, 'all')).length;
    const prep = orders.filter((o) => matchesFilter(o, 'prep')).length;
    const ship = orders.filter((o) => matchesFilter(o, 'ship')).length;
    return { all, prep, ship };
  }, [orders]);

  const list = useMemo(() => orders.filter((o) => matchesFilter(o, filter)), [orders, filter]);

  const pills = labels.orderListFilters.map((p) => {
    const n = p.key === 'all' ? counts.all : p.key === 'prep' ? counts.prep : counts.ship;
    return { ...p, label: `${p.label} (${n})` };
  });

  return (
    <ThemedView style={styles.screen}>
      <VendorTabHeader
        title="LISTE COMMANDES"
        right={
          <Pressable hitSlop={10} onPress={() => {}}>
            <Search size={22} color={palette.primaryDeep} strokeWidth={LUCIDE_STROKE} />
          </Pressable>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottom }]}>
        <View style={styles.pillRow}>
          {pills.map((p) => {
            const on = filter === p.key;
            return (
              <Pressable
                key={p.key}
                style={[styles.pill, on ? { backgroundColor: colors.primary } : { backgroundColor: colors.surfaceMuted }]}
                onPress={() => setFilter(p.key)}>
                <ThemedText style={[styles.pillText, on ? { color: colors.onPrimary } : { color: colors.textSecondary }]}>{p.label}</ThemedText>
              </Pressable>
            );
          })}
        </View>

        {list.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>Aucune commande</ThemedText>
            <ThemedText style={[styles.emptyHint, { color: colors.textMuted }]}>Les commandes de vos clients apparaîtront ici.</ThemedText>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {list.map((o) => {
              const st = statusStyle(o.statut, colors);
              return (
                <Pressable
                  key={o.id}
                  style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colorScheme === 'dark' ? colors.primary : '#0C3020' }]}
                  onPress={() => router.push(hrefVendorOrder(o.id))}
                  android_ripple={{ color: colors.primarySoft }}>
                  <View style={styles.cardTop}>
                    <ThemedText type="defaultSemiBold" style={[styles.ref, { color: colors.text }]}>
                      #{o.ref}
                    </ThemedText>
                    <ThemedText type="defaultSemiBold" style={[styles.price, { color: colors.text }]}>
                      {formatFcfa(o.prixTotal)}
                    </ThemedText>
                  </View>
                  <ThemedText type="defaultSemiBold" style={[styles.client, { color: colors.text }]}>
                    {o.clientNom}
                  </ThemedText>
                  {(o.statut === 'prete' || o.statut === 'en_livraison') && o.livraison_statut ? (
                    <ThemedText style={[styles.deliveryHint, { color: colors.primary }]} numberOfLines={1}>
                      GoLivra · {livraisonStatutLabel(o.livraison_statut)}
                    </ThemedText>
                  ) : null}
                  <View style={styles.cardBottom}>
                    <ThemedText style={[styles.time, { color: colors.textMuted }]}>{o.creeLeLabel}</ThemedText>
                    <View style={[styles.badge, { backgroundColor: st.bg }]}>
                      <ThemedText style={[styles.badgeText, { color: st.text }]}>
                        {statusLabel(o.statut)}
                      </ThemedText>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { paddingHorizontal: 18, paddingTop: 6 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  pill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 },
  pillText: { fontSize: 13, fontWeight: '800' },
  emptyBox: {
    padding: 32,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { fontSize: 15, fontWeight: '700' },
  emptyHint: { fontSize: 13, textAlign: 'center' },
  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ref: { fontSize: 14 },
  price: { fontSize: 15 },
  client: { fontSize: 16, marginBottom: 10 },
  deliveryHint: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { fontSize: 13 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: '800' },
});


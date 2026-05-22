import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { MapPin, Store } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppContentWidth } from '@/components/app-content-width';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { COURIER_TAB_BAR_PADDING_BOTTOM } from '@/constants/courier-layout';
import { LUCIDE_STROKE } from '@/constants/icons';
import { useCourier } from '@/contexts/courier-context';
import { missionStatutLabel } from '@/lib/courier-api';
import { useCourierPalette } from '@/lib/courier-theme';
import { hrefCourierMission } from '@/lib/courier-nav';

export default function CourierMissionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useCourierPalette();
  const { missions, loading, error, refresh } = useCourier();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refresh().catch(() => undefined);
    }, [refresh]),
  );

  const active = missions.filter((m) => m.statut !== 'livree' && m.statut !== 'annulee');
  const done = missions.filter((m) => m.statut === 'livree' || m.statut === 'annulee');
  const bottom = Math.max(insets.bottom, 12) + COURIER_TAB_BAR_PADDING_BOTTOM;

  return (
    <ThemedView style={styles.screen} lightColor={palette.bg} darkColor={palette.bg}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              try {
                await refresh();
              } finally {
                setRefreshing(false);
              }
            }}
            tintColor={palette.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, 12), paddingBottom: bottom }]}>
        <AppContentWidth phonePadding={0}>
        <ThemedText type="title" style={[styles.title, { color: palette.primaryDeep }]}>
          Mes courses
        </ThemedText>
        <ThemedText style={[styles.sub, { color: palette.muted }]}>Missions attribuées par GoLivra</ThemedText>

        {loading && missions.length === 0 ? (
          <ActivityIndicator color={palette.primary} style={{ marginTop: 32 }} />
        ) : error ? (
          <View style={[styles.bannerErr, { borderColor: palette.border }]}>
            <ThemedText style={[styles.bannerErrText, { color: palette.danger }]}>{error}</ThemedText>
          </View>
        ) : null}

        <Section title={`En cours (${active.length})`} palette={palette} />
        {active.length === 0 ? (
          <ThemedText style={[styles.empty, { color: palette.muted }]}>Aucune course active pour le moment.</ThemedText>
        ) : (
          active.map((m) => <MissionCard key={m.id} mission={m} onPress={() => router.push(hrefCourierMission(m.id))} palette={palette} />)
        )}

        <Section title={`Historique (${done.length})`} palette={palette} />
        {done.length === 0 ? (
          <ThemedText style={[styles.empty, { color: palette.muted }]}>Pas encore d&apos;historique.</ThemedText>
        ) : (
          done.slice(0, 20).map((m) => (
            <MissionCard key={m.id} mission={m} muted onPress={() => router.push(hrefCourierMission(m.id))} palette={palette} />
          ))
        )}
        </AppContentWidth>
      </ScrollView>
    </ThemedView>
  );
}

function Section({ title, palette }: { title: string; palette: ReturnType<typeof useCourierPalette> }) {
  return <ThemedText style={[styles.section, { color: palette.primaryDeep }]}>{title}</ThemedText>;
}

function MissionCard({
  mission,
  muted,
  onPress,
  palette,
}: {
  mission: import('@/lib/courier-api').CourierMission;
  muted?: boolean;
  onPress: () => void;
  palette: ReturnType<typeof useCourierPalette>;
}) {
  return (
    <Pressable style={[styles.card, muted ? styles.cardMuted : undefined, { backgroundColor: palette.card, borderColor: palette.border }]} onPress={onPress}>
      <View style={styles.cardTop}>
        <ThemedText style={[styles.ref, { color: muted ? palette.muted : palette.text }]}>
          {mission.commerce_nom || mission.commande?.numero || mission.id.slice(0, 8).toUpperCase()}
        </ThemedText>
        <ThemedText style={[styles.statut, muted ? styles.statutMuted : undefined, { color: muted ? palette.muted : palette.primary }]}>
          {missionStatutLabel(mission.statut)}
        </ThemedText>
      </View>
      {mission.adresse_retrait ? (
        <View style={styles.line}>
          <Store size={14} color={palette.muted} strokeWidth={LUCIDE_STROKE} />
          <ThemedText style={[styles.lineText, { color: palette.textSecondary }]} numberOfLines={1}>
            {mission.adresse_retrait}
          </ThemedText>
        </View>
      ) : null}
      <View style={styles.line}>
        <MapPin size={14} color={palette.primary} strokeWidth={LUCIDE_STROKE} />
        <ThemedText style={[styles.lineText, { color: palette.textSecondary }]} numberOfLines={2}>
          {mission.adresse_livraison || '—'}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { paddingHorizontal: 18, gap: 10 },
  title: { fontSize: 28 },
  sub: { marginTop: -4, marginBottom: 8 },
  bannerErr: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  bannerErrText: { fontSize: 13 },
  section: { fontSize: 15, fontWeight: '900', marginTop: 12 },
  empty: { fontSize: 13, marginBottom: 8 },
  card: {
    borderRadius: 18,
    padding: 14,
    gap: 8,
    borderWidth: 1,
  },
  cardMuted: { opacity: 0.88 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ref: { fontWeight: '800', fontSize: 15 },
  statut: { fontSize: 11, fontWeight: '800' },
  statutMuted: {},
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  lineText: { flex: 1, fontSize: 13, lineHeight: 18 },
});

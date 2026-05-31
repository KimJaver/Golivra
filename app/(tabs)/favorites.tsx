import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { ChevronRight, Heart, LayoutGrid, Store, UtensilsCrossed } from 'lucide-react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LUCIDE_STROKE } from '@/constants/icons';
import { TAB_BAR_CONTENT_PADDING_BOTTOM } from '@/constants/layout';
import type { EnterprisePublic } from '@/lib/catalog';
import { fetchAllEnterprises, peekAllEnterprises } from '@/lib/client-data';
import { getFavoriteEnterpriseIds } from '@/lib/favorites';
import { resolveRemoteImageUrl } from '@/lib/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppColors } from '@/hooks/use-app-colors';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useAppColors();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [enterprises, setEnterprises] = useState<EnterprisePublic[]>([]);
  const [loading, setLoading] = useState(() => !peekAllEnterprises()?.length);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomPad = Math.max(insets.bottom, 16) + TAB_BAR_CONTENT_PADDING_BOTTOM;

  const applyFavorites = useCallback((ids: string[], list: EnterprisePublic[]) => {
    const idSet = new Set(ids);
    setEnterprises(list.filter((e) => idSet.has(e.id)));
  }, []);

  const load = useCallback(async (force = false) => {
    setError(null);
    try {
      const ids = await getFavoriteEnterpriseIds();
      setFavoriteIds(ids);
      if (ids.length === 0) {
        setEnterprises([]);
        return;
      }
      const cached = peekAllEnterprises();
      if (cached?.length) applyFavorites(ids, cached);
      const data = await fetchAllEnterprises(force);
      applyFavorites(ids, data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger les favoris.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [applyFavorites]);

  useFocusEffect(
    useCallback(() => {
      const cached = peekAllEnterprises();
      if (cached?.length) {
        setLoading(false);
        void getFavoriteEnterpriseIds().then((ids) => {
          setFavoriteIds(ids);
          applyFavorites(ids, cached);
        });
      }
      void load();
    }, [load, applyFavorites])
  );

  const onRefresh = () => {
    setRefreshing(true);
    void load();
  };

  return (
    <ThemedView style={styles.screen}>
      <View style={[styles.heroGlow, { backgroundColor: colors.heroGlow }]} />
      <FlatList
        data={enterprises}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={[styles.head, { paddingTop: Math.max(insets.top, 14) }]}>
            <ThemedText type="title" style={[styles.title, { color: colors.primaryDeep }]}>
              Favoris
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>Commerces enregistrés depuis l'accueil.</ThemedText>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
              <ThemedText style={[styles.muted, { color: colors.textMuted }]}>Chargement…</ThemedText>
            </View>
          ) : error ? (
            <View style={[styles.stateCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <ActivityIndicator color={colors.primary} />
              <ThemedText style={[styles.stateBody, { color: colors.textMuted }]}>Chargement des favoris…</ThemedText>
              <Pressable style={[styles.retry, { backgroundColor: colors.primary }]} onPress={() => void load(true)}>
                <ThemedText style={[styles.retryText, { color: colors.surface }]}>Actualiser</ThemedText>
              </Pressable>
            </View>
          ) : favoriteIds.length === 0 ? (
            <View style={[styles.stateCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft, borderColor: colors.borderStrong }]}>
                <Heart size={28} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
              </View>
              <ThemedText style={[styles.stateTitle, { color: colors.primaryDeep }]}>Aucun favori</ThemedText>
              <ThemedText style={[styles.stateBody, { color: colors.textMuted }]}>
                Touchez le cœur sur un commerce dans l'accueil pour le retrouver ici.
              </ThemedText>
              <Pressable style={[styles.retry, { backgroundColor: colors.primary }]} onPress={() => router.push('/(tabs)')}>
                <ThemedText style={[styles.retryText, { color: colors.surface }]}>Retour à l'accueil</ThemedText>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.stateCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <LayoutGrid size={36} color={colors.textMuted} strokeWidth={LUCIDE_STROKE} />
              <ThemedText style={[styles.stateTitle, { color: colors.primaryDeep }]}>Favoris indisponibles</ThemedText>
              <ThemedText style={[styles.stateBody, { color: colors.textMuted }]}>
                Ces commerces ne sont plus listés comme ouverts.
              </ThemedText>
              <Pressable style={[styles.retry, { backgroundColor: colors.primary }]} onPress={onRefresh}>
                <ThemedText style={[styles.retryText, { color: colors.surface }]}>Actualiser</ThemedText>
              </Pressable>
            </View>
          )
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        renderItem={({ item }) => {
          const img = resolveRemoteImageUrl(item.image_url);
          return (
            <Pressable
              style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}
              onPress={() => router.push(`/(tabs)/marketplace/${item.id}`)}
              android_ripple={{ color: colors.primaryMuted }}>
              <View style={[styles.thumbWrap, { backgroundColor: colors.primarySoft }]}>
                {img ? (
                  <Image source={{ uri: img }} style={styles.thumb} contentFit="cover" />
                ) : (
                  <View style={[styles.thumb, styles.thumbPh]}>
                    {item.type === 'restaurant' ? (
                      <UtensilsCrossed size={30} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
                    ) : (
                      <Store size={30} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
                    )}
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold" style={[styles.rowTitle, { color: colors.text }]}>
                  {item.nom ?? 'Commerce'}
                </ThemedText>
                <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
                  <ThemedText style={[styles.badgeText, { color: colors.primary }]}>{item.type === 'restaurant' ? 'Restaurant' : 'Boutique'}</ThemedText>
                </View>
                {item.adresse ? (
                  <ThemedText style={[styles.rowAddr, { color: colors.textMuted }]} numberOfLines={2}>
                    {item.adresse}
                  </ThemedText>
                ) : null}
              </View>
              <ChevronRight size={22} color={colors.textMuted} strokeWidth={LUCIDE_STROKE} />
            </Pressable>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  heroGlow: {
    position: 'absolute',
    top: -140,
    left: -90,
    width: 360,
    height: 360,
    borderRadius: 220,
  },
  head: { paddingHorizontal: 20, marginBottom: 14 },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { marginTop: 8, fontSize: 15, lineHeight: 22, opacity: 0.92 },
  list: { paddingHorizontal: 20, flexGrow: 1, gap: 14 },
  center: { paddingVertical: 48, alignItems: 'center', gap: 12 },
  muted: { fontSize: 15 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#0C3020',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  thumbWrap: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
  },
  thumb: { width: '100%', height: '100%' },
  thumbPh: { alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 17 },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { fontSize: 11, fontWeight: '800' },
  rowAddr: { fontSize: 13, marginTop: 8, lineHeight: 18 },
  stateCard: {
    marginHorizontal: 4,
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    gap: 12,
    alignItems: 'center',
  },
  stateError: {},
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  stateTitle: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
  stateBody: { fontSize: 14, lineHeight: 21, textAlign: 'center' },
  retry: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  retryText: { fontWeight: '800' },
});

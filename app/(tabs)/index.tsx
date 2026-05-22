import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import {
  Bell,
  ChevronRight,
  Heart,
  MoreHorizontal,
  ScrollText,
  Search,
  ShoppingBag,
  ShoppingBasket,
  SlidersHorizontal,
  Store,
  Tag,
  Truck,
  User,
  UtensilsCrossed,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeHeroCarousel, type HomeHeroSlide } from '@/components/home-hero-carousel';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LUCIDE_STROKE } from '@/constants/icons';
import { TAB_BAR_CONTENT_PADDING_BOTTOM } from '@/constants/layout';
import { apiFetch } from '@/lib/api';
import { getSessionToken } from '@/lib/auth';
import { fetchAllEnterprises, fetchAuthMe, peekAllEnterprises } from '@/lib/client-data';
import { getFavoriteEnterpriseIds, toggleFavoriteEnterpriseId } from '@/lib/favorites';
import { resolveRemoteImageUrl } from '@/lib/images';
import {
  DEFAULT_PUBLIC_PRICING,
  displayDeliveryFeeFcfa,
  FALLBACK_DELIVERY_FEE_FCFA,
  FALLBACK_MIN_ORDER_FCFA,
  fetchPublicPricing,
  type PublicPricing,
} from '@/lib/pricing';
import { formatFcfa } from '@/lib/format';
import { useAppColors } from '@/hooks/use-app-colors';
import { useUnreadNotifications } from '@/hooks/use-unread-notifications';

type Enterprise = {
  id: string;
  nom: string | null;
  type: 'restaurant' | 'boutique';
  adresse: string | null;
  description?: string | null;
  image_url?: string | null;
  frais_livraison?: number | null;
};

type OrderRow = {
  id: string;
  entreprise_id: string | null;
  statut: string | null;
  adresse_livraison?: string | null;
  cree_le?: string | null;
};

type Me = {
  id: string;
  nom: string | null;
  telephone: string;
  image_url?: string | null;
  imageUrl?: string | null;
};

const TERMINAL_STATUSES = new Set(['livree', 'annulee', 'remboursee']);

function normStatutHome(s: string | null | undefined): string {
  return (s ?? '').trim().toLowerCase().replace(/\s+/g, '_');
}

function isActiveOrder(statut: string | null | undefined): boolean {
  if (!statut?.trim()) return false;
  return !TERMINAL_STATUSES.has(normStatutHome(statut));
}

function statutLabel(statut: string | null | undefined): string {
  if (!statut) return 'Statut inconnu';
  const key = normStatutHome(statut);
  const map: Record<string, string> = {
    en_attente: 'En attente',
    partiellement_acceptee: 'Partiellement acceptée',
    acceptee: 'Acceptée',
    en_preparation: 'En préparation',
    prete: 'Prête',
    en_livraison: 'En livraison',
    livree: 'Livrée',
    partiellement_livree: 'Partiellement livrée',
    annulee: 'Annulée',
    remboursee: 'Remboursée',
    commande_creee: 'Commande créée',
    en_attente_vendeur: 'En attente vendeur',
    probleme: 'Problème',
  };
  return map[key] ?? statut;
}

const CATEGORY_ITEMS: { key: string; label: string; Icon: LucideIcon; type: 'restaurant' | 'boutique' | 'all' }[] = [
  { key: 'restaurant', label: 'Restaurants', Icon: UtensilsCrossed, type: 'restaurant' },
  { key: 'boutique', label: 'Boutiques', Icon: ShoppingBag, type: 'boutique' },
  { key: 'supermarches', label: 'Supermarchés', Icon: ShoppingBasket, type: 'all' },
  { key: 'autres', label: 'Autres', Icon: MoreHorizontal, type: 'all' },
];

const HERO_SLIDES: HomeHeroSlide[] = [
  {
    image: require('@/assets/images/assetlivraions.png'),
    cta: 'Commander maintenant',
  },
  {
    image: require('@/assets/images/marketplaceassets.png'),
    cta: 'Voir le marketplace',
  },
];


function compactOrderRef(id: string): string {
  const clean = id.replace(/-/g, '');
  const slice = clean.slice(0, 8).toUpperCase();
  return slice.length >= 8 ? slice : id.slice(0, 12);
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useAppColors();
  const { unreadCount } = useUnreadNotifications();
  const [pricing, setPricing] = useState<PublicPricing | null>(null);

  const [search, setSearch] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loadingEnterprises, setLoadingEnterprises] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [enterpriseError, setEnterpriseError] = useState<string | null>(null);

  const loadAll = useCallback(async (force = false) => {
    setEnterpriseError(null);

    const cachedEnt = peekAllEnterprises();
    if (cachedEnt?.length) {
      setEnterprises(cachedEnt as Enterprise[]);
      setLoadingEnterprises(false);
    } else {
      setLoadingEnterprises(true);
    }

    const favTask = getFavoriteEnterpriseIds()
      .then((ids) => setFavoriteIds(new Set(ids)))
      .catch(() => setFavoriteIds(new Set()));

    const entTask = fetchAllEnterprises(force)
      .then((data) => setEnterprises(data as Enterprise[]))
      .catch((e) => {
        setEnterpriseError(e instanceof Error ? e.message : 'Erreur réseau');
        if (!cachedEnt?.length) setEnterprises([]);
      })
      .finally(() => setLoadingEnterprises(false));

    const token = await getSessionToken();
    const ordersTask =
      token != null
        ? apiFetch<OrderRow[]>('/api/orders', { method: 'GET', token })
            .then((data) => setOrders(Array.isArray(data) ? data : []))
            .catch(() => setOrders([]))
            .finally(() => setLoadingOrders(false))
        : Promise.resolve().then(() => {
            setOrders([]);
            setLoadingOrders(false);
          });

    if (orders.length === 0) setLoadingOrders(true);

    const meTask =
      token != null
        ? fetchAuthMe(token, force)
            .then(setMe)
            .catch(() => setMe(null))
        : Promise.resolve().then(() => setMe(null));
    const pricingTask = fetchPublicPricing(force).then(setPricing).catch(() => undefined);

    await Promise.all([favTask, entTask, ordersTask, meTask, pricingTask]);
  }, [orders.length]);

  useFocusEffect(
    useCallback(() => {
      void loadAll();
    }, [loadAll])
  );

  const enterpriseById = useMemo(() => new Map(enterprises.map((e) => [e.id, e])), [enterprises]);

  const activeOrders = useMemo(
    () =>
      [...orders].filter((o) => isActiveOrder(o.statut)).sort((a, b) => {
        const da = a.cree_le ? new Date(a.cree_le).getTime() : 0;
        const db = b.cree_le ? new Date(b.cree_le).getTime() : 0;
        return db - da;
      }),
    [orders]
  );

  const heroOrder = activeOrders[0] ?? null;

  const toggleFav = async (id: string) => {
    const nextIsFav = await toggleFavoriteEnterpriseId(id);
    setFavoriteIds((prev) => {
      const n = new Set(prev);
      if (nextIsFav) n.add(id);
      else n.delete(id);
      return n;
    });
  };

  const goMarketplace = (params?: { q?: string; type?: string }) => {
    if (params?.q || params?.type) {
      const q = new URLSearchParams();
      if (params.q) q.set('q', params.q);
      if (params.type) q.set('type', params.type);
      router.push(`/(tabs)/marketplace?${q.toString()}`);
    } else {
      router.push('/(tabs)/marketplace');
    }
  };

  const contentBottom = Math.max(insets.bottom, 12) + TAB_BAR_CONTENT_PADDING_BOTTOM;
  const profileImage = resolveRemoteImageUrl(me?.imageUrl ?? me?.image_url);
  const pricingSnap = pricing ?? DEFAULT_PUBLIC_PRICING;
  const deliveryFrom = pricingSnap.frais_livraison_base_fcfa;
  const minOrder = pricingSnap.montant_min_commande_fcfa;
  const firstName = (me?.nom || '').trim().split(/\s+/)[0] || 'Bienvenue';

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 10), paddingBottom: contentBottom }]}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Image source={require('@/assets/images/logo.png')} style={styles.brandLogo} contentFit="contain" />
            <ThemedText style={[styles.greeting, { color: colors.textMuted }]} numberOfLines={1}>
              Bonjour, {firstName}
            </ThemedText>
          </View>
          <View style={styles.topBarRight}>
            <Pressable style={[styles.iconBtn, { backgroundColor: colors.primarySoft, borderColor: colors.border }]} onPress={() => router.push('/notifications')} hitSlop={10}>
              <Bell size={22} color={colors.primaryDeep} strokeWidth={LUCIDE_STROKE} />
              {unreadCount > 0 ? (
                <View style={[styles.notifDot, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
                  <ThemedText style={styles.notifDotText}>{unreadCount > 9 ? '9+' : unreadCount}</ThemedText>
                </View>
              ) : null}
            </Pressable>
            <Pressable style={[styles.avatarOuter, { backgroundColor: colors.primarySoft, borderColor: colors.border }]} onPress={() => router.push('/(tabs)/profile')} hitSlop={8}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.avatarImg}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={80}
                />
              ) : (
                <User size={22} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.infoChips}>
          <View style={[styles.infoChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Truck size={16} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
            <ThemedText style={[styles.infoChipText, { color: colors.text }]}>
              Livraison dès {formatFcfa(deliveryFrom)}
            </ThemedText>
          </View>
          <View style={[styles.infoChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ShoppingBag size={16} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
            <ThemedText style={[styles.infoChipText, { color: colors.text }]}>
              Min. {formatFcfa(minOrder)}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={22} color={colors.textMuted} strokeWidth={LUCIDE_STROKE} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher un restaurant, un plat, une boutique…"
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => {
              if (search.trim()) goMarketplace({ q: search.trim() });
            }}
            returnKeyType="search"
          />
          <View style={[styles.searchDivider, { backgroundColor: colors.border }]} />
          <Pressable
            style={styles.filterTap}
            onPress={() => goMarketplace(search.trim() ? { q: search.trim() } : undefined)}
            hitSlop={8}>
            <SlidersHorizontal size={22} color={colors.primaryDeep} strokeWidth={LUCIDE_STROKE} />
          </Pressable>
        </View>

        <HomeHeroCarousel
          slides={HERO_SLIDES}
          heroIndex={heroIndex}
          onIndexChange={setHeroIndex}
          onCta={() => goMarketplace()}
        />

        <View style={styles.catGrid}>
          {CATEGORY_ITEMS.map((c) => (
            <Pressable
              key={c.key}
              style={[styles.catTile, { borderColor: colors.border, backgroundColor: colors.surface }]}
              onPress={() => goMarketplace({ type: c.type })}
              android_ripple={{ color: colors.primaryMuted }}>
              <View style={[styles.catIconWrap, { backgroundColor: colors.primarySoft }]}>
                <c.Icon size={24} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
              </View>
              <ThemedText style={[styles.catLabel, { color: colors.text }]} numberOfLines={2}>
                {c.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHead}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.primaryDeep }]}>
            Commerces disponibles
          </ThemedText>
          <Pressable onPress={() => goMarketplace()} hitSlop={10}>
            <ThemedText style={[styles.seeAll, { color: colors.primary }]}>Voir tout {'>'}</ThemedText>
          </Pressable>
        </View>
        {loadingEnterprises ? (
          <View style={styles.loaderRow}>
            <ActivityIndicator color={colors.primary} />
            <ThemedText style={[styles.loaderText, { color: colors.textMuted }]}>Chargement des commerces…</ThemedText>
          </View>
        ) : enterpriseError ? (
          <View style={[styles.warnCard, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
            <ThemedText style={[styles.warnTitle, { color: colors.primaryDeep }]}>Liste indisponible</ThemedText>
            <ThemedText style={[styles.warnBody, { color: colors.textMuted }]}>{enterpriseError}</ThemedText>
            <Pressable style={[styles.warnBtn, { backgroundColor: colors.primary }]} onPress={() => void loadAll()}>
              <ThemedText style={[styles.warnBtnText, { color: colors.onPrimary }]}>Réessayer</ThemedText>
            </Pressable>
          </View>
        ) : enterprises.length === 0 ? (
          <View style={[styles.warnCard, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
            <ThemedText style={[styles.warnTitle, { color: colors.primaryDeep }]}>Aucun commerce</ThemedText>
            <ThemedText style={[styles.warnBody, { color: colors.textMuted }]}>Aucun établissement ouvert pour le moment.</ThemedText>
          </View>
        ) : (
          <View style={styles.commerceList}>
            {enterprises.slice(0, 6).map((e) => {
              const img = resolveRemoteImageUrl(e.image_url);
              const fav = favoriteIds.has(e.id);
              const typeLabel = e.type === 'restaurant' ? 'Restaurant' : 'Boutique';
              const feeLabel = formatFcfa(displayDeliveryFeeFcfa(e.frais_livraison, pricingSnap));
              return (
                <Pressable
                  key={e.id}
                  style={[styles.commerceRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push(`/(tabs)/marketplace/${e.id}`)}
                  android_ripple={{ color: colors.primaryMuted }}>
                  <View style={[styles.commerceThumb, { backgroundColor: colors.primarySoft }]}>
                    {img ? (
                      <Image source={{ uri: img }} style={styles.commerceThumbImg} contentFit="cover" />
                    ) : e.type === 'restaurant' ? (
                      <UtensilsCrossed size={22} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
                    ) : (
                      <Store size={22} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
                    )}
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <ThemedText type="defaultSemiBold" style={[styles.commerceName, { color: colors.text }]} numberOfLines={1}>
                      {e.nom ?? 'Commerce'}
                    </ThemedText>
                    <ThemedText style={[styles.commerceMeta, { color: colors.textMuted }]} numberOfLines={1}>
                      {typeLabel} · Livraison {feeLabel}
                    </ThemedText>
                  </View>
                  <Pressable onPress={() => void toggleFav(e.id)} hitSlop={10}>
                    <Heart size={20} color={fav ? colors.error : colors.textMuted} fill={fav ? colors.error : 'none'} strokeWidth={LUCIDE_STROKE} />
                  </Pressable>
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          style={[styles.promoBanner, { backgroundColor: colors.primarySoft, borderColor: colors.border }]}
          onPress={() => goMarketplace()}
          android_ripple={{ color: colors.primaryMuted }}>
          <Tag size={20} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
          <ThemedText style={[styles.promoBannerText, { color: colors.primaryDeep }]}>
            Codes promo au paiement · Marketplace
          </ThemedText>
        </Pressable>

        <View style={[styles.sectionHead, { marginTop: 20 }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.primaryDeep }]}>
            Vos commandes
          </ThemedText>
          <Pressable onPress={() => router.push('/(tabs)/explore')} hitSlop={10}>
            <ThemedText style={[styles.seeAll, { color: colors.primary }]}>Voir tout {'>'}</ThemedText>
          </Pressable>
        </View>

        {loadingOrders ? (
          <View style={styles.loaderRow}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : !heroOrder ? (
          <View style={[styles.orderEmpty, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
            <View style={styles.orderEmptyHeader}>
              <ScrollText size={22} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
              <ThemedText style={[styles.orderEmptyTitle, { color: colors.primaryDeep }]}>Aucune commande en cours</ThemedText>
            </View>
            <ThemedText style={[styles.orderEmptyBody, { color: colors.textMuted }]}>Les commandes actives apparaîtront ici avec leur statut réel.</ThemedText>
          </View>
        ) : (
          <Pressable
            style={[styles.orderCard, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={() => router.push('/(tabs)/explore')}
            android_ripple={{ color: colors.primaryMuted }}>
            <View style={[styles.orderThumb, { backgroundColor: colors.primarySoft }]}>
              {(() => {
                const ent = heroOrder.entreprise_id ? enterpriseById.get(heroOrder.entreprise_id) : undefined;
                const u = resolveRemoteImageUrl(ent?.image_url);
                return u ? (
                  <Image source={{ uri: u }} style={styles.orderThumbImg} contentFit="cover" />
                ) : (
                  <View style={[styles.orderThumbImg, styles.orderThumbPh]}>
                    {ent?.type === 'boutique' ? (
                      <Store size={22} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
                    ) : (
                      <UtensilsCrossed size={22} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
                    )}
                  </View>
                );
              })()}
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <ThemedText type="defaultSemiBold" style={[styles.orderRef, { color: colors.text }]}>
                Commande #{compactOrderRef(heroOrder.id)}
              </ThemedText>
              <ThemedText style={[styles.orderMerchant, { color: colors.textMuted }]} numberOfLines={1}>
                {(heroOrder.entreprise_id && enterpriseById.get(heroOrder.entreprise_id)?.nom) || 'Commerce'}
              </ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: colors.successSoft }]}>
                <ThemedText style={[styles.statusBadgeText, { color: colors.success }]}>{statutLabel(heroOrder.statut)}</ThemedText>
              </View>
            </View>
            <ChevronRight size={22} color={colors.textMuted} strokeWidth={LUCIDE_STROKE} />
          </Pressable>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  topBarLeft: { flex: 1, gap: 2, marginRight: 8 },
  greeting: { fontSize: 14, fontWeight: '600' },
  brandLogo: { width: 120, height: 40 },
  infoChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoChipText: { fontSize: 13, fontWeight: '600' },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notifDotText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  avatarOuter: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  catTile: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '46%',
    minHeight: 88,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  catIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commerceList: { gap: 8, marginBottom: 12 },
  commerceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  commerceThumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  commerceThumbImg: { width: '100%', height: '100%' },
  commerceName: { fontSize: 15 },
  commerceMeta: { fontSize: 12 },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  promoBannerText: { flex: 1, fontSize: 14, fontWeight: '700' },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    minHeight: 40,
  },
  searchDivider: { width: 1, height: 26 },
  filterTap: { padding: 4 },
  catRow: {
    gap: 12,
    paddingBottom: 6,
    marginBottom: 20,
  },
  catCard: {
    width: 76,
    minHeight: 88,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  sectionNote: { fontSize: 12, marginBottom: 14, marginTop: -2 },
  seeAll: { fontSize: 14, fontWeight: '700' },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  loaderText: { fontSize: 14 },
  warnCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    marginBottom: 8,
  },
  warnTitle: { fontWeight: '800', fontSize: 15 },
  warnBody: { fontSize: 14, lineHeight: 20 },
  warnBtn: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  warnBtnText: { fontWeight: '800' },
  popRow: { gap: 14, paddingBottom: 8 },
  popCard: {
    width: 220,
    borderRadius: 20,
    paddingBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 5,
    overflow: 'hidden',
  },
  popImageWrap: {
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  popImage: {
    width: '100%',
    height: '100%',
  },
  popImagePh: { alignItems: 'center', justifyContent: 'center' },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popName: {
    paddingHorizontal: 12,
    fontSize: 16,
  },
  popMeta: {
    paddingHorizontal: 12,
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  offersRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },
  offerGreen: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    gap: 12,
    minHeight: 148,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
  },
  offerGreenText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    flex: 1,
  },
  offerChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  offerChipText: { fontWeight: '800', fontSize: 12 },
  offerOutline: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 2,
    padding: 14,
    gap: 12,
    minHeight: 148,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  offerOutlineText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    flex: 1,
  },
  offerChipOutline: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  offerChipOutlineText: { fontWeight: '800', fontSize: 12 },
  orderEmpty: {
    gap: 10,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  orderEmptyHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  orderEmptyTitle: { fontWeight: '800', fontSize: 15, flex: 1 },
  orderEmptyBody: { fontSize: 13, lineHeight: 18 },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  orderThumb: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
  },
  orderThumbImg: { width: '100%', height: '100%' },
  orderThumbPh: { alignItems: 'center', justifyContent: 'center' },
  orderRef: { fontSize: 14 },
  orderMerchant: { fontSize: 13 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  orderEta: { fontSize: 12 },
});

import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import {
  Building2,
  Clock,
  MapPin,
  Package,
  Phone,
  ShoppingBasket,
  ShoppingCart,
  Store,
  UtensilsCrossed,
} from 'lucide-react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createEnterpriseDetailStyles } from '@/constants/enterprise-detail-styles';
import { LUCIDE_STROKE } from '@/constants/icons';
import { useAppColors } from '@/hooks/use-app-colors';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import type { EnterprisePublic, ProductPublic } from '@/lib/catalog';
import { fetchEnterpriseById, fetchProductsForEnterprise } from '@/lib/catalog';
import { peekEnterpriseById, peekProductsForEnterprise } from '@/lib/client-data';
import { addProductToCartPrompt } from '@/lib/cart-local';
import { formatFcfa } from '@/lib/format';
import { resolveRemoteImageUrl } from '@/lib/images';

function numStock(stock: number | string | undefined): number {
  const n = Number(stock);
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

function numPrice(prix: number | string): number {
  const n = Number(prix);
  return Number.isFinite(n) ? n : 0;
}

export default function EnterpriseDetailScreen() {
  const { enterpriseId } = useLocalSearchParams<{ enterpriseId: string }>();
  const navigation = useNavigation();
  const id = typeof enterpriseId === 'string' ? enterpriseId : '';
  const colors = useAppColors();
  const styles = useThemedStyles(createEnterpriseDetailStyles);

  const [enterprise, setEnterprise] = useState<EnterprisePublic | null>(null);
  const [products, setProducts] = useState<ProductPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (force = false) => {
    if (!id) return;
    setError(null);
    const cachedEnt = peekEnterpriseById(id);
    const cachedProds = peekProductsForEnterprise(id);
    if (cachedEnt) setEnterprise(cachedEnt);
    if (cachedProds) setProducts(cachedProds);
    if (!cachedEnt && !cachedProds) setLoading(true);
    else setLoading(false);

    try {
      const [ent, prods] = await Promise.all([
        fetchEnterpriseById(id, force),
        fetchProductsForEnterprise(id, force),
      ]);
      setEnterprise(ent);
      setProducts(prods);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement.');
      if (!cachedEnt) setEnterprise(null);
      if (!cachedProds) setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: enterprise?.nom ?? 'Commerce',
    });
  }, [navigation, enterprise?.nom]);

  const hero = resolveRemoteImageUrl(enterprise?.image_url);
  const isRestaurant = enterprise?.type === 'restaurant';
  const prepMin = enterprise?.delai_preparation_min ?? 25;
  const shipMin = enterprise?.delai_livraison_min ?? 48;

  const addProduct = (p: ProductPublic) => {
    if (!enterprise) return;
    const stock = numStock(p.stock);
    const prix = numPrice(p.prix);
    addProductToCartPrompt({
      enterpriseId: enterprise.id,
      enterpriseNom: enterprise.nom ?? 'Commerce',
      enterpriseType: enterprise.type,
      productId: p.id,
      nom: p.nom ?? 'Produit',
      prixUnitaire: prix,
      stockAvailable: stock,
      onDone: () => {},
    });
  };

  if (!id) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Identifiant commerce manquant.</ThemedText>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={styles.muted}>Chargement…</ThemedText>
      </ThemedView>
    );
  }

  if (error || !enterprise) {
    return (
      <ThemedView style={styles.center}>
        <Building2 size={44} color={colors.placeholder} strokeWidth={LUCIDE_STROKE} />
        <ThemedText style={styles.errTitle}>{error ?? 'Commerce introuvable.'}</ThemedText>
        <Pressable style={styles.retry} onPress={() => void reload()}>
          <ThemedText style={styles.retryText}>Réessayer</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.heroWrap}>
          {hero ? (
            <Image source={{ uri: hero }} style={styles.heroImg} contentFit="cover" />
          ) : (
            <View style={[styles.heroImg, styles.heroPh]}>
              {enterprise.type === 'restaurant' ? (
                <UtensilsCrossed size={56} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
              ) : (
                <Store size={56} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
              )}
            </View>
          )}
          <View style={styles.heroBadge}>
            <ThemedText style={styles.heroBadgeText}>{enterprise.type === 'restaurant' ? 'Restaurant' : 'Boutique'}</ThemedText>
          </View>
        </View>

        <View style={styles.block}>
          <ThemedText type="title" style={styles.name}>
            {enterprise.nom ?? 'Commerce'}
          </ThemedText>
          {enterprise.description ? (
            <ThemedText style={styles.desc}>{enterprise.description}</ThemedText>
          ) : null}
          {enterprise.adresse ? (
            <View style={styles.infoRow}>
              <MapPin size={20} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
              <ThemedText style={styles.infoText}>{enterprise.adresse}</ThemedText>
            </View>
          ) : null}
          {enterprise.telephone ? (
            <View style={styles.infoRow}>
              <Phone size={20} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
              <ThemedText style={styles.infoText}>{enterprise.telephone}</ThemedText>
            </View>
          ) : null}
          <View style={styles.infoRow}>
            <Clock size={20} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
            <ThemedText style={styles.infoText}>
              Préparation ~{prepMin} min · Livraison ~{shipMin} min
            </ThemedText>
          </View>
        </View>

        <View style={styles.sectionHead}>
          <ThemedText style={styles.sectionTitle}>Articles</ThemedText>
          <ThemedText style={styles.sectionHint}>{products.length} référence(s)</ThemedText>
        </View>

        {products.length === 0 ? (
          <View style={styles.emptyProducts}>
            <Package size={36} color={colors.placeholder} strokeWidth={LUCIDE_STROKE} />
            <ThemedText style={styles.emptyProductsText}>
              {isRestaurant ? 'Aucun plat au menu pour le moment.' : 'Aucun produit au catalogue.'}
            </ThemedText>
          </View>
        ) : (
          products.map((p) => {
            const stock = numStock(p.stock);
            const prix = numPrice(p.prix);
            const img = resolveRemoteImageUrl(p.image_url);
            const disabled = stock <= 0;
            return (
              <View key={p.id} style={styles.productCard}>
                <View style={styles.productThumb}>
                  {img ? (
                    <Image source={{ uri: img }} style={styles.productImg} contentFit="cover" />
                  ) : (
                    <View style={[styles.productImg, styles.productImgPh]}>
                      <ShoppingBasket size={28} color={colors.primary} strokeWidth={LUCIDE_STROKE} />
                    </View>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold" style={styles.productName}>
                    {p.nom ?? 'Produit'}
                  </ThemedText>
                  {p.description ? (
                    <ThemedText style={styles.productDesc} numberOfLines={2}>
                      {p.description}
                    </ThemedText>
                  ) : null}
                  <ThemedText style={styles.productPrice}>{formatFcfa(prix)}</ThemedText>
                  <ThemedText style={[styles.stock, disabled && styles.stockOut]}>
                    {disabled ? 'Rupture de stock' : `Stock : ${stock}`}
                  </ThemedText>
                </View>
                <Pressable
                  style={[styles.addBtn, disabled && styles.addBtnDisabled]}
                  disabled={disabled}
                  onPress={() => addProduct(p)}
                  android_ripple={{ color: colors.primaryMuted }}>
                  <ShoppingCart size={22} color={colors.onPrimary} strokeWidth={LUCIDE_STROKE} />
                </Pressable>
              </View>
            );
          })
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </ThemedView>
  );
}

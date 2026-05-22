import { useRouter } from 'expo-router';
import { ChevronRight, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VendorScreenHeader } from '@/components/vendor-screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LUCIDE_STROKE } from '@/constants/icons';
import { useAppColors } from '@/hooks/use-app-colors';
import { useVendor } from '@/contexts/vendor-context';
import { hrefVendorStock } from '@/lib/vendor-nav';

export default function VendorCatalogScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useAppColors();
  const { products } = useVendor();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); if (!q) return products; return products.filter((p) => p.nom.toLowerCase().includes(q)); }, [products, query]);

  return (
    <ThemedView style={styles.screen}>
      <VendorScreenHeader title="CATALOGUE" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 80, paddingHorizontal: 18 }}>
        <View style={[styles.search, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
          <Search size={20} color={colors.textMuted} strokeWidth={LUCIDE_STROKE} />
          <TextInput style={[styles.searchIn, { color: colors.text }]} placeholder="Rechercher un produit…" placeholderTextColor={colors.placeholder} value={query} onChangeText={setQuery} />
        </View>

        <Pressable style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => router.push('/vendor/categories')}>
          <View style={[styles.thumb, { backgroundColor: colors.surfaceMuted }]} />
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold" style={[styles.name, { color: colors.text }]}>Tous les produits</ThemedText>
            <ThemedText style={[styles.count, { color: colors.textMuted }]}>{products.length} produits</ThemedText>
          </View>
          <ChevronRight size={20} color={colors.textMuted} strokeWidth={LUCIDE_STROKE} />
        </Pressable>

        {filtered.length === 0 ? (
          <ThemedText style={[styles.empty, { color: colors.textMuted }]}>{query.trim() ? 'Aucun produit ne correspond à votre recherche.' : 'Aucun produit dans votre catalogue.'}</ThemedText>
        ) : (
          filtered.map((p) => (
            <Pressable key={p.id} style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => router.push(hrefVendorStock(p.id))}>
              <View style={[styles.thumb, { backgroundColor: colors.surfaceMuted }]} />
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold" style={[styles.name, { color: colors.text }]} numberOfLines={1}>{p.nom}</ThemedText>
                <ThemedText style={[styles.count, { color: colors.textMuted }]}>Stock {p.stock} · {p.enLigne ? 'En ligne' : 'Hors ligne'}</ThemedText>
              </View>
              <ChevronRight size={20} color={colors.textMuted} strokeWidth={LUCIDE_STROKE} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16, borderWidth: 1 },
  searchIn: { flex: 1, fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  thumb: { width: 52, height: 52, borderRadius: 10 },
  name: { fontSize: 15 },
  count: { fontSize: 13, marginTop: 2 },
  empty: { fontSize: 14, textAlign: 'center', marginTop: 24 },
});

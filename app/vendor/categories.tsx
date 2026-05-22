import { ScrollView, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';



import { VendorScreenHeader } from '@/components/vendor-screen-header';

import { ThemedText } from '@/components/themed-text';

import { ThemedView } from '@/components/themed-view';

import { useVendor } from '@/contexts/vendor-context';

import { formatFcfa } from '@/lib/format';

import { useAppColors } from '@/hooks/use-app-colors';



export default function VendorCategoriesScreen() {

  const colors = useAppColors();

  const insets = useSafeAreaInsets();

  const { products } = useVendor();



  return (

    <ThemedView style={styles.screen}>

      <VendorScreenHeader title="PRODUITS" />

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20, paddingHorizontal: 18 }}>

        {products.length === 0 ? (

          <ThemedText style={[styles.empty, { color: colors.textMuted }]}>Aucun produit enregistré.</ThemedText>

        ) : (

          products.map((p) => (

            <View key={p.id} style={[styles.row, { borderBottomColor: colors.border }]}>

              <View style={[styles.thumb, { backgroundColor: colors.surfaceMuted }]} />

              <View style={{ flex: 1 }}>

                <ThemedText type="defaultSemiBold" style={[styles.name, { color: colors.text }]}>

                  {p.nom}

                </ThemedText>

                <ThemedText style={[styles.meta, { color: colors.textMuted }]}>

                  {formatFcfa(p.prix)} · Stock: {p.stock}

                </ThemedText>

              </View>

            </View>

          ))

        )}

      </ScrollView>

    </ThemedView>

  );

}



const styles = StyleSheet.create({

  screen: { flex: 1 },

  empty: { fontSize: 14, textAlign: 'center', marginTop: 32 },

  row: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

    paddingVertical: 12,

    borderBottomWidth: StyleSheet.hairlineWidth,

  },

  thumb: { width: 52, height: 52, borderRadius: 10 },

  name: { fontSize: 15 },

  meta: { fontSize: 13, marginTop: 2 },

});


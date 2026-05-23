import type { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { Package, Store, UtensilsCrossed } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LUCIDE_STROKE } from '@/constants/icons';
import { useAppColors } from '@/hooks/use-app-colors';

export default function HowMultiDeliveryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useAppColors();

  return (
    <ThemedView style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 10) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button">
          <ThemedText style={[styles.back, { color: colors.primary }]}>← Retour</ThemedText>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={[styles.title, { color: colors.primaryDeep }]}>
          Livraisons multiples
        </ThemedText>
        <ThemedText style={[styles.lead, { color: colors.textSecondary }]}>
          Si votre panier contient des articles de plusieurs commerces, GoLivra crée une commande par commerce. Chaque
          partie est préparée et livrée séparément.
        </ThemedText>

        <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.primarySoft }]}>
          <ThemedText type="defaultSemiBold" style={[styles.cardTitle, { color: colors.primaryDeep }]}>
            Pourquoi ?
          </ThemedText>
          <ThemedText style={[styles.p, { color: colors.textSecondary }]}>
            Un seul livreur qui court entre un restaurant, une boutique et une pharmacie serait lent, coûteux en erreurs
            et peu fiable. En séparant les livraisons au lancement, le service reste simple et prévisible.
          </ThemedText>
        </View>

        <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.primarySoft }]}>
          <ThemedText type="defaultSemiBold" style={[styles.cardTitle, { color: colors.primaryDeep }]}>
            Frais de livraison
          </ThemedText>
          <ThemedText style={[styles.p, { color: colors.textSecondary }]}>
            Chaque commerce a ses propres frais de livraison, car un livreur est mobilisé à chaque fois. Le total affiché
            dans votre panier additionne ces frais.
          </ThemedText>
        </View>

        <ThemedText type="defaultSemiBold" style={[styles.exampleTitle, { color: colors.primaryDeep }]}>
          Exemple (après validation)
        </ThemedText>
        <View style={[styles.exampleBox, { borderColor: colors.border, backgroundColor: colors.primarySoft }]}>
          <Row icon={<UtensilsCrossed size={20} color={colors.primary} strokeWidth={LUCIDE_STROKE} />} text="Restaurant A → ~30 min" />
          <View style={[styles.div, { backgroundColor: colors.border }]} />
          <Row icon={<Store size={20} color={colors.primary} strokeWidth={LUCIDE_STROKE} />} text="Boutique B → ~45 min" />
          <View style={[styles.div, { backgroundColor: colors.border }]} />
          <Row icon={<Package size={20} color={colors.primary} strokeWidth={LUCIDE_STROKE} />} text="Autre commerce → ~60 min" />
        </View>

        <ThemedText style={[styles.note, { color: colors.textMuted }]}>
          Les délais indiqués après commande sont des estimations ; ils peuvent varier selon la préparation et le trafic.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

function Row({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <View style={styles.row}>
      {icon}
      <ThemedText style={styles.rowText} type="defaultSemiBold">
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: { paddingHorizontal: 16, paddingBottom: 8 },
  back: { fontSize: 16, fontWeight: '700' },
  scroll: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  lead: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: { fontSize: 16, marginBottom: 8 },
  p: { fontSize: 14, lineHeight: 21 },
  exampleTitle: { fontSize: 15, marginBottom: 10, marginTop: 4 },
  exampleBox: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  rowText: { flex: 1, fontSize: 15 },
  div: { height: StyleSheet.hairlineWidth, marginLeft: 32 },
  note: { fontSize: 13, lineHeight: 19 },
});

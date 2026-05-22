import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeliveryAddressForm, type DeliveryAddressFormValue } from '@/components/delivery-address-form';
import { VendorScreenHeader } from '@/components/vendor-screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useVendor } from '@/contexts/vendor-context';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import { useAppColors } from '@/hooks/use-app-colors';
import { useVendorTheme } from '@/hooks/use-vendor-theme';
import { getSessionToken } from '@/lib/auth';
import { isDeliveryAddressComplete, snapshotFromFields } from '@/lib/format-address';
import { formatCgPhone } from '@/lib/phone';
import { createVendorExternalDelivery } from '@/lib/vendor-api';
import { VENDOR_HREF } from '@/lib/vendor-nav';

const emptyAddr = (): DeliveryAddressFormValue => ({
  quartier: '',
  ligne1: '',
  instructions: '',
  point_reperes: '',
  ville: 'Brazzaville',
  pays: 'Congo',
});

export default function VendorCreateDirectDeliveryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { shop } = useVendor();
  const colors = useAppColors();
  const { palette } = useVendorTheme();
  const { showSuccess, showError, FeedbackOverlay } = useActionFeedback();
  const [clientNom, setClientNom] = useState('');
  const [clientPhone, setClientPhone] = useState(() => formatCgPhone(''));
  const [address, setAddress] = useState<DeliveryAddressFormValue>(emptyAddr);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!shop?.id) {
      showError('Commerce introuvable', 'Rechargez votre espace vendeur puis réessayez.');
      return;
    }
    const nom = clientNom.trim();
    const tel = formatCgPhone(clientPhone);
    if (!nom) {
      showError('Client manquant', 'Indiquez le nom du destinataire.');
      return;
    }
    if (!tel) {
      showError('Téléphone invalide', 'Indiquez un numéro valide (+242 …).');
      return;
    }
    if (!isDeliveryAddressComplete(address)) {
      showError('Adresse incomplète', 'Quartier et adresse détaillée sont obligatoires.');
      return;
    }

    setSubmitting(true);
    try {
      const token = await getSessionToken();
      if (!token) throw new Error('Session expirée.');
      await createVendorExternalDelivery(token, {
        establishmentId: shop.id,
        establishmentType: shop.type,
        clientNom: nom,
        clientTelephone: tel,
        adresse: snapshotFromFields(address),
        note: description.trim() || undefined,
      });
      showSuccess(
        'Livraison créée !',
        'Un livreur GoLivra sera assigné automatiquement. Suivez le statut dans l’onglet Livraisons.',
        {
          primaryLabel: 'Voir mes livraisons',
          onPrimary: () => router.replace(VENDOR_HREF.deliveriesTab),
        },
      );
    } catch (e) {
      showError('Création impossible', e instanceof Error ? e.message : 'Réessayez plus tard.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <FeedbackOverlay />
      <VendorScreenHeader title="Créer une livraison" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 18, paddingBottom: insets.bottom + 24 }}>
          <ThemedText style={[styles.intro, { color: colors.textMuted }]}>
            <ThemedText type="defaultSemiBold">Livraison externe</ThemedText> : hors commande client (colis, client
            au téléphone). Même réseau GoLivra.{' '}
            <ThemedText type="defaultSemiBold">Votre commerce paie</ThemedText> la livraison (Mobile Money).
          </ThemedText>

          <ThemedText style={[styles.label, { color: palette.primaryDeep }]}>Client</ThemedText>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
            value={clientNom}
            onChangeText={setClientNom}
            placeholder="Nom du destinataire"
            placeholderTextColor={colors.placeholder}
          />
          <TextInput
            style={[styles.input, { marginTop: 10, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
            value={clientPhone}
            onChangeText={(t) => setClientPhone(formatCgPhone(t))}
            placeholder="Téléphone (+242 …)"
            placeholderTextColor={colors.placeholder}
            keyboardType="phone-pad"
          />

          <ThemedText style={[styles.label, { color: palette.primaryDeep, marginTop: 16 }]}>
            Adresse de livraison
          </ThemedText>
          <DeliveryAddressForm value={address} onChange={setAddress} compact accentColor={palette.primary} />

          <ThemedText style={[styles.label, { color: palette.primaryDeep, marginTop: 8 }]}>
            Description du colis
          </ThemedText>
          <TextInput
            style={[styles.input, styles.area, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Ex. Sac noir, documents, nourriture à garder au chaud…"
            placeholderTextColor={colors.placeholder}
            multiline
            textAlignVertical="top"
          />

          <Pressable
            style={[styles.submit, { backgroundColor: palette.primaryDeep }, submitting && styles.submitDisabled]}
            onPress={() => void submit()}
            disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText style={[styles.submitTxt, { color: colors.onPrimary }]}>Créer la livraison GoLivra</ThemedText>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  intro: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '800', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  area: { minHeight: 80, marginTop: 0 },
  submit: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitDisabled: { opacity: 0.7 },
  submitTxt: { fontWeight: '800', fontSize: 16 },
});

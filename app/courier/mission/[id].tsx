import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ArrowLeft, CheckCircle2, MapPin, Store } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppContentWidth } from '@/components/app-content-width';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LUCIDE_STROKE } from '@/constants/icons';
import { useCourier } from '@/contexts/courier-context';
import {
  acceptCourierMission,
  advanceCourierMission,
  completeCourierMission,
  missionStatutLabel,
  type CourierMission,
} from '@/lib/courier-api';
import { getSessionToken } from '@/lib/auth';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import { useCourierPalette } from '@/lib/courier-theme';

export default function CourierMissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useCourierPalette();
  const { missions, refresh } = useCourier();
  const { showSuccess, showError, FeedbackOverlay } = useActionFeedback();
  const [mission, setMission] = useState<CourierMission | null>(null);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = missions.find((m) => m.id === id) ?? null;
    setMission(found);
    if (!found) setError('Course introuvable.');
  }, [id, missions]);

  const isDone = mission?.statut === 'livree' || mission?.statut === 'annulee';
  const canAccept = mission?.ouverte === true && mission.statut === 'en_attente';
  const canAdvance =
    mission && !isDone && !canAccept && (mission.statut === 'attribuee' || mission.statut === 'en_collecte');
  const advanceLabel =
    mission?.statut === 'attribuee' ? 'J’ai récupéré la commande' : 'En route vers le client';
  const canComplete =
    mission && !isDone && !canAccept && (mission.statut === 'en_route' || mission.statut === 'collectee');

  const accept = async () => {
    if (!id) return;
    const token = await getSessionToken();
    if (!token) return;
    setActing(true);
    setError(null);
    try {
      const updated = await acceptCourierMission(token, id);
      setMission({ ...updated, ouverte: false });
      await refresh();
      showSuccess('Course acceptée !', 'Vous pouvez récupérer la commande chez le commerce.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Impossible d\'accepter la course.';
      setError(msg);
      showError('Acceptation impossible', msg);
    } finally {
      setActing(false);
    }
  };

  const advance = async () => {
    if (!id) return;
    const token = await getSessionToken();
    if (!token) return;
    setActing(true);
    setError(null);
    try {
      const updated = await advanceCourierMission(token, id);
      setMission(updated);
      await refresh();
      showSuccess(
        updated.statut === 'en_route' ? 'En route !' : 'Collecte enregistrée',
        updated.statut === 'en_route' ? 'Direction le client.' : 'Récupération confirmée chez le commerce.',
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Impossible de mettre à jour la course.';
      setError(msg);
      showError('Mise à jour impossible', msg);
    } finally {
      setActing(false);
    }
  };

  const complete = async () => {
    if (!id) return;
    const token = await getSessionToken();
    if (!token) return;
    setActing(true);
    setError(null);
    try {
      const updated = await completeCourierMission(token, id);
      setMission(updated);
      await refresh();
      showSuccess('Livraison terminée !', 'Bonne course, merci.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Impossible de valider la livraison.';
      setError(msg);
      showError('Finalisation impossible', msg);
    } finally {
      setActing(false);
    }
  };

  return (
    <ThemedView style={styles.screen} lightColor={palette.bg} darkColor={palette.bg}>
      <FeedbackOverlay />
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 8), backgroundColor: palette.card, borderBottomColor: palette.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: palette.primarySoft }]} hitSlop={12}>
          <ArrowLeft size={22} color={palette.primaryDeep} strokeWidth={LUCIDE_STROKE} />
        </Pressable>
        <ThemedText style={[styles.topTitle, { color: palette.primaryDeep }]}>Course</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      {!mission ? (
        <View style={styles.center}>
          {error ? (
            <ThemedText style={[styles.err, { color: palette.danger }]}>{error}</ThemedText>
          ) : (
            <ActivityIndicator color={palette.primary} size="large" />
          )}
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}>
          <AppContentWidth phonePadding={0}>
          <View style={[styles.hero, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <ThemedText style={[styles.ref, { color: palette.text }]}>
              {mission.type_livraison === 'externe'
                ? 'Livraison du commerce'
                : mission.commande?.numero || mission.id.slice(0, 8).toUpperCase()}
            </ThemedText>
            <View style={[styles.statutPill, { backgroundColor: palette.primarySoft }]}>
              <ThemedText style={[styles.statutText, { color: palette.primary }]}>{missionStatutLabel(mission.statut)}</ThemedText>
            </View>
          </View>

          <View style={[styles.block, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <View style={styles.blockHead}>
              <Store size={18} color={palette.primary} strokeWidth={LUCIDE_STROKE} />
              <ThemedText style={[styles.blockTitle, { color: palette.primaryDeep }]}>Point de retrait</ThemedText>
            </View>
            <ThemedText style={[styles.blockText, { color: palette.textSecondary }]}>{mission.adresse_retrait || '—'}</ThemedText>
          </View>

          {mission.type_livraison === 'externe' && mission.client_nom ? (
            <View style={[styles.block, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <ThemedText style={[styles.blockTitle, { color: palette.primaryDeep }]}>Client</ThemedText>
              <ThemedText style={[styles.blockText, { color: palette.textSecondary }]}>
                {mission.client_nom}
                {mission.client_telephone ? ` · ${mission.client_telephone}` : ''}
              </ThemedText>
              {mission.montant_total != null ? (
                <ThemedText style={[styles.blockText, { color: palette.textSecondary }]}>Montant : {mission.montant_total} FCFA</ThemedText>
              ) : null}
              {mission.note ? <ThemedText style={[styles.hint, { color: palette.muted }]}>{mission.note}</ThemedText> : null}
            </View>
          ) : null}

          <View style={[styles.block, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <View style={styles.blockHead}>
              <MapPin size={18} color={palette.primary} strokeWidth={LUCIDE_STROKE} />
              <ThemedText style={[styles.blockTitle, { color: palette.primaryDeep }]}>Adresse client</ThemedText>
            </View>
            <ThemedText style={[styles.blockText, { color: palette.textSecondary }]}>{mission.adresse_livraison || '—'}</ThemedText>
          </View>

          {error ? (
            <View style={[styles.errBox, { borderColor: palette.border }]}>
              <ThemedText style={[styles.err, { color: palette.danger }]}>{error}</ThemedText>
            </View>
          ) : null}

          {canAccept ? (
            <Pressable style={[styles.primaryBtn, { backgroundColor: palette.primary }, acting && styles.disabled]} disabled={acting} onPress={() => void accept()}>
              <ThemedText style={styles.primaryBtnText}>{acting ? 'Acceptation…' : 'Accepter cette course'}</ThemedText>
            </Pressable>
          ) : null}
          {canAdvance ? (
            <Pressable
              style={[styles.secondaryBtn, { borderColor: palette.primary }, acting && styles.disabled]}
              disabled={acting}
              onPress={() => void advance()}>
              <ThemedText style={[styles.secondaryBtnText, { color: palette.primary }]}>
                {acting ? 'Mise à jour…' : advanceLabel}
              </ThemedText>
            </Pressable>
          ) : null}
          {canComplete ? (
            <Pressable style={[styles.primaryBtn, { backgroundColor: palette.primary }, acting && styles.disabled]} disabled={acting} onPress={() => void complete()}>
              <CheckCircle2 size={20} color="#FFF" strokeWidth={LUCIDE_STROKE} />
              <ThemedText style={styles.primaryBtnText}>{acting ? 'Validation…' : 'Marquer comme livrée'}</ThemedText>
            </Pressable>
          ) : isDone ? (
            <ThemedText style={[styles.hint, { color: palette.muted }]}>Course terminée.</ThemedText>
          ) : !canAccept ? (
            <ThemedText style={[styles.hint, { color: palette.muted }]}>Course assignée — récupérez la commande puis validez la livraison.</ThemedText>
          ) : null}
          </AppContentWidth>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { fontWeight: '900', fontSize: 17 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  scroll: { padding: 18, gap: 14 },
  hero: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  ref: { fontSize: 20, fontWeight: '900' },
  statutPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statutText: { fontWeight: '800', fontSize: 12 },
  block: {
    borderRadius: 18,
    padding: 16,
    gap: 8,
    borderWidth: 1,
  },
  blockHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  blockTitle: { fontWeight: '800', fontSize: 14 },
  blockText: { fontSize: 15, lineHeight: 22 },
  errBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  err: { fontWeight: '600' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 8,
    borderWidth: 2,
  },
  secondaryBtnText: { fontWeight: '800', fontSize: 15 },
  primaryBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  disabled: { opacity: 0.65 },
  hint: { textAlign: 'center', fontSize: 13, marginTop: 8 },
});

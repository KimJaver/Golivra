import { AppState, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { ThemedText } from '@/components/themed-text';
import { useAppColors } from '@/hooks/use-app-colors';
import {
  getBiometricLockEnabled,
  isBiometricHardwareAvailable,
  promptBiometricUnlock,
} from '@/lib/biometric-lock';

type Props = { children: ReactNode };

/**
 * Verrouillage optionnel (paramètres) : Face ID / empreinte au retour sur l’app.
 * Désactivé par défaut.
 */
export function BiometricAppGate({ children }: Props) {
  const colors = useAppColors();
  const [unlocked, setUnlocked] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    void (async () => {
      const hardware = await isBiometricHardwareAvailable();
      if (!hardware) return;
      setEnabled(await getBiometricLockEnabled());
    })();
  }, []);

  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;

    const sub = AppState.addEventListener('change', (next) => {
      const prev = appState.current;
      appState.current = next;
      if ((prev === 'background' || prev === 'inactive') && next === 'active') {
        setUnlocked(false);
        void promptBiometricUnlock('Déverrouiller GoLivra').then((ok) => setUnlocked(ok));
      }
    });

    return () => sub.remove();
  }, [enabled]);

  if (!enabled || unlocked) return <>{children}</>;

  return (
    <View style={[styles.lock, { backgroundColor: colors.background }]}>
      <ThemedText type="subtitle" style={{ color: colors.text, textAlign: 'center' }}>
        GoLivra est verrouillée
      </ThemedText>
      <ThemedText style={{ color: colors.textMuted, textAlign: 'center', marginTop: 8 }}>
        Utilisez Face ID ou votre empreinte pour continuer
      </ThemedText>
      <Pressable
        style={[styles.btn, { backgroundColor: colors.primary }]}
        onPress={() => void promptBiometricUnlock('Déverrouiller GoLivra').then(setUnlocked)}>
        <ThemedText style={{ color: colors.onPrimary, fontWeight: '800' }}>Déverrouiller</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  lock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  btn: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
});

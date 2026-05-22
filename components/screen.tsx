import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { useAppColors } from '@/hooks/use-app-colors';

/** Conteneur racine d’écran — fond adapté au thème clair/sombre. */
export function Screen({ children, style, ...rest }: ViewProps & { children: ReactNode }) {
  const colors = useAppColors();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});

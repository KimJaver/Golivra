import { StyleSheet } from 'react-native';

import type { AppPalette } from '@/constants/app-palette';

/** Styles communs dérivés de la palette (évite les couleurs en dur). */
export function createScreenStyles(c: AppPalette) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
      backgroundColor: c.surface,
    },
    backBtn: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 22,
      backgroundColor: c.primarySoft,
      borderWidth: 1,
      borderColor: c.border,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '800',
      color: c.primaryDeep,
    },
    headerSpacer: { width: 44 },
    card: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      padding: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: 16,
      color: c.text,
      backgroundColor: c.inputBg,
      minHeight: 52,
    },
    btnPrimary: {
      backgroundColor: c.primary,
      borderRadius: 999,
      paddingVertical: 16,
      minHeight: 52,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnPrimaryText: {
      color: c.onPrimary,
      fontWeight: '800',
      fontSize: 17,
    },
  });
}

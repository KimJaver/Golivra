import { Moon, Smartphone, Sun } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { LUCIDE_STROKE } from '@/constants/icons';
import type { ThemePreference } from '@/contexts/app-theme-context';
import { useAppTheme } from '@/contexts/app-theme-context';

type PaletteLike = {
  card: string;
  border: string;
  primary: string;
  primaryDeep: string;
  primarySoft: string;
  text: string;
  muted: string;
};

type Props = {
  palette?: PaletteLike;
  title?: string;
  hint?: string;
};

const OPTIONS: { id: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { id: 'light', label: 'Clair', Icon: Sun },
  { id: 'dark', label: 'Sombre', Icon: Moon },
  { id: 'system', label: 'Système', Icon: Smartphone },
];

export function ThemeModePicker({ palette: paletteProp, title = 'Apparence', hint }: Props) {
  const { preference, setPreference, colors } = useAppTheme();
  const palette = paletteProp ?? {
    card: colors.surface,
    border: colors.border,
    primary: colors.primary,
    primaryDeep: colors.primaryDeep,
    primarySoft: colors.primarySoft,
    text: colors.text,
    muted: colors.textMuted,
  };

  return (
    <View style={styles.wrap}>
      <ThemedText style={[styles.title, { color: palette.primaryDeep }]}>{title}</ThemedText>
      {hint ? (
        <ThemedText style={[styles.hint, { color: palette.muted }]}>{hint}</ThemedText>
      ) : null}
      <View style={[styles.row, { backgroundColor: palette.card, borderColor: palette.border }]}>
        {OPTIONS.map((opt) => {
          const active = preference === opt.id;
          const Icon = opt.Icon;
          return (
            <Pressable
              key={opt.id}
              style={[
                styles.chip,
                { borderColor: palette.border },
                active && { backgroundColor: palette.primarySoft, borderColor: palette.primary },
              ]}
              onPress={() => void setPreference(opt.id)}>
              <Icon size={18} color={active ? palette.primary : palette.muted} strokeWidth={LUCIDE_STROKE} />
              <ThemedText style={[styles.chipLabel, { color: active ? palette.primaryDeep : palette.text }]}>
                {opt.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  title: { fontWeight: '900', fontSize: 15 },
  hint: { fontSize: 12, lineHeight: 17 },
  row: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipLabel: { fontSize: 12, fontWeight: '800' },
});

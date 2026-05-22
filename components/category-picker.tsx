import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useAppColors } from '@/hooks/use-app-colors';
import type { EnterpriseCategory } from '@/lib/enterprise';

type Props = {
  visible: boolean;
  title: string;
  categories: EnterpriseCategory[];
  selectedId: string | null;
  onSelect: (category: EnterpriseCategory) => void;
  onClose: () => void;
};

export function CategoryPicker({ visible, title, categories, selectedId, onSelect, onClose }: Props) {
  const colors = useAppColors();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <ThemedText type="defaultSemiBold" style={[styles.title, { color: colors.text }]}>
            {title}
          </ThemedText>
          <ScrollView style={[styles.list, { backgroundColor: colors.surface }]} keyboardShouldPersistTaps="handled">
            {categories.map((c) => {
              const selected = c.id === selectedId;
              return (
                <Pressable
                  key={c.id}
                  style={[styles.row, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.successSoft : colors.surfaceMuted }]}
                  onPress={() => { onSelect(c); onClose(); }}>
                  <ThemedText style={[styles.rowText, { color: selected ? colors.primary : colors.text }, selected && styles.rowTextSelected]}>{c.nom}</ThemedText>
                  {selected ? <MaterialIcons name="check" size={20} color={colors.primary} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '70%', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 18, paddingBottom: 24, paddingTop: 10 },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, marginBottom: 14 },
  title: { fontSize: 17, marginBottom: 12 },
  list: { maxHeight: 360 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  rowText: { fontSize: 15, flex: 1 },
  rowTextSelected: { fontWeight: '800' },
});

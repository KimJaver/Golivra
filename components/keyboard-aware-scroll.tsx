import { useEffect, useState, type ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { useAppColors } from '@/hooks/use-app-colors';

type Props = {
  children: ReactNode;
  footer?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollProps?: Omit<ScrollViewProps, 'children' | 'contentContainerStyle'>;
  keyboardVerticalOffset?: number;
  centerContent?: boolean;
};

/**
 * Écran formulaire : scroll fluide quand le clavier s’ouvre, padding safe area cohérent.
 */
export function KeyboardAwareScroll({
  children,
  footer,
  contentContainerStyle,
  scrollProps,
  keyboardVerticalOffset,
  centerContent = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const bottomPad = keyboardVisible
    ? Math.max(insets.bottom, 12) + 120
    : Math.max(insets.bottom, 16) + (footer ? 8 : 24);

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset ?? (Platform.OS === 'ios' ? insets.top : 0)}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            centerContent && styles.centerGrow,
            { paddingBottom: bottomPad },
            contentContainerStyle,
          ]}
          {...scrollProps}>
          {children}
        </ScrollView>
        {footer ? (
          <ThemedView
            style={[
              styles.footer,
              {
                paddingBottom: Math.max(insets.bottom, 12),
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
              },
            ]}>
            {footer}
          </ThemedView>
        ) : null}
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  centerGrow: { flexGrow: 1, justifyContent: 'center' },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});

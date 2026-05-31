import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCourierPalette } from '@/lib/courier-theme';

const TAB_ORDER = ['index', 'missions', 'profile'] as const;

function haptic() {
  if (process.env.EXPO_OS === 'ios') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export function CourierTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const palette = useCourierPalette();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? 10 : 8);
  const focusedName = state.routes[state.index]?.name;

  const orderedRoutes = TAB_ORDER.map((name) => state.routes.find((r) => r.name === name)).filter(
    (r): r is (typeof state.routes)[number] => r != null,
  );

  return (
    <View style={[styles.root, styles.boxPointer, { paddingBottom: bottomPad }]}>
      <LinearGradient
        colors={
          isDark
            ? ['rgba(16,18,20,0)', 'rgba(16,18,20,0.95)', palette.primarySoft]
            : ['rgba(255,255,255,0)', 'rgba(246,250,247,0.95)', palette.primarySoft]
        }
        locations={[0, 0.45, 1]}
        style={[StyleSheet.absoluteFill, styles.noPointer]}
      />
      <View style={styles.barArea}>
        <View style={[styles.track, { borderColor: palette.border }, Platform.OS === 'ios' ? { shadowColor: palette.primaryDeep, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16 } : styles.shadowAndroid]}>
          <BlurView intensity={Platform.OS === 'ios' ? 42 : 80} tint={isDark ? 'dark' : 'light'} style={styles.blur} />
          <LinearGradient
            colors={
              isDark
                ? ['rgba(16,18,20,0.92)', palette.card]
                : ['rgba(255,255,255,0.92)', palette.card]
            }
            style={styles.blur}
          />
          <View style={styles.row}>
            {orderedRoutes.map((route) => {
              const { options } = descriptors[route.key];
              const isFocused = focusedName === route.name;
              const title =
                typeof options.title === 'string'
                  ? options.title
                  : typeof options.tabBarLabel === 'string'
                    ? options.tabBarLabel
                    : route.name;
              const color = isFocused ? palette.primary : palette.tabBarInactive;
              const Icon = options.tabBarIcon;

              return (
                <PlatformPressable
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isFocused }}
                  onPress={() => {
                    haptic();
                    const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                    if (!isFocused && !e.defaultPrevented) {
                      navigation.navigate(route.name);
                    }
                  }}
                  style={styles.tab}>
                  {isFocused ? <View style={[styles.activePill, { backgroundColor: palette.primarySoft }]} /> : null}
                  {Icon ? Icon({ focused: isFocused, color, size: 22 }) : null}
                  <Text style={[styles.label, { color, fontWeight: isFocused ? '800' : '600' }]}>{title}</Text>
                </PlatformPressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  boxPointer: { pointerEvents: 'box-none' },
  noPointer: { pointerEvents: 'none' },
  barArea: { paddingHorizontal: 16, paddingTop: 8 },
  track: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
  },
  blur: { ...StyleSheet.absoluteFillObject, borderRadius: 28 },
  shadowAndroid: { elevation: 10 },
  row: { flexDirection: 'row', paddingVertical: 11, paddingHorizontal: 8 },
  tab: { flex: 1, alignItems: 'center', gap: 5, paddingVertical: 5 },
  activePill: {
    position: 'absolute',
    top: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  label: { fontSize: 10 },
});

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppColors } from '@/hooks/use-app-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useVendorTheme } from '@/hooks/use-vendor-theme';

const TAB_ORDER = ['index', 'orders', 'deliveries', 'products', 'more'] as const;

function haptic() {
  if (process.env.EXPO_OS === 'ios') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export function VendorTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? 10 : 8);
  const { palette } = useVendorTheme();
  const colors = useAppColors();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  const orderedRoutes = TAB_ORDER.map((name) => state.routes.find((r) => r.name === name)).filter(
    (r): r is (typeof state.routes)[number] => r != null
  );

  const focusedName = state.routes[state.index]?.name;

  const fadeMid = isDark ? 'rgba(11,12,14,0.92)' : 'rgba(248,252,249,0.92)';

  return (
    <View style={[styles.root, styles.boxPointer, { paddingBottom: bottomPad }]}>
      <LinearGradient
        colors={isDark ? ['rgba(11,12,14,0)', fadeMid, colors.backgroundAlt] : ['rgba(255,255,255,0)', fadeMid, palette.primarySoft]}
        locations={[0, 0.4, 1]}
        style={[StyleSheet.absoluteFill, styles.noPointer]}
      />
      <View style={[styles.barArea, styles.boxPointer]}>
        <View
          style={[
            styles.track,
            Platform.OS === 'ios' ? styles.trackShadowIos : styles.trackShadowAndroid,
            { shadowColor: palette.primaryDeep },
          ]}>
          <BlurView
            intensity={Platform.OS === 'ios' ? 40 : 80}
            tint={isDark ? 'dark' : 'light'}
            style={[StyleSheet.absoluteFillObject, { borderRadius: 28 }]}
          />
          <LinearGradient
            colors={isDark ? ['rgba(21,23,26,0.85)', colors.surfaceElevated] : ['rgba(255,255,255,0.85)', '#FFFFFF']}
            style={[StyleSheet.absoluteFillObject, { borderRadius: 28 }]}
          />
          <View
            style={[
              StyleSheet.absoluteFillObject,
              styles.trackStroke,
              { borderColor: palette.trackStroke },
            ]}
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
                  accessibilityLabel={typeof title === 'string' ? title : route.name}
                  onPress={() => {
                    haptic();
                    const e = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });
                    if (!isFocused && !e.defaultPrevented) {
                      navigation.navigate(route.name as never);
                    }
                  }}
                  style={styles.tab}
                  hitSlop={{ top: 6, bottom: 8, left: 4, right: 4 }}>
                  {isFocused ? (
                    <View style={[styles.activePill, { backgroundColor: palette.primarySoft }]} />
                  ) : null}
                  {Icon ? <Icon focused={isFocused} color={color} size={22} /> : null}
                  <Text
                    style={[styles.label, { color, fontWeight: isFocused ? '800' : '600' }]}
                    numberOfLines={1}>
                    {typeof title === 'string' ? title : route.name}
                  </Text>
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
  root: {
    backgroundColor: 'transparent',
    paddingTop: 4,
  },
  boxPointer: { pointerEvents: 'box-none' },
  noPointer: { pointerEvents: 'none' },
  barArea: {
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  track: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 58,
    justifyContent: 'center',
  },
  trackShadowIos: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  trackShadowAndroid: {
    elevation: 10,
  },
  trackStroke: {
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    pointerEvents: 'none',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 6,
    zIndex: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  label: {
    fontSize: 10,
    letterSpacing: -0.15,
  },
});

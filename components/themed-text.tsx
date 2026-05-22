import { StyleSheet, Text, type TextProps } from 'react-native';

import { useAppColors } from '@/hooks/use-app-colors';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'muted';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const colors = useAppColors();
  const defaultColor =
    type === 'muted' ? colors.textMuted : type === 'link' ? colors.primary : colors.text;
  const color = useThemeColor(
    { light: lightColor ?? defaultColor, dark: darkColor ?? defaultColor },
    'text',
  );

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'muted' ? styles.muted : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  link: {
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '700',
  },
  muted: {
    fontSize: 14,
    lineHeight: 20,
  },
});

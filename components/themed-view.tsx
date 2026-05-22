import { View, type ViewProps } from 'react-native';

import { useAppColors } from '@/hooks/use-app-colors';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const colors = useAppColors();
  const backgroundColor = useThemeColor(
    { light: lightColor ?? colors.background, dark: darkColor ?? colors.background },
    'background',
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

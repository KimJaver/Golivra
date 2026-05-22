import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useResponsiveLayout } from '@/hooks/use-responsive-layout';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Padding horizontal sur téléphone (défaut 18). */
  phonePadding?: number;
};

/** Centre le contenu et limite la largeur sur tablette / grands écrans. */
export function AppContentWidth({ children, style, phonePadding = 18 }: Props) {
  const { contentWidth, horizontalPadding, isTablet } = useResponsiveLayout();

  return (
    <View
      style={[
        styles.root,
        {
          paddingHorizontal: isTablet ? horizontalPadding : phonePadding,
          maxWidth: contentWidth,
          alignSelf: 'center',
          width: '100%',
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
});

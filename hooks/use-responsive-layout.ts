import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const TABLET_MIN = 600;
const LARGE_TABLET_MIN = 900;
export const MAX_CONTENT_WIDTH = 720;

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isTablet = width >= TABLET_MIN;
    const isLargeTablet = width >= LARGE_TABLET_MIN;
    const contentWidth = Math.min(width, isLargeTablet ? MAX_CONTENT_WIDTH : isTablet ? 640 : width);
    const horizontalPadding = isTablet ? Math.max(20, (width - contentWidth) / 2) : 0;
    const gridColumns = isLargeTablet ? 3 : isTablet ? 2 : 1;
    const compactHeight = height < 700;

    return {
      width,
      height,
      isTablet,
      isLargeTablet,
      contentWidth,
      horizontalPadding,
      gridColumns,
      compactHeight,
    };
  }, [width, height]);
}

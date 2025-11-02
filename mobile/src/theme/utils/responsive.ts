/**
 * Responsive Utility Functions
 *
 * Advanced responsive helpers implementing:
 * - Box system with parent-child relationships
 * - Rearrange vs shrink principle
 * - Fluid scaling utilities
 */

import { useWindowDimensions, Platform, PixelRatio } from 'react-native';
import { breakpoints } from '../breakpoints';
import { spacing } from '../spacing';

// ============================================================================
// Fluid Typography
// ============================================================================

/**
 * Calculate fluid font size based on viewport width
 * Implements smooth scaling between breakpoints
 *
 * @param minSize - Minimum font size (phone)
 * @param maxSize - Maximum font size (desktop)
 * @param minWidth - Minimum viewport width (default: 375)
 * @param maxWidth - Maximum viewport width (default: 1200)
 *
 * @example
 * const fontSize = useFluidSize(16, 20); // Scales from 16px to 20px
 */
export const useFluidSize = (
  minSize: number,
  maxSize: number,
  minWidth: number = breakpoints.phone.min,
  maxWidth: number = 1200
): number => {
  const { width } = useWindowDimensions();

  if (width <= minWidth) return minSize;
  if (width >= maxWidth) return maxSize;

  // Linear interpolation
  const slope = (maxSize - minSize) / (maxWidth - minWidth);
  return minSize + slope * (width - minWidth);
};

/**
 * Calculate fluid spacing based on viewport
 * Scales spacing proportionally to screen size
 */
export const useFluidSpacing = (
  phoneSpacing: number,
  desktopSpacing: number = phoneSpacing * 1.5
): number => {
  return useFluidSize(phoneSpacing, desktopSpacing);
};

// ============================================================================
// Responsive Values
// ============================================================================

/**
 * Get value based on screen width ranges
 * More flexible than device type
 *
 * @example
 * const columns = useResponsiveValue({
 *   0: 1,      // 1 column from 0px
 *   600: 2,    // 2 columns from 600px
 *   1024: 3,   // 3 columns from 1024px
 * });
 */
export const useResponsiveValue = <T,>(
  values: Record<number, T>
): T => {
  const { width } = useWindowDimensions();

  const breakpointKeys = Object.keys(values)
    .map(Number)
    .sort((a, b) => b - a); // Sort descending

  for (const breakpoint of breakpointKeys) {
    if (width >= breakpoint) {
      return values[breakpoint];
    }
  }

  // Fallback to smallest breakpoint
  return values[Math.min(...breakpointKeys)];
};

/**
 * Clamp value between min and max with viewport-based scaling
 * @example
 * const padding = useClampedValue(16, 32, 48); // Scales from 16 to 48, defaults to 32
 */
export const useClampedValue = (
  min: number,
  preferred: number,
  max: number
): number => {
  const { width } = useWindowDimensions();
  const scale = width / 375; // 375 = iPhone base width

  const scaled = preferred * scale;
  return Math.max(min, Math.min(max, scaled));
};

// ============================================================================
// Grid System
// ============================================================================

/**
 * Calculate responsive grid columns
 * Implements box system with clear relationships
 *
 * @param minColumns - Minimum columns (phone)
 * @param maxColumns - Maximum columns (desktop)
 * @param gap - Gap between columns
 */
export const useGridColumns = (
  minColumns: number = 1,
  maxColumns: number = 3,
  gap: number = spacing[4]
): {
  columns: number;
  itemWidth: number;
  gap: number;
} => {
  const { width } = useWindowDimensions();

  const columns = useResponsiveValue({
    [breakpoints.phone.min]: minColumns,
    [breakpoints.tablet.min]: Math.ceil((minColumns + maxColumns) / 2),
    [breakpoints.desktop.min]: maxColumns,
  });

  const totalGap = gap * (columns - 1);
  const itemWidth = (width - totalGap) / columns;

  return { columns, itemWidth, gap };
};

/**
 * Calculate masonry/staggered grid layout
 * For Pinterest-style grids
 */
export const useMasonryGrid = (
  columns: number,
  gap: number = spacing[4]
) => {
  const { width } = useWindowDimensions();

  const totalGap = gap * (columns - 1);
  const columnWidth = (width - totalGap) / columns;

  const getColumnIndex = (index: number) => index % columns;
  const getColumnOffset = (columnIndex: number) =>
    columnIndex * (columnWidth + gap);

  return { columnWidth, getColumnIndex, getColumnOffset };
};

// ============================================================================
// Container Queries (Box System)
// ============================================================================

/**
 * Get container width with responsive padding
 * Implements system of boxes principle
 *
 * @param fullWidth - Whether container should be full width
 * @param maxWidth - Maximum container width
 */
export const useContainerWidth = (
  fullWidth: boolean = false,
  maxWidth: number = 1200
): {
  width: number | string;
  padding: number;
  maxWidth: number;
} => {
  const { width } = useWindowDimensions();

  const padding = useResponsiveValue({
    [breakpoints.phone.min]: spacing[4],    // 16px
    [breakpoints.tablet.min]: spacing[6],   // 24px
    [breakpoints.desktop.min]: spacing[8],  // 32px
  });

  if (fullWidth) {
    return {
      width: '100%',
      padding,
      maxWidth: Infinity,
    };
  }

  return {
    width: Math.min(width - padding * 2, maxWidth),
    padding,
    maxWidth,
  };
};

/**
 * Calculate item size within container
 * Accounts for padding and gaps
 */
export const useItemSize = (
  itemsPerRow: number,
  containerPadding: number = spacing[4],
  itemGap: number = spacing[2]
): number => {
  const { width } = useWindowDimensions();

  const availableWidth = width - containerPadding * 2;
  const totalGap = itemGap * (itemsPerRow - 1);

  return (availableWidth - totalGap) / itemsPerRow;
};

// ============================================================================
// Aspect Ratio Utilities
// ============================================================================

/**
 * Calculate height based on aspect ratio
 * @param width - Element width
 * @param aspectRatio - Aspect ratio (width / height)
 *
 * @example
 * const height = calculateAspectRatioHeight(375, 16/9); // 211.875
 */
export const calculateAspectRatioHeight = (
  width: number,
  aspectRatio: number
): number => {
  return width / aspectRatio;
};

/**
 * Get responsive aspect ratio
 * Different aspect ratios for different devices
 */
export const useResponsiveAspectRatio = (
  phoneRatio: number = 1, // Square on phone
  tabletRatio: number = 4 / 3,
  desktopRatio: number = 16 / 9
): number => {
  return useResponsiveValue({
    [breakpoints.phone.min]: phoneRatio,
    [breakpoints.tablet.min]: tabletRatio,
    [breakpoints.desktop.min]: desktopRatio,
  });
};

// ============================================================================
// Orientation & Device Detection
// ============================================================================

/**
 * Detect device orientation
 * Useful for layout rearrangement
 */
export const useOrientation = (): 'portrait' | 'landscape' => {
  const { width, height } = useWindowDimensions();
  return height >= width ? 'portrait' : 'landscape';
};

/**
 * Detect if device is a tablet
 * Based on screen size and pixel density
 */
export const useIsTablet = (): boolean => {
  const { width } = useWindowDimensions();
  const pixelRatio = PixelRatio.get();

  // iPad detection: large screen with standard pixel density
  const isLargeScreen = width >= breakpoints.tablet.min;
  const isTabletDensity = pixelRatio < 3; // Tablets typically have lower pixel density

  return isLargeScreen && (Platform.OS === 'ios' ? isTabletDensity : true);
};

/**
 * Get safe area padding for responsive layouts
 * Accounts for notches, status bars
 */
export const useSafeAreaPadding = (): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} => {
  // Note: In production, use react-native-safe-area-context
  // This is a simplified version
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  if (Platform.OS === 'ios') {
    return {
      top: isLandscape ? 0 : 44,    // Status bar
      bottom: isLandscape ? 21 : 34, // Home indicator
      left: isLandscape ? 44 : 0,
      right: isLandscape ? 44 : 0,
    };
  }

  // Android
  return {
    top: 24,  // Status bar
    bottom: 0,
    left: 0,
    right: 0,
  };
};

// ============================================================================
// Performance Utilities
// ============================================================================

/**
 * Normalize size for different pixel densities
 * Ensures consistent visual size across devices
 */
export const normalize = (size: number): number => {
  const scale = useWindowDimensions().width / 375; // iPhone base width
  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }

  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/**
 * Scale font size based on device
 * Ensures readability across screen sizes
 */
export const scaleFontSize = (size: number): number => {
  const { width } = useWindowDimensions();
  const baseWidth = 375; // iPhone 11/12/13 width

  const scale = width / baseWidth;

  // Limit scaling to prevent too large/small text
  const clampedScale = Math.min(Math.max(scale, 0.9), 1.3);

  return Math.round(size * clampedScale);
};

/**
 * Get pixel ratio category
 * Useful for loading appropriate image resolutions
 */
export const getPixelRatioCategory = (): '1x' | '2x' | '3x' => {
  const pixelRatio = PixelRatio.get();

  if (pixelRatio >= 3) return '3x';
  if (pixelRatio >= 2) return '2x';
  return '1x';
};

// ============================================================================
// Layout Rearrangement Helpers
// ============================================================================

/**
 * Get flex direction based on available space
 * Implements "rearrange, not shrink" principle
 *
 * @param minWidth - Minimum width for horizontal layout
 */
export const useFlexDirection = (
  minWidth: number = breakpoints.tablet.min
): 'row' | 'column' => {
  const { width } = useWindowDimensions();
  return width >= minWidth ? 'row' : 'column';
};

/**
 * Determine if elements should wrap
 * Based on container width and item count
 */
export const useShouldWrap = (
  itemCount: number,
  minItemWidth: number,
  gap: number = spacing[2]
): boolean => {
  const { width } = useWindowDimensions();

  const totalGap = gap * (itemCount - 1);
  const totalItemWidth = minItemWidth * itemCount;
  const requiredWidth = totalItemWidth + totalGap;

  return width < requiredWidth;
};

/**
 * Calculate optimal number of items per row
 * Based on minimum item width
 */
export const useOptimalItemsPerRow = (
  minItemWidth: number,
  maxItemsPerRow: number = 4,
  gap: number = spacing[2],
  containerPadding: number = spacing[4]
): number => {
  const { width } = useWindowDimensions();

  const availableWidth = width - containerPadding * 2;

  for (let items = maxItemsPerRow; items >= 1; items--) {
    const totalGap = gap * (items - 1);
    const itemWidth = (availableWidth - totalGap) / items;

    if (itemWidth >= minItemWidth) {
      return items;
    }
  }

  return 1; // Fallback
};

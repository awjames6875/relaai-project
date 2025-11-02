/**
 * Breakpoint System
 *
 * Responsive layout principles from UI/UX best practices:
 * - Every design starts as a system of boxes
 * - Responsive isn't about shrinking - it's about rearranging with purpose
 * - Elements should shift, flow, or reprioritize as space changes
 *
 * Mobile-first approach:
 * - Phone: 0-599px (iPhone SE to iPhone 14 Pro)
 * - Tablet: 600-1023px (iPad, Android tablets)
 * - Desktop: 1024px+ (iPad Pro landscape, desktop web)
 */

import { Breakpoints } from './types';
import { useWindowDimensions } from 'react-native';

// ============================================================================
// Breakpoint Definitions
// ============================================================================

/**
 * Breakpoint ranges for different device types
 * Based on common device sizes and usability research
 */
export const breakpoints: Breakpoints = {
  // Phone: Portrait mobile devices
  phone: {
    min: 0,
    max: 599,
  },

  // Tablet: Landscape phones, portrait tablets
  tablet: {
    min: 600,
    max: 1023,
  },

  // Desktop: Landscape tablets, desktop browsers
  desktop: {
    min: 1024,
    max: Infinity,
  },
};

// ============================================================================
// Specific Device Breakpoints
// ============================================================================

/**
 * Common device sizes for reference
 * Use these for testing and debugging
 */
export const deviceSizes = {
  // iPhones
  iphoneSE: 375,        // iPhone SE (2020)
  iphone12: 390,        // iPhone 12, 13
  iphone12ProMax: 428,  // iPhone 12/13/14 Pro Max
  iphone14Pro: 393,     // iPhone 14 Pro

  // iPads
  ipadMini: 744,        // iPad Mini (portrait)
  ipad: 820,            // iPad 10.2" (portrait)
  ipadPro11: 834,       // iPad Pro 11" (portrait)
  ipadPro129: 1024,     // iPad Pro 12.9" (portrait)

  // Android (common)
  androidSmall: 360,    // Small Android phones
  androidMedium: 412,   // Pixel, Galaxy S
  androidLarge: 480,    // Large phones
  androidTablet: 600,   // Small tablets

  // Desktop
  desktopSmall: 1024,
  desktopMedium: 1280,
  desktopLarge: 1440,
  desktopXL: 1920,
};

// ============================================================================
// Responsive Hooks
// ============================================================================

/**
 * Custom hook to get current device type
 * Returns boolean flags for each device type
 *
 * @example
 * const { isPhone, isTablet, isDesktop } = useResponsive();
 * if (isPhone) {
 *   // Render mobile layout
 * }
 */
export const useResponsive = () => {
  const { width } = useWindowDimensions();

  return {
    isPhone: width >= breakpoints.phone.min && width <= breakpoints.phone.max,
    isTablet: width >= breakpoints.tablet.min && width <= breakpoints.tablet.max,
    isDesktop: width >= breakpoints.desktop.min,
    width,
  };
};

/**
 * Custom hook to get specific device size category
 * Useful for more granular responsive logic
 *
 * @example
 * const device = useDeviceSize();
 * if (device === 'phone-small') {
 *   // iPhone SE layout
 * }
 */
export const useDeviceSize = () => {
  const { width } = useWindowDimensions();

  if (width < 380) return 'phone-small';   // iPhone SE, small Androids
  if (width < 430) return 'phone-medium';  // iPhone 12, 13, 14
  if (width < 600) return 'phone-large';   // iPhone Pro Max, phablets
  if (width < 800) return 'tablet-small';  // iPad Mini
  if (width < 1024) return 'tablet-large'; // iPad
  if (width < 1280) return 'desktop-small';
  if (width < 1920) return 'desktop-medium';
  return 'desktop-large';
};

// ============================================================================
// Responsive Value Selectors
// ============================================================================

/**
 * Select value based on current device type
 * Mobile-first: returns phone value if no match
 *
 * @example
 * const padding = selectResponsiveValue({
 *   phone: 16,
 *   tablet: 24,
 *   desktop: 32
 * });
 */
export const selectResponsiveValue = <T,>(values: {
  phone: T;
  tablet?: T;
  desktop?: T;
}): T => {
  const { isDesktop, isTablet } = useResponsive();

  if (isDesktop && values.desktop !== undefined) {
    return values.desktop;
  }

  if (isTablet && values.tablet !== undefined) {
    return values.tablet;
  }

  return values.phone;
};

/**
 * Select value based on minimum width
 * Useful for responsive styling
 *
 * @example
 * const columns = selectByWidth(width, {
 *   0: 1,      // 1 column on phone
 *   600: 2,    // 2 columns on tablet
 *   1024: 3,   // 3 columns on desktop
 * });
 */
export const selectByWidth = <T,>(
  currentWidth: number,
  values: Record<number, T>
): T => {
  const breakpointKeys = Object.keys(values)
    .map(Number)
    .sort((a, b) => b - a); // Sort descending

  for (const breakpoint of breakpointKeys) {
    if (currentWidth >= breakpoint) {
      return values[breakpoint];
    }
  }

  // Fallback to smallest breakpoint
  return values[Math.min(...breakpointKeys)];
};

// ============================================================================
// Layout Rearrangement Helpers
// ============================================================================

/**
 * Get flex direction based on screen size
 * Implements "rearrange, not shrink" principle
 *
 * @example
 * const flexDirection = getResponsiveFlexDirection('column', 'row');
 * // Returns 'column' on phone, 'row' on tablet/desktop
 */
export const getResponsiveFlexDirection = (
  phone: 'row' | 'column',
  tabletAndUp: 'row' | 'column'
): 'row' | 'column' => {
  const { isPhone } = useResponsive();
  return isPhone ? phone : tabletAndUp;
};

/**
 * Get number of columns for grid layouts
 * Automatically adjusts based on screen size
 *
 * @example
 * const columns = getResponsiveColumns(); // 1 on phone, 2 on tablet, 3 on desktop
 */
export const getResponsiveColumns = (custom?: {
  phone?: number;
  tablet?: number;
  desktop?: number;
}) => {
  const defaults = {
    phone: 1,
    tablet: 2,
    desktop: 3,
  };

  const values = { ...defaults, ...custom };

  return selectResponsiveValue(values);
};

/**
 * Get item width for grid layouts
 * Accounts for gaps and padding
 *
 * @example
 * const itemWidth = getResponsiveItemWidth(16, 3); // containerWidth, columns, gap
 */
export const getResponsiveItemWidth = (
  containerWidth: number,
  columns: number,
  gap: number = 16
): number => {
  const totalGap = gap * (columns - 1);
  return (containerWidth - totalGap) / columns;
};

// ============================================================================
// Responsive Component Visibility
// ============================================================================

/**
 * Show/hide components based on device type
 * Returns display: 'flex' | 'none'
 *
 * @example
 * const display = showOn(['tablet', 'desktop']);
 * // Shows on tablet/desktop, hides on phone
 */
export const showOn = (devices: Array<'phone' | 'tablet' | 'desktop'>): 'flex' | 'none' => {
  const { isPhone, isTablet, isDesktop } = useResponsive();

  const shouldShow =
    (devices.includes('phone') && isPhone) ||
    (devices.includes('tablet') && isTablet) ||
    (devices.includes('desktop') && isDesktop);

  return shouldShow ? 'flex' : 'none';
};

/**
 * Hide components on specific devices
 * Inverse of showOn
 */
export const hideOn = (devices: Array<'phone' | 'tablet' | 'desktop'>): 'flex' | 'none' => {
  const allDevices: Array<'phone' | 'tablet' | 'desktop'> = ['phone', 'tablet', 'desktop'];
  const showDevices = allDevices.filter(d => !devices.includes(d));
  return showOn(showDevices);
};

// ============================================================================
// Media Query Helpers (for styled-components)
// ============================================================================

/**
 * Media query helpers for styled-components
 * Use these in styled components for responsive styles
 *
 * @example
 * const Container = styled.View`
 *   padding: 16px;
 *
 *   ${media.tablet} {
 *     padding: 24px;
 *   }
 *
 *   ${media.desktop} {
 *     padding: 32px;
 *   }
 * `;
 */
export const media = {
  // Min-width queries (mobile-first)
  tablet: `@media (min-width: ${breakpoints.tablet.min}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop.min}px)`,

  // Max-width queries (desktop-first, use sparingly)
  phoneOnly: `@media (max-width: ${breakpoints.phone.max}px)`,
  tabletOnly: `@media (min-width: ${breakpoints.tablet.min}px) and (max-width: ${breakpoints.tablet.max}px)`,

  // Custom breakpoint
  custom: (minWidth: number) => `@media (min-width: ${minWidth}px)`,
};

// ============================================================================
// Box System Helpers
// ============================================================================

/**
 * Calculate container constraints
 * Implements "system of boxes" principle
 *
 * @example
 * const constraints = getContainerConstraints();
 * // Returns { maxWidth, padding } based on device
 */
export const getContainerConstraints = () => {
  const { isPhone, isTablet } = useResponsive();

  if (isPhone) {
    return {
      maxWidth: '100%',
      padding: 16,
      margin: 0,
    };
  }

  if (isTablet) {
    return {
      maxWidth: 960,
      padding: 24,
      margin: 'auto',
    };
  }

  // Desktop
  return {
    maxWidth: 1200,
    padding: 32,
    margin: 'auto',
  };
};

/**
 * Safe area insets for notched devices
 * Accounts for status bar, home indicator
 */
export const useSafeAreaInsets = () => {
  // Note: In production, use react-native-safe-area-context
  // This is a simplified version
  const { isPhone } = useResponsive();

  return {
    top: isPhone ? 44 : 0,      // Status bar height
    bottom: isPhone ? 34 : 0,   // Home indicator height
    left: 0,
    right: 0,
  };
};

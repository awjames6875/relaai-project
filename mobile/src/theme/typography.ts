/**
 * Typography System
 *
 * Modular type scale with 1.25 ratio (major third)
 * Base size: 16px (body text)
 *
 * Typography Hierarchy:
 * - H1-H6: Headings (display, title, subtitle)
 * - Body: Main text content (large, default, small)
 * - Caption: Helper text, timestamps
 * - Label: Form labels, tags
 * - Button: Button text
 *
 * Responsive: Text scales slightly on larger screens
 */

import { Typography, FontWeights } from './types';
import { Platform } from 'react-native';

// ============================================================================
// Font Weights
// ============================================================================

export const fontWeights: FontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// ============================================================================
// Font Families
// ============================================================================

/**
 * System font stacks for iOS and Android
 * Uses native fonts for best performance and native feel
 */
export const fontFamilies = {
  // iOS: San Francisco, Android: Roboto
  system: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  // Monospace for code or numeric displays
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

// ============================================================================
// Typography Scale
// ============================================================================

/**
 * Modular scale with 1.25 ratio (major third)
 * Base: 16px
 * Formula: base × (ratio ^ exponent)
 */
export const typography: Typography = {
  // Display/Hero text - largest
  h1: {
    fontSize: 32,      // 16 × 1.25^3 ≈ 32
    lineHeight: 40,    // 1.25 ratio for comfortable reading
    fontWeight: '800', // Extrabold
    letterSpacing: -0.5, // Tighter spacing for large text
  },

  // Page titles
  h2: {
    fontSize: 28,      // 16 × 1.25^2.5 ≈ 28
    lineHeight: 36,
    fontWeight: '700', // Bold
    letterSpacing: -0.3,
  },

  // Section headings
  h3: {
    fontSize: 24,      // 16 × 1.25^2 ≈ 24
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  // Subsection headings
  h4: {
    fontSize: 20,      // 16 × 1.25 = 20
    lineHeight: 28,
    fontWeight: '600', // Semibold
    letterSpacing: -0.1,
  },

  // Small headings
  h5: {
    fontSize: 18,      // 16 × 1.125 ≈ 18
    lineHeight: 24,
    fontWeight: '600',
  },

  // Tiny headings
  h6: {
    fontSize: 16,      // Base size
    lineHeight: 24,
    fontWeight: '600',
  },

  // Large body text
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400', // Regular
  },

  // Default body text - base size
  body: {
    fontSize: 16,      // Base
    lineHeight: 24,    // 1.5 ratio for readability
    fontWeight: '400',
  },

  // Small body text
  bodySmall: {
    fontSize: 14,      // 16 / 1.14 ≈ 14
    lineHeight: 20,
    fontWeight: '400',
  },

  // Caption text (timestamps, helper text)
  caption: {
    fontSize: 12,      // 16 / 1.33 ≈ 12
    lineHeight: 16,
    fontWeight: '400',
  },

  // Labels (form labels, tags, badges)
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500', // Medium
    letterSpacing: 0.1, // Slightly wider for readability
  },

  // Button text
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600', // Semibold
    letterSpacing: 0.2, // Wider for impact
  },
};

// ============================================================================
// Responsive Typography
// ============================================================================

/**
 * Scale multipliers for different screen sizes
 * Mobile-first approach: phone = 1x, tablet = 1.1x, desktop = 1.2x
 */
export const typographyScale = {
  phone: 1,
  tablet: 1.1,
  desktop: 1.2,
};

/**
 * Get responsive font size
 * @example getResponsiveFontSize(typography.h1, 'tablet') // returns 35.2
 */
export const getResponsiveFontSize = (
  variant: keyof Typography,
  device: keyof typeof typographyScale
): number => {
  return typography[variant].fontSize * typographyScale[device];
};

// ============================================================================
// Text Styles (for React Native Text components)
// ============================================================================

/**
 * Pre-built text styles ready for React Native
 * Can be used directly with Text component
 *
 * @example
 * <Text style={textStyles.h1}>Heading</Text>
 */
export const textStyles = {
  h1: {
    fontFamily: fontFamilies.system,
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
    fontWeight: typography.h1.fontWeight,
    letterSpacing: typography.h1.letterSpacing,
  },
  h2: {
    fontFamily: fontFamilies.system,
    fontSize: typography.h2.fontSize,
    lineHeight: typography.h2.lineHeight,
    fontWeight: typography.h2.fontWeight,
    letterSpacing: typography.h2.letterSpacing,
  },
  h3: {
    fontFamily: fontFamilies.system,
    fontSize: typography.h3.fontSize,
    lineHeight: typography.h3.lineHeight,
    fontWeight: typography.h3.fontWeight,
    letterSpacing: typography.h3.letterSpacing,
  },
  h4: {
    fontFamily: fontFamilies.system,
    fontSize: typography.h4.fontSize,
    lineHeight: typography.h4.lineHeight,
    fontWeight: typography.h4.fontWeight,
    letterSpacing: typography.h4.letterSpacing,
  },
  h5: {
    fontFamily: fontFamilies.system,
    fontSize: typography.h5.fontSize,
    lineHeight: typography.h5.lineHeight,
    fontWeight: typography.h5.fontWeight,
  },
  h6: {
    fontFamily: fontFamilies.system,
    fontSize: typography.h6.fontSize,
    lineHeight: typography.h6.lineHeight,
    fontWeight: typography.h6.fontWeight,
  },
  bodyLarge: {
    fontFamily: fontFamilies.system,
    fontSize: typography.bodyLarge.fontSize,
    lineHeight: typography.bodyLarge.lineHeight,
    fontWeight: typography.bodyLarge.fontWeight,
  },
  body: {
    fontFamily: fontFamilies.system,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: typography.body.fontWeight,
  },
  bodySmall: {
    fontFamily: fontFamilies.system,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    fontWeight: typography.bodySmall.fontWeight,
  },
  caption: {
    fontFamily: fontFamilies.system,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: typography.caption.fontWeight,
  },
  label: {
    fontFamily: fontFamilies.system,
    fontSize: typography.label.fontSize,
    lineHeight: typography.label.lineHeight,
    fontWeight: typography.label.fontWeight,
    letterSpacing: typography.label.letterSpacing,
  },
  button: {
    fontFamily: fontFamilies.system,
    fontSize: typography.button.fontSize,
    lineHeight: typography.button.lineHeight,
    fontWeight: typography.button.fontWeight,
    letterSpacing: typography.button.letterSpacing,
  },
};

// ============================================================================
// Typography Utilities
// ============================================================================

/**
 * Truncate text with ellipsis
 * Returns React Native style object
 */
export const truncateText = (lines: number = 1) => ({
  numberOfLines: lines,
  ellipsizeMode: 'tail' as const,
});

/**
 * Text alignment helpers
 */
export const textAlign = {
  left: { textAlign: 'left' as const },
  center: { textAlign: 'center' as const },
  right: { textAlign: 'right' as const },
  justify: { textAlign: 'justify' as const },
};

/**
 * Text transform helpers
 */
export const textTransform = {
  uppercase: { textTransform: 'uppercase' as const },
  lowercase: { textTransform: 'lowercase' as const },
  capitalize: { textTransform: 'capitalize' as const },
  none: { textTransform: 'none' as const },
};

/**
 * Text decoration helpers
 */
export const textDecoration = {
  underline: { textDecorationLine: 'underline' as const },
  lineThrough: { textDecorationLine: 'line-through' as const },
  none: { textDecorationLine: 'none' as const },
};

// ============================================================================
// Accessibility
// ============================================================================

/**
 * Minimum font sizes for accessibility
 * WCAG 2.1 Level AA compliance
 */
export const accessibilityMinimums = {
  bodyText: 16,     // Minimum for body text
  largeText: 18,    // Large text (1.5x body or bold 1.2x)
  touchTarget: 44,  // Minimum touch target
};

/**
 * Dynamic type scale for accessibility
 * Supports user font size preferences
 */
export const dynamicTypeScale = {
  xs: 0.8,   // Extra small
  sm: 0.9,   // Small
  md: 1.0,   // Medium (default)
  lg: 1.1,   // Large
  xl: 1.2,   // Extra large
  xxl: 1.3,  // 2x large
  xxxl: 1.5, // 3x large (maximum)
};

/**
 * Get scaled font size based on user preference
 * @example getScaledFontSize(typography.body, 'lg') // returns 17.6
 */
export const getScaledFontSize = (
  variant: keyof Typography,
  scale: keyof typeof dynamicTypeScale
): number => {
  return typography[variant].fontSize * dynamicTypeScale[scale];
};

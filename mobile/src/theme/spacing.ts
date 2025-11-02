/**
 * Spacing System
 *
 * 4px base unit system for consistent spacing throughout the app
 * Follows the 8-point grid system (multiples of 4)
 *
 * Usage:
 * - Use spacing[4] for standard padding (16px)
 * - Use spacing[2] for tight spacing (8px)
 * - Use spacing[6] for loose spacing (24px)
 *
 * Responsive spacing utilities in utils/responsive.ts
 */

import { SpacingScale } from './types';

// ============================================================================
// Base Spacing Scale
// ============================================================================

/**
 * 4px-based spacing scale
 * Each unit is a multiple of 4px for consistency
 */
export const spacing: SpacingScale = {
  0: 0,    // No spacing
  1: 4,    // Tiny
  2: 8,    // Extra small
  3: 12,   // Small
  4: 16,   // Medium (most common)
  5: 20,   // Large
  6: 24,   // Extra large
  8: 32,   // 2x large
  10: 40,  // 3x large
  12: 48,  // 4x large
  16: 64,  // 5x large
  20: 80,  // 6x large
  24: 96,  // Maximum
};

// ============================================================================
// Component-Specific Spacing
// ============================================================================

/**
 * Padding presets for common components
 */
export const componentPadding = {
  button: {
    small: { horizontal: spacing[3], vertical: spacing[2] },    // 12px x 8px
    medium: { horizontal: spacing[4], vertical: spacing[3] },   // 16px x 12px
    large: { horizontal: spacing[6], vertical: spacing[4] },    // 24px x 16px
  },
  card: {
    compact: spacing[3],  // 12px
    default: spacing[4],  // 16px
    comfortable: spacing[6], // 24px
  },
  input: {
    horizontal: spacing[4], // 16px
    vertical: spacing[3],   // 12px
  },
  modal: {
    padding: spacing[6],  // 24px
    spacing: spacing[4],  // 16px between elements
  },
  screen: {
    horizontal: spacing[4], // 16px - standard screen padding
    vertical: spacing[6],   // 24px - top/bottom padding
  },
  list: {
    itemGap: spacing[2],      // 8px between list items
    sectionGap: spacing[6],   // 24px between sections
    itemPadding: spacing[4],  // 16px item internal padding
  },
};

/**
 * Gap presets for flex/grid layouts
 */
export const layoutGaps = {
  tight: spacing[1],      // 4px
  compact: spacing[2],    // 8px
  default: spacing[4],    // 16px
  comfortable: spacing[6], // 24px
  loose: spacing[8],      // 32px
};

/**
 * Border radius values
 * Follows Apple's Human Interface Guidelines
 */
export const borderRadius = {
  none: 0,
  sm: 4,    // Small elements (chips, badges)
  md: 8,    // Default (buttons, inputs)
  lg: 12,   // Cards, containers
  xl: 16,   // Modals, bottom sheets
  '2xl': 24,  // Maximum roundness
  full: 9999, // Circular (avatars, pills)
};

/**
 * Icon sizes
 * Consistent sizing for all icons
 */
export const iconSizes = {
  xs: 16,   // Inline icons
  sm: 20,   // Small buttons
  md: 24,   // Default
  lg: 32,   // Large buttons
  xl: 48,   // Feature icons
  '2xl': 64,  // Hero icons
};

/**
 * Avatar sizes
 */
export const avatarSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  '2xl': 120,
};

// ============================================================================
// Spacing Utilities
// ============================================================================

/**
 * Helper to get spacing value
 * @example getSpacing(4) // returns 16
 */
export const getSpacing = (scale: keyof SpacingScale): number => {
  return spacing[scale];
};

/**
 * Helper to get multiple spacing values
 * @example getSpacings([2, 4]) // returns [8, 16]
 */
export const getSpacings = (scales: Array<keyof SpacingScale>): number[] => {
  return scales.map(scale => spacing[scale]);
};

/**
 * CSS-style spacing shorthand
 * @example spacingShorthand(4) // "16px"
 * @example spacingShorthand(4, 2) // "16px 8px"
 * @example spacingShorthand(4, 2, 4, 2) // "16px 8px 16px 8px"
 */
export const spacingShorthand = (
  top: keyof SpacingScale,
  right?: keyof SpacingScale,
  bottom?: keyof SpacingScale,
  left?: keyof SpacingScale
): string => {
  if (right === undefined) {
    return `${spacing[top]}px`;
  }
  if (bottom === undefined) {
    return `${spacing[top]}px ${spacing[right]}px`;
  }
  if (left === undefined) {
    return `${spacing[top]}px ${spacing[right]}px ${spacing[bottom]}px`;
  }
  return `${spacing[top]}px ${spacing[right]}px ${spacing[bottom]}px ${spacing[left]}px`;
};

// ============================================================================
// Responsive Spacing (Mobile-First)
// ============================================================================

/**
 * Responsive spacing multipliers
 * Phone: 1x, Tablet: 1.25x, Desktop: 1.5x
 */
export const responsiveSpacingMultipliers = {
  phone: 1,
  tablet: 1.25,
  desktop: 1.5,
};

/**
 * Get responsive spacing value
 * Automatically scales based on device size
 */
export const getResponsiveSpacing = (
  scale: keyof SpacingScale,
  device: keyof typeof responsiveSpacingMultipliers
): number => {
  return spacing[scale] * responsiveSpacingMultipliers[device];
};

// ============================================================================
// Layout Constraints
// ============================================================================

/**
 * Maximum content widths for readability
 * Prevents text from being too wide on large screens
 */
export const maxContentWidth = {
  text: 640,       // Max width for body text (optimal reading)
  form: 480,       // Max width for forms
  container: 1200, // Max width for main container
  wide: 1440,      // Wide container
};

/**
 * Minimum touch target sizes (accessibility)
 * Follows WCAG 2.1 Level AAA (44x44 minimum)
 */
export const touchTargets = {
  minimum: 44,  // iOS Human Interface Guidelines
  comfortable: 48, // Material Design
  large: 56,    // Easy to tap
};

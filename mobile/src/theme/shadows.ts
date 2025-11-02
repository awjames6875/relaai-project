/**
 * Shadow System
 *
 * Implements two-layer shadow principle from UI/UX best practices:
 * - Ambient shadow (diffuse): Simulates scattered light, softer
 * - Directional shadow (key light): Simulates direct light source, sharper
 *
 * Elevation scale: 0 (none) → 24 (maximum prominence)
 * Light from above concept: Shadows appear below elements
 *
 * Usage:
 * - Small shadow (sm): Subtle elevation for cards
 * - Medium shadow (md): Standard elevation for buttons
 * - Large shadow (lg): Prominent elevation for modals
 * - Extra large (xl/2xl): Maximum elevation for popups, tooltips
 */

import { ShadowSystem, DualShadow, ShadowStyle } from './types';

// ============================================================================
// Shadow Generation
// ============================================================================

/**
 * Generate a dual-layer shadow
 * Combines ambient (soft, diffuse) and directional (sharp, focused) shadows
 */
const createDualShadow = (
  elevation: number,
  shadowColor: string = '#000000'
): DualShadow => {
  // Ambient shadow: diffuse light scattered in all directions
  const ambient: ShadowStyle = {
    shadowColor,
    shadowOffset: {
      width: 0,
      height: elevation * 0.5,
    },
    shadowOpacity: 0.1,
    shadowRadius: elevation,
    elevation: elevation, // Android elevation
  };

  // Directional shadow: direct light from above
  const directional: ShadowStyle = {
    shadowColor,
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: 0.15,
    shadowRadius: elevation * 1.5,
    elevation: elevation,
  };

  // Combined shadow for direct use (merges both layers)
  // iOS supports multiple shadows via array, Android uses elevation
  const combined: ShadowStyle = {
    shadowColor,
    shadowOffset: {
      width: 0,
      height: elevation * 0.75, // Average of ambient and directional
    },
    shadowOpacity: 0.12, // Blended opacity
    shadowRadius: elevation * 1.25, // Blended radius
    elevation: elevation,
  };

  return {
    ambient,
    directional,
    combined,
  };
};

// ============================================================================
// Light Mode Shadows
// ============================================================================

export const lightShadows: ShadowSystem = {
  none: createDualShadow(0),
  sm: createDualShadow(2),   // Cards, list items
  md: createDualShadow(4),   // Buttons, input fields
  lg: createDualShadow(8),   // Floating action buttons, hover states
  xl: createDualShadow(16),  // Modals, dialogs
  '2xl': createDualShadow(24), // Maximum elevation (tooltips, dropdown menus)
};

// ============================================================================
// Dark Mode Shadows
// ============================================================================

// In dark mode, shadows are more subtle and sometimes inverted
// Use lighter shadow color for better visibility on dark backgrounds
export const darkShadows: ShadowSystem = {
  none: createDualShadow(0),
  sm: createDualShadow(2, 'rgba(0, 0, 0, 0.4)'),
  md: createDualShadow(4, 'rgba(0, 0, 0, 0.4)'),
  lg: createDualShadow(8, 'rgba(0, 0, 0, 0.4)'),
  xl: createDualShadow(16, 'rgba(0, 0, 0, 0.5)'),
  '2xl': createDualShadow(24, 'rgba(0, 0, 0, 0.5)'),
};

// ============================================================================
// Specialized Shadows
// ============================================================================

/**
 * Inset shadows - push elements inward (sunken effect)
 * Used for input fields, pressed buttons
 * Note: React Native doesn't support inset shadows natively,
 * this is for web/CSS-in-JS implementations
 */
export const insetShadows = {
  sm: {
    boxShadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  md: {
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
  },
  lg: {
    boxShadow: 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
  },
};

/**
 * Colored shadows - match shadow color to element color
 * Creates subtle glow effect for branded elements
 */
export const createColoredShadow = (
  elevation: number,
  color: string,
  opacity: number = 0.3
): ShadowStyle => {
  return {
    shadowColor: color,
    shadowOffset: {
      width: 0,
      height: elevation * 0.75,
    },
    shadowOpacity: opacity,
    shadowRadius: elevation * 1.5,
    elevation: elevation,
  };
};

/**
 * Gradient-enhanced shadows
 * Combines linear gradient with light inner shadow for shiny, elevated effect
 * Returns CSS gradient string for styled-components
 */
export const createGradientShadow = (
  baseColor: string,
  direction: 'vertical' | 'horizontal' = 'vertical'
): string => {
  const gradientDirection = direction === 'vertical' ? 'to bottom' : 'to right';

  return `
    background: linear-gradient(${gradientDirection},
      ${baseColor}00 0%,
      ${baseColor}10 50%,
      ${baseColor}20 100%
    );
  `;
};

// ============================================================================
// Shadow Utilities
// ============================================================================

/**
 * Get shadow based on theme mode
 */
export const getShadows = (mode: 'light' | 'dark'): ShadowSystem => {
  return mode === 'light' ? lightShadows : darkShadows;
};

/**
 * Apply shadow to styled component
 * Handles both iOS and Android differences
 *
 * @example
 * const Card = styled.View`
 *   ${applyShadow(theme.shadows.md)}
 * `;
 */
export const applyShadow = (shadow: DualShadow | ShadowStyle): string => {
  // If it's a DualShadow, use the combined version
  const shadowStyle = 'combined' in shadow ? shadow.combined : shadow;

  return `
    shadow-color: ${shadowStyle.shadowColor};
    shadow-offset: ${shadowStyle.shadowOffset.width}px ${shadowStyle.shadowOffset.height}px;
    shadow-opacity: ${shadowStyle.shadowOpacity};
    shadow-radius: ${shadowStyle.shadowRadius}px;
    elevation: ${shadowStyle.elevation};
  `;
};

/**
 * Apply dual shadow (iOS only - uses multiple shadows)
 * For iOS, we can layer ambient + directional shadows
 */
export const applyDualShadow = (shadow: DualShadow): string => {
  return `
    /* Ambient shadow */
    shadow-color: ${shadow.ambient.shadowColor};
    shadow-offset: ${shadow.ambient.shadowOffset.width}px ${shadow.ambient.shadowOffset.height}px;
    shadow-opacity: ${shadow.ambient.shadowOpacity};
    shadow-radius: ${shadow.ambient.shadowRadius}px;

    /* Android elevation (uses directional) */
    elevation: ${shadow.directional.elevation};
  `;
};

// ============================================================================
// Depth Levels Documentation
// ============================================================================

/**
 * Recommended shadow usage by component type:
 *
 * none (0):
 * - Flat surfaces
 * - List items (not elevated)
 * - Inline elements
 *
 * sm (2):
 * - Cards
 * - List items (subtle elevation)
 * - Tabs
 *
 * md (4):
 * - Buttons
 * - Input fields
 * - Chips
 * - Navigation bars
 *
 * lg (8):
 * - Floating action buttons
 * - Hover states
 * - Active/selected states
 *
 * xl (16):
 * - Modals
 * - Dialogs
 * - Bottom sheets
 *
 * 2xl (24):
 * - Tooltips
 * - Dropdown menus
 * - Popups
 * - Maximum prominence
 */

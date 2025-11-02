/**
 * Shadow Utility Functions
 *
 * Advanced shadow generation utilities
 * Implements two-layer shadow system with color matching
 */

import { ShadowStyle, DualShadow } from '../types';
import { addAlpha, hexToRgb } from './colors';

// ============================================================================
// Custom Shadow Generation
// ============================================================================

/**
 * Generate shadow with custom parameters
 * Allows fine-tuned control over shadow appearance
 *
 * @param elevation - Shadow depth (0-24)
 * @param color - Shadow color (hex)
 * @param opacity - Shadow opacity (0-1)
 * @param blur - Shadow blur multiplier (default: 1)
 */
export const generateCustomShadow = (
  elevation: number,
  color: string = '#000000',
  opacity: number = 0.12,
  blur: number = 1
): ShadowStyle => {
  return {
    shadowColor: color,
    shadowOffset: {
      width: 0,
      height: elevation * 0.75,
    },
    shadowOpacity: opacity,
    shadowRadius: elevation * 1.25 * blur,
    elevation: elevation,
  };
};

/**
 * Generate colored shadow (brand-matched)
 * Creates shadow that matches element color for subtle glow
 *
 * @example
 * const blueShadow = generateColoredShadow(8, '#007AFF');
 * // Creates blue-tinted shadow
 */
export const generateColoredShadow = (
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
 * Generate inner shadow effect (inset)
 * Note: React Native doesn't support inset shadows natively
 * This returns CSS for web/styled-components
 *
 * @param elevation - Inset depth
 * @param color - Shadow color
 */
export const generateInsetShadow = (
  elevation: number,
  color: string = '#000000'
): string => {
  const offsetY = elevation;
  const blur = elevation * 2;
  const spread = 0;

  return `inset 0 ${offsetY}px ${blur}px ${spread}px ${addAlpha(color, 0.1)}`;
};

// ============================================================================
// Gradient-Enhanced Shadows
// ============================================================================

/**
 * Generate shadow with gradient enhancement
 * Combines shadow with subtle gradient for shiny effect
 *
 * Returns both shadow and gradient styles
 */
export const generateGradientShadow = (
  elevation: number,
  baseColor: string,
  direction: 'vertical' | 'horizontal' = 'vertical'
): {
  shadow: ShadowStyle;
  gradient: string;
} => {
  const shadow = generateCustomShadow(elevation);

  const gradientDirection = direction === 'vertical' ? 'to bottom' : 'to right';
  const gradient = `linear-gradient(${gradientDirection}, ${addAlpha(baseColor, 0)} 0%, ${addAlpha(baseColor, 0.05)} 50%, ${addAlpha(baseColor, 0.1)} 100%)`;

  return { shadow, gradient };
};

// ============================================================================
// Multi-Layer Shadows
// ============================================================================

/**
 * Generate three-layer shadow for maximum depth
 * Combines ambient, directional, and contact shadows
 *
 * Used for prominent elements like floating action buttons
 */
export const generateTripleShadow = (
  elevation: number,
  color: string = '#000000'
): {
  ambient: ShadowStyle;
  directional: ShadowStyle;
  contact: ShadowStyle;
} => {
  // Ambient: soft, diffuse shadow all around
  const ambient: ShadowStyle = {
    shadowColor: color,
    shadowOffset: { width: 0, height: elevation * 0.25 },
    shadowOpacity: 0.08,
    shadowRadius: elevation * 0.75,
    elevation: elevation,
  };

  // Directional: main shadow from light source
  const directional: ShadowStyle = {
    shadowColor: color,
    shadowOffset: { width: 0, height: elevation },
    shadowOpacity: 0.15,
    shadowRadius: elevation * 1.5,
    elevation: elevation,
  };

  // Contact: sharp shadow directly under element
  const contact: ShadowStyle = {
    shadowColor: color,
    shadowOffset: { width: 0, height: elevation * 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: elevation * 0.5,
    elevation: elevation,
  };

  return { ambient, directional, contact };
};

// ============================================================================
// Animated Shadow Utilities
// ============================================================================

/**
 * Interpolate between two shadow elevations
 * Useful for animated hover/press states
 *
 * @param from - Starting elevation
 * @param to - Ending elevation
 * @param progress - Animation progress (0-1)
 */
export const interpolateShadow = (
  from: number,
  to: number,
  progress: number
): ShadowStyle => {
  const elevation = from + (to - from) * progress;

  return {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: elevation * 0.75,
    },
    shadowOpacity: 0.12,
    shadowRadius: elevation * 1.25,
    elevation: Math.round(elevation),
  };
};

/**
 * Generate shadow for hover state
 * Increases elevation slightly
 */
export const generateHoverShadow = (baseShadow: ShadowStyle): ShadowStyle => {
  return {
    ...baseShadow,
    shadowOffset: {
      ...baseShadow.shadowOffset,
      height: baseShadow.shadowOffset.height * 1.5,
    },
    shadowRadius: baseShadow.shadowRadius * 1.25,
    elevation: baseShadow.elevation + 2,
  };
};

/**
 * Generate shadow for active/pressed state
 * Decreases elevation
 */
export const generateActiveShadow = (baseShadow: ShadowStyle): ShadowStyle => {
  return {
    ...baseShadow,
    shadowOffset: {
      ...baseShadow.shadowOffset,
      height: baseShadow.shadowOffset.height * 0.5,
    },
    shadowRadius: baseShadow.shadowRadius * 0.75,
    shadowOpacity: baseShadow.shadowOpacity * 0.5,
    elevation: Math.max(0, baseShadow.elevation - 2),
  };
};

// ============================================================================
// Platform-Specific Utilities
// ============================================================================

/**
 * Convert shadow to platform-specific style
 * Handles iOS vs Android differences
 */
export const platformShadow = (shadow: ShadowStyle, platform: 'ios' | 'android'): object => {
  if (platform === 'android') {
    // Android uses elevation only
    return {
      elevation: shadow.elevation,
    };
  }

  // iOS uses shadow properties
  return {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
  };
};

/**
 * Generate Android-specific elevation shadow
 * Android Material Design elevation system
 */
export const generateAndroidElevation = (elevation: number): { elevation: number } => {
  return { elevation };
};

/**
 * Generate iOS-specific shadow
 * iOS uses blur radius and offset
 */
export const generateIOSShadow = (
  elevation: number,
  color: string = '#000000'
): Omit<ShadowStyle, 'elevation'> => {
  return {
    shadowColor: color,
    shadowOffset: {
      width: 0,
      height: elevation * 0.5,
    },
    shadowOpacity: 0.1 + (elevation / 100),
    shadowRadius: elevation,
  };
};

// ============================================================================
// Shadow Style Converters
// ============================================================================

/**
 * Convert shadow to CSS box-shadow string
 * For web/styled-components usage
 */
export const shadowToCSS = (shadow: ShadowStyle): string => {
  const { shadowOffset, shadowRadius, shadowOpacity, shadowColor } = shadow;
  const rgb = hexToRgb(shadowColor);

  if (!rgb) return 'none';

  const color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowOpacity})`;

  return `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px ${color}`;
};

/**
 * Convert dual shadow to CSS (multiple shadows)
 */
export const dualShadowToCSS = (dualShadow: DualShadow): string => {
  const ambient = shadowToCSS(dualShadow.ambient);
  const directional = shadowToCSS(dualShadow.directional);

  return `${ambient}, ${directional}`;
};

// ============================================================================
// Depth Scale Presets
// ============================================================================

/**
 * Predefined depth levels with semantic names
 * Based on Material Design elevation system
 */
export const depthPresets = {
  flat: 0,
  raised: 2,
  overlay: 4,
  floating: 6,
  modal: 8,
  dropdown: 12,
  sticky: 16,
  popup: 24,
};

/**
 * Get shadow for common component types
 * Provides consistent elevation across app
 */
export const getComponentShadow = (
  component: 'card' | 'button' | 'modal' | 'fab' | 'dropdown' | 'tooltip'
): ShadowStyle => {
  const elevations = {
    card: depthPresets.raised,
    button: depthPresets.overlay,
    modal: depthPresets.modal,
    fab: depthPresets.floating,
    dropdown: depthPresets.dropdown,
    tooltip: depthPresets.popup,
  };

  return generateCustomShadow(elevations[component]);
};

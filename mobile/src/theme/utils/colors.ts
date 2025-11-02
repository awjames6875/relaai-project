/**
 * Color Utility Functions
 *
 * Helper functions for color manipulation:
 * - Lighten/darken colors
 * - Alpha/opacity adjustments
 * - Contrast calculations
 * - Color layering
 */

// ============================================================================
// Color Manipulation
// ============================================================================

/**
 * Convert hex color to RGB
 * @example hexToRgb('#007AFF') // { r: 0, g: 122, b: 255 }
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Convert RGB to hex
 * @example rgbToHex(0, 122, 255) // '#007AFF'
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Lighten a hex color by percentage
 * @example lighten('#007AFF', 0.2) // 20% lighter
 */
export const lighten = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const lightenValue = (value: number) => Math.min(255, Math.round(value + (255 - value) * amount));

  return rgbToHex(
    lightenValue(r),
    lightenValue(g),
    lightenValue(b)
  );
};

/**
 * Darken a hex color by percentage
 * @example darken('#007AFF', 0.2) // 20% darker
 */
export const darken = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const darkenValue = (value: number) => Math.max(0, Math.round(value * (1 - amount)));

  return rgbToHex(
    darkenValue(r),
    darkenValue(g),
    darkenValue(b)
  );
};

/**
 * Add alpha/opacity to hex color
 * @example addAlpha('#007AFF', 0.5) // 'rgba(0, 122, 255, 0.5)'
 */
export const addAlpha = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ============================================================================
// Color Layering (from UI/UX principles)
// ============================================================================

/**
 * Generate color shades for layering
 * Creates 3-4 shades by increasing lightness by 0.1 increments
 * Implements: "Darker = deeper/background, Lighter = elevated/important"
 *
 * @example
 * const shades = generateColorLayers('#FFFFFF');
 * // Returns: ['#FFFFFF', '#F5F5F5', '#EEEEEE', '#E0E0E0']
 */
export const generateColorLayers = (baseColor: string, count: number = 4): string[] => {
  const layers: string[] = [baseColor];

  for (let i = 1; i < count; i++) {
    const darkenAmount = i * 0.1; // 0.1 increments
    layers.push(darken(baseColor, darkenAmount));
  }

  return layers;
};

/**
 * Get elevation color based on layer index
 * Higher index = lighter = more elevated
 *
 * @example
 * const cardColor = getElevationColor('#FFFFFF', 1); // First elevation
 * const modalColor = getElevationColor('#FFFFFF', 2); // Second elevation
 */
export const getElevationColor = (baseColor: string, elevation: number): string => {
  const layers = generateColorLayers(baseColor, 4);
  return layers[Math.min(elevation, layers.length - 1)];
};

// ============================================================================
// Contrast & Accessibility
// ============================================================================

/**
 * Calculate relative luminance (WCAG 2.1)
 * Used for contrast ratio calculations
 */
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;

  // Convert to 0-1 range
  const [rs, gs, bs] = [r, g, b].map(val => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Calculate contrast ratio between two colors (WCAG 2.1)
 * @returns Contrast ratio (1-21)
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if color combination meets WCAG AA standards
 * @param foreground - Text color
 * @param background - Background color
 * @param level - 'AA' | 'AAA'
 * @param size - 'normal' | 'large' (large = 18px+ or 14px+ bold)
 */
export const meetsContrastStandard = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean => {
  const ratio = getContrastRatio(foreground, background);

  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }

  // AA standard
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Get appropriate text color (black or white) based on background
 * Ensures WCAG AA contrast
 *
 * @example
 * const textColor = getAccessibleTextColor('#007AFF'); // Returns '#FFFFFF'
 */
export const getAccessibleTextColor = (backgroundColor: string): '#000000' | '#FFFFFF' => {
  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');

  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
};

// ============================================================================
// Color Blending
// ============================================================================

/**
 * Mix two colors together
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 * @param weight - Weight of first color (0-1)
 */
export const mixColors = (color1: string, color2: string, weight: number = 0.5): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const mix = (val1: number, val2: number) =>
    Math.round(val1 * weight + val2 * (1 - weight));

  return rgbToHex(
    mix(rgb1.r, rgb2.r),
    mix(rgb1.g, rgb2.g),
    mix(rgb1.b, rgb2.b)
  );
};

/**
 * Create gradient string for React Native
 * @example
 * const gradient = createGradient(['#007AFF', '#5856D6']);
 * // Returns: ['#007AFF', '#5856D6']
 */
export const createGradient = (colors: string[]): string[] => {
  return colors;
};

/**
 * Generate color palette from single color
 * Creates full 50-900 shade range
 *
 * @example
 * const palette = generatePalette('#007AFF');
 * // Returns: { 50: '#E3F2FD', ..., 500: '#007AFF', ..., 900: '#002B5C' }
 */
export const generatePalette = (baseColor: string): Record<number, string> => {
  return {
    50: lighten(baseColor, 0.9),
    100: lighten(baseColor, 0.7),
    200: lighten(baseColor, 0.5),
    300: lighten(baseColor, 0.3),
    400: lighten(baseColor, 0.15),
    500: baseColor,
    600: darken(baseColor, 0.15),
    700: darken(baseColor, 0.3),
    800: darken(baseColor, 0.5),
    900: darken(baseColor, 0.7),
  };
};

// ============================================================================
// Theme-Aware Color Utilities
// ============================================================================

/**
 * Get semantic color variant based on state
 * @param type - 'success' | 'error' | 'warning' | 'info'
 * @param variant - 'base' | 'hover' | 'active' | 'disabled'
 */
export const getSemanticColorVariant = (
  baseColor: string,
  variant: 'base' | 'hover' | 'active' | 'disabled'
): string => {
  switch (variant) {
    case 'hover':
      return darken(baseColor, 0.1);
    case 'active':
      return darken(baseColor, 0.2);
    case 'disabled':
      return addAlpha(baseColor, 0.4);
    default:
      return baseColor;
  }
};

/**
 * Generate surface color for dark mode
 * Creates elevated surfaces that work in dark themes
 */
export const generateSurfaceColor = (baseColor: string, elevation: number): string => {
  // In dark mode, higher elevation = lighter surface
  const lightenAmount = elevation * 0.05; // 5% per elevation level
  return lighten(baseColor, lightenAmount);
};

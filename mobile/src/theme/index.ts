/**
 * RelaAI Design System
 *
 * Comprehensive theme system implementing:
 * - Two-layer shadow system (ambient + directional)
 * - Color layering for depth (darker = background, lighter = elevated)
 * - Responsive box system (rearrange, not shrink)
 * - Full color palette (primary, secondary, neutral, semantic)
 *
 * Usage:
 * import { theme, ThemeProvider } from '@/theme';
 * <ThemeProvider theme={theme}>
 *   <App />
 * </ThemeProvider>
 */

import { Theme } from './types';
import { lightColors, darkColors, getColors } from './colors';
import { lightShadows, darkShadows, getShadows } from './shadows';
import { spacing } from './spacing';
import { typography, fontWeights } from './typography';
import { breakpoints } from './breakpoints';

// ============================================================================
// Export All Theme Utilities
// ============================================================================

// Type exports
export * from './types';

// Core theme modules
export * from './colors';
export * from './shadows';
export * from './spacing';
export * from './typography';
export * from './breakpoints';

// Utility functions
export * from './utils/colors';
export * from './utils/shadows';
export * from './utils/responsive';

// ============================================================================
// Theme Objects
// ============================================================================

/**
 * Light theme (default)
 */
export const lightTheme: Theme = {
  colors: lightColors,
  shadows: lightShadows,
  spacing,
  typography,
  fontWeights,
  breakpoints,
  mode: 'light',
};

/**
 * Dark theme
 */
export const darkTheme: Theme = {
  colors: darkColors,
  shadows: darkShadows,
  spacing,
  typography,
  fontWeights,
  breakpoints,
  mode: 'dark',
};

/**
 * Get theme based on mode
 */
export const getTheme = (mode: 'light' | 'dark'): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
};

/**
 * Default theme export
 */
export const theme = lightTheme;

// ============================================================================
// Theme Provider (to be used with styled-components)
// ============================================================================

/**
 * Theme Provider Component
 *
 * Usage:
 * import { ThemeProvider, theme } from '@/theme';
 *
 * function App() {
 *   return (
 *     <ThemeProvider theme={theme}>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 */
export { ThemeProvider } from 'styled-components/native';

// ============================================================================
// Theme Hook (for accessing theme in components)
// ============================================================================

/**
 * Hook to access current theme
 *
 * Usage:
 * import { useTheme } from '@/theme';
 *
 * function MyComponent() {
 *   const theme = useTheme();
 *   return <Text style={{ color: theme.colors.primary[500] }}>Hello</Text>;
 * }
 */
export { useTheme } from 'styled-components/native';

// ============================================================================
// Quick Access Constants
// ============================================================================

/**
 * Common colors for quick access
 * @example
 * import { colors } from '@/theme';
 * <View style={{ backgroundColor: colors.primary }} />
 */
export const colors = {
  // Primary colors
  primary: lightColors.primary[500],
  primaryDark: lightColors.primary[700],
  primaryLight: lightColors.primary[300],

  // Secondary colors
  secondary: lightColors.secondary[500],
  secondaryDark: lightColors.secondary[700],
  secondaryLight: lightColors.secondary[300],

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: lightColors.neutral[500],
  grayDark: lightColors.neutral[700],
  grayLight: lightColors.neutral[300],

  // Semantic colors
  success: lightColors.semantic.success.light,
  error: lightColors.semantic.error.light,
  warning: lightColors.semantic.warning.light,
  info: lightColors.semantic.info.light,

  // Background colors
  background: lightColors.neutral[50],
  surface: '#FFFFFF',

  // Text colors
  textPrimary: lightColors.neutral[900],
  textSecondary: lightColors.neutral[600],
  textTertiary: lightColors.neutral[500],
  textDisabled: lightColors.neutral[400],
};

/**
 * Common shadows for quick access
 * @example
 * import { shadows } from '@/theme';
 * <View style={shadows.md.combined} />
 */
export const shadows = lightShadows;

// ============================================================================
// Design Tokens (for non-React contexts)
// ============================================================================

/**
 * Design tokens object
 * Can be used in non-React contexts or exported to other platforms
 */
export const designTokens = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  shadows: {
    light: lightShadows,
    dark: darkShadows,
  },
  spacing,
  typography,
  breakpoints,
  fontWeights,
};

// ============================================================================
// Theme Configuration
// ============================================================================

/**
 * Theme configuration options
 * Used for customizing theme behavior
 */
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  colorScheme: 'default' | 'colorblind' | 'high-contrast';
  fontScale: number; // Accessibility: font size multiplier
  reducedMotion: boolean; // Accessibility: disable animations
}

/**
 * Default theme configuration
 */
export const defaultThemeConfig: ThemeConfig = {
  mode: 'auto',
  colorScheme: 'default',
  fontScale: 1.0,
  reducedMotion: false,
};

// ============================================================================
// Documentation Comments
// ============================================================================

/**
 * DESIGN SYSTEM PRINCIPLES
 *
 * 1. SHADOWS - Two-Layer System
 *    - Color Layering: Darker = deeper/background, Lighter = elevated/important
 *    - Dual Shadows: Ambient (diffuse) + Directional (key light)
 *    - Elevation Scale: 0 (none) → 24 (maximum prominence)
 *    - Gradients: Linear gradients + light inner shadow = shiny effect
 *
 * 2. COLORS - Palette System
 *    - Primary: Main brand color (blue) - CTAs and key actions
 *    - Secondary: Complementary (purple) - subtle actions
 *    - Neutral: Gray scale - majority of UI
 *    - Semantic: Success/Error/Warning/Info - state colors
 *
 * 3. RESPONSIVENESS - Box System
 *    - Every design is a system of boxes with clear relationships
 *    - Responsive = rearrange with purpose, not just shrink
 *    - Mobile-first: phone → tablet → desktop
 *    - Elements shift, flow, or reprioritize as space changes
 *
 * USAGE EXAMPLES
 *
 * // 1. Using theme in styled components
 * import styled from 'styled-components/native';
 *
 * const Card = styled.View`
 *   background-color: ${({ theme }) => theme.colors.primary[500]};
 *   ${({ theme }) => applyShadow(theme.shadows.md)};
 *   padding: ${({ theme }) => theme.spacing[4]}px;
 * `;
 *
 * // 2. Using responsive hooks
 * import { useResponsive } from '@/theme';
 *
 * function MyComponent() {
 *   const { isPhone, isTablet } = useResponsive();
 *   const columns = isPhone ? 1 : isTablet ? 2 : 3;
 * }
 *
 * // 3. Using color utilities
 * import { lighten, darken, addAlpha } from '@/theme';
 *
 * const hoverColor = lighten('#007AFF', 0.2);
 * const shadowColor = addAlpha('#000000', 0.1);
 *
 * // 4. Using shadow utilities
 * import { generateCustomShadow, applyShadow } from '@/theme';
 *
 * const customShadow = generateCustomShadow(8, '#007AFF', 0.3);
 *
 * // 5. Using responsive values
 * import { useResponsiveValue } from '@/theme';
 *
 * const padding = useResponsiveValue({
 *   0: 16,     // Phone
 *   600: 24,   // Tablet
 *   1024: 32,  // Desktop
 * });
 */

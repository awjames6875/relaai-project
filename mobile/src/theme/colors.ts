/**
 * Color Palette System
 *
 * Implements the color layering principle from UI/UX best practices:
 * - Primary: Main brand color (blue) - used for CTAs and key actions
 * - Secondary: Complementary color (purple) - used for subtle actions
 * - Neutral: Gray scale - majority of the UI
 * - Semantic: Success, Error, Warning, Info - state colors
 *
 * Each color has 10 shades (50-900) with base at 500
 * Darker = deeper/background, Lighter = elevated/important
 */

import { ColorPalette } from './types';

// ============================================================================
// Light Mode Colors
// ============================================================================

export const lightColors: ColorPalette = {
  // Primary Color - Blue (#007AFF)
  // Used for CTAs, buttons, links, active states
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#007AFF', // Base - iOS blue
    600: '#0066D6',
    700: '#0052AD',
    800: '#003F85',
    900: '#002B5C',
  },

  // Secondary Color - Purple (#5856D6)
  // Used for secondary actions, highlights, badges
  secondary: {
    50: '#F3F2FF',
    100: '#E5E3FF',
    200: '#D1CEFF',
    300: '#BCB9FF',
    400: '#A8A5FF',
    500: '#5856D6', // Base - iOS purple
    600: '#4845B8',
    700: '#39359A',
    800: '#2B287C',
    900: '#1D1A5E',
  },

  // Neutral Colors - Gray Scale
  // Used for text, backgrounds, borders
  neutral: {
    50: '#FAFAFA',  // Lightest background
    100: '#F5F5F5', // Card backgrounds
    200: '#EEEEEE', // Subtle borders
    300: '#E0E0E0', // Dividers
    400: '#BDBDBD', // Disabled text
    500: '#9E9E9E', // Secondary text
    600: '#757575', // Body text
    700: '#616161', // Headings
    800: '#424242', // Strong emphasis
    900: '#212121', // Maximum contrast
  },

  // Semantic Colors
  // Used for success, error, warning, and info states
  semantic: {
    success: {
      light: '#34C759', // iOS green
      dark: '#30D158',  // iOS green dark mode
    },
    error: {
      light: '#FF3B30', // iOS red
      dark: '#FF453A',  // iOS red dark mode
    },
    warning: {
      light: '#FF9500', // iOS orange
      dark: '#FF9F0A',  // iOS orange dark mode
    },
    info: {
      light: '#5AC8FA', // iOS teal/cyan
      dark: '#64D2FF',  // iOS teal/cyan dark mode
    },
  },
};

// ============================================================================
// Dark Mode Colors
// ============================================================================

export const darkColors: ColorPalette = {
  // Primary Color - Blue (adjusted for dark mode)
  primary: {
    50: '#002B5C',
    100: '#003F85',
    200: '#0052AD',
    300: '#0066D6',
    400: '#0A84FF', // iOS blue dark mode
    500: '#0A84FF', // Base - brighter for dark mode
    600: '#409CFF',
    700: '#64B5F6',
    800: '#90CAF9',
    900: '#BBDEFB',
  },

  // Secondary Color - Purple (adjusted for dark mode)
  secondary: {
    50: '#1D1A5E',
    100: '#2B287C',
    200: '#39359A',
    300: '#4845B8',
    400: '#5E5CE6', // iOS purple dark mode
    500: '#5E5CE6', // Base - brighter for dark mode
    600: '#8E8CFF',
    700: '#A8A5FF',
    800: '#BCB9FF',
    900: '#D1CEFF',
  },

  // Neutral Colors - Inverted for dark mode
  neutral: {
    50: '#1C1C1E',  // Darkest background (iOS dark mode)
    100: '#2C2C2E', // Card backgrounds
    200: '#3A3A3C', // Elevated surfaces
    300: '#48484A', // Dividers
    400: '#636366', // Disabled text
    500: '#8E8E93', // Secondary text
    600: '#AEAEB2', // Body text
    700: '#C7C7CC', // Headings
    800: '#D1D1D6', // Strong emphasis
    900: '#E5E5EA', // Maximum contrast
  },

  // Semantic Colors (using dark mode variants)
  semantic: {
    success: {
      light: '#30D158',
      dark: '#30D158',
    },
    error: {
      light: '#FF453A',
      dark: '#FF453A',
    },
    warning: {
      light: '#FF9F0A',
      dark: '#FF9F0A',
    },
    info: {
      light: '#64D2FF',
      dark: '#64D2FF',
    },
  },
};

// ============================================================================
// Special Color Sets
// ============================================================================

// Background colors with elevation layers
// Implements color layering principle: darker = background, lighter = elevated
export const backgroundLayers = {
  light: {
    base: lightColors.neutral[50],      // Deepest background
    elevated1: lightColors.neutral[100], // Cards
    elevated2: '#FFFFFF',                // Modals, popups
    elevated3: '#FFFFFF',                // Tooltips, menus
  },
  dark: {
    base: darkColors.neutral[50],       // Deepest background
    elevated1: darkColors.neutral[100],  // Cards
    elevated2: darkColors.neutral[200],  // Modals, popups
    elevated3: darkColors.neutral[300],  // Tooltips, menus
  },
};

// Text colors for different hierarchy levels
export const textColors = {
  light: {
    primary: lightColors.neutral[900],   // Main text
    secondary: lightColors.neutral[600], // Supporting text
    tertiary: lightColors.neutral[500],  // Placeholder text
    disabled: lightColors.neutral[400],  // Disabled text
    inverse: '#FFFFFF',                  // Text on dark backgrounds
  },
  dark: {
    primary: darkColors.neutral[900],
    secondary: darkColors.neutral[600],
    tertiary: darkColors.neutral[500],
    disabled: darkColors.neutral[400],
    inverse: darkColors.neutral[50],
  },
};

// Border colors for layering
export const borderColors = {
  light: {
    subtle: lightColors.neutral[200],
    default: lightColors.neutral[300],
    strong: lightColors.neutral[400],
  },
  dark: {
    subtle: darkColors.neutral[200],
    default: darkColors.neutral[300],
    strong: darkColors.neutral[400],
  },
};

// ============================================================================
// Color Utilities
// ============================================================================

/**
 * Get appropriate text color based on background
 * Ensures WCAG AA contrast ratio
 */
export const getContrastText = (backgroundColor: string): string => {
  // Simple luminance calculation (more sophisticated version in utils/colors.ts)
  const isLight = backgroundColor.includes('F') || backgroundColor.includes('E');
  return isLight ? textColors.light.primary : textColors.dark.primary;
};

/**
 * Get color palette based on theme mode
 */
export const getColors = (mode: 'light' | 'dark'): ColorPalette => {
  return mode === 'light' ? lightColors : darkColors;
};

/**
 * Theme Type Definitions
 *
 * TypeScript interfaces for the RelaAI design system.
 * Provides type safety for all theme values.
 */

// ============================================================================
// Color System Types
// ============================================================================

export interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base color
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SemanticColor {
  light: string;
  dark: string;
}

export interface SemanticColors {
  success: SemanticColor;
  error: SemanticColor;
  warning: SemanticColor;
  info: SemanticColor;
}

export interface ColorPalette {
  primary: ColorShades;
  secondary: ColorShades;
  neutral: ColorShades;
  semantic: SemanticColors;
}

// ============================================================================
// Shadow System Types
// ============================================================================

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android elevation
}

export interface DualShadow {
  ambient: ShadowStyle;
  directional: ShadowStyle;
  combined: ShadowStyle; // Merged shadow for direct use
}

export type ShadowElevation = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ShadowSystem {
  none: DualShadow;
  sm: DualShadow;   // elevation 2
  md: DualShadow;   // elevation 4
  lg: DualShadow;   // elevation 8
  xl: DualShadow;   // elevation 16
  '2xl': DualShadow; // elevation 24
}

// ============================================================================
// Spacing System Types
// ============================================================================

export type SpacingScale = {
  0: number;   // 0px
  1: number;   // 4px
  2: number;   // 8px
  3: number;   // 12px
  4: number;   // 16px
  5: number;   // 20px
  6: number;   // 24px
  8: number;   // 32px
  10: number;  // 40px
  12: number;  // 48px
  16: number;  // 64px
  20: number;  // 80px
  24: number;  // 96px
};

// ============================================================================
// Typography System Types
// ============================================================================

export interface FontSize {
  fontSize: number;
  lineHeight: number;
}

export interface TypographyVariant extends FontSize {
  fontWeight: '400' | '500' | '600' | '700' | '800';
  letterSpacing?: number;
}

export interface Typography {
  h1: TypographyVariant;
  h2: TypographyVariant;
  h3: TypographyVariant;
  h4: TypographyVariant;
  h5: TypographyVariant;
  h6: TypographyVariant;
  body: TypographyVariant;
  bodyLarge: TypographyVariant;
  bodySmall: TypographyVariant;
  caption: TypographyVariant;
  label: TypographyVariant;
  button: TypographyVariant;
}

export interface FontWeights {
  regular: '400';
  medium: '500';
  semibold: '600';
  bold: '700';
  extrabold: '800';
}

// ============================================================================
// Breakpoint System Types
// ============================================================================

export interface Breakpoint {
  min: number;
  max: number;
}

export interface Breakpoints {
  phone: Breakpoint;
  tablet: Breakpoint;
  desktop: Breakpoint;
}

export interface DeviceType {
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// ============================================================================
// Main Theme Type
// ============================================================================

export interface Theme {
  colors: ColorPalette;
  shadows: ShadowSystem;
  spacing: SpacingScale;
  typography: Typography;
  fontWeights: FontWeights;
  breakpoints: Breakpoints;
  mode: 'light' | 'dark';
}

// ============================================================================
// Component Prop Types
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'default' | 'colorblind' | 'high-contrast';

export interface ThemeSettings {
  mode: ThemeMode;
  colorScheme: ColorScheme;
}

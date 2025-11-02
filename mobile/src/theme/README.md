# RelaAI Design System

Comprehensive theme system implementing advanced UI/UX principles for consistent, beautiful interfaces.

## 🎨 Design Principles

### 1. Shadow System - Two-Layer Approach

**Color Layering for Depth:**
- Create 3-4 shades of your base color (0.1 lightness increments)
- **Hierarchy:** Darker = deeper/background, Lighter = elevated/important
- **Layering Effect:** Stack lighter shades on top of darker ones

**Dual Shadows:**
- **Ambient shadow:** Soft, diffuse light (top layer)
- **Directional shadow:** Sharp, focused light from above (bottom layer)
- **Elevation scale:** 0 (none) → 24 (maximum prominence)

**Three Depth Levels:**
- Small shadow (subtle) - Cards, list items
- Medium shadow (standard) - Buttons, inputs
- Large shadow (prominent) - Modals, floating action buttons

### 2. Color Palette System

**Four Color Types:**
- **Primary:** Main brand color (blue #007AFF) - CTAs, key actions
- **Secondary:** Complementary color (purple #5856D6) - subtle actions
- **Neutral:** Gray scale (50-900) - majority of UI
- **Semantic:** Success/Error/Warning/Info - state colors

**Each color has 10 shades** (50-900) with base at 500:
- 50-400: Light variations
- 500: Base color
- 600-900: Dark variations

### 3. Responsive Layout - Box System

**Principle 1:**
Every design starts as a system of boxes. Build layouts where everything has a clear relationship and natural balance, so the structure feels flexible before it ever responds.

**Principle 2:**
Responsive isn't about shrinking — it's about rearranging with purpose. As space changes, elements should shift, flow, or reprioritize, maintaining clarity and rhythm.

**Breakpoints:**
- Phone: 0-599px (iPhone SE to iPhone 14 Pro)
- Tablet: 600-1023px (iPad, Android tablets)
- Desktop: 1024px+ (iPad Pro landscape, desktop web)

## 📦 Installation

The theme system is already set up! Just import it:

```typescript
import { theme, ThemeProvider } from '@/theme';
```

## 🚀 Usage

### Basic Setup

Wrap your app with `ThemeProvider`:

```typescript
import { ThemeProvider, lightTheme } from '@/theme';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Using Theme in Styled Components

```typescript
import styled from 'styled-components/native';
import { applyShadow } from '@/theme';

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.primary[500]};
  ${({ theme }) => applyShadow(theme.shadows.md)};
  padding: ${({ theme }) => theme.spacing[4]}px;
  border-radius: 12px;
`;
```

### Accessing Theme via Hook

```typescript
import { useTheme } from '@/theme';

function MyComponent() {
  const theme = useTheme();

  return (
    <Text style={{
      color: theme.colors.primary[500],
      fontSize: theme.typography.body.fontSize
    }}>
      Hello World
    </Text>
  );
}
```

## 🎨 Colors

### Accessing Colors

```typescript
import { useTheme } from '@/theme';

const theme = useTheme();

// Primary colors
theme.colors.primary[500]  // Base blue
theme.colors.primary[700]  // Darker blue
theme.colors.primary[300]  // Lighter blue

// Semantic colors
theme.colors.semantic.success.light  // Green
theme.colors.semantic.error.light    // Red
theme.colors.semantic.warning.light  // Orange
theme.colors.semantic.info.light     // Cyan
```

### Color Utilities

```typescript
import { lighten, darken, addAlpha } from '@/theme';

const hoverColor = lighten('#007AFF', 0.2);  // 20% lighter
const shadowColor = darken('#007AFF', 0.3);  // 30% darker
const overlayColor = addAlpha('#000000', 0.5); // 50% opacity
```

### Color Layering

```typescript
import { generateColorLayers, getElevationColor } from '@/theme';

// Generate 4 shades for depth
const layers = generateColorLayers('#FFFFFF');
// ['#FFFFFF', '#F5F5F5', '#EEEEEE', '#E0E0E0']

// Get color for specific elevation
const cardColor = getElevationColor('#FFFFFF', 1);
```

## 🌑 Shadows

### Basic Shadows

```typescript
import styled from 'styled-components/native';
import { applyShadow } from '@/theme';

const Card = styled.View`
  ${({ theme }) => applyShadow(theme.shadows.md)};
`;
```

### Shadow Elevations

```typescript
// Available elevations
theme.shadows.none   // No shadow
theme.shadows.sm     // Elevation 2 - Cards
theme.shadows.md     // Elevation 4 - Buttons
theme.shadows.lg     // Elevation 8 - FABs
theme.shadows.xl     // Elevation 16 - Modals
theme.shadows['2xl'] // Elevation 24 - Tooltips
```

### Custom Shadows

```typescript
import { generateCustomShadow, generateColoredShadow } from '@/theme';

// Custom shadow with specific parameters
const shadow = generateCustomShadow(
  8,           // elevation
  '#000000',   // color
  0.15,        // opacity
  1.5          // blur multiplier
);

// Colored shadow (brand-matched)
const blueShadow = generateColoredShadow(8, '#007AFF', 0.3);
```

### Animated Shadows

```typescript
import { generateHoverShadow, generateActiveShadow } from '@/theme';

const baseShadow = theme.shadows.md.combined;
const hoverShadow = generateHoverShadow(baseShadow);
const activeShadow = generateActiveShadow(baseShadow);
```

## 📏 Spacing

### Spacing Scale

```typescript
theme.spacing[0]   // 0px
theme.spacing[1]   // 4px
theme.spacing[2]   // 8px
theme.spacing[3]   // 12px
theme.spacing[4]   // 16px - Most common
theme.spacing[6]   // 24px
theme.spacing[8]   // 32px
theme.spacing[12]  // 48px
```

### Component Padding Presets

```typescript
import { componentPadding } from '@/theme';

// Button padding
componentPadding.button.small    // { horizontal: 12, vertical: 8 }
componentPadding.button.medium   // { horizontal: 16, vertical: 12 }
componentPadding.button.large    // { horizontal: 24, vertical: 16 }

// Card padding
componentPadding.card.compact    // 12px
componentPadding.card.default    // 16px
componentPadding.card.comfortable // 24px
```

## 📱 Typography

### Text Variants

```typescript
import { textStyles } from '@/theme';

<Text style={textStyles.h1}>Heading 1</Text>
<Text style={textStyles.body}>Body text</Text>
<Text style={textStyles.caption}>Caption text</Text>
```

### Available Variants

- `h1` - 32px, extrabold
- `h2` - 28px, bold
- `h3` - 24px, bold
- `h4` - 20px, semibold
- `h5` - 18px, semibold
- `h6` - 16px, semibold
- `bodyLarge` - 18px, regular
- `body` - 16px, regular (base)
- `bodySmall` - 14px, regular
- `caption` - 12px, regular
- `label` - 14px, medium
- `button` - 16px, semibold

### Responsive Typography

```typescript
import { getResponsiveFontSize, scaleFontSize } from '@/theme';

// Scale based on device
const fontSize = getResponsiveFontSize('h1', 'tablet'); // 35.2px

// Auto-scale for readability
const scaledSize = scaleFontSize(16); // Adjusts based on screen
```

## 📐 Responsive Design

### Responsive Hooks

```typescript
import { useResponsive } from '@/theme';

function MyComponent() {
  const { isPhone, isTablet, isDesktop, width } = useResponsive();

  return (
    <View style={{
      padding: isPhone ? 16 : isTablet ? 24 : 32
    }}>
      {/* Content */}
    </View>
  );
}
```

### Responsive Values

```typescript
import { useResponsiveValue } from '@/theme';

const padding = useResponsiveValue({
  0: 16,     // Phone
  600: 24,   // Tablet
  1024: 32,  // Desktop
});
```

### Grid Layouts

```typescript
import { useGridColumns } from '@/theme';

const { columns, itemWidth, gap } = useGridColumns(
  1,  // min columns (phone)
  3,  // max columns (desktop)
  16  // gap
);
```

### Responsive Components

```typescript
import { showOn, hideOn } from '@/theme';

<View style={{ display: showOn(['tablet', 'desktop']) }}>
  {/* Only shows on tablet and desktop */}
</View>

<View style={{ display: hideOn(['phone']) }}>
  {/* Hides on phone */}
</View>
```

### Flex Direction

```typescript
import { useFlexDirection } from '@/theme';

const flexDirection = useFlexDirection(600); // 'column' on phone, 'row' on tablet+
```

## 🎯 Common Patterns

### Card with Shadow

```typescript
import styled from 'styled-components/native';
import { applyShadow } from '@/theme';

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  ${({ theme }) => applyShadow(theme.shadows.sm)};
  padding: ${({ theme }) => theme.spacing[4]}px;
  border-radius: 12px;
  margin: ${({ theme }) => theme.spacing[2]}px;
`;
```

### Button with States

```typescript
const Button = styled.TouchableOpacity<{ variant: 'primary' | 'secondary' }>`
  background-color: ${({ theme, variant }) =>
    variant === 'primary'
      ? theme.colors.primary[500]
      : theme.colors.secondary[500]
  };
  ${({ theme }) => applyShadow(theme.shadows.md)};
  padding-horizontal: ${({ theme }) => theme.spacing[4]}px;
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  border-radius: 8px;

  &:hover {
    ${({ theme }) => applyShadow(theme.shadows.lg)};
  }

  &:active {
    ${({ theme }) => applyShadow(theme.shadows.sm)};
  }
`;
```

### Responsive Container

```typescript
import { useContainerWidth } from '@/theme';

function Container({ children }) {
  const { width, padding, maxWidth } = useContainerWidth();

  return (
    <View style={{
      width,
      padding,
      maxWidth,
      marginHorizontal: 'auto'
    }}>
      {children}
    </View>
  );
}
```

### Color Layering

```typescript
const Background = styled.View`
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  ${({ theme }) => applyShadow(theme.shadows.sm)};
`;

const Modal = styled.View`
  background-color: #FFFFFF;
  ${({ theme }) => applyShadow(theme.shadows.xl)};
`;
```

## 🌓 Dark Mode

### Switching Themes

```typescript
import { lightTheme, darkTheme } from '@/theme';
import { useState } from 'react';

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <YourApp onToggle={() => setIsDark(!isDark)} />
    </ThemeProvider>
  );
}
```

### Theme-Aware Components

```typescript
const Text = styled.Text`
  color: ${({ theme }) =>
    theme.mode === 'dark'
      ? theme.colors.neutral[900]  // Light text in dark mode
      : theme.colors.neutral[900]  // Dark text in light mode
  };
`;
```

## ♿ Accessibility

### Contrast Checking

```typescript
import { meetsContrastStandard, getAccessibleTextColor } from '@/theme';

// Check if colors meet WCAG AA
const isAccessible = meetsContrastStandard('#007AFF', '#FFFFFF', 'AA', 'normal');

// Get best text color for background
const textColor = getAccessibleTextColor('#007AFF'); // Returns '#FFFFFF'
```

### Font Scaling

```typescript
import { getScaledFontSize } from '@/theme';

// Support user font size preferences
const fontSize = getScaledFontSize('body', 'xl'); // 1.2x larger
```

## 📚 Resources

- **Full Documentation:** See `docs/design-system.md`
- **Component Templates:** See `code-templates/react-native-components/`
- **Contracts:** See `contracts/component-contracts/`

## 🎓 Best Practices

1. **Always use theme values** - Never hardcode colors, spacing, or shadows
2. **Mobile-first responsive** - Start with phone layout, enhance for larger screens
3. **Consistent elevation** - Use predefined shadow levels
4. **Semantic colors** - Use success/error/warning/info for states
5. **Accessibility first** - Check contrast ratios, support font scaling

## 🔧 Customization

To customize the theme:

1. Edit `colors.ts` for color palette changes
2. Edit `shadows.ts` for shadow adjustments
3. Edit `spacing.ts` for spacing scale modifications
4. Edit `typography.ts` for font changes
5. Edit `breakpoints.ts` for responsive breakpoint adjustments

All changes automatically propagate throughout the app!

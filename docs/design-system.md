# RelaAI Design System

**Version:** 1.0.0
**Last Updated:** 2025-01-02

Complete guide to RelaAI's design system, implementing advanced UI/UX principles for beautiful, accessible mobile interfaces.

---

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Shadow System](#shadow-system)
4. [Color Palette](#color-palette)
5. [Responsive Design](#responsive-design)
6. [Typography](#typography)
7. [Spacing](#spacing)
8. [Components](#components)
9. [Accessibility](#accessibility)
10. [Best Practices](#best-practices)

---

## Overview

The RelaAI design system is built on three core UI/UX principles:

1. **Shadow System** - Two-layer shadows (ambient + directional) for realistic depth
2. **Color Palette** - Primary, secondary, neutral, and semantic colors with 10 shades each
3. **Responsive Design** - Box-based layouts that rearrange, not shrink

### Quick Start

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

---

## Design Principles

### 1. Shadow System - Two-Layer Approach

**Color Layering for Depth:**
- Create 3-4 shades of base color (0.1 lightness increments)
- **Hierarchy:** Darker = deeper/background, Lighter = elevated/important
- **Layering Effect:** Stack lighter shades on top of darker ones
- **No borders needed:** Color contrast alone separates elements

**Dual Shadows:**
- **Ambient shadow:** Soft, diffuse light from all directions (top layer)
- **Directional shadow:** Sharp, focused light from above (bottom layer)
- **Combines for realism:** Natural lighting simulation

**Elevation Scale:**
```
none  (0)  → No shadow (flat surfaces)
sm    (2)  → Subtle (cards, list items)
md    (4)  → Standard (buttons, inputs)
lg    (8)  → Prominent (FABs, hover states)
xl    (16) → Elevated (modals, dialogs)
2xl   (24) → Maximum (tooltips, dropdowns)
```

**Usage Example:**
```typescript
import styled from 'styled-components/native';

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  ${({ theme }) => {
    const shadow = theme.shadows.sm.combined;
    return `
      shadow-color: ${shadow.shadowColor};
      shadow-offset: ${shadow.shadowOffset.width}px ${shadow.shadowOffset.height}px;
      shadow-opacity: ${shadow.shadowOpacity};
      shadow-radius: ${shadow.shadowRadius}px;
      elevation: ${shadow.elevation};
    `;
  }}
`;
```

### 2. Color Palette System

**Four Color Types:**

1. **Primary (Blue #007AFF)**
   - Used for: CTAs, buttons, links, active states
   - Purpose: Main brand color, draws attention

2. **Secondary (Purple #5856D6)**
   - Used for: Secondary actions, highlights, badges
   - Purpose: Complementary color for subtle emphasis

3. **Neutral (Gray 50-900)**
   - Used for: Text, backgrounds, borders, UI surfaces
   - Purpose: Majority of the interface

4. **Semantic (Success/Error/Warning/Info)**
   - **Success:** Green (#34C759) - confirmations, success states
   - **Error:** Red (#FF3B30) - errors, destructive actions
   - **Warning:** Orange (#FF9500) - warnings, cautions
   - **Info:** Cyan (#5AC8FA) - information, notifications

**Color Shade Scale:**
```
50  → Lightest (backgrounds)
100 → Very light (elevated surfaces)
200 → Light (subtle borders)
300 → Medium-light (dividers)
400 → Medium (disabled text)
500 → BASE COLOR
600 → Medium-dark (secondary text)
700 → Dark (body text)
800 → Very dark (headings)
900 → Darkest (maximum contrast)
```

**Usage Example:**
```typescript
const Button = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary[500]};
`;

const Text = styled.Text`
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const SuccessMessage = styled.View`
  background-color: ${({ theme }) => theme.colors.semantic.success.light};
`;
```

### 3. Responsive Layout - Box System

**Principle 1: System of Boxes**
Every design starts as a system of boxes with clear parent-child relationships. Build layouts where everything has natural balance, so the structure feels flexible before it ever responds.

**Principle 2: Rearrange, Not Shrink**
Responsive isn't about shrinking — it's about rearranging with purpose. As space changes, elements should shift, flow, or reprioritize, maintaining clarity and rhythm.

**Breakpoints:**
```
Phone:   0-599px   (iPhone SE to iPhone 14 Pro)
Tablet:  600-1023px (iPad, Android tablets)
Desktop: 1024px+    (iPad Pro landscape, desktop)
```

**Usage Example:**
```typescript
import { useResponsive, useGridColumns } from '@/theme';

function MyComponent() {
  const { isPhone, isTablet, isDesktop } = useResponsive();
  const { columns, itemWidth, gap } = useGridColumns(1, 3, 16);

  return (
    <View style={{
      flexDirection: isPhone ? 'column' : 'row',
      padding: isPhone ? 16 : isTablet ? 24 : 32
    }}>
      {/* Content automatically adapts */}
    </View>
  );
}
```

---

## Shadow System

### Shadow Levels

| Level | Elevation | Use Case | Example |
|-------|-----------|----------|---------|
| none  | 0  | Flat surfaces, inline elements | Text, dividers |
| sm    | 2  | Subtle elevation | Cards, list items |
| md    | 4  | Standard elevation | Buttons, inputs |
| lg    | 8  | Prominent elevation | FABs, hover states |
| xl    | 16 | High elevation | Modals, dialogs |
| 2xl   | 24 | Maximum elevation | Tooltips, menus |

### Implementation

**Basic Shadow:**
```typescript
import { applyShadow } from '@/theme';

const Card = styled.View`
  ${({ theme }) => applyShadow(theme.shadows.md)};
`;
```

**Colored Shadow:**
```typescript
import { generateColoredShadow } from '@/theme';

const BrandCard = styled.View`
  ${() => {
    const shadow = generateColoredShadow(8, '#007AFF', 0.3);
    return applyShadow(shadow);
  }}
`;
```

**Animated Shadow:**
```typescript
import { generateHoverShadow, generateActiveShadow } from '@/theme';

const baseShadow = theme.shadows.md.combined;
const hoverShadow = generateHoverShadow(baseShadow);  // Increases elevation
const activeShadow = generateActiveShadow(baseShadow); // Decreases elevation
```

---

## Color Palette

### Using Colors

**Accessing Colors:**
```typescript
// Via theme
${({ theme }) => theme.colors.primary[500]}

// Via quick access
import { colors } from '@/theme';
colors.primary // #007AFF
colors.success // #34C759
```

###  Full Palette

**Primary (Blue):**
```typescript
50:  #E3F2FD
100: #BBDEFB
200: #90CAF9
300: #64B5F6
400: #42A5F5
500: #007AFF ← Base
600: #0066D6
700: #0052AD
800: #003F85
900: #002B5C
```

**Secondary (Purple):**
```typescript
50:  #F3F2FF
100: #E5E3FF
200: #D1CEFF
300: #BCB9FF
400: #A8A5FF
500: #5856D6 ← Base
600: #4845B8
700: #39359A
800: #2B287C
900: #1D1A5E
```

**Neutral (Gray):**
```typescript
50:  #FAFAFA (lightest background)
100: #F5F5F5 (card backgrounds)
200: #EEEEEE (subtle borders)
300: #E0E0E0 (dividers)
400: #BDBDBD (disabled text)
500: #9E9E9E (secondary text)
600: #757575 (body text)
700: #616161 (headings)
800: #424242 (strong emphasis)
900: #212121 (maximum contrast)
```

### Color Utilities

**Lighten/Darken:**
```typescript
import { lighten, darken } from '@/theme';

const hoverColor = lighten('#007AFF', 0.2);  // 20% lighter
const shadowColor = darken('#007AFF', 0.3);   // 30% darker
```

**Add Opacity:**
```typescript
import { addAlpha } from '@/theme';

const overlay = addAlpha('#000000', 0.5); // rgba(0, 0, 0, 0.5)
```

**Color Layering:**
```typescript
import { generateColorLayers } from '@/theme';

const layers = generateColorLayers('#FFFFFF', 4);
// ['#FFFFFF', '#F5F5F5', '#EEEEEE', '#E0E0E0']
```

---

## Responsive Design

### Hooks

**useResponsive:**
```typescript
import { useResponsive } from '@/theme';

const { isPhone, isTablet, isDesktop, width } = useResponsive();
```

**useResponsiveValue:**
```typescript
import { useResponsiveValue } from '@/theme';

const padding = useResponsiveValue({
  0: 16,     // 0px+   (phone)
  600: 24,   // 600px+ (tablet)
  1024: 32,  // 1024px+ (desktop)
});
```

**useGridColumns:**
```typescript
import { useGridColumns } from '@/theme';

const { columns, itemWidth, gap } = useGridColumns(
  1,  // min columns (phone)
  3,  // max columns (desktop)
  16  // gap between items
);
```

### Component Visibility

**Show/Hide on Devices:**
```typescript
import { showOn, hideOn } from '@/theme';

// Show only on tablet and desktop
<View style={{ display: showOn(['tablet', 'desktop']) }}>
  {/* Content */}
</View>

// Hide on phone
<View style={{ display: hideOn(['phone']) }}>
  {/* Content */}
</View>
```

### Flex Direction

**Responsive Layout:**
```typescript
import { useFlexDirection } from '@/theme';

const flexDirection = useFlexDirection(600);
// Returns 'column' on phone, 'row' on tablet+
```

---

## Typography

### Type Scale

| Variant | Size | Weight | Usage |
|---------|------|--------|-------|
| h1 | 32px | 800 (extrabold) | Display/hero text |
| h2 | 28px | 700 (bold) | Page titles |
| h3 | 24px | 700 (bold) | Section headings |
| h4 | 20px | 600 (semibold) | Subsection headings |
| h5 | 18px | 600 (semibold) | Small headings |
| h6 | 16px | 600 (semibold) | Tiny headings |
| bodyLarge | 18px | 400 (regular) | Large body text |
| body | 16px | 400 (regular) | Default body text |
| bodySmall | 14px | 400 (regular) | Small body text |
| caption | 12px | 400 (regular) | Captions, timestamps |
| label | 14px | 500 (medium) | Labels, tags |
| button | 16px | 600 (semibold) | Button text |

### Usage

**Via Text Component:**
```typescript
import { textStyles } from '@/theme';

<Text style={textStyles.h1}>Heading</Text>
<Text style={textStyles.body}>Body text</Text>
```

**Via Theme:**
```typescript
const Heading = styled.Text`
  font-size: ${({ theme }) => theme.typography.h1.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  line-height: ${({ theme }) => theme.typography.h1.lineHeight}px;
`;
```

---

## Spacing

### Spacing Scale

```typescript
0:  0px   // No spacing
1:  4px   // Tiny
2:  8px   // Extra small
3:  12px  // Small
4:  16px  // Medium (most common)
5:  20px  // Large
6:  24px  // Extra large
8:  32px  // 2x large
10: 40px  // 3x large
12: 48px  // 4x large
16: 64px  // 5x large
20: 80px  // 6x large
24: 96px  // Maximum
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

### Border Radius

```typescript
import { borderRadius } from '@/theme';

borderRadius.sm   // 4px  - Small elements
borderRadius.md   // 8px  - Default
borderRadius.lg   // 12px - Cards
borderRadius.xl   // 16px - Modals
borderRadius['2xl'] // 24px - Maximum
borderRadius.full // 9999 - Circular
```

---

## Components

### Button Example

```typescript
import styled from 'styled-components/native';

const Button = styled.TouchableOpacity<{ variant: string }>`
  background-color: ${({ theme, variant }) =>
    variant === 'primary'
      ? theme.colors.primary[500]
      : theme.colors.secondary[500]
  };
  padding-horizontal: ${({ theme }) => theme.spacing[4]}px;
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  border-radius: ${({ theme }) => theme.spacing[2]}px;

  ${({ theme, variant }) => {
    if (variant !== 'outline') {
      const shadow = theme.shadows.md.combined;
      return `
        shadow-color: ${shadow.shadowColor};
        shadow-offset: ${shadow.shadowOffset.width}px ${shadow.shadowOffset.height}px;
        shadow-opacity: ${shadow.shadowOpacity};
        shadow-radius: ${shadow.shadowRadius}px;
        elevation: ${shadow.elevation};
      `;
    }
  }}
`;

const ButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.button.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.button.fontWeight};
  color: #FFFFFF;
`;
```

### Card Example

```typescript
const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  padding: ${({ theme }) => theme.spacing[4]}px;
  border-radius: ${({ theme }) => borderRadius.lg}px;
  ${({ theme }) => applyShadow(theme.shadows.sm)};
`;
```

---

## Accessibility

### Contrast Checking

```typescript
import { meetsContrastStandard, getAccessibleTextColor } from '@/theme';

// Check WCAG compliance
const isAccessible = meetsContrastStandard(
  '#007AFF',  // foreground
  '#FFFFFF',  // background
  'AA',       // standard
  'normal'    // size
);

// Get best text color
const textColor = getAccessibleTextColor('#007AFF'); // '#FFFFFF'
```

### Font Scaling

```typescript
import { getScaledFontSize } from '@/theme';

// Support user preferences
const fontSize = getScaledFontSize('body', 'xl'); // 1.2x larger
```

---

## Best Practices

### Do's

✅ Always use theme values (never hardcode colors/spacing)
✅ Use semantic colors for states (success, error, warning, info)
✅ Check contrast ratios for accessibility (WCAG AA minimum)
✅ Use predefined shadow levels (don't create custom shadows)
✅ Start mobile-first, enhance for larger screens
✅ Use box-based layouts with clear relationships

### Don'ts

❌ Never hardcode colors, spacing, or shadows
❌ Don't shrink content - rearrange it responsively
❌ Avoid using more than 3 font weights in one view
❌ Don't skip accessibility props (labels, roles, states)
❌ Avoid mixing semantic and non-semantic color usage

---

## Resources

- **Theme Files:** `mobile/src/theme/`
- **Component Contracts:** `contracts/component-contracts/`
- **Code Templates:** `code-templates/react-native-components/`
- **Usage Guide:** `mobile/src/theme/README.md`

---

**Built with principles from UI/UX best practices for beautiful, accessible interfaces.**

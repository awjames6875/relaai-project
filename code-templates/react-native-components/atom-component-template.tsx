/**
 * Atom Component Template
 *
 * This template demonstrates how to create atomic-level components in the RelaAI project.
 * Atoms are the smallest building blocks of the UI (Button, Input, Avatar, etc.)
 *
 * Usage:
 * 1. Copy this template
 * 2. Replace placeholders with your component name
 * 3. Update the props interface in contracts/component-contracts/component-interfaces.ts
 * 4. Customize styling and behavior
 * 5. Add comprehensive tests
 */

import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import styled from 'styled-components/native';
// TODO: Import your component props interface from contracts
import { ButtonProps } from '../../contracts/component-contracts/component-interfaces';

// ==================== STYLED COMPONENTS ====================

// TODO: Define your styled components here
// Use theme values for colors, spacing, typography
// Example theme access: ${({ theme }) => theme.colors.primary}

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
  fullWidth: boolean;
}

const StyledButton = styled.TouchableOpacity<StyledButtonProps>`
  /* Base styles using theme spacing and border radius */
  border-radius: ${({ theme }) => theme.spacing[2]}px; // 8px from theme
  align-items: center;
  justify-content: center;
  flex-direction: row;

  /* Size-based styles using theme spacing */
  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return `
          height: 32px;
          padding-horizontal: ${theme.spacing[3]}px;  /* 12px */
        `;
      case 'large':
        return `
          height: 56px;
          padding-horizontal: ${theme.spacing[6]}px;  /* 24px */
        `;
      default: // medium
        return `
          height: 44px;
          padding-horizontal: ${theme.spacing[4]}px;  /* 16px */
        `;
    }
  }}

  /* Variant-based styles using theme colors */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary[500]};
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary[500]};
        `;
      case 'outline':
        return `
          background-color: transparent;
          border-width: 1px;
          border-color: ${theme.colors.primary[500]};
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.semantic.error.light};
        `;
      default:
        return `background-color: ${theme.colors.primary[500]};`;
    }
  }}

  /* Shadow elevation using theme shadows (design system) */
  ${({ variant, theme }) => {
    // Solid buttons get medium shadow, outline/ghost get no shadow
    if (variant === 'outline') {
      return ''; // No shadow for outline buttons
    }
    // Apply shadow from theme
    const shadow = theme.shadows.md.combined;
    return `
      shadow-color: ${shadow.shadowColor};
      shadow-offset: ${shadow.shadowOffset.width}px ${shadow.shadowOffset.height}px;
      shadow-opacity: ${shadow.shadowOpacity};
      shadow-radius: ${shadow.shadowRadius}px;
      elevation: ${shadow.elevation};
    `;
  }}

  /* Full width */
  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}

  /* Disabled state */
  ${({ disabled }) => disabled && `
    opacity: 0.5;
  `}
`;

const ButtonText = styled.Text<{ variant: string; size: string }>`
  /* Text styles using theme typography */
  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return `
          font-size: ${theme.typography.bodySmall.fontSize}px;
          font-weight: ${theme.fontWeights.medium};
          line-height: ${theme.typography.bodySmall.lineHeight}px;
        `;
      case 'large':
        return `
          font-size: ${theme.typography.bodyLarge.fontSize}px;
          font-weight: ${theme.fontWeights.semibold};
          line-height: ${theme.typography.bodyLarge.lineHeight}px;
        `;
      default: // medium
        return `
          font-size: ${theme.typography.button.fontSize}px;
          font-weight: ${theme.typography.button.fontWeight};
          line-height: ${theme.typography.button.lineHeight}px;
          letter-spacing: ${theme.typography.button.letterSpacing}px;
        `;
    }
  }}

  /* Text color based on variant using theme colors */
  ${({ variant, theme }) => {
    const colors = {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      outline: theme.colors.primary[500],
      danger: '#FFFFFF',
    };

    return `color: ${colors[variant as keyof typeof colors]};`;
  }}
`;

const IconContainer = styled.View`
  margin-right: 8px;
`;

// ==================== COMPONENT ====================

/**
 * Button Component
 *
 * A reusable button component following the atomic design pattern.
 * Supports multiple variants, sizes, loading states, and icons.
 *
 * @example
 * ```tsx
 * <Button
 *   title="Submit"
 *   onPress={() => handleSubmit()}
 *   variant="primary"
 *   size="medium"
 *   loading={isLoading}
 *   disabled={!isValid}
 *   testID="submit-button"
 * />
 * ```
 *
 * @param {ButtonProps} props - Component props defined in contracts
 * @returns {JSX.Element} Button component
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  testID,
}) => {
  // TODO: Add any internal state or hooks if needed
  // Example: const [isPressed, setIsPressed] = React.useState(false);

  // TODO: Handle press events with proper error handling
  const handlePress = () => {
    if (disabled || loading) {
      return;
    }

    try {
      onPress();
    } catch (error) {
      // TODO: Add error logging/reporting
      console.error('Button press error:', error);
    }
  };

  // TODO: Compute accessibility label
  const accessibilityLabel = testID || `${title}-button`;

  // TODO: Compute accessibility state
  const accessibilityState = {
    disabled: disabled || loading,
    busy: loading,
  };

  return (
    <StyledButton
      onPress={handlePress}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      activeOpacity={0.7}
      // Accessibility props - REQUIRED for all interactive elements
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      accessibilityHint={`Double tap to ${title.toLowerCase()}`}
      testID={testID}
    >
      {/* TODO: Render icon if provided */}
      {icon && !loading && (
        <IconContainer>
          {/* TODO: Replace with actual Icon component */}
          {/* <Icon name={icon} size={size === 'small' ? 16 : size === 'large' ? 24 : 20} /> */}
        </IconContainer>
      )}

      {/* TODO: Render loading spinner or button text */}
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#007AFF' : '#FFFFFF'}
          size={size === 'small' ? 'small' : 'small'}
          testID={`${testID}-loading`}
        />
      ) : (
        <ButtonText variant={variant} size={size}>
          {title}
        </ButtonText>
      )}
    </StyledButton>
  );
};

// ==================== DEFAULT EXPORT ====================

export default Button;

// ==================== ALTERNATIVE EXAMPLES ====================

/**
 * EXAMPLE: Input Atom Component
 *
 * Uncomment and customize for an Input component:
 */

/*
import { InputProps } from '../../contracts/component-contracts/component-interfaces';

const StyledTextInput = styled.TextInput<{ hasError: boolean }>`
  height: 44px;
  padding-horizontal: 12px;
  border-width: 1px;
  border-radius: 8px;
  font-size: 16px;
  ${({ hasError }) => hasError ? `
    border-color: #FF3B30;
  ` : `
    border-color: #D1D1D6;
  `}
`;

const InputLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #3C3C43;
  margin-bottom: 8px;
`;

const ErrorText = styled.Text`
  font-size: 12px;
  color: #FF3B30;
  margin-top: 4px;
`;

const HelperText = styled.Text`
  font-size: 12px;
  color: #8E8E93;
  margin-top: 4px;
`;

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  helperText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete,
  multiline = false,
  numberOfLines,
  maxLength,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  testID,
}) => {
  return (
    <View>
      {label && <InputLabel>{label}</InputLabel>}

      <StyledTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C7C7CC"
        hasError={!!error}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        editable={!disabled}
        accessible={true}
        accessibilityLabel={label || placeholder || 'Text input'}
        accessibilityRole="text"
        accessibilityState={{ disabled }}
        testID={testID}
      />

      {error && <ErrorText testID={`${testID}-error`}>{error}</ErrorText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </View>
  );
};
*/

/**
 * EXAMPLE: Avatar Atom Component
 *
 * Uncomment and customize for an Avatar component:
 */

/*
import { AvatarProps } from '../../contracts/component-contracts/component-interfaces';

const AvatarContainer = styled.TouchableOpacity<{ size: string }>`
  ${({ size }) => {
    const dimensions = {
      small: 32,
      medium: 48,
      large: 64,
      xlarge: 96,
    };
    const dim = dimensions[size as keyof typeof dimensions];
    return `
      width: ${dim}px;
      height: ${dim}px;
      border-radius: ${dim / 2}px;
    `;
  }}
  overflow: hidden;
  background-color: #007AFF;
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const InitialsText = styled.Text<{ size: string }>`
  color: #FFFFFF;
  font-weight: 600;
  ${({ size }) => {
    const fontSizes = {
      small: 12,
      medium: 18,
      large: 24,
      xlarge: 36,
    };
    return `font-size: ${fontSizes[size as keyof typeof fontSizes]}px;`;
  }}
`;

const Badge = styled.View<{ color: string }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ color }) => color || '#34C759'};
  border-width: 2px;
  border-color: #FFFFFF;
`;

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = 'medium',
  onPress,
  showBadge = false,
  badgeColor = '#34C759',
  testID,
}) => {
  // TODO: Extract initials from name
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <AvatarContainer
      size={size}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      accessible={true}
      accessibilityLabel={`${name} avatar`}
      accessibilityRole={onPress ? 'button' : 'image'}
      testID={testID}
    >
      {imageUrl ? (
        <AvatarImage
          source={{ uri: imageUrl }}
          resizeMode="cover"
          accessible={false}
        />
      ) : (
        <InitialsText size={size}>{initials}</InitialsText>
      )}

      {showBadge && <Badge color={badgeColor} />}
    </AvatarContainer>
  );
};
*/

// ==================== STYLING BEST PRACTICES ====================

/**
 * STYLING TIPS:
 *
 * 1. Use theme values for consistency:
 *    - ${({ theme }) => theme.colors.primary}
 *    - ${({ theme }) => theme.spacing.md}
 *    - ${({ theme }) => theme.typography.body.fontSize}
 *
 * 2. Support different states:
 *    - default, hover (web), pressed, disabled, focused
 *
 * 3. Use semantic color names:
 *    - primary, secondary, danger, success, warning
 *
 * 4. Make components responsive:
 *    - Use relative units when appropriate
 *    - Consider screen size variations
 *
 * 5. Follow platform conventions:
 *    - iOS: rounded corners, subtle shadows
 *    - Android: material design guidelines
 */

// ==================== ACCESSIBILITY CHECKLIST ====================

/**
 * ACCESSIBILITY REQUIREMENTS:
 *
 * ✓ accessible={true} on all interactive elements
 * ✓ accessibilityLabel - Clear, descriptive label
 * ✓ accessibilityRole - button, text, image, etc.
 * ✓ accessibilityState - disabled, selected, checked, busy
 * ✓ accessibilityHint - Additional context for screen readers
 * ✓ testID - For automated testing
 *
 * Common roles:
 * - button, link, search, image, imagebutton, text, adjustable
 * - header, summary, alert, checkbox, combobox, menu, menubar
 * - menuitem, progressbar, radio, radiogroup, scrollbar, spinbutton
 * - switch, tab, tablist, timer, toolbar
 */

// ==================== PERFORMANCE TIPS ====================

/**
 * PERFORMANCE OPTIMIZATION:
 *
 * 1. Use React.memo for components that receive stable props
 * 2. Use useCallback for event handlers passed as props
 * 3. Use useMemo for expensive computations
 * 4. Avoid inline styles - use styled components
 * 5. Optimize images - use appropriate sizes
 * 6. Avoid unnecessary re-renders
 * 7. Use FlatList for long lists (not ScrollView)
 */

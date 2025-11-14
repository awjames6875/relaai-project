/**
 * Button Component (Atom)
 *
 * Reusable button with variants and sizes based on design system.
 */
import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { colors } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled.TouchableOpacity<{
  variant: string;
  size: string;
  disabled: boolean;
  fullWidth: boolean;
}>`
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  ${({ size }) => {
    switch (size) {
      case 'small':
        return 'height: 40px; padding-horizontal: 16px;';
      case 'large':
        return 'height: 56px; padding-horizontal: 24px;';
      default:
        return 'height: 50px; padding-horizontal: 24px;';
    }
  }}

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `background-color: ${colors.primary};`;
      case 'secondary':
        return `background-color: ${colors.secondary};`;
      case 'outline':
        return `
          background-color: transparent;
          border-width: 2px;
          border-color: ${colors.primary};
        `;
      case 'danger':
        return `background-color: ${colors.error};`;
      default:
        return `background-color: ${colors.primary};`;
    }
  }}

  ${({ fullWidth }) => (fullWidth ? 'width: 100%;' : '')}
`;

const ButtonText = styled.Text<{ variant: string }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ variant }) => (variant === 'outline' ? colors.primary : '#FFFFFF')};
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={isDisabled}
      fullWidth={fullWidth}
      {...props}
    >
      {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <ButtonText variant={variant}>{children}</ButtonText>}
    </StyledButton>
  );
};


/**
 * Card Component (Molecule)
 *
 * Reusable card container with shadow and padding.
 * Based on design system shadow and spacing patterns.
 */
import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';
import { colors } from '../../theme';
import { generateCustomShadow } from '../../theme/utils/shadows';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  onPress?: () => void;
  padding?: number;
  marginBottom?: number;
}

const shadowStyle = generateCustomShadow(2, '#000000', 0.1);

const CardContainer = styled.View<{ padding: number; marginBottom: number }>`
  background-color: ${colors.white};
  border-radius: 12px;
  padding: ${({ padding }) => padding}px;
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
  ${shadowStyle}
`;

const TouchableCard = styled.TouchableOpacity<{ padding: number; marginBottom: number }>`
  background-color: ${colors.white};
  border-radius: 12px;
  padding: ${({ padding }) => padding}px;
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
  ${shadowStyle}
`;

export const Card = ({
  children,
  onPress,
  padding = 16,
  marginBottom = 12,
  ...props
}: CardProps): React.ReactElement => {
  if (onPress) {
    return (
      <TouchableCard
        padding={padding}
        marginBottom={marginBottom}
        onPress={onPress}
        activeOpacity={0.7}
        {...props}
      >
        {children}
      </TouchableCard>
    );
  }

  return (
    <CardContainer padding={padding} marginBottom={marginBottom} {...props}>
      {children}
    </CardContainer>
  );
};


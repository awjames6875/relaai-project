/**
 * EmptyState Component (Molecule)
 *
 * Displays an empty state message with optional icon and action button.
 * Used in lists when there's no data to display.
 */
import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../../theme';
import { Button } from '../atoms';

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 8px;
  text-align: center;
`;

const Message = styled.Text`
  font-size: 16px;
  color: ${colors.textSecondary};
  text-align: center;
  margin-bottom: 24px;
  line-height: 22px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  max-width: 200px;
`;

export const EmptyState = ({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps): React.ReactElement => {
  return (
    <Container>
      <Title>{title}</Title>
      {message && <Message>{message}</Message>}
      {actionLabel && onAction && (
        <ButtonContainer>
          <Button onPress={onAction} fullWidth>
            {actionLabel}
          </Button>
        </ButtonContainer>
      )}
    </Container>
  );
};


/**
 * Input Component (Atom)
 *
 * Reusable text input with validation states.
 */
import React from 'react';
import styled from 'styled-components/native';
import { TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
  testID?: string;
}

const Container = styled.View`
  margin-bottom: 16px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`;

const StyledInput = styled.TextInput<{ hasError: boolean }>`
  height: 50px;
  border-width: 2px;
  border-color: ${({ hasError }) => (hasError ? '#FF3B30' : '#E5E5EA')};
  border-radius: 12px;
  padding-horizontal: 16px;
  font-size: 16px;
  background-color: #FFFFFF;
  color: #000000;
`;

const ErrorText = styled.Text`
  font-size: 12px;
  color: #FF3B30;
  margin-top: 4px;
`;

export const Input: React.FC<InputProps> = ({ label, error, containerStyle, testID, ...props }) => {
  return (
    <Container style={containerStyle} testID={testID}>
      {label && <Label>{label}</Label>}
      <StyledInput hasError={!!error} {...props} testID={testID} />
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};


/**
 * CARD COMPONENT TESTS
 *
 * Component: Card
 * Created: 2025-01-02
 * Author: Cursor Agent
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { Card } from '@/components/molecules';
import { lightTheme } from '@/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Card', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render children', () => {
      renderWithTheme(<Card><>Test Content</></Card>);
      expect(screen.getByText('Test Content')).toBeTruthy();
    });

    it('should render as non-touchable by default', () => {
      renderWithTheme(<Card><>Content</></Card>);
      expect(screen.getByText('Content')).toBeTruthy();
    });

    it('should render as touchable when onPress provided', () => {
      const mockOnPress = jest.fn();
      renderWithTheme(<Card onPress={mockOnPress}><>Content</></Card>);
      
      const touchable = screen.getByText('Content');
      fireEvent.press(touchable);
      
      expect(mockOnPress).toHaveBeenCalled();
    });
  });
});


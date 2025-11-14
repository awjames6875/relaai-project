/**
 * EMPTY STATE COMPONENT TESTS
 *
 * Component: EmptyState
 * Created: 2025-01-02
 * Author: Cursor Agent
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { EmptyState } from '@/components/molecules';
import { lightTheme } from '@/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('EmptyState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render title', () => {
      renderWithTheme(<EmptyState title="No items found" />);
      expect(screen.getByText('No items found')).toBeTruthy();
    });

    it('should render message when provided', () => {
      renderWithTheme(
        <EmptyState
          title="Empty"
          message="Try adding something"
        />
      );
      expect(screen.getByText('Try adding something')).toBeTruthy();
    });

    it('should not render message when not provided', () => {
      renderWithTheme(<EmptyState title="Empty" />);
      expect(screen.queryByText(/Try adding/)).toBeNull();
    });

    it('should render action button when provided', () => {
      const mockAction = jest.fn();
      renderWithTheme(
        <EmptyState
          title="Empty"
          actionLabel="Add Item"
          onAction={mockAction}
        />
      );
      
      const button = screen.getByText('Add Item');
      expect(button).toBeTruthy();
      
      fireEvent.press(button);
      expect(mockAction).toHaveBeenCalled();
    });

    it('should not render action button when not provided', () => {
      renderWithTheme(<EmptyState title="Empty" />);
      expect(screen.queryByRole('button')).toBeNull();
    });
  });
});


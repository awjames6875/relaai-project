/**
 * CONTACT CARD COMPONENT TESTS
 *
 * Component: ContactCard
 * Created: 2025-01-02
 * Author: Cursor Agent
 *
 * Test Framework: Jest + React Native Testing Library
 * Coverage Target: >80%
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { ContactCard } from '@/components/molecules';
import { lightTheme } from '@/theme';
import { createContactFactory } from '../../test-factories/contact.factory';

// ==================== TEST SETUP ====================

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('ContactCard', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== RENDERING TESTS ====================

  describe('Rendering', () => {
    it('should render successfully with all fields', () => {
      const contact = createContactFactory();
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText(contact.name)).toBeTruthy();
      expect(screen.getByText(contact.relationshipType!)).toBeTruthy();
      expect(screen.getByText(contact.phoneNumber!)).toBeTruthy();
      expect(screen.getByText(contact.email!)).toBeTruthy();
    });

    it('should render with minimal data (name only)', () => {
      const contact = createContactFactory({
        phoneNumber: undefined,
        email: undefined,
        relationshipType: undefined,
      });
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText(contact.name)).toBeTruthy();
    });

    it('should display contact initials in avatar', () => {
      const contact = createContactFactory({ name: 'John Doe' });
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText('JD')).toBeTruthy();
    });

    it('should handle single word names', () => {
      const contact = createContactFactory({ name: 'Madonna' });
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText('M')).toBeTruthy();
    });

    it('should handle three word names', () => {
      const contact = createContactFactory({ name: 'Mary Jane Watson' });
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText('MW')).toBeTruthy();
    });
  });

  // ==================== INTERACTION TESTS ====================

  describe('Interaction', () => {
    it('should call onPress when tapped', () => {
      const contact = createContactFactory();
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      const card = screen.getByTestId ? screen.getByTestId('contact-card') : screen.getByText(contact.name);
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should not crash when onPress is provided', () => {
      const contact = createContactFactory();
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText(contact.name)).toBeTruthy();
    });
  });

  // ==================== AVATAR TESTS ====================

  describe('Avatar Initials', () => {
    it('should extract initials from two-word name', () => {
      const contact = createContactFactory({ name: 'Jane Smith' });
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText('JS')).toBeTruthy();
    });

    it('should extract initials from uppercase name', () => {
      const contact = createContactFactory({ name: 'JOHN DOE' });
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText('JD')).toBeTruthy();
    });

    it('should extract initials from lowercase name', () => {
      const contact = createContactFactory({ name: 'john doe' });
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText('jd')).toBeTruthy();
    });

    it('should extract initials from mixed case name', () => {
      const contact = createContactFactory({ name: 'John DOE' });
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText('JD')).toBeTruthy();
    });
  });

  // ==================== LAYOUT TESTS ====================

  describe('Layout', () => {
    it('should display chevron indicator', () => {
      const contact = createContactFactory();
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText('›')).toBeTruthy();
    });

    it('should display phone icon when phone number exists', () => {
      const contact = createContactFactory();
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText('📞')).toBeTruthy();
    });

    it('should display email icon when email exists', () => {
      const contact = createContactFactory();
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.getByText('✉️')).toBeTruthy();
    });

    it('should not display phone icon when no phone number', () => {
      const contact = createContactFactory({ phoneNumber: undefined });
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.queryByText('📞')).toBeNull();
    });

    it('should not display email icon when no email', () => {
      const contact = createContactFactory({ email: undefined });
      renderWithTheme(<ContactCard contact={contact} onPress={mockOnPress} />);

      expect(screen.queryByText('✉️')).toBeNull();
    });
  });
});


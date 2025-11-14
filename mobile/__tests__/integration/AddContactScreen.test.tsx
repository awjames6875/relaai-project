/**
 * ADD CONTACT SCREEN TESTS
 *
 * Component: AddContactScreen
 * Created: 2025-01-02
 * Author: Cursor Agent
 */
import React from 'react';
import { renderWithProviders, createMockNavigation, createMockRoute, screen, fireEvent, waitFor } from '../test-utils';

import AddContactScreen from '@/screens/contacts/AddContactScreen';
import { createCreateContactDTOFactory } from '../factories/contact.factory';

// ==================== MOCKS ====================

const mockNavigation = createMockNavigation();
const mockRoute = createMockRoute();

describe('AddContactScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== RENDERING TESTS ====================

  describe('Rendering', () => {
    it('should render all form fields', () => {
      const store = createTestStore({
        auth: { user: { id: 'user-123' }, isAuthenticated: true, session: null, isLoading: false, error: null },
        contacts: { contacts: [], selectedContact: null, isLoading: false, error: null, pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false }, filters: {} },
      });

      renderWithProviders(<AddContactScreen navigation={mockNavigation as any} route={mockRoute as any} />, { store });

      expect(screen.getByTestId('add-contact-submit-button')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter contact name')).toBeTruthy();
      expect(screen.getByPlaceholderText('+1234567890')).toBeTruthy();
      expect(screen.getByPlaceholderText('email@example.com')).toBeTruthy();
    });

    it('should render section titles', () => {
      const store = createTestStore({
        auth: { user: { id: 'user-123' }, isAuthenticated: true, session: null, isLoading: false, error: null },
        contacts: { contacts: [], selectedContact: null, isLoading: false, error: null, pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false }, filters: {} },
      });

      renderWithProviders(<AddContactScreen navigation={mockNavigation as any} route={mockRoute as any} />, { store });
      
      expect(screen.getByText('Basic Information')).toBeTruthy();
      expect(screen.getByText('Important Dates')).toBeTruthy();
      expect(screen.getByText('Additional Information')).toBeTruthy();
    });
  });

  // ==================== VALIDATION TESTS ====================

  describe('Validation', () => {
    it('should show error for empty name on submit', async () => {
      const store = createTestStore({
        auth: { user: { id: 'user-123' }, isAuthenticated: true, session: null, isLoading: false, error: null },
        contacts: { contacts: [], selectedContact: null, isLoading: false, error: null, pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false }, filters: {} },
      });

      renderWithProviders(<AddContactScreen navigation={mockNavigation as any} route={mockRoute as any} />, { store });

      const submitButton = screen.getByTestId('add-contact-submit-button');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Contact name is required/i)).toBeTruthy();
      });
    });

    it('should show error for invalid phone format', async () => {
      const store = createTestStore({
        auth: { user: { id: 'user-123' }, isAuthenticated: true, session: null, isLoading: false, error: null },
        contacts: { contacts: [], selectedContact: null, isLoading: false, error: null, pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false }, filters: {} },
      });

      renderWithProviders(<AddContactScreen navigation={mockNavigation as any} route={mockRoute as any} />, { store });

      const nameInput = screen.getByPlaceholderText('Enter contact name');
      const phoneInput = screen.getByPlaceholderText('+1234567890');

      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.changeText(phoneInput, '123456'); // Invalid format

      const submitButton = screen.getByTestId('add-contact-submit-button');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/E.164 format/i)).toBeTruthy();
      });
    });

    it('should show error for invalid email format', async () => {
      const store = createTestStore({
        auth: { user: { id: 'user-123' }, isAuthenticated: true, session: null, isLoading: false, error: null },
        contacts: { contacts: [], selectedContact: null, isLoading: false, error: null, pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false }, filters: {} },
      });

      renderWithProviders(<AddContactScreen navigation={mockNavigation as any} route={mockRoute as any} />, { store });

      const nameInput = screen.getByPlaceholderText('Enter contact name');
      const emailInput = screen.getByPlaceholderText('email@example.com');

      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.changeText(emailInput, 'not-an-email');

      const submitButton = screen.getByTestId('add-contact-submit-button');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/valid email address/i)).toBeTruthy();
      });
    });
  });
});


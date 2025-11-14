/**
 * CONTACTS LIST SCREEN TESTS
 *
 * Component: ContactsListScreen
 * Created: 2025-01-02
 * Author: Cursor Agent
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';

import ContactsListScreen from '@/screens/contacts/ContactsListScreen';
import authReducer from '@/store/slices/authSlice';
import contactReducer from '@/store/slices/contactSlice';
import { lightTheme } from '@/theme';
import { createContactFactory, createContactArrayFactory } from '../factories/contact.factory';

// ==================== MOCKS ====================

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  canGoBack: jest.fn(() => true),
};

// ==================== TEST SETUP ====================

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      contacts: contactReducer,
    },
    preloadedState,
  });
};

const renderWithProviders = (component: React.ReactElement, { store = createTestStore() } = {}) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <NavigationContainer>{component}</NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
};

describe('ContactsListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== RENDERING TESTS ====================

  describe('Rendering', () => {
    it('should render search input', () => {
      const store = createTestStore({
        auth: { user: { id: 'user-123' }, isAuthenticated: true, session: null, isLoading: false, error: null },
        contacts: { contacts: [], selectedContact: null, isLoading: false, error: null, pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false }, filters: {} },
      });

      renderWithProviders(<ContactsListScreen navigation={mockNavigation as any} route={{} as any} />, { store });
      expect(screen.getByPlaceholderText('Search contacts...')).toBeTruthy();
    });

    it('should display empty state when no contacts', () => {
      const store = createTestStore({
        auth: { user: { id: 'user-123' }, isAuthenticated: true, session: null, isLoading: false, error: null },
        contacts: { contacts: [], selectedContact: null, isLoading: false, error: null, pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false }, filters: {} },
      });

      renderWithProviders(<ContactsListScreen navigation={mockNavigation as any} route={{} as any} />, { store });
      expect(screen.getByText(/No contacts yet/i)).toBeTruthy();
      expect(screen.getByText(/Add your first contact to get started/i)).toBeTruthy();
    });

    it('should display contact list when contacts exist', () => {
      const contacts = createContactArrayFactory(3);
      const store = createTestStore({
        auth: { user: { id: 'user-123' }, isAuthenticated: true, session: null, isLoading: false, error: null },
        contacts: {
          contacts,
          selectedContact: null,
          isLoading: false,
          error: null,
          pagination: { page: 1, pageSize: 20, totalItems: 3, totalPages: 1, hasMore: false },
          filters: {},
        },
      });

      renderWithProviders(<ContactsListScreen navigation={mockNavigation as any} route={{} as any} />, { store });
      expect(screen.getByText(contacts[0].name)).toBeTruthy();
      expect(screen.getByText(contacts[1].name)).toBeTruthy();
      expect(screen.getByText(contacts[2].name)).toBeTruthy();
    });
  });

  // ==================== SEARCH TESTS ====================

  describe('Search Functionality', () => {
    it('should show clear button when search has text', () => {
      const store = createTestStore({
        auth: { user: { id: 'user-123' }, isAuthenticated: true, session: null, isLoading: false, error: null },
        contacts: { contacts: [], selectedContact: null, isLoading: false, error: null, pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false }, filters: {} },
      });

      renderWithProviders(<ContactsListScreen navigation={mockNavigation as any} route={{} as any} />, { store });
      
      const searchInput = screen.getByPlaceholderText('Search contacts...');
      fireEvent.changeText(searchInput, 'test');

      expect(screen.getByText('Clear')).toBeTruthy();
    });

    it('should filter contacts when searching', () => {
      const contacts = createContactArrayFactory(3);
      contacts[0].name = 'John Doe';
      contacts[1].name = 'Jane Smith';
      contacts[2].name = 'Bob Johnson';

      const store = createTestStore({
        auth: { user: { id: 'user-123' }, isAuthenticated: true, session: null, isLoading: false, error: null },
        contacts: {
          contacts,
          selectedContact: null,
          isLoading: false,
          error: null,
          pagination: { page: 1, pageSize: 20, totalItems: 3, totalPages: 1, hasMore: false },
          filters: { search: 'John' },
        },
      });

      renderWithProviders(<ContactsListScreen navigation={mockNavigation as any} route={{} as any} />, { store });
      
      expect(screen.getByText('John Doe')).toBeTruthy();
      expect(screen.queryByText('Jane Smith')).toBeNull();
      expect(screen.queryByText('Bob Johnson')).toBeNull();
    });
  });

  // ==================== NAVIGATION TESTS ====================

  describe('Navigation', () => {
    it('should navigate to AddContact when button pressed in empty state', () => {
      const store = createTestStore({
        auth: { user: { id: 'user-123' }, isAuthenticated: true, session: null, isLoading: false, error: null },
        contacts: { contacts: [], selectedContact: null, isLoading: false, error: null, pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false }, filters: {} },
      });

      renderWithProviders(<ContactsListScreen navigation={mockNavigation as any} route={{} as any} />, { store });
      
      const addButton = screen.getByText('Add Contact');
      fireEvent.press(addButton);

      expect(mockNavigate).toHaveBeenCalledWith('AddContact');
    });
  });
});


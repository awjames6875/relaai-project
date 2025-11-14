/**
 * Test Utilities
 *
 * Comprehensive test helpers and render functions for React Native testing.
 * Includes Redux, Navigation, Theme, and SafeArea providers.
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import authReducer from '@/store/slices/authSlice';
import contactReducer from '@/store/slices/contactSlice';
import messageReducer from '@/store/slices/messageSlice';
import relationshipReducer from '@/store/slices/relationshipSlice';
import { lightTheme } from '@/theme';

// ==================== STORE SETUP ====================

export interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState<any>;
  store?: any;
}

/**
 * Create a test Redux store with optional preloaded state
 */
export const createTestStore = (preloadedState?: PreloadedState<any>) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      contacts: contactReducer,
      messages: messageReducer,
      relationships: relationshipReducer,
    },
    preloadedState,
  });
};

/**
 * Default test store with minimal auth state
 */
const defaultTestStore = createTestStore({
  auth: {
    user: { id: 'user-test-123', email: 'test@example.com' },
    isAuthenticated: true,
    session: null,
    isLoading: false,
    error: null,
  },
  contacts: {
    contacts: [],
    selectedContact: null,
    isLoading: false,
    error: null,
    pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false },
    filters: {},
  },
  messages: {
    messages: [],
    selectedMessage: null,
    isLoading: false,
    error: null,
    pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false },
    filters: {},
  },
  relationships: {
    relationships: [],
    selectedRelationship: null,
    isLoading: false,
    error: null,
    pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false },
  },
});

// ==================== RENDER FUNCTIONS ====================

/**
 * Custom render function with all providers (Redux, Navigation, Theme, SafeArea)
 * Use this for integration tests and screen tests
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  const navigationRef = React.createRef<NavigationContainerRef<any>>();

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <ThemeProvider theme={lightTheme}>
              {children}
            </ThemeProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
    navigationRef,
  };
};

/**
 * Lightweight render for unit tests that only need theme
 * Use this for component unit tests that don't need navigation/Redux
 */
export const renderWithTheme = (
  ui: React.ReactElement,
  renderOptions?: RenderOptions
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider theme={lightTheme}>
        {children}
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Render with Redux only (no navigation)
 * Use this for Redux integration tests
 */
export const renderWithRedux = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          {children}
        </ThemeProvider>
      </Provider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
};

// ==================== MOCK NAVIGATION HELPERS ====================

/**
 * Create a mock navigation object for screen components
 */
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  canGoBack: jest.fn(() => true),
  isFocused: jest.fn(() => true),
});

/**
 * Create a mock route object for screen components
 */
export const createMockRoute = (params: any = {}) => ({
  params,
  name: 'TestScreen',
  key: 'test-screen-key',
});

// ==================== TEST STATE BUILDERS ====================

/**
 * Build a complete auth state for testing
 */
export const buildAuthState = (overrides?: any) => ({
  user: { id: 'user-test-123', email: 'test@example.com' },
  isAuthenticated: true,
  session: null,
  isLoading: false,
  error: null,
  ...overrides,
});

/**
 * Build a complete contacts state for testing
 */
export const buildContactsState = (overrides?: any) => ({
  contacts: [],
  selectedContact: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false },
  filters: {},
  ...overrides,
});

/**
 * Build a complete messages state for testing
 */
export const buildMessagesState = (overrides?: any) => ({
  messages: [],
  selectedMessage: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false },
  filters: {},
  ...overrides,
});

/**
 * Build a complete relationships state for testing
 */
export const buildRelationshipsState = (overrides?: any) => ({
  relationships: [],
  selectedRelationship: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasMore: false },
  ...overrides,
});

// ==================== RE-EXPORTS ====================

export * from '@testing-library/react-native';

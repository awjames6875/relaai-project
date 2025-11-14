/**
 * PROFILE SETUP FLOW INTEGRATION TEST
 *
 * Feature: US-1.3 Profile Setup
 * Created: 2025-11-02
 * Author: QA Agent (Claude)
 *
 * Test Type: Integration (End-to-End Flow)
 * Coverage Target: 100% of critical path
 *
 * Tests complete profile setup workflow:
 * - Registration → Profile Setup → Save → Navigation
 * - Valid data flow
 * - Invalid data handling
 * - Skip functionality
 * - Error handling (network failures)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import { launchImageLibrary } from 'react-native-image-picker';

import ProfileSetupScreen from '@/screens/auth/ProfileSetupScreen';
import profileReducer from '@/store/slices/profileSlice';
import authReducer from '@/store/slices/authSlice';
import { lightTheme } from '@/theme';
import { supabase } from '@/services/supabase';
import {
  createProfileFactory,
  createValidJPGImageFactory,
  createProfileUpdatePayloadFactory,
} from '../factories/profile.factory';

// ==================== MOCKS ====================

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
};

// Mock image picker
jest.mock('react-native-image-picker');
const mockLaunchImageLibrary = launchImageLibrary as jest.MockedFunction<typeof launchImageLibrary>;

// Mock Supabase
jest.mock('@/services/supabase', () => ({
  supabase: {
    from: jest.fn(),
    storage: {
      from: jest.fn(),
    },
    auth: {
      getUser: jest.fn(),
      signUp: jest.fn(),
    },
  },
}));

const mockSupabaseFrom = supabase.from as jest.MockedFunction<typeof supabase.from>;
const mockSupabaseStorage = supabase.storage.from as jest.MockedFunction<typeof supabase.storage.from>;
const mockGetUser = supabase.auth.getUser as jest.MockedFunction<typeof supabase.auth.getUser>;

// ==================== TEST SETUP ====================

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      profile: profileReducer,
      auth: authReducer,
    },
    preloadedState,
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  {
    store = createTestStore(),
  } = {}
) => {
  return {
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <NavigationContainer>
            {component}
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    ),
    store,
  };
};

describe('Profile Setup Flow Integration', () => {
  const mockUserId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock: user is authenticated
    mockGetUser.mockResolvedValue({
      data: { user: { id: mockUserId } },
      error: null,
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ==================== COMPLETE FLOW - SUCCESS ====================

  describe('Complete Flow - Valid Data', () => {
    it('should complete full profile setup flow with valid data', async () => {
      // Arrange
      const profileData = createProfileUpdatePayloadFactory({
        fullName: 'John Doe',
        phoneNumber: '+12125551234',
        timezone: 'America/New_York',
      });

      const savedProfile = createProfileFactory({
        id: mockUserId,
        ...profileData,
      });

      // Mock profile update
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockResolvedValue({
        data: [savedProfile],
        error: null,
      });

      mockSupabaseFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
      } as any);

      const { store } = renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act - Fill in form
      fireEvent.changeText(screen.getByTestId('full-name-input'), profileData.fullName);
      fireEvent.changeText(screen.getByTestId('phone-input'), profileData.phoneNumber!);
      fireEvent(screen.getByTestId('timezone-picker'), 'onValueChange', profileData.timezone);
      fireEvent(screen.getByTestId('email-notifications-toggle'), 'onValueChange', true);
      fireEvent(screen.getByTestId('push-notifications-toggle'), 'onValueChange', true);
      fireEvent(screen.getByTestId('reminder-frequency-picker'), 'onValueChange', 'weekly');

      // Act - Submit form
      fireEvent.press(screen.getByTestId('save-profile-button'));

      // Assert - Profile updated in store
      await waitFor(() => {
        const state = store.getState();
        expect(state.profile.profile).toBeTruthy();
        expect(state.profile.profile?.fullName).toBe(profileData.fullName);
        expect(state.profile.loading).toBe(false);
        expect(state.profile.error).toBeNull();
      });

      // Assert - Navigation occurred
      expect(mockNavigate).toHaveBeenCalled();

      // Assert - Supabase called correctly
      expect(mockSupabaseFrom).toHaveBeenCalledWith('profiles');
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          full_name: profileData.fullName,
          phone: profileData.phoneNumber,
          timezone: profileData.timezone,
        })
      );
    });

    it('should complete flow with minimal data (no optional fields)', async () => {
      // Arrange
      const profileData = {
        fullName: 'Jane Smith',
        timezone: 'UTC',
        notificationPreferences: {
          email: false,
          push: false,
          sms: false,
          reminderFrequency: 'monthly' as const,
        },
      };

      const savedProfile = createProfileFactory({
        id: mockUserId,
        fullName: profileData.fullName,
        timezone: profileData.timezone,
        phoneNumber: undefined,
      });

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockResolvedValue({
        data: [savedProfile],
        error: null,
      });

      mockSupabaseFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
      } as any);

      const { store } = renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act
      fireEvent.changeText(screen.getByTestId('full-name-input'), profileData.fullName);
      fireEvent(screen.getByTestId('timezone-picker'), 'onValueChange', profileData.timezone);
      fireEvent.press(screen.getByTestId('save-profile-button'));

      // Assert
      await waitFor(() => {
        const state = store.getState();
        expect(state.profile.profile?.fullName).toBe(profileData.fullName);
        expect(state.profile.profile?.timezone).toBe(profileData.timezone);
        expect(state.profile.profile?.phoneNumber).toBeUndefined();
      });

      expect(mockNavigate).toHaveBeenCalled();
    });

    it('should complete flow with image upload', async () => {
      // Arrange
      const profileData = createProfileUpdatePayloadFactory();
      const imageFile = createValidJPGImageFactory();
      const avatarUrl = `https://storage.supabase.com/avatars/${mockUserId}/avatar.jpg`;

      // Mock image picker
      mockLaunchImageLibrary.mockImplementation((options, callback) => {
        callback?.({
          assets: [{
            uri: imageFile.uri,
            type: imageFile.type,
            fileName: imageFile.name,
            fileSize: imageFile.size,
          }],
        });
      });

      // Mock image upload
      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: `${mockUserId}/avatar.jpg` },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: avatarUrl },
      });

      mockSupabaseStorage.mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      } as any);

      // Mock profile update
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockResolvedValue({
        data: [createProfileFactory({ profilePictureUrl: avatarUrl })],
        error: null,
      });

      mockSupabaseFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
      } as any);

      const { store } = renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act - Upload image
      fireEvent.press(screen.getByTestId('upload-avatar-button'));

      await waitFor(() => {
        expect(screen.getByTestId('avatar-preview')).toBeTruthy();
      });

      // Act - Complete profile
      fireEvent.changeText(screen.getByTestId('full-name-input'), profileData.fullName);
      fireEvent(screen.getByTestId('timezone-picker'), 'onValueChange', profileData.timezone);
      fireEvent.press(screen.getByTestId('save-profile-button'));

      // Assert
      await waitFor(() => {
        const state = store.getState();
        expect(state.profile.profile?.profilePictureUrl).toBe(avatarUrl);
      });

      expect(mockUpload).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  // ==================== COMPLETE FLOW - VALIDATION ERRORS ====================

  describe('Complete Flow - Invalid Data', () => {
    it('should prevent submission with validation errors', async () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act - Submit without filling required fields
      fireEvent.press(screen.getByTestId('save-profile-button'));

      // Assert - Validation errors shown
      await waitFor(() => {
        expect(screen.getByText(/Full name is required/)).toBeTruthy();
        expect(screen.getByText(/Timezone is required/)).toBeTruthy();
      });

      // Assert - No navigation
      expect(mockNavigate).not.toHaveBeenCalled();

      // Assert - No Supabase calls
      expect(mockSupabaseFrom).not.toHaveBeenCalled();
    });

    it('should allow correction and resubmission after validation errors', async () => {
      // Arrange
      const validData = createProfileUpdatePayloadFactory();

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockResolvedValue({
        data: [createProfileFactory()],
        error: null,
      });

      mockSupabaseFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
      } as any);

      const { store } = renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act - Submit with errors
      fireEvent.changeText(screen.getByTestId('full-name-input'), 'A'); // Too short
      fireEvent.press(screen.getByTestId('save-profile-button'));

      await waitFor(() => {
        expect(screen.getByText(/must be between 2 and 100 characters/)).toBeTruthy();
      });

      // Act - Correct and resubmit
      fireEvent.changeText(screen.getByTestId('full-name-input'), validData.fullName);
      fireEvent(screen.getByTestId('timezone-picker'), 'onValueChange', validData.timezone);
      fireEvent.press(screen.getByTestId('save-profile-button'));

      // Assert - Success
      await waitFor(() => {
        expect(store.getState().profile.profile).toBeTruthy();
      });

      expect(mockNavigate).toHaveBeenCalled();
    });

    it('should show multiple validation errors simultaneously', async () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act - Fill with invalid data
      fireEvent.changeText(screen.getByTestId('full-name-input'), 'A');
      fireEvent.changeText(screen.getByTestId('phone-input'), '1234567890'); // Missing +
      fireEvent.press(screen.getByTestId('save-profile-button'));

      // Assert - All errors shown
      await waitFor(() => {
        expect(screen.getByText(/must be between 2 and 100 characters/)).toBeTruthy();
        expect(screen.getByText(/Phone number must be in E.164 format/)).toBeTruthy();
        expect(screen.getByText(/Timezone is required/)).toBeTruthy();
      });
    });
  });

  // ==================== SKIP FUNCTIONALITY ====================

  describe('Skip Functionality', () => {
    it('should navigate to next screen when Skip is pressed', () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act
      fireEvent.press(screen.getByTestId('skip-button'));

      // Assert
      expect(mockNavigate).toHaveBeenCalled();
      expect(mockSupabaseFrom).not.toHaveBeenCalled();
    });

    it('should skip without saving any data', async () => {
      // Arrange
      const { store } = renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act - Fill some data but skip
      fireEvent.changeText(screen.getByTestId('full-name-input'), 'John Doe');
      fireEvent(screen.getByTestId('timezone-picker'), 'onValueChange', 'America/New_York');
      fireEvent.press(screen.getByTestId('skip-button'));

      // Assert - No profile saved
      await waitFor(() => {
        expect(store.getState().profile.profile).toBeNull();
      });

      expect(mockSupabaseFrom).not.toHaveBeenCalled();
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling - Network Failures', () => {
    it('should handle network error during profile save', async () => {
      // Arrange
      mockSupabaseFrom.mockImplementation(() => {
        throw new Error('Network error');
      });

      const { store } = renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act
      fireEvent.changeText(screen.getByTestId('full-name-input'), 'John Doe');
      fireEvent(screen.getByTestId('timezone-picker'), 'onValueChange', 'America/New_York');
      fireEvent.press(screen.getByTestId('save-profile-button'));

      // Assert
      await waitFor(() => {
        const state = store.getState();
        expect(state.profile.error).toBeTruthy();
        expect(state.profile.error).toContain('Network error');
      });

      // Assert - Error message displayed
      expect(screen.getByText(/Network error/)).toBeTruthy();

      // Assert - No navigation
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle database error during save', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });

      mockSupabaseFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
      } as any);

      const { store } = renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act
      fireEvent.changeText(screen.getByTestId('full-name-input'), 'John Doe');
      fireEvent(screen.getByTestId('timezone-picker'), 'onValueChange', 'America/New_York');
      fireEvent.press(screen.getByTestId('save-profile-button'));

      // Assert
      await waitFor(() => {
        expect(store.getState().profile.error).toBe(errorMessage);
      });

      expect(screen.getByText(errorMessage)).toBeTruthy();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should allow retry after error', async () => {
      // Arrange
      const errorMessage = 'Temporary error';
      const successProfile = createProfileFactory();

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn()
        .mockResolvedValueOnce({
          data: null,
          error: { message: errorMessage },
        })
        .mockResolvedValueOnce({
          data: [successProfile],
          error: null,
        });

      mockSupabaseFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
      } as any);

      const { store } = renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act - First attempt fails
      fireEvent.changeText(screen.getByTestId('full-name-input'), 'John Doe');
      fireEvent(screen.getByTestId('timezone-picker'), 'onValueChange', 'America/New_York');
      fireEvent.press(screen.getByTestId('save-profile-button'));

      await waitFor(() => {
        expect(store.getState().profile.error).toBe(errorMessage);
      });

      // Act - Retry succeeds
      fireEvent.press(screen.getByTestId('save-profile-button'));

      // Assert
      await waitFor(() => {
        expect(store.getState().profile.profile).toBeTruthy();
        expect(store.getState().profile.error).toBeNull();
      });

      expect(mockNavigate).toHaveBeenCalled();
    });

    it('should handle authentication error', async () => {
      // Arrange
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      } as any);

      const { store } = renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act
      fireEvent.changeText(screen.getByTestId('full-name-input'), 'John Doe');
      fireEvent(screen.getByTestId('timezone-picker'), 'onValueChange', 'America/New_York');
      fireEvent.press(screen.getByTestId('save-profile-button'));

      // Assert
      await waitFor(() => {
        expect(store.getState().profile.error).toContain('authenticated');
      });
    });

    it('should handle image upload error gracefully', async () => {
      // Arrange
      const imageFile = createValidJPGImageFactory();

      mockLaunchImageLibrary.mockImplementation((options, callback) => {
        callback?.({
          assets: [{
            uri: imageFile.uri,
            type: imageFile.type,
            fileName: imageFile.name,
            fileSize: imageFile.size,
          }],
        });
      });

      const mockUpload = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Upload failed' },
      });

      mockSupabaseStorage.mockReturnValue({
        upload: mockUpload,
      } as any);

      const { store } = renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act
      fireEvent.press(screen.getByTestId('upload-avatar-button'));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/Upload failed/)).toBeTruthy();
      });

      // Assert - Can still save profile without image
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockResolvedValue({
        data: [createProfileFactory()],
        error: null,
      });

      mockSupabaseFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
      } as any);

      fireEvent.changeText(screen.getByTestId('full-name-input'), 'John Doe');
      fireEvent(screen.getByTestId('timezone-picker'), 'onValueChange', 'America/New_York');
      fireEvent.press(screen.getByTestId('save-profile-button'));

      await waitFor(() => {
        expect(store.getState().profile.profile).toBeTruthy();
      });
    });
  });

  // ==================== PERFORMANCE ====================

  describe('Performance', () => {
    it('should complete save in under 2 seconds', async () => {
      // Arrange
      const startTime = Date.now();

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockResolvedValue({
        data: [createProfileFactory()],
        error: null,
      });

      mockSupabaseFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
      } as any);

      const { store } = renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} />);

      // Act
      fireEvent.changeText(screen.getByTestId('full-name-input'), 'John Doe');
      fireEvent(screen.getByTestId('timezone-picker'), 'onValueChange', 'America/New_York');
      fireEvent.press(screen.getByTestId('save-profile-button'));

      // Assert
      await waitFor(() => {
        expect(store.getState().profile.profile).toBeTruthy();
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000);
    });
  });
});

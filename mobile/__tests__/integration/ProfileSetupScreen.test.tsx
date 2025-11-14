/**
 * PROFILE SETUP SCREEN COMPONENT TESTS
 *
 * Component: ProfileSetupScreen
 * Created: 2025-11-02
 * Author: QA Agent (Claude)
 *
 * Test Framework: Jest + React Native Testing Library
 * Coverage Target: >80%
 *
 * Tests ProfileSetupScreen component for US-1.3:
 * - Rendering and UI elements
 * - Form interactions (inputs, toggles, buttons)
 * - Image upload and preview
 * - Validation error display
 * - Navigation (skip, save)
 * - Loading states
 */

import React from 'react';
import { renderWithProviders, createMockNavigation, createMockRoute, screen, fireEvent, waitFor } from '../test-utils';
import { launchImageLibrary } from 'react-native-image-picker';

import ProfileSetupScreen from '@/screens/auth/ProfileSetupScreen';
import {
  createProfileFactory,
  createValidJPGImageFactory,
  createOversizedImageFactory,
} from '../test-factories/profile.factory';

// ==================== MOCKS ====================

// Mock image picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

const mockLaunchImageLibrary = launchImageLibrary as jest.MockedFunction<typeof launchImageLibrary>;

// ==================== TEST SETUP ====================

const mockNavigation = createMockNavigation();
const mockRoute = createMockRoute({ userId: 'user-123', email: 'test@example.com' });

describe('ProfileSetupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ==================== RENDERING TESTS ====================

  describe('Rendering', () => {
    it('should render successfully', () => {
      // Arrange & Act
      renderWithProviders(<ProfileSetupScreen />);

      // Assert
      expect(screen.getByTestId('profile-setup-screen')).toBeTruthy();
    });

    it('should render screen title', () => {
      // Arrange & Act
      renderWithProviders(<ProfileSetupScreen />);

      // Assert
      expect(screen.getByText('Complete Your Profile')).toBeTruthy();
    });

    it('should render full name input', () => {
      // Arrange & Act
      renderWithProviders(<ProfileSetupScreen />);

      // Assert
      expect(screen.getByTestId('full-name-input')).toBeTruthy();
      expect(screen.getByText('Full Name')).toBeTruthy();
    });

    it('should render phone number input', () => {
      // Arrange & Act
      renderWithProviders(<ProfileSetupScreen />);

      // Assert
      expect(screen.getByTestId('phone-input')).toBeTruthy();
      expect(screen.getByText(/Phone Number/)).toBeTruthy();
    });

    it('should render timezone picker', () => {
      // Arrange & Act
      renderWithProviders(<ProfileSetupScreen />);

      // Assert
      expect(screen.getByTestId('timezone-picker')).toBeTruthy();
      expect(screen.getByText('Timezone')).toBeTruthy();
    });

    it('should render profile picture upload button', () => {
      // Arrange & Act
      renderWithProviders(<ProfileSetupScreen />);

      // Assert
      expect(screen.getByTestId('upload-avatar-button')).toBeTruthy();
      expect(screen.getByText(/Upload Profile Picture/)).toBeTruthy();
    });

    it('should render notification preference toggles', () => {
      // Arrange & Act
      renderWithProviders(<ProfileSetupScreen />);

      // Assert
      expect(screen.getByTestId('email-notifications-toggle')).toBeTruthy();
      expect(screen.getByTestId('push-notifications-toggle')).toBeTruthy();
      expect(screen.getByText('Email Notifications')).toBeTruthy();
      expect(screen.getByText('Push Notifications')).toBeTruthy();
    });

    it('should render reminder frequency picker', () => {
      // Arrange & Act
      renderWithProviders(<ProfileSetupScreen />);

      // Assert
      expect(screen.getByTestId('reminder-frequency-picker')).toBeTruthy();
      expect(screen.getByText('Reminder Frequency')).toBeTruthy();
    });

    it('should render Save Profile button', () => {
      // Arrange & Act
      renderWithProviders(<ProfileSetupScreen />);

      // Assert
      expect(screen.getByTestId('save-profile-button')).toBeTruthy();
      expect(screen.getByText('Save Profile')).toBeTruthy();
    });

    it('should render Skip button', () => {
      // Arrange & Act
      renderWithProviders(<ProfileSetupScreen />);

      // Assert
      expect(screen.getByTestId('skip-button')).toBeTruthy();
      expect(screen.getByText('Skip for now')).toBeTruthy();
    });
  });

  // ==================== FORM INTERACTION TESTS ====================

  describe('Form Interactions', () => {
    it('should update full name input value', () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const input = screen.getByTestId('full-name-input');

      // Act
      fireEvent.changeText(input, 'John Doe');

      // Assert
      expect(input.props.value).toBe('John Doe');
    });

    it('should update phone number input value', () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const input = screen.getByTestId('phone-input');

      // Act
      fireEvent.changeText(input, '+12125551234');

      // Assert
      expect(input.props.value).toBe('+12125551234');
    });

    it('should update timezone selection', () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const picker = screen.getByTestId('timezone-picker');

      // Act
      fireEvent(picker, 'onValueChange', 'America/New_York');

      // Assert
      expect(picker.props.selectedValue).toBe('America/New_York');
    });

    it('should toggle email notifications', () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const toggle = screen.getByTestId('email-notifications-toggle');

      // Act
      fireEvent(toggle, 'onValueChange', true);

      // Assert
      expect(toggle.props.value).toBe(true);
    });

    it('should toggle push notifications', () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const toggle = screen.getByTestId('push-notifications-toggle');

      // Act
      fireEvent(toggle, 'onValueChange', false);

      // Assert
      expect(toggle.props.value).toBe(false);
    });

    it('should update reminder frequency', () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const picker = screen.getByTestId('reminder-frequency-picker');

      // Act
      fireEvent(picker, 'onValueChange', 'weekly');

      // Assert
      expect(picker.props.selectedValue).toBe('weekly');
    });
  });

  // ==================== IMAGE UPLOAD TESTS ====================

  describe('Image Upload', () => {
    it('should open image picker when upload button pressed', async () => {
      // Arrange
      mockLaunchImageLibrary.mockImplementation((options, callback) => {
        callback?.({ didCancel: true });
      });

      renderWithProviders(<ProfileSetupScreen />);
      const uploadButton = screen.getByTestId('upload-avatar-button');

      // Act
      fireEvent.press(uploadButton);

      // Assert
      await waitFor(() => {
        expect(mockLaunchImageLibrary).toHaveBeenCalled();
      });
    });

    it('should display image preview after selection', async () => {
      // Arrange
      const mockImage = createValidJPGImageFactory();
      mockLaunchImageLibrary.mockImplementation((options, callback) => {
        callback?.({
          assets: [{
            uri: mockImage.uri,
            type: mockImage.type,
            fileName: mockImage.name,
            fileSize: mockImage.size,
          }],
        });
      });

      renderWithProviders(<ProfileSetupScreen />);
      const uploadButton = screen.getByTestId('upload-avatar-button');

      // Act
      fireEvent.press(uploadButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('avatar-preview')).toBeTruthy();
      });
    });

    it('should show default avatar when no image selected', () => {
      // Arrange & Act
      renderWithProviders(<ProfileSetupScreen />);

      // Assert
      expect(screen.getByTestId('default-avatar')).toBeTruthy();
    });

    it('should handle image picker cancellation', async () => {
      // Arrange
      mockLaunchImageLibrary.mockImplementation((options, callback) => {
        callback?.({ didCancel: true });
      });

      renderWithProviders(<ProfileSetupScreen />);
      const uploadButton = screen.getByTestId('upload-avatar-button');

      // Act
      fireEvent.press(uploadButton);

      // Assert
      await waitFor(() => {
        expect(screen.queryByTestId('avatar-preview')).toBeNull();
      });
    });

    it('should display error for oversized image', async () => {
      // Arrange
      const oversizedImage = createOversizedImageFactory();
      mockLaunchImageLibrary.mockImplementation((options, callback) => {
        callback?.({
          assets: [{
            uri: oversizedImage.uri,
            type: oversizedImage.type,
            fileName: oversizedImage.name,
            fileSize: oversizedImage.size,
          }],
        });
      });

      renderWithProviders(<ProfileSetupScreen />);
      const uploadButton = screen.getByTestId('upload-avatar-button');

      // Act
      fireEvent.press(uploadButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/Image must be less than 5MB/)).toBeTruthy();
      });
    });
  });

  // ==================== VALIDATION TESTS ====================

  describe('Validation', () => {
    it('should display error for empty full name', async () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const saveButton = screen.getByTestId('save-profile-button');

      // Act
      fireEvent.press(saveButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/Full name is required/)).toBeTruthy();
      });
    });

    it('should display error for invalid full name', async () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const nameInput = screen.getByTestId('full-name-input');
      const saveButton = screen.getByTestId('save-profile-button');

      // Act
      fireEvent.changeText(nameInput, 'A');
      fireEvent.press(saveButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/Full name must be between 2 and 100 characters/)).toBeTruthy();
      });
    });

    it('should display error for invalid phone number', async () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const nameInput = screen.getByTestId('full-name-input');
      const phoneInput = screen.getByTestId('phone-input');
      const timezonePicker = screen.getByTestId('timezone-picker');
      const saveButton = screen.getByTestId('save-profile-button');

      // Act
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.changeText(phoneInput, '1234567890'); // Missing +
      fireEvent(timezonePicker, 'onValueChange', 'America/New_York');
      fireEvent.press(saveButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/Phone number must be in E.164 format/)).toBeTruthy();
      });
    });

    it('should display error for missing timezone', async () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const nameInput = screen.getByTestId('full-name-input');
      const saveButton = screen.getByTestId('save-profile-button');

      // Act
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.press(saveButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/Timezone is required/)).toBeTruthy();
      });
    });

    it('should clear validation errors when input is corrected', async () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const nameInput = screen.getByTestId('full-name-input');
      const saveButton = screen.getByTestId('save-profile-button');

      // Act - Submit with empty name
      fireEvent.press(saveButton);
      await waitFor(() => {
        expect(screen.getByText(/Full name is required/)).toBeTruthy();
      });

      // Act - Correct the name
      fireEvent.changeText(nameInput, 'John Doe');

      // Assert - Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/Full name is required/)).toBeNull();
      });
    });
  });

  // ==================== NAVIGATION TESTS ====================

  describe('Navigation', () => {
    it('should navigate to next screen on successful save', async () => {
      // Arrange
      const store = createTestStore();
      renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} route={mockRoute as any} />, { store });

      const nameInput = screen.getByTestId('full-name-input');
      const timezonePicker = screen.getByTestId('timezone-picker');
      const saveButton = screen.getByTestId('save-profile-button');

      // Act
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent(timezonePicker, 'onValueChange', 'America/New_York');
      fireEvent.press(saveButton);

      // Assert
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    it('should navigate when Skip button is pressed', () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const skipButton = screen.getByTestId('skip-button');

      // Act
      fireEvent.press(skipButton);

      // Assert
      expect(mockNavigate).toHaveBeenCalled();
    });

    it('should not navigate if validation fails', async () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const saveButton = screen.getByTestId('save-profile-button');

      // Act
      fireEvent.press(saveButton);

      // Assert
      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });

  // ==================== LOADING STATE TESTS ====================

  describe('Loading States', () => {
    it('should show loading indicator during save', async () => {
      // Arrange
      const store = createTestStore();
      renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} route={mockRoute as any} />, { store });

      const nameInput = screen.getByTestId('full-name-input');
      const timezonePicker = screen.getByTestId('timezone-picker');
      const saveButton = screen.getByTestId('save-profile-button');

      // Act
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent(timezonePicker, 'onValueChange', 'America/New_York');
      fireEvent.press(saveButton);

      // Assert
      expect(screen.getByTestId('loading-indicator')).toBeTruthy();
    });

    it('should disable save button while loading', async () => {
      // Arrange
      const store = createTestStore({
        profile: {
          profile: null,
          loading: true,
          error: null,
          avatarUploading: false,
        },
      });
      renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} route={mockRoute as any} />, { store });

      const saveButton = screen.getByTestId('save-profile-button');

      // Assert
      expect(saveButton.props.disabled).toBe(true);
    });

    it('should show uploading indicator during image upload', async () => {
      // Arrange
      const store = createTestStore({
        profile: {
          profile: null,
          loading: false,
          error: null,
          avatarUploading: true,
        },
      });
      renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} route={mockRoute as any} />, { store });

      // Assert
      expect(screen.getByTestId('avatar-uploading-indicator')).toBeTruthy();
    });
  });

  // ==================== ERROR HANDLING TESTS ====================

  describe('Error Handling', () => {
    it('should display error message from Redux store', () => {
      // Arrange
      const errorMessage = 'Failed to update profile';
      const store = createTestStore({
        profile: {
          profile: null,
          loading: false,
          error: errorMessage,
          avatarUploading: false,
        },
      });

      // Act
      renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} route={mockRoute as any} />, { store });

      // Assert
      expect(screen.getByText(errorMessage)).toBeTruthy();
    });

    it('should allow retry after error', async () => {
      // Arrange
      const store = createTestStore({
        profile: {
          profile: null,
          loading: false,
          error: 'Network error',
          avatarUploading: false,
        },
      });
      renderWithProviders(<ProfileSetupScreen navigation={mockNavigation as any} route={mockRoute as any} />, { store });

      const nameInput = screen.getByTestId('full-name-input');
      const timezonePicker = screen.getByTestId('timezone-picker');
      const saveButton = screen.getByTestId('save-profile-button');

      // Act
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent(timezonePicker, 'onValueChange', 'America/New_York');
      fireEvent.press(saveButton);

      // Assert - Should attempt save again
      await waitFor(() => {
        expect(saveButton.props.disabled).toBe(false);
      });
    });

    it('should handle image picker error', async () => {
      // Arrange
      mockLaunchImageLibrary.mockImplementation((options, callback) => {
        callback?.({ errorCode: 'camera_unavailable', errorMessage: 'Camera not available' });
      });

      renderWithProviders(<ProfileSetupScreen />);
      const uploadButton = screen.getByTestId('upload-avatar-button');

      // Act
      fireEvent.press(uploadButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/Camera not available/)).toBeTruthy();
      });
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle rapid button presses', async () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const skipButton = screen.getByTestId('skip-button');

      // Act - Rapid clicks
      fireEvent.press(skipButton);
      fireEvent.press(skipButton);
      fireEvent.press(skipButton);

      // Assert - Should only navigate once
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle special characters in name', async () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const nameInput = screen.getByTestId('full-name-input');
      const timezonePicker = screen.getByTestId('timezone-picker');
      const saveButton = screen.getByTestId('save-profile-button');

      // Act
      fireEvent.changeText(nameInput, "Mary O'Brien-Smith");
      fireEvent(timezonePicker, 'onValueChange', 'America/New_York');
      fireEvent.press(saveButton);

      // Assert - Should accept valid name with special chars
      await waitFor(() => {
        expect(screen.queryByText(/can only contain letters/)).toBeNull();
      });
    });

    it('should trim whitespace from inputs', async () => {
      // Arrange
      renderWithProviders(<ProfileSetupScreen />);
      const nameInput = screen.getByTestId('full-name-input');
      const timezonePicker = screen.getByTestId('timezone-picker');
      const saveButton = screen.getByTestId('save-profile-button');

      // Act
      fireEvent.changeText(nameInput, '  John Doe  ');
      fireEvent(timezonePicker, 'onValueChange', 'America/New_York');
      fireEvent.press(saveButton);

      // Assert - Should trim and accept
      await waitFor(() => {
        expect(nameInput.props.value).toBe('John Doe');
      });
    });
  });
});

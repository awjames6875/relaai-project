/**
 * PROFILE SLICE UNIT TESTS
 *
 * Component: profileSlice
 * Created: 2025-11-02
 * Author: QA Agent (Claude)
 *
 * Test Framework: Jest + Redux Toolkit
 * Coverage Target: >90%
 *
 * Tests Redux slice for US-1.3 Profile Setup:
 * - Async thunks (updateProfile, uploadAvatar)
 * - Reducers (pending, fulfilled, rejected states)
 * - Selectors
 * - State management
 */

import { configureStore } from '@reduxjs/toolkit';
import type { Store } from '@reduxjs/toolkit';
import profileReducer, {
  updateProfile,
  uploadAvatar,
  selectProfile,
  selectProfileLoading,
  selectProfileError,
  selectAvatarUploading,
  resetProfileError,
  type ProfileState,
} from '@/store/slices/profileSlice';

import { supabase } from '@/services/supabase';
import {
  createProfileFactory,
  createUpdateProfileDTOFactory,
  createValidJPGImageFactory,
  createOversizedImageFactory,
  type ProfileUpdatePayload,
} from '../../factories/profile.factory';

// ==================== MOCKS ====================

// Mock Supabase client
jest.mock('@/services/supabase', () => ({
  supabase: {
    from: jest.fn(),
    storage: {
      from: jest.fn(),
    },
    auth: {
      getUser: jest.fn(),
    },
  },
}));

// ==================== TEST SETUP ====================

interface RootState {
  profile: ProfileState;
}

const createTestStore = (preloadedState?: Partial<RootState>): Store => {
  return configureStore({
    reducer: {
      profile: profileReducer,
    },
    preloadedState: preloadedState as any,
  });
};

const mockSupabaseFrom = supabase.from as jest.MockedFunction<typeof supabase.from>;
const mockSupabaseStorage = supabase.storage.from as jest.MockedFunction<typeof supabase.storage.from>;
const mockGetUser = supabase.auth.getUser as jest.MockedFunction<typeof supabase.auth.getUser>;

describe('profileSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ==================== INITIAL STATE TESTS ====================

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      // Arrange & Act
      const store = createTestStore();
      const state = store.getState().profile;

      // Assert
      expect(state.profile).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.avatarUploading).toBe(false);
    });
  });

  // ==================== REDUCER TESTS ====================

  describe('Reducers', () => {
    describe('resetProfileError', () => {
      it('should reset error to null', () => {
        // Arrange
        const store = createTestStore({
          profile: {
            profile: null,
            loading: false,
            error: 'Some error',
            avatarUploading: false,
          },
        });

        // Act
        store.dispatch(resetProfileError());
        const state = store.getState().profile;

        // Assert
        expect(state.error).toBeNull();
      });

      it('should not affect other state properties', () => {
        // Arrange
        const mockProfile = createProfileFactory();
        const store = createTestStore({
          profile: {
            profile: mockProfile,
            loading: true,
            error: 'Some error',
            avatarUploading: true,
          },
        });

        // Act
        store.dispatch(resetProfileError());
        const state = store.getState().profile;

        // Assert
        expect(state.profile).toEqual(mockProfile);
        expect(state.loading).toBe(true);
        expect(state.avatarUploading).toBe(true);
      });
    });
  });

  // ==================== SELECTORS TESTS ====================

  describe('Selectors', () => {
    it('selectProfile should return profile from state', () => {
      // Arrange
      const mockProfile = createProfileFactory();
      const state: RootState = {
        profile: {
          profile: mockProfile,
          loading: false,
          error: null,
          avatarUploading: false,
        },
      };

      // Act
      const result = selectProfile(state);

      // Assert
      expect(result).toEqual(mockProfile);
    });

    it('selectProfileLoading should return loading state', () => {
      // Arrange
      const state: RootState = {
        profile: {
          profile: null,
          loading: true,
          error: null,
          avatarUploading: false,
        },
      };

      // Act
      const result = selectProfileLoading(state);

      // Assert
      expect(result).toBe(true);
    });

    it('selectProfileError should return error message', () => {
      // Arrange
      const errorMessage = 'Failed to update profile';
      const state: RootState = {
        profile: {
          profile: null,
          loading: false,
          error: errorMessage,
          avatarUploading: false,
        },
      };

      // Act
      const result = selectProfileError(state);

      // Assert
      expect(result).toBe(errorMessage);
    });

    it('selectAvatarUploading should return avatar upload state', () => {
      // Arrange
      const state: RootState = {
        profile: {
          profile: null,
          loading: false,
          error: null,
          avatarUploading: true,
        },
      };

      // Act
      const result = selectAvatarUploading(state);

      // Assert
      expect(result).toBe(true);
    });
  });

  // ==================== UPDATE PROFILE THUNK TESTS ====================

  describe('updateProfile async thunk', () => {
    const mockUserId = 'user-123';

    beforeEach(() => {
      // Mock getUser to return current user
      mockGetUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      } as any);
    });

    describe('Successful Profile Update', () => {
      it('should update profile successfully', async () => {
        // Arrange
        const updateData: ProfileUpdatePayload = {
          fullName: 'John Doe',
          phoneNumber: '+12125551234',
          timezone: 'America/New_York',
          notificationPreferences: {
            email: true,
            push: true,
            sms: false,
            reminderFrequency: 'weekly',
          },
        };

        const updatedProfile = createProfileFactory({
          id: mockUserId,
          ...updateData,
        });

        const mockUpdate = jest.fn().mockReturnThis();
        const mockEq = jest.fn().mockReturnThis();
        const mockSelect = jest.fn().mockResolvedValue({
          data: [updatedProfile],
          error: null,
        });

        mockSupabaseFrom.mockReturnValue({
          update: mockUpdate,
          eq: mockEq,
          select: mockSelect,
        } as any);

        const store = createTestStore();

        // Act
        const result = await store.dispatch(updateProfile(updateData));

        // Assert
        expect(result.type).toBe('profile/updateProfile/fulfilled');
        expect(result.payload).toEqual(updatedProfile);

        const state = store.getState().profile;
        expect(state.profile).toEqual(updatedProfile);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
      });

      it('should set loading to true while updating', async () => {
        // Arrange
        const updateData = createUpdateProfileDTOFactory();
        const updatedProfile = createProfileFactory();

        const mockUpdate = jest.fn().mockReturnThis();
        const mockEq = jest.fn().mockReturnThis();
        const mockSelect = jest.fn().mockImplementation(() => {
          // Return promise that doesn't resolve immediately
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({ data: [updatedProfile], error: null });
            }, 100);
          });
        });

        mockSupabaseFrom.mockReturnValue({
          update: mockUpdate,
          eq: mockEq,
          select: mockSelect,
        } as any);

        const store = createTestStore();

        // Act
        const promise = store.dispatch(updateProfile(updateData as any));

        // Assert - Check loading state immediately
        expect(store.getState().profile.loading).toBe(true);

        // Wait for completion
        await promise;
        expect(store.getState().profile.loading).toBe(false);
      });

      it('should call Supabase update with correct parameters', async () => {
        // Arrange
        const updateData: ProfileUpdatePayload = {
          fullName: 'Jane Smith',
          timezone: 'America/Los_Angeles',
          notificationPreferences: {
            email: false,
            push: true,
            sms: false,
            reminderFrequency: 'daily',
          },
        };

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

        const store = createTestStore();

        // Act
        await store.dispatch(updateProfile(updateData));

        // Assert
        expect(mockSupabaseFrom).toHaveBeenCalledWith('profiles');
        expect(mockUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            full_name: updateData.fullName,
            timezone: updateData.timezone,
            notification_preferences: updateData.notificationPreferences,
          })
        );
        expect(mockEq).toHaveBeenCalledWith('user_id', mockUserId);
      });

      it('should handle optional phone number', async () => {
        // Arrange
        const updateData: ProfileUpdatePayload = {
          fullName: 'John Doe',
          phoneNumber: undefined,
          timezone: 'UTC',
          notificationPreferences: {
            email: true,
            push: false,
            sms: false,
            reminderFrequency: 'monthly',
          },
        };

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

        const store = createTestStore();

        // Act
        await store.dispatch(updateProfile(updateData));

        // Assert
        expect(mockUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            phone: null,
          })
        );
      });
    });

    describe('Failed Profile Update', () => {
      it('should handle Supabase error', async () => {
        // Arrange
        const updateData = createUpdateProfileDTOFactory();
        const errorMessage = 'Database error';

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

        const store = createTestStore();

        // Act
        const result = await store.dispatch(updateProfile(updateData as any));

        // Assert
        expect(result.type).toBe('profile/updateProfile/rejected');
        expect(result.payload).toBe(errorMessage);

        const state = store.getState().profile;
        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.profile).toBeNull();
      });

      it('should handle no data returned', async () => {
        // Arrange
        const updateData = createUpdateProfileDTOFactory();

        const mockUpdate = jest.fn().mockReturnThis();
        const mockEq = jest.fn().mockReturnThis();
        const mockSelect = jest.fn().mockResolvedValue({
          data: [],
          error: null,
        });

        mockSupabaseFrom.mockReturnValue({
          update: mockUpdate,
          eq: mockEq,
          select: mockSelect,
        } as any);

        const store = createTestStore();

        // Act
        const result = await store.dispatch(updateProfile(updateData as any));

        // Assert
        expect(result.type).toBe('profile/updateProfile/rejected');
        expect(result.payload).toBe('Failed to update profile');
      });

      it('should handle network error', async () => {
        // Arrange
        const updateData = createUpdateProfileDTOFactory();

        mockSupabaseFrom.mockImplementation(() => {
          throw new Error('Network error');
        });

        const store = createTestStore();

        // Act
        const result = await store.dispatch(updateProfile(updateData as any));

        // Assert
        expect(result.type).toBe('profile/updateProfile/rejected');
        expect(result.payload).toContain('Network error');
      });

      it('should handle missing user authentication', async () => {
        // Arrange
        const updateData = createUpdateProfileDTOFactory();

        mockGetUser.mockResolvedValue({
          data: { user: null },
          error: { message: 'Not authenticated' },
        } as any);

        const store = createTestStore();

        // Act
        const result = await store.dispatch(updateProfile(updateData as any));

        // Assert
        expect(result.type).toBe('profile/updateProfile/rejected');
        expect(result.payload).toBe('User not authenticated');
      });
    });
  });

  // ==================== UPLOAD AVATAR THUNK TESTS ====================

  describe('uploadAvatar async thunk', () => {
    const mockUserId = 'user-123';

    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      } as any);
    });

    describe('Successful Avatar Upload', () => {
      it('should upload avatar successfully', async () => {
        // Arrange
        const imageFile = createValidJPGImageFactory();
        const avatarUrl = `https://storage.supabase.com/avatars/${mockUserId}/avatar.jpg`;

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

        const store = createTestStore();

        // Act
        const result = await store.dispatch(uploadAvatar(imageFile));

        // Assert
        expect(result.type).toBe('profile/uploadAvatar/fulfilled');
        expect(result.payload).toBe(avatarUrl);

        const state = store.getState().profile;
        expect(state.avatarUploading).toBe(false);
        expect(state.error).toBeNull();
      });

      it('should set avatarUploading to true while uploading', async () => {
        // Arrange
        const imageFile = createValidJPGImageFactory();

        const mockUpload = jest.fn().mockImplementation(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({ data: { path: 'test.jpg' }, error: null });
            }, 100);
          });
        });

        const mockGetPublicUrl = jest.fn().mockReturnValue({
          data: { publicUrl: 'https://test.com/avatar.jpg' },
        });

        mockSupabaseStorage.mockReturnValue({
          upload: mockUpload,
          getPublicUrl: mockGetPublicUrl,
        } as any);

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

        const store = createTestStore();

        // Act
        const promise = store.dispatch(uploadAvatar(imageFile));

        // Assert - Check uploading state immediately
        expect(store.getState().profile.avatarUploading).toBe(true);

        // Wait for completion
        await promise;
        expect(store.getState().profile.avatarUploading).toBe(false);
      });

      it('should call storage upload with correct parameters', async () => {
        // Arrange
        const imageFile = createValidJPGImageFactory();

        const mockUpload = jest.fn().mockResolvedValue({
          data: { path: 'test.jpg' },
          error: null,
        });

        const mockGetPublicUrl = jest.fn().mockReturnValue({
          data: { publicUrl: 'https://test.com/avatar.jpg' },
        });

        mockSupabaseStorage.mockReturnValue({
          upload: mockUpload,
          getPublicUrl: mockGetPublicUrl,
        } as any);

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

        const store = createTestStore();

        // Act
        await store.dispatch(uploadAvatar(imageFile));

        // Assert
        expect(mockSupabaseStorage).toHaveBeenCalledWith('avatars');
        expect(mockUpload).toHaveBeenCalledWith(
          `${mockUserId}/avatar.jpg`,
          expect.any(Object),
          expect.objectContaining({
            upsert: true,
            contentType: imageFile.type,
          })
        );
      });
    });

    describe('Failed Avatar Upload', () => {
      it('should handle upload error', async () => {
        // Arrange
        const imageFile = createValidJPGImageFactory();
        const errorMessage = 'Upload failed';

        const mockUpload = jest.fn().mockResolvedValue({
          data: null,
          error: { message: errorMessage },
        });

        mockSupabaseStorage.mockReturnValue({
          upload: mockUpload,
        } as any);

        const store = createTestStore();

        // Act
        const result = await store.dispatch(uploadAvatar(imageFile));

        // Assert
        expect(result.type).toBe('profile/uploadAvatar/rejected');
        expect(result.payload).toBe(errorMessage);

        const state = store.getState().profile;
        expect(state.avatarUploading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });

      it('should handle network error during upload', async () => {
        // Arrange
        const imageFile = createValidJPGImageFactory();

        mockSupabaseStorage.mockImplementation(() => {
          throw new Error('Network error');
        });

        const store = createTestStore();

        // Act
        const result = await store.dispatch(uploadAvatar(imageFile));

        // Assert
        expect(result.type).toBe('profile/uploadAvatar/rejected');
        expect(result.payload).toContain('Network error');
      });

      it('should handle missing user authentication', async () => {
        // Arrange
        const imageFile = createValidJPGImageFactory();

        mockGetUser.mockResolvedValue({
          data: { user: null },
          error: { message: 'Not authenticated' },
        } as any);

        const store = createTestStore();

        // Act
        const result = await store.dispatch(uploadAvatar(imageFile));

        // Assert
        expect(result.type).toBe('profile/uploadAvatar/rejected');
        expect(result.payload).toBe('User not authenticated');
      });

      it('should handle profile update failure after upload', async () => {
        // Arrange
        const imageFile = createValidJPGImageFactory();

        const mockUpload = jest.fn().mockResolvedValue({
          data: { path: 'test.jpg' },
          error: null,
        });

        const mockGetPublicUrl = jest.fn().mockReturnValue({
          data: { publicUrl: 'https://test.com/avatar.jpg' },
        });

        mockSupabaseStorage.mockReturnValue({
          upload: mockUpload,
          getPublicUrl: mockGetPublicUrl,
        } as any);

        const mockUpdate = jest.fn().mockReturnThis();
        const mockEq = jest.fn().mockReturnThis();
        const mockSelect = jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Update failed' },
        });

        mockSupabaseFrom.mockReturnValue({
          update: mockUpdate,
          eq: mockEq,
          select: mockSelect,
        } as any);

        const store = createTestStore();

        // Act
        const result = await store.dispatch(uploadAvatar(imageFile));

        // Assert
        expect(result.type).toBe('profile/uploadAvatar/rejected');
        expect(result.payload).toBe('Update failed');
      });
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle concurrent updateProfile calls', async () => {
      // Arrange
      const updateData1 = createUpdateProfileDTOFactory({ fullName: 'User 1' });
      const updateData2 = createUpdateProfileDTOFactory({ fullName: 'User 2' });

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn()
        .mockResolvedValueOnce({
          data: [createProfileFactory({ fullName: 'User 1' })],
          error: null,
        })
        .mockResolvedValueOnce({
          data: [createProfileFactory({ fullName: 'User 2' })],
          error: null,
        });

      mockSupabaseFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
      } as any);

      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      } as any);

      const store = createTestStore();

      // Act
      const [result1, result2] = await Promise.all([
        store.dispatch(updateProfile(updateData1 as any)),
        store.dispatch(updateProfile(updateData2 as any)),
      ]);

      // Assert
      expect(result1.type).toBe('profile/updateProfile/fulfilled');
      expect(result2.type).toBe('profile/updateProfile/fulfilled');
      // Last update should win
      expect(store.getState().profile.profile?.fullName).toBe('User 2');
    });

    it('should maintain state integrity after failed update', async () => {
      // Arrange
      const initialProfile = createProfileFactory();
      const updateData = createUpdateProfileDTOFactory();

      const store = createTestStore({
        profile: {
          profile: initialProfile,
          loading: false,
          error: null,
          avatarUploading: false,
        },
      });

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      });

      mockSupabaseFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
      } as any);

      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      } as any);

      // Act
      await store.dispatch(updateProfile(updateData as any));

      // Assert - Original profile should remain unchanged
      const state = store.getState().profile;
      expect(state.profile).toEqual(initialProfile);
      expect(state.error).toBe('Update failed');
    });
  });
});

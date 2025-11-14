/**
 * Profile Redux Slice
 *
 * Manages profile state (profile data, loading, error).
 * Based on Epic 1: User Onboarding - US-1.3 Profile Setup requirements.
 *
 * Follows the same pattern as authSlice.ts for consistency.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { UserProfile, UpdateUserDTO } from '@contracts/data-contracts/dto-definitions';
import type { RootState } from '../index';

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
}

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: number; // 0-100 for avatar upload progress
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  uploadProgress: 0,
};

// Async thunk to fetch current user profile
export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Profile not found');
      }

      // Transform database response to UserProfile DTO
      const profile: UserProfile = {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        phoneNumber: data.phone_number,
        profilePictureUrl: data.profile_picture_url,
        timezone: data.timezone || 'UTC',
        subscriptionTier: data.subscription_tier || 'free',
        subscriptionStatus: data.subscription_status || 'active',
        onboardingCompleted: data.onboarding_completed || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Async thunk to update user profile
export const updateProfile = createAsyncThunk(
  'profile/update',
  async (
    {
      userId,
      updates,
      notificationPreferences,
    }: {
      userId: string;
      updates: UpdateUserDTO;
      notificationPreferences?: NotificationPreferences;
    },
    { rejectWithValue }
  ) => {
    try {
      // Prepare update data - transform from DTO to database schema
      const updateData: any = {};

      if (updates.fullName !== undefined) {
        updateData.full_name = updates.fullName;
      }

      if (updates.phoneNumber !== undefined) {
        updateData.phone_number = updates.phoneNumber;
      }

      if (updates.timezone !== undefined) {
        updateData.timezone = updates.timezone;
      }

      if (updates.profilePictureUrl !== undefined) {
        updateData.profile_picture_url = updates.profilePictureUrl;
      }

      if (notificationPreferences !== undefined) {
        updateData.notification_preferences = notificationPreferences;
      }

      // Always update the updated_at timestamp
      updateData.updated_at = new Date().toISOString();

      // Update profile in database
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Failed to update profile');
      }

      // Transform database response to UserProfile DTO
      const profile: UserProfile = {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        phoneNumber: data.phone_number,
        profilePictureUrl: data.profile_picture_url,
        timezone: data.timezone || 'UTC',
        subscriptionTier: data.subscription_tier || 'free',
        subscriptionStatus: data.subscription_status || 'active',
        onboardingCompleted: data.onboarding_completed || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return profile;
    } catch (error: any) {
      // Handle different types of errors
      if (error.code === 'PGRST116') {
        return rejectWithValue('Profile not found');
      }

      if (error.code === '23505') {
        return rejectWithValue('This information is already in use');
      }

      if (error.message?.includes('network')) {
        return rejectWithValue('Network error. Please check your connection and try again.');
      }

      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// Async thunk to upload profile avatar
export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async (
    {
      userId,
      file,
    }: {
      userId: string;
      file: {
        uri: string;
        type: string;
        name?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      // Determine file extension from type
      let fileExtension = 'jpg';
      if (file.type === 'image/png') {
        fileExtension = 'png';
      } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        fileExtension = 'jpg';
      }

      // Create file path: public/{userId}/avatar.{ext}
      const filePath = `public/${userId}/avatar.${fileExtension}`;

      // Fetch the file data from the URI (for React Native)
      const response = await fetch(file.uri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          contentType: file.type,
          upsert: true, // Replace existing file if present
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded avatar');
      }

      // Update profile with new avatar URL
      const { data: profileData, error: updateError } = await supabase
        .from('profiles')
        .update({
          profile_picture_url: urlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Return the new avatar URL
      return urlData.publicUrl;
    } catch (error: any) {
      // Handle storage-specific errors
      if (error.message?.includes('storage')) {
        return rejectWithValue('Failed to upload image. Please try again.');
      }

      if (error.message?.includes('size')) {
        return rejectWithValue('Image file is too large. Maximum size is 5MB.');
      }

      if (error.message?.includes('network')) {
        return rejectWithValue('Network error. Please check your connection and try again.');
      }

      return rejectWithValue(error.message || 'Failed to upload avatar');
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.isLoading = false;
      state.uploadProgress = 0;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Upload avatar
    builder
      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadProgress = 100;
        // Update profile picture URL in state
        if (state.profile) {
          state.profile.profilePictureUrl = action.payload;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.uploadProgress = 0;
      });
  },
});

// Actions
export const { clearError, clearProfile, setUploadProgress } = profileSlice.actions;

// Selectors
export const selectProfile = (state: RootState) => state.profile.profile;
export const selectProfileLoading = (state: RootState) => state.profile.isLoading;
export const selectProfileError = (state: RootState) => state.profile.error;
export const selectUploadProgress = (state: RootState) => state.profile.uploadProgress;
export const selectFullName = (state: RootState) => state.profile.profile?.fullName;
export const selectProfilePictureUrl = (state: RootState) => state.profile.profile?.profilePictureUrl;
export const selectTimezone = (state: RootState) => state.profile.profile?.timezone;
export const selectOnboardingCompleted = (state: RootState) =>
  state.profile.profile?.onboardingCompleted || false;

// Reducer
export default profileSlice.reducer;

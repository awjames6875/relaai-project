/**
 * Profile Service
 *
 * Handles all profile operations using Supabase.
 * Provides methods for profile CRUD operations and avatar uploads.
 *
 * Based on: contracts/database-contracts/schema.sql (profiles table)
 * Based on: contracts/data-contracts/dto-definitions.ts (UserProfile, UpdateUserDTO)
 */

import { supabase } from './supabase';
import { UserProfile, UpdateUserDTO } from '@contracts/data-contracts/dto-definitions';

// ==================== ERROR TYPES ====================

export interface ServiceError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface DatabaseError extends ServiceError {
  type: 'database';
}

export interface StorageError extends ServiceError {
  type: 'storage';
}

export interface ValidationError extends ServiceError {
  type: 'validation';
  field?: string;
}

// ==================== INPUT TYPES ====================

/**
 * Profile creation input (used during signup)
 */
export interface ProfileCreateInput {
  id: string; // user_id from auth.users
  email: string;
  fullName: string;
  phoneNumber?: string;
  timezone?: string;
}

/**
 * Profile update input
 */
export interface ProfileUpdateInput {
  fullName?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  timezone?: string;
  onboardingCompleted?: boolean;
}

/**
 * Notification preferences structure
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
}

// ==================== VALIDATION ====================

/**
 * Validate full name (2-100 characters, letters, spaces, hyphens, apostrophes only)
 */
const validateFullName = (fullName: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-']{2,100}$/;
  return nameRegex.test(fullName);
};

/**
 * Validate phone number (E.164 format: +[country code][number])
 */
const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Validate timezone (basic IANA format check)
 */
const validateTimezone = (timezone: string): boolean => {
  // Basic check for IANA timezone format (e.g., "America/New_York", "UTC", "Europe/London")
  const timezoneRegex = /^[A-Z][a-zA-Z_/]+$|^UTC$/;
  return timezoneRegex.test(timezone);
};

/**
 * Validate image file type
 */
const validateImageType = (file: File | Blob): boolean => {
  if (file instanceof File) {
    return ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
  }
  // For Blob, we assume type is set correctly
  return ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
};

/**
 * Validate image file size (max 5MB)
 */
const validateImageSize = (file: File | Blob): boolean => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  return file.size <= MAX_SIZE;
};

// ==================== DATABASE OPERATIONS ====================

/**
 * Get user profile by user ID
 *
 * @param userId - The user's ID (from auth.users)
 * @returns Profile data or error
 */
export const getProfile = async (userId: string) => {
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
      return {
        data: null,
        error: {
          type: 'database',
          message: 'Profile not found',
          code: 'PROFILE_NOT_FOUND',
        } as DatabaseError,
      };
    }

    // Map database columns to DTO format
    const profile: UserProfile = {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phoneNumber: data.phone_number || undefined,
      profilePictureUrl: data.profile_picture_url || undefined,
      timezone: data.timezone,
      subscriptionTier: data.subscription_tier,
      subscriptionStatus: data.subscription_status,
      onboardingCompleted: data.onboarding_completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: profile, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to fetch profile',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Create initial profile (called after signup)
 *
 * @param profileData - Profile creation data
 * @returns Created profile or error
 */
export const createProfile = async (profileData: ProfileCreateInput) => {
  try {
    // Validate required fields
    if (!profileData.fullName || !validateFullName(profileData.fullName)) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Full name must be 2-100 characters with letters, spaces, hyphens, or apostrophes only',
          code: 'INVALID_FULL_NAME',
          field: 'fullName',
        } as ValidationError,
      };
    }

    if (profileData.phoneNumber && !validatePhoneNumber(profileData.phoneNumber)) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Phone number must be in E.164 format (e.g., +1234567890)',
          code: 'INVALID_PHONE_NUMBER',
          field: 'phoneNumber',
        } as ValidationError,
      };
    }

    if (profileData.timezone && !validateTimezone(profileData.timezone)) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Invalid timezone format',
          code: 'INVALID_TIMEZONE',
          field: 'timezone',
        } as ValidationError,
      };
    }

    // Insert profile
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.fullName,
        phone_number: profileData.phoneNumber || null,
        timezone: profileData.timezone || 'UTC',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Map to DTO
    const profile: UserProfile = {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phoneNumber: data.phone_number || undefined,
      profilePictureUrl: data.profile_picture_url || undefined,
      timezone: data.timezone,
      subscriptionTier: data.subscription_tier,
      subscriptionStatus: data.subscription_status,
      onboardingCompleted: data.onboarding_completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: profile, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to create profile',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Update user profile
 *
 * @param userId - The user's ID
 * @param profileData - Partial profile data to update
 * @returns Updated profile or error
 */
export const updateProfile = async (userId: string, profileData: ProfileUpdateInput) => {
  try {
    // Validate fields if provided
    if (profileData.fullName !== undefined) {
      if (!validateFullName(profileData.fullName)) {
        return {
          data: null,
          error: {
            type: 'validation',
            message: 'Full name must be 2-100 characters with letters, spaces, hyphens, or apostrophes only',
            code: 'INVALID_FULL_NAME',
            field: 'fullName',
          } as ValidationError,
        };
      }
    }

    if (profileData.phoneNumber !== undefined && profileData.phoneNumber !== '') {
      if (!validatePhoneNumber(profileData.phoneNumber)) {
        return {
          data: null,
          error: {
            type: 'validation',
            message: 'Phone number must be in E.164 format (e.g., +1234567890)',
            code: 'INVALID_PHONE_NUMBER',
            field: 'phoneNumber',
          } as ValidationError,
        };
      }
    }

    if (profileData.timezone !== undefined && !validateTimezone(profileData.timezone)) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Invalid timezone format',
          code: 'INVALID_TIMEZONE',
          field: 'timezone',
        } as ValidationError,
      };
    }

    // Map DTO fields to database columns
    const updateData: Record<string, any> = {};
    if (profileData.fullName !== undefined) updateData.full_name = profileData.fullName;
    if (profileData.phoneNumber !== undefined) updateData.phone_number = profileData.phoneNumber || null;
    if (profileData.profilePictureUrl !== undefined) updateData.profile_picture_url = profileData.profilePictureUrl;
    if (profileData.timezone !== undefined) updateData.timezone = profileData.timezone;
    if (profileData.onboardingCompleted !== undefined) updateData.onboarding_completed = profileData.onboardingCompleted;

    // Update profile
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
      return {
        data: null,
        error: {
          type: 'database',
          message: 'Profile not found',
          code: 'PROFILE_NOT_FOUND',
        } as DatabaseError,
      };
    }

    // Map to DTO
    const profile: UserProfile = {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phoneNumber: data.phone_number || undefined,
      profilePictureUrl: data.profile_picture_url || undefined,
      timezone: data.timezone,
      subscriptionTier: data.subscription_tier,
      subscriptionStatus: data.subscription_status,
      onboardingCompleted: data.onboarding_completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: profile, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to update profile',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

// ==================== STORAGE OPERATIONS ====================

/**
 * Upload avatar image to Supabase Storage
 *
 * @param userId - The user's ID
 * @param imageFile - The image file to upload (File or Blob)
 * @returns Public URL of uploaded avatar or error
 */
export const uploadAvatar = async (userId: string, imageFile: File | Blob) => {
  try {
    // Validate file type
    if (!validateImageType(imageFile)) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Image must be JPG or PNG format',
          code: 'INVALID_IMAGE_TYPE',
          field: 'avatar',
        } as ValidationError,
      };
    }

    // Validate file size
    if (!validateImageSize(imageFile)) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Image size must be less than 5MB',
          code: 'IMAGE_TOO_LARGE',
          field: 'avatar',
        } as ValidationError,
      };
    }

    // Determine file extension
    const fileType = imageFile.type;
    const extension = fileType === 'image/png' ? 'png' : 'jpg';
    const filePath = `public/${userId}/avatar.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: true, // Replace existing file
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      return {
        data: null,
        error: {
          type: 'storage',
          message: 'Failed to get public URL for avatar',
          code: 'PUBLIC_URL_ERROR',
        } as StorageError,
      };
    }

    return { data: urlData.publicUrl, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'storage',
        message: error.message || 'Failed to upload avatar',
        code: error.code,
        details: error,
      } as StorageError,
    };
  }
};

/**
 * Delete avatar image from Supabase Storage
 *
 * @param userId - The user's ID
 * @returns Success status or error
 */
export const deleteAvatar = async (userId: string) => {
  try {
    // Try both extensions
    const paths = [
      `public/${userId}/avatar.jpg`,
      `public/${userId}/avatar.png`,
    ];

    // Delete both files (one will fail silently if it doesn't exist)
    const deletePromises = paths.map((path) =>
      supabase.storage.from('avatars').remove([path])
    );

    await Promise.all(deletePromises);

    return { error: null };
  } catch (error: any) {
    return {
      error: {
        type: 'storage',
        message: error.message || 'Failed to delete avatar',
        code: error.code,
        details: error,
      } as StorageError,
    };
  }
};

// ==================== COMBINED OPERATIONS ====================

/**
 * Update profile with avatar upload
 * Convenience method that uploads avatar and updates profile in one operation
 *
 * @param userId - The user's ID
 * @param profileData - Profile update data
 * @param avatarFile - Optional avatar file to upload
 * @returns Updated profile or error
 */
export const updateProfileWithAvatar = async (
  userId: string,
  profileData: ProfileUpdateInput,
  avatarFile?: File | Blob
) => {
  try {
    let avatarUrl: string | undefined;

    // Upload avatar if provided
    if (avatarFile) {
      const { data: uploadedUrl, error: uploadError } = await uploadAvatar(userId, avatarFile);
      if (uploadError) {
        return { data: null, error: uploadError };
      }
      avatarUrl = uploadedUrl;
    }

    // Update profile with avatar URL
    const updateData = {
      ...profileData,
      profilePictureUrl: avatarUrl || profileData.profilePictureUrl,
    };

    return await updateProfile(userId, updateData);
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to update profile with avatar',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

// Export validation functions for use in components
export const validators = {
  validateFullName,
  validatePhoneNumber,
  validateTimezone,
  validateImageType,
  validateImageSize,
};

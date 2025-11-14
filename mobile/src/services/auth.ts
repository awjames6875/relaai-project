/**
 * Authentication Service
 *
 * Handles all authentication operations using Supabase Auth.
 * Provides methods for signup, login, logout, and session management.
 *
 * Based on: contracts/api-contracts/auth-endpoints.yaml
 */

import { supabase } from './supabase';
import { UserLoginDTO, UserRegistrationDTO } from '@contracts/data-contracts/dto-definitions';

export interface AuthError {
  message: string;
  code?: string;
}

/**
 * Register a new user
 */
export const signUp = async (userData: UserRegistrationDTO) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      throw error;
    }

    // Create profile after successful signup
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: userData.email,
        full_name: userData.fullName,
        phone_number: userData.phoneNumber,
        timezone: userData.timezone || 'UTC',
      });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Note: User is created, but profile creation failed
        // Should handle this gracefully in production
      }
    }

    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || 'Failed to create account',
        code: error.code,
      },
    };
  }
};

/**
 * Login user
 */
export const signIn = async (credentials: UserLoginDTO) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || 'Invalid email or password',
        code: error.code,
      },
    };
  }
};

/**
 * Logout user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { error: null };
  } catch (error: any) {
    return {
      error: {
        message: error.message || 'Failed to logout',
        code: error.code,
      },
    };
  }
};

/**
 * Get current session
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { data, error: error ? { message: error.message, code: error.code } : null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || 'Failed to get session',
        code: error.code,
      },
    };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    return { data, error: error ? { message: error.message, code: error.code } : null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || 'Failed to get user',
        code: error.code,
      },
    };
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw error;
    }
    return { error: null };
  } catch (error: any) {
    return {
      error: {
        message: error.message || 'Failed to send reset email',
        code: error.code,
      },
    };
  }
};


/**
 * Authentication Redux Slice
 *
 * Manages authentication state (user, session, loading, error).
 * Based on Epic 1: User Onboarding requirements.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '../../services/auth';
import { UserLoginDTO, UserRegistrationDTO } from '@contracts/data-contracts/dto-definitions';
import type { Session } from '@supabase/supabase-js';
import type { RootState } from '../index';

interface AuthState {
  user: any | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async (userData: UserRegistrationDTO, { rejectWithValue }) => {
    const { data, error } = await authService.signUp(userData);
    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const signInUser = createAsyncThunk(
  'auth/signIn',
  async (credentials: UserLoginDTO, { rejectWithValue }) => {
    const { data, error } = await authService.signIn(credentials);
    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const signOutUser = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  const { error } = await authService.signOut();
  if (error) {
    return rejectWithValue(error.message);
  }
});

export const loadSession = createAsyncThunk(
  'auth/loadSession',
  async (_, { rejectWithValue }) => {
    const { data, error } = await authService.getSession();
    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // Sign up
    builder
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = !!action.payload.session;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign in
    builder
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = !!action.payload.session;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign out
    builder
      .addCase(signOutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.session = null;
        state.isAuthenticated = false;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load session
    builder
      .addCase(loadSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.session = action.payload.session || null;
        state.user = action.payload.user || null;
        state.isAuthenticated = !!action.payload.session;
      })
      .addCase(loadSession.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setSession } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectSession = (state: RootState) => state.auth.session;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer;


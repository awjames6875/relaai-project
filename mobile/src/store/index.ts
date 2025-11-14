/**
 * Redux Store Configuration
 *
 * Central state management for RelaAI mobile app.
 * Uses Redux Toolkit for simplified Redux patterns.
 */

import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import profileSlice from './slices/profileSlice';
import contactSlice from './slices/contactSlice';
import messageSlice from './slices/messageSlice';
import relationshipSlice from './slices/relationshipSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    contacts: contactSlice,
    messages: messageSlice,
    relationships: relationshipSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Type exports for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


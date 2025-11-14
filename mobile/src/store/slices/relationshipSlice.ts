/**
 * Relationship Redux Slice
 *
 * Manages relationship state (relationships list, health scores, temperature, loading, error).
 * Based on Epic 4: Relationship Health Tracking requirements.
 *
 * Follows the same pattern as contactSlice.ts and messageSlice.ts for consistency.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchRelationships,
  getRelationshipByContactId,
  createOrUpdateRelationship,
  updateRelationshipNotes,
  updateLastContactDate,
  fetchRelationshipAnalytics,
  FetchRelationshipsParams,
} from '../../services/relationship';
import {
  Relationship,
  UpdateRelationshipDTO,
  RelationshipAnalytics,
} from '@contracts/data-contracts/dto-definitions';
import type { RootState } from '../index';

interface RelationshipsState {
  relationships: Relationship[];
  selectedRelationship: Relationship | null;
  analytics: RelationshipAnalytics | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    temperature?: 'cold' | 'warm' | 'hot';
    healthScoreMin?: number;
    healthScoreMax?: number;
  };
}

const initialState: RelationshipsState = {
  relationships: [],
  selectedRelationship: null,
  analytics: null,
  isLoading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchRelationshipsThunk = createAsyncThunk(
  'relationships/fetchRelationships',
  async ({ userId, params }: { userId: string; params?: FetchRelationshipsParams }, { rejectWithValue }) => {
    const result = await fetchRelationships(userId, params);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

export const fetchRelationshipByContactThunk = createAsyncThunk(
  'relationships/fetchRelationshipByContact',
  async ({ userId, contactId }: { userId: string; contactId: string }, { rejectWithValue }) => {
    const result = await getRelationshipByContactId(userId, contactId);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

export const createOrUpdateRelationshipThunk = createAsyncThunk(
  'relationships/createOrUpdate',
  async (
    {
      userId,
      contactId,
      relationshipData,
    }: { userId: string; contactId: string; relationshipData?: UpdateRelationshipDTO },
    { rejectWithValue }
  ) => {
    const result = await createOrUpdateRelationship(userId, contactId, relationshipData || {});
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

export const updateRelationshipNotesThunk = createAsyncThunk(
  'relationships/updateNotes',
  async (
    { userId, contactId, notes }: { userId: string; contactId: string; notes: string },
    { rejectWithValue }
  ) => {
    const result = await updateRelationshipNotes(userId, contactId, notes);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

export const updateLastContactDateThunk = createAsyncThunk(
  'relationships/updateLastContactDate',
  async ({ userId, contactId }: { userId: string; contactId: string }, { rejectWithValue }) => {
    const result = await updateLastContactDate(userId, contactId);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

export const fetchRelationshipAnalyticsThunk = createAsyncThunk(
  'relationships/fetchAnalytics',
  async (userId: string, { rejectWithValue }) => {
    const result = await fetchRelationshipAnalytics(userId);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

const relationshipSlice = createSlice({
  name: 'relationships',
  initialState,
  reducers: {
    setTemperatureFilter: (state, action: PayloadAction<'cold' | 'warm' | 'hot' | undefined>) => {
      state.filters.temperature = action.payload;
    },
    setHealthScoreFilter: (state, action: PayloadAction<{ min?: number; max?: number }>) => {
      state.filters.healthScoreMin = action.payload.min;
      state.filters.healthScoreMax = action.payload.max;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearSelectedRelationship: (state) => {
      state.selectedRelationship = null;
    },
    clearRelationships: (state) => {
      state.relationships = [];
      state.selectedRelationship = null;
      state.analytics = null;
      state.error = null;
      state.isLoading = false;
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Relationships
      .addCase(fetchRelationshipsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRelationshipsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.relationships = action.payload;
      })
      .addCase(fetchRelationshipsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Relationship By Contact
      .addCase(fetchRelationshipByContactThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedRelationship = null;
      })
      .addCase(fetchRelationshipByContactThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedRelationship = action.payload;
      })
      .addCase(fetchRelationshipByContactThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create or Update Relationship
      .addCase(createOrUpdateRelationshipThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrUpdateRelationshipThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.relationships.findIndex((r) => r.contactId === action.payload.contactId);
        if (index !== -1) {
          state.relationships[index] = action.payload;
        } else {
          state.relationships.push(action.payload);
        }
        if (state.selectedRelationship?.contactId === action.payload.contactId) {
          state.selectedRelationship = action.payload;
        }
      })
      .addCase(createOrUpdateRelationshipThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Relationship Notes
      .addCase(updateRelationshipNotesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRelationshipNotesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.relationships.findIndex((r) => r.contactId === action.payload.contactId);
        if (index !== -1) {
          state.relationships[index] = action.payload;
        }
        if (state.selectedRelationship?.contactId === action.payload.contactId) {
          state.selectedRelationship = action.payload;
        }
      })
      .addCase(updateRelationshipNotesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Last Contact Date
      .addCase(updateLastContactDateThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLastContactDateThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.relationships.findIndex((r) => r.contactId === action.payload.contactId);
        if (index !== -1) {
          state.relationships[index] = action.payload;
        }
        if (state.selectedRelationship?.contactId === action.payload.contactId) {
          state.selectedRelationship = action.payload;
        }
      })
      .addCase(updateLastContactDateThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Analytics
      .addCase(fetchRelationshipAnalyticsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRelationshipAnalyticsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchRelationshipAnalyticsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTemperatureFilter,
  setHealthScoreFilter,
  clearFilters,
  clearSelectedRelationship,
  clearRelationships,
} = relationshipSlice.actions;

// Selectors
export const selectRelationships = (state: RootState) => state.relationships.relationships;
export const selectRelationshipByContactId = (contactId: string) => (state: RootState) =>
  state.relationships.relationships.find((r) => r.contactId === contactId);
export const selectSelectedRelationship = (state: RootState) => state.relationships.selectedRelationship;
export const selectRelationshipAnalytics = (state: RootState) => state.relationships.analytics;
export const selectRelationshipsLoading = (state: RootState) => state.relationships.isLoading;
export const selectRelationshipsError = (state: RootState) => state.relationships.error;
export const selectRelationshipsFilters = (state: RootState) => state.relationships.filters;

// Derived selectors
export const selectColdRelationships = (state: RootState) =>
  state.relationships.relationships.filter((r) => r.temperature === 'cold');
export const selectWarmRelationships = (state: RootState) =>
  state.relationships.relationships.filter((r) => r.temperature === 'warm');
export const selectHotRelationships = (state: RootState) =>
  state.relationships.relationships.filter((r) => r.temperature === 'hot');

export default relationshipSlice.reducer;


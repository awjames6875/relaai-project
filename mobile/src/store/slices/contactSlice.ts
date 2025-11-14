/**
 * Contact Redux Slice
 *
 * Manages contact state (contacts list, loading, error, pagination).
 * Based on Epic 2: Contact Management requirements.
 *
 * Follows the same pattern as profileSlice.ts for consistency.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../../services/contact';
import { Contact, CreateContactDTO, UpdateContactDTO } from '@contracts/data-contracts/dto-definitions';
import type { RootState } from '../index';

interface ContactsState {
  contacts: Contact[];
  selectedContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters: {
    search?: string;
    relationshipType?: string;
  };
}

const initialState: ContactsState = {
  contacts: [],
  selectedContact: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasMore: false,
  },
  filters: {},
};

/**
 * Fetch paginated list of contacts
 */
export const fetchContactsList = createAsyncThunk(
  'contacts/fetch',
  async (
    {
      userId,
      page = 1,
      pageSize = 20,
      search,
      relationshipType,
    }: {
      userId: string;
      page?: number;
      pageSize?: number;
      search?: string;
      relationshipType?: string;
    },
    { rejectWithValue }
  ) => {
    const result = await fetchContacts(userId, {
      page,
      pageSize,
      search,
      relationshipType,
    });

    if (result.error) {
      return rejectWithValue(result.error.message);
    }

    return result;
  }
);

/**
 * Fetch a single contact by ID
 */
export const fetchContact = createAsyncThunk(
  'contacts/fetchOne',
  async (
    { userId, contactId }: { userId: string; contactId: string },
    { rejectWithValue }
  ) => {
    const result = await getContactById(userId, contactId);

    if (result.error) {
      return rejectWithValue(result.error.message);
    }

    return result.data;
  }
);

/**
 * Create a new contact
 */
export const createContactThunk = createAsyncThunk(
  'contacts/create',
  async (
    { userId, contactData }: { userId: string; contactData: CreateContactDTO },
    { rejectWithValue }
  ) => {
    const result = await createContact(userId, contactData);

    if (result.error) {
      return rejectWithValue(result.error.message);
    }

    return result.data;
  }
);

/**
 * Update an existing contact
 */
export const updateContactThunk = createAsyncThunk(
  'contacts/update',
  async (
    {
      userId,
      contactId,
      updates,
    }: {
      userId: string;
      contactId: string;
      updates: UpdateContactDTO;
    },
    { rejectWithValue }
  ) => {
    const result = await updateContact(userId, contactId, updates);

    if (result.error) {
      return rejectWithValue(result.error.message);
    }

    return result.data;
  }
);

/**
 * Delete a contact (soft delete)
 */
export const deleteContactThunk = createAsyncThunk(
  'contacts/delete',
  async (
    { userId, contactId }: { userId: string; contactId: string },
    { rejectWithValue }
  ) => {
    const result = await deleteContact(userId, contactId);

    if (result.error) {
      return rejectWithValue(result.error.message);
    }

    return contactId;
  }
);

// Slice
const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearContacts: (state) => {
      state.contacts = [];
      state.selectedContact = null;
      state.error = null;
      state.isLoading = false;
      state.pagination = initialState.pagination;
      state.filters = {};
    },
    setFilters: (
      state,
      action: PayloadAction<{ search?: string; relationshipType?: string }>
    ) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    // Fetch contacts list
    builder
      .addCase(fetchContactsList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContactsList.fulfilled, (state, action) => {
        state.isLoading = false;
        // For pagination: append if page > 1, replace if page 1
        const isFirstPage = action.meta.arg.page === 1;
        state.contacts = isFirstPage
          ? action.payload.data
          : [...state.contacts, ...action.payload.data];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchContactsList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch single contact
    builder
      .addCase(fetchContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedContact = action.payload;
      })
      .addCase(fetchContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create contact
    builder
      .addCase(createContactThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createContactThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add new contact to the list
        state.contacts.unshift(action.payload);
        // Update pagination
        state.pagination.totalItems += 1;
        state.pagination.totalPages = Math.ceil(
          state.pagination.totalItems / state.pagination.pageSize
        );
      })
      .addCase(createContactThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update contact
    builder
      .addCase(updateContactThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateContactThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update contact in the list
        const index = state.contacts.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        // Update selected contact if it's the one being updated
        if (state.selectedContact?.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
      })
      .addCase(updateContactThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete contact
    builder
      .addCase(deleteContactThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteContactThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove contact from the list
        state.contacts = state.contacts.filter((c) => c.id !== action.payload);
        // Clear selected contact if it was the deleted one
        if (state.selectedContact?.id === action.payload) {
          state.selectedContact = null;
        }
        // Update pagination
        state.pagination.totalItems -= 1;
        state.pagination.totalPages = Math.ceil(
          state.pagination.totalItems / state.pagination.pageSize
        );
      })
      .addCase(deleteContactThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, clearContacts, setFilters, clearFilters } = contactSlice.actions;

// Selectors
export const selectContacts = (state: RootState) => state.contacts.contacts;
export const selectSelectedContact = (state: RootState) => state.contacts.selectedContact;
export const selectContactsLoading = (state: RootState) => state.contacts.isLoading;
export const selectContactsError = (state: RootState) => state.contacts.error;
export const selectContactsPagination = (state: RootState) => state.contacts.pagination;
export const selectContactsFilters = (state: RootState) => state.contacts.filters;

// Reducer
export default contactSlice.reducer;


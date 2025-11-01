/**
 * Redux Slice Template
 *
 * This template demonstrates how to create a Redux Toolkit slice with:
 * - Normalized state structure
 * - Synchronous reducers
 * - Async thunks integration
 * - Type-safe state and actions
 *
 * @example
 * // Import this slice in your store configuration:
 * import exampleReducer from './slices/exampleSlice';
 *
 * export const store = configureStore({
 *   reducer: {
 *     example: exampleReducer,
 *   },
 * });
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../contracts/component-contracts/redux-types';
// TODO: Import relevant DTOs from contracts
// import { Contact, PaginationMetadata } from '../../contracts/data-contracts/dto-definitions';

// TODO: Import async thunks that this slice will handle
// import { fetchExampleData, createExampleItem } from './exampleThunks';

// ==================== STATE INTERFACE ====================

/**
 * Define the shape of this slice's state
 *
 * Best Practices:
 * - Use normalized state for collections (items as Record<id, item>)
 * - Separate loading states for different operations
 * - Include error messages for user feedback
 * - Add pagination metadata if needed
 */
interface ExampleState {
  // TODO: Replace with your actual entity type
  items: Record<string, any>; // Normalized: { [id]: item }
  ids: string[]; // Ordered list of IDs for maintaining order

  // Selection state
  selectedId: string | null;

  // Filter and sort state
  filterBy: 'all' | 'active' | 'archived'; // TODO: Replace with your filter options
  sortBy: 'name' | 'date' | 'priority'; // TODO: Replace with your sort options
  searchQuery: string;

  // Loading states - separate for different operations
  isLoading: boolean; // For initial fetch
  isRefreshing: boolean; // For pull-to-refresh
  isCreating: boolean; // For create operations
  isUpdating: boolean; // For update operations
  isDeleting: boolean; // For delete operations

  // Error state
  error: string | null;

  // Pagination
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };

  // TODO: Add any additional state properties specific to your feature
  // Examples:
  // - lastFetchedAt: string | null;
  // - isDirty: boolean; // For unsaved changes
  // - optimisticUpdates: Record<string, any>; // For optimistic UI
}

// ==================== INITIAL STATE ====================

/**
 * Initial state values
 *
 * Best Practices:
 * - Use sensible defaults that match the type definitions
 * - Initialize collections as empty objects/arrays
 * - Set boolean flags to false
 * - Set nullable fields to null
 */
const initialState: ExampleState = {
  items: {},
  ids: [],
  selectedId: null,
  filterBy: 'all',
  sortBy: 'name',
  searchQuery: '',
  isLoading: false,
  isRefreshing: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasMore: false,
  },
};

// ==================== SLICE DEFINITION ====================

/**
 * Redux Toolkit slice with reducers and extra reducers
 *
 * Reducers: Synchronous state updates
 * ExtraReducers: Handle async thunk actions (pending, fulfilled, rejected)
 */
const exampleSlice = createSlice({
  name: 'example', // TODO: Change to your feature name (e.g., 'contacts', 'messages')
  initialState,

  // ==================== SYNCHRONOUS REDUCERS ====================
  reducers: {
    /**
     * Set the selected item ID
     *
     * @param state - Current state
     * @param action - Action with item ID payload
     */
    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },

    /**
     * Update search query
     *
     * @param state - Current state
     * @param action - Action with search query string
     */
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      // TODO: Optionally reset pagination when search changes
      // state.pagination.page = 1;
    },

    /**
     * Set filter option
     *
     * @param state - Current state
     * @param action - Action with filter value
     */
    setFilter(state, action: PayloadAction<ExampleState['filterBy']>) {
      state.filterBy = action.payload;
      // TODO: Reset pagination when filter changes
      state.pagination.page = 1;
    },

    /**
     * Set sort option
     *
     * @param state - Current state
     * @param action - Action with sort value
     */
    setSort(state, action: PayloadAction<ExampleState['sortBy']>) {
      state.sortBy = action.payload;
    },

    /**
     * Clear error state
     *
     * Useful for dismissing error messages after user acknowledgment
     */
    clearError(state) {
      state.error = null;
    },

    /**
     * Reset the entire slice to initial state
     *
     * Useful for logout or clearing feature data
     */
    resetState() {
      return initialState;
    },

    // TODO: Add optimistic update reducers if needed
    /**
     * Optimistically add an item before API response
     *
     * @example
     * optimisticAdd(state, action: PayloadAction<{ tempId: string; item: any }>) {
     *   const { tempId, item } = action.payload;
     *   state.items[tempId] = { ...item, id: tempId, _isOptimistic: true };
     *   state.ids.unshift(tempId);
     * }
     */

    /**
     * Optimistically update an item before API response
     *
     * @example
     * optimisticUpdate(state, action: PayloadAction<{ id: string; updates: Partial<any> }>) {
     *   const { id, updates } = action.payload;
     *   if (state.items[id]) {
     *     state.items[id] = { ...state.items[id], ...updates, _isOptimistic: true };
     *   }
     * }
     */

    /**
     * Revert optimistic update on error
     *
     * @example
     * revertOptimistic(state, action: PayloadAction<string>) {
     *   const id = action.payload;
     *   delete state.items[id];
     *   state.ids = state.ids.filter(itemId => itemId !== id);
     * }
     */
  },

  // ==================== ASYNC THUNK HANDLERS ====================
  extraReducers: (builder) => {
    // TODO: Uncomment and implement handlers for your async thunks

    // Example: Fetch list of items
    /*
    builder
      .addCase(fetchExampleData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExampleData.fulfilled, (state, action) => {
        state.isLoading = false;

        // Normalize the data
        const items: Record<string, any> = {};
        const ids: string[] = [];

        action.payload.data.forEach((item: any) => {
          items[item.id] = item;
          ids.push(item.id);
        });

        state.items = items;
        state.ids = ids;

        // Update pagination
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchExampleData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch data';
      });
    */

    // Example: Create new item
    /*
    builder
      .addCase(createExampleItem.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createExampleItem.fulfilled, (state, action) => {
        state.isCreating = false;

        // Add the new item to normalized state
        const newItem = action.payload;
        state.items[newItem.id] = newItem;
        state.ids.unshift(newItem.id); // Add to beginning

        // Update total count
        state.pagination.totalItems += 1;

        // Select the newly created item
        state.selectedId = newItem.id;
      })
      .addCase(createExampleItem.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string || 'Failed to create item';
      });
    */

    // Example: Update item
    /*
    builder
      .addCase(updateExampleItem.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateExampleItem.fulfilled, (state, action) => {
        state.isUpdating = false;

        // Update the item in normalized state
        const updatedItem = action.payload;
        if (state.items[updatedItem.id]) {
          state.items[updatedItem.id] = updatedItem;
        }
      })
      .addCase(updateExampleItem.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string || 'Failed to update item';

        // TODO: Revert optimistic update if applicable
      });
    */

    // Example: Delete item
    /*
    builder
      .addCase(deleteExampleItem.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteExampleItem.fulfilled, (state, action) => {
        state.isDeleting = false;

        // Remove from normalized state
        const deletedId = action.payload;
        delete state.items[deletedId];
        state.ids = state.ids.filter(id => id !== deletedId);

        // Update total count
        state.pagination.totalItems -= 1;

        // Clear selection if deleted item was selected
        if (state.selectedId === deletedId) {
          state.selectedId = null;
        }
      })
      .addCase(deleteExampleItem.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string || 'Failed to delete item';
      });
    */

    // Example: Refresh (pull-to-refresh)
    /*
    builder
      .addCase(refreshExampleData.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshExampleData.fulfilled, (state, action) => {
        state.isRefreshing = false;

        // Replace all data with fresh data
        const items: Record<string, any> = {};
        const ids: string[] = [];

        action.payload.data.forEach((item: any) => {
          items[item.id] = item;
          ids.push(item.id);
        });

        state.items = items;
        state.ids = ids;

        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(refreshExampleData.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error = action.payload as string || 'Failed to refresh data';
      });
    */

    // TODO: Add more thunk handlers as needed:
    // - Fetch single item by ID
    // - Batch operations
    // - Import/export operations
    // - Search operations
  },
});

// ==================== EXPORTS ====================

// Export actions for use in components
export const {
  setSelectedId,
  setSearchQuery,
  setFilter,
  setSort,
  clearError,
  resetState,
} = exampleSlice.actions;

// Export reducer for store configuration
export default exampleSlice.reducer;

// ==================== TYPE EXPORTS ====================

// Export state type for selectors
export type { ExampleState };

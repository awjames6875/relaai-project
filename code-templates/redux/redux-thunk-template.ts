/**
 * Redux Async Thunk Template
 *
 * This template demonstrates how to create async thunks with Redux Toolkit:
 * - API integration with Supabase
 * - Error handling patterns
 * - Loading state management
 * - Optimistic updates
 * - Request cancellation
 *
 * @example
 * // Dispatch thunks from components:
 * import { useDispatch } from 'react-redux';
 * import { fetchExampleData, createExampleItem } from './exampleThunks';
 *
 * const MyComponent = () => {
 *   const dispatch = useDispatch();
 *
 *   useEffect(() => {
 *     dispatch(fetchExampleData());
 *   }, [dispatch]);
 * };
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../contracts/component-contracts/redux-types';
// TODO: Import your API service
// import * as exampleService from '../../services/exampleService';
// TODO: Import DTOs from contracts
// import type {
//   Contact,
//   CreateContactDTO,
//   UpdateContactDTO,
//   PaginatedResponse,
// } from '../../contracts/data-contracts/dto-definitions';

// ==================== TYPE DEFINITIONS ====================

/**
 * Error response structure from API
 */
interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

/**
 * Thunk API configuration
 * Provides typed access to state, dispatch, and rejection handling
 */
interface ThunkAPI {
  state: RootState;
  rejectValue: string;
}

// ==================== FETCH LIST ====================

/**
 * Fetch a paginated list of items
 *
 * Features:
 * - Pagination support
 * - Optional filtering
 * - Error handling
 * - Type-safe response
 *
 * @example
 * dispatch(fetchExampleData({ page: 1, pageSize: 20 }));
 */
export const fetchExampleData = createAsyncThunk<
  // Return type (fulfilled action payload)
  {
    data: any[]; // TODO: Replace 'any' with your DTO type
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasMore: boolean;
    };
  },
  // Argument type (what you pass when dispatching)
  {
    page?: number;
    pageSize?: number;
    filters?: Record<string, any>;
  } | void,
  // ThunkAPI type
  ThunkAPI
>(
  'example/fetchData', // Action type prefix (TODO: Change to your feature name)
  async (params, { rejectWithValue }) => {
    try {
      // TODO: Replace with your actual API service call
      // const response = await exampleService.fetchItems({
      //   page: params?.page || 1,
      //   pageSize: params?.pageSize || 20,
      //   ...params?.filters,
      // });

      // TODO: Remove mock data and use actual API response
      const mockResponse = {
        data: [],
        pagination: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 20,
          totalItems: 0,
          totalPages: 0,
          hasMore: false,
        },
      };

      return mockResponse;
    } catch (error: any) {
      // Handle and format error
      const errorMessage = error?.message || 'Failed to fetch data';
      console.error('[fetchExampleData] Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==================== FETCH SINGLE ITEM ====================

/**
 * Fetch a single item by ID
 *
 * Features:
 * - ID-based lookup
 * - Error handling for not found
 * - Type-safe response
 *
 * @example
 * dispatch(fetchExampleItemById('123'));
 */
export const fetchExampleItemById = createAsyncThunk<
  // Return type
  any, // TODO: Replace with your DTO type
  // Argument type
  string, // Item ID
  // ThunkAPI type
  ThunkAPI
>(
  'example/fetchById',
  async (itemId, { rejectWithValue }) => {
    try {
      // TODO: Replace with your actual API service call
      // const item = await exampleService.fetchItemById(itemId);

      // TODO: Remove mock data
      const mockItem = { id: itemId, name: 'Mock Item' };

      return mockItem;
    } catch (error: any) {
      const errorMessage = error?.message || `Failed to fetch item ${itemId}`;
      console.error('[fetchExampleItemById] Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==================== CREATE ITEM ====================

/**
 * Create a new item
 *
 * Features:
 * - Validation before API call
 * - Optimistic update support (see slice)
 * - Error handling
 * - Returns created item with server-generated ID
 *
 * @example
 * dispatch(createExampleItem({ name: 'New Item' }));
 */
export const createExampleItem = createAsyncThunk<
  // Return type (created item with ID)
  any, // TODO: Replace with your DTO type
  // Argument type (creation data)
  Partial<any>, // TODO: Replace with your CreateDTO type
  // ThunkAPI type
  ThunkAPI
>(
  'example/create',
  async (itemData, { rejectWithValue, getState }) => {
    try {
      // TODO: Add validation logic
      // if (!itemData.name || itemData.name.trim().length === 0) {
      //   return rejectWithValue('Name is required');
      // }

      // TODO: Replace with your actual API service call
      // const createdItem = await exampleService.createItem(itemData);

      // TODO: Remove mock data
      const mockCreatedItem = {
        id: Date.now().toString(),
        ...itemData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return mockCreatedItem;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create item';
      console.error('[createExampleItem] Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==================== UPDATE ITEM ====================

/**
 * Update an existing item
 *
 * Features:
 * - Partial updates (only changed fields)
 * - Optimistic update support
 * - Error handling with rollback
 *
 * @example
 * dispatch(updateExampleItem({ id: '123', updates: { name: 'Updated' } }));
 */
export const updateExampleItem = createAsyncThunk<
  // Return type (updated item)
  any, // TODO: Replace with your DTO type
  // Argument type
  {
    id: string;
    updates: Partial<any>; // TODO: Replace with your UpdateDTO type
  },
  // ThunkAPI type
  ThunkAPI
>(
  'example/update',
  async ({ id, updates }, { rejectWithValue, getState }) => {
    try {
      // TODO: Add validation logic
      // if (updates.name !== undefined && updates.name.trim().length === 0) {
      //   return rejectWithValue('Name cannot be empty');
      // }

      // TODO: Optional - Save original state for rollback
      // const state = getState();
      // const originalItem = state.example.items[id];

      // TODO: Replace with your actual API service call
      // const updatedItem = await exampleService.updateItem(id, updates);

      // TODO: Remove mock data
      const mockUpdatedItem = {
        id,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return mockUpdatedItem;
    } catch (error: any) {
      const errorMessage = error?.message || `Failed to update item ${id}`;
      console.error('[updateExampleItem] Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==================== DELETE ITEM ====================

/**
 * Delete an item (soft delete or hard delete)
 *
 * Features:
 * - Confirmation handling in component
 * - Optimistic delete support
 * - Error handling with rollback
 *
 * @example
 * dispatch(deleteExampleItem('123'));
 */
export const deleteExampleItem = createAsyncThunk<
  // Return type (deleted item ID)
  string,
  // Argument type
  string, // Item ID
  // ThunkAPI type
  ThunkAPI
>(
  'example/delete',
  async (itemId, { rejectWithValue, getState }) => {
    try {
      // TODO: Optional - Save original state for rollback
      // const state = getState();
      // const originalItem = state.example.items[itemId];

      // TODO: Replace with your actual API service call
      // await exampleService.deleteItem(itemId);

      // Mock successful deletion
      return itemId;
    } catch (error: any) {
      const errorMessage = error?.message || `Failed to delete item ${itemId}`;
      console.error('[deleteExampleItem] Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==================== REFRESH DATA ====================

/**
 * Refresh data (pull-to-refresh)
 *
 * Features:
 * - Separate loading state (isRefreshing)
 * - Replaces existing data
 * - Error handling
 *
 * @example
 * dispatch(refreshExampleData());
 */
export const refreshExampleData = createAsyncThunk<
  // Return type
  {
    data: any[]; // TODO: Replace with your DTO type
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasMore: boolean;
    };
  },
  // Argument type
  void,
  // ThunkAPI type
  ThunkAPI
>(
  'example/refresh',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get current pagination settings from state
      const state = getState();
      const { page, pageSize } = state.example.pagination;

      // TODO: Replace with your actual API service call
      // const response = await exampleService.fetchItems({ page: 1, pageSize });

      // TODO: Remove mock data
      const mockResponse = {
        data: [],
        pagination: {
          page: 1,
          pageSize,
          totalItems: 0,
          totalPages: 0,
          hasMore: false,
        },
      };

      return mockResponse;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to refresh data';
      console.error('[refreshExampleData] Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==================== BATCH OPERATIONS ====================

/**
 * Batch update multiple items
 *
 * Features:
 * - Update multiple items in one request
 * - All-or-nothing or partial success handling
 * - Progress tracking
 *
 * @example
 * dispatch(batchUpdateItems([
 *   { id: '1', updates: { status: 'active' } },
 *   { id: '2', updates: { status: 'active' } },
 * ]));
 */
export const batchUpdateItems = createAsyncThunk<
  // Return type (updated items)
  any[], // TODO: Replace with your DTO type array
  // Argument type
  Array<{ id: string; updates: Partial<any> }>,
  // ThunkAPI type
  ThunkAPI
>(
  'example/batchUpdate',
  async (updates, { rejectWithValue }) => {
    try {
      // TODO: Replace with your actual API service call
      // const updatedItems = await exampleService.batchUpdate(updates);

      // TODO: Remove mock data
      const mockUpdatedItems = updates.map(({ id, updates: itemUpdates }) => ({
        id,
        ...itemUpdates,
        updatedAt: new Date().toISOString(),
      }));

      return mockUpdatedItems;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to batch update items';
      console.error('[batchUpdateItems] Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Batch delete multiple items
 *
 * @example
 * dispatch(batchDeleteItems(['1', '2', '3']));
 */
export const batchDeleteItems = createAsyncThunk<
  // Return type (deleted item IDs)
  string[],
  // Argument type
  string[], // Array of item IDs
  // ThunkAPI type
  ThunkAPI
>(
  'example/batchDelete',
  async (itemIds, { rejectWithValue }) => {
    try {
      // TODO: Replace with your actual API service call
      // await exampleService.batchDelete(itemIds);

      // Mock successful deletion
      return itemIds;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to batch delete items';
      console.error('[batchDeleteItems] Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==================== SEARCH ====================

/**
 * Search items with debouncing handled in component
 *
 * Features:
 * - Full-text search
 * - Filter support
 * - Pagination
 *
 * @example
 * dispatch(searchExampleItems({ query: 'search term', filters: {} }));
 */
export const searchExampleItems = createAsyncThunk<
  // Return type
  {
    data: any[]; // TODO: Replace with your DTO type
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasMore: boolean;
    };
  },
  // Argument type
  {
    query: string;
    filters?: Record<string, any>;
    page?: number;
    pageSize?: number;
  },
  // ThunkAPI type
  ThunkAPI
>(
  'example/search',
  async ({ query, filters, page = 1, pageSize = 20 }, { rejectWithValue }) => {
    try {
      // TODO: Replace with your actual API service call
      // const response = await exampleService.searchItems({
      //   query,
      //   filters,
      //   page,
      //   pageSize,
      // });

      // TODO: Remove mock data
      const mockResponse = {
        data: [],
        pagination: {
          page,
          pageSize,
          totalItems: 0,
          totalPages: 0,
          hasMore: false,
        },
      };

      return mockResponse;
    } catch (error: any) {
      const errorMessage = error?.message || 'Search failed';
      console.error('[searchExampleItems] Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==================== OPTIMISTIC UPDATE EXAMPLE ====================

/**
 * Update item with optimistic UI pattern
 *
 * Steps:
 * 1. Dispatch optimistic update action (from slice)
 * 2. Make API call
 * 3. On success: Replace optimistic data with server data
 * 4. On failure: Revert optimistic update
 *
 * @example
 * // In component:
 * dispatch(optimisticUpdate({ id: '123', name: 'New Name' }));
 * dispatch(updateItemOptimistic({ id: '123', updates: { name: 'New Name' } }));
 */
export const updateItemOptimistic = createAsyncThunk<
  // Return type
  any, // TODO: Replace with your DTO type
  // Argument type
  {
    id: string;
    updates: Partial<any>;
  },
  // ThunkAPI type
  ThunkAPI
>(
  'example/updateOptimistic',
  async ({ id, updates }, { rejectWithValue, dispatch }) => {
    // TODO: Import optimistic update actions from slice
    // dispatch(optimisticUpdate({ id, updates }));

    try {
      // TODO: Replace with your actual API service call
      // const updatedItem = await exampleService.updateItem(id, updates);

      // TODO: Remove mock data
      const mockUpdatedItem = {
        id,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return mockUpdatedItem;
    } catch (error: any) {
      // TODO: Revert optimistic update on error
      // dispatch(revertOptimistic(id));

      const errorMessage = error?.message || `Failed to update item ${id}`;
      console.error('[updateItemOptimistic] Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==================== CONDITIONAL FETCH ====================

/**
 * Fetch data only if not already loaded or stale
 *
 * Features:
 * - Prevents unnecessary API calls
 * - Configurable staleness threshold
 * - Cache-first strategy
 *
 * @example
 * dispatch(fetchIfNeeded());
 */
export const fetchIfNeeded = createAsyncThunk<
  // Return type
  {
    data: any[];
    pagination: any;
  },
  // Argument type
  { force?: boolean } | void,
  // ThunkAPI type
  ThunkAPI
>(
  'example/fetchIfNeeded',
  async (params, { getState, rejectWithValue }) => {
    const state = getState();
    const { isLoading, ids } = state.example;

    // Don't fetch if already loading
    if (isLoading) {
      return rejectWithValue('Already loading');
    }

    // Don't fetch if data exists and not forced
    if (ids.length > 0 && !params?.force) {
      return rejectWithValue('Data already loaded');
    }

    // TODO: Check staleness
    // const lastFetchedAt = state.example.lastFetchedAt;
    // const staleThreshold = 5 * 60 * 1000; // 5 minutes
    // const isStale = !lastFetchedAt || Date.now() - new Date(lastFetchedAt).getTime() > staleThreshold;
    //
    // if (!isStale && !params?.force) {
    //   return rejectWithValue('Data is fresh');
    // }

    try {
      // TODO: Replace with your actual API service call
      // const response = await exampleService.fetchItems();

      // TODO: Remove mock data
      const mockResponse = {
        data: [],
        pagination: {
          page: 1,
          pageSize: 20,
          totalItems: 0,
          totalPages: 0,
          hasMore: false,
        },
      };

      return mockResponse;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to fetch data';
      console.error('[fetchIfNeeded] Error:', error);
      return rejectWithValue(errorMessage);
    }
  },
  {
    // Use condition to prevent dispatch
    condition: (params, { getState }) => {
      const state = getState();
      const { isLoading, ids } = state.example;

      // Don't dispatch if already loading
      if (isLoading) return false;

      // Don't dispatch if data exists and not forced
      if (ids.length > 0 && !params?.force) return false;

      return true;
    },
  }
);

// ==================== ERROR HANDLING HELPERS ====================

/**
 * Extract user-friendly error message from error object
 *
 * @param error - Error object from API or network
 * @returns User-friendly error message
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
}

/**
 * Check if error is a network error
 *
 * @param error - Error object
 * @returns True if network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error?.message?.includes('Network') ||
    error?.message?.includes('network') ||
    error?.code === 'NETWORK_ERROR'
  );
}

/**
 * Check if error is an authentication error
 *
 * @param error - Error object
 * @returns True if auth error
 */
export function isAuthError(error: any): boolean {
  return (
    error?.code === 401 ||
    error?.code === 403 ||
    error?.message?.includes('Unauthorized') ||
    error?.message?.includes('Forbidden')
  );
}

// ==================== USAGE IN COMPONENTS ====================

/**
 * COMPONENT USAGE EXAMPLES:
 *
 * @example
 * import { useDispatch, useSelector } from 'react-redux';
 * import { fetchExampleData, createExampleItem } from './exampleThunks';
 * import { selectIsLoading, selectError } from './exampleSelectors';
 *
 * const MyComponent = () => {
 *   const dispatch = useDispatch();
 *   const isLoading = useSelector(selectIsLoading);
 *   const error = useSelector(selectError);
 *
 *   // Fetch on mount
 *   useEffect(() => {
 *     dispatch(fetchExampleData());
 *   }, [dispatch]);
 *
 *   // Handle create
 *   const handleCreate = async () => {
 *     try {
 *       const result = await dispatch(createExampleItem({ name: 'New' })).unwrap();
 *       console.log('Created:', result);
 *     } catch (error) {
 *       console.error('Failed:', error);
 *     }
 *   };
 *
 *   // Handle refresh
 *   const handleRefresh = () => {
 *     dispatch(refreshExampleData());
 *   };
 *
 *   return (
 *     <View>
 *       {isLoading && <ActivityIndicator />}
 *       {error && <Text>Error: {error}</Text>}
 *       <Button onPress={handleCreate} title="Create" />
 *       <Button onPress={handleRefresh} title="Refresh" />
 *     </View>
 *   );
 * };
 */

/**
 * Redux Integration Test Template
 *
 * This template demonstrates how to test Redux slices, thunks, and selectors:
 * - Mock store setup
 * - Testing async thunks
 * - Testing selectors
 * - Testing reducers
 * - Integration with components
 *
 * @example
 * // Run tests:
 * npm test exampleSlice.test.ts
 */

import { configureStore } from '@reduxjs/toolkit';
import type { RootState } from '../../contracts/component-contracts/redux-types';

// TODO: Import your slice reducer
// import exampleReducer from './exampleSlice';
// TODO: Import your actions
// import { setSelectedId, setSearchQuery, setFilter } from './exampleSlice';
// TODO: Import your thunks
// import { fetchExampleData, createExampleItem, updateExampleItem, deleteExampleItem } from './exampleThunks';
// TODO: Import your selectors
// import { selectProcessedItems, selectSelectedItem, selectIsLoading } from './exampleSelectors';

// TODO: Import your API service to mock
// import * as exampleService from '../../services/exampleService';

// ==================== MOCK DATA ====================

/**
 * Mock data for testing
 *
 * Best Practices:
 * - Define reusable mock data at the top
 * - Use realistic data that matches your DTOs
 * - Include edge cases (empty arrays, null values, etc.)
 */
const mockItem = {
  id: '1',
  userId: 'user-1',
  name: 'Test Item',
  status: 'active',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

const mockItems = [
  mockItem,
  {
    id: '2',
    userId: 'user-1',
    name: 'Another Item',
    status: 'active',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
  },
  {
    id: '3',
    userId: 'user-1',
    name: 'Archived Item',
    status: 'archived',
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z',
  },
];

const mockPagination = {
  page: 1,
  pageSize: 20,
  totalItems: 3,
  totalPages: 1,
  hasMore: false,
};

const mockError = 'Something went wrong';

// ==================== TEST STORE SETUP ====================

/**
 * Create a test store with initial state
 *
 * @param initialState - Optional initial state
 * @returns Configured Redux store
 */
function createTestStore(initialState?: Partial<RootState>) {
  // TODO: Replace with your actual reducer
  const store = configureStore({
    reducer: {
      // example: exampleReducer,
      // TODO: Add other reducers if testing cross-slice behavior
    },
    preloadedState: initialState as any,
  });

  return store;
}

// ==================== MOCK API SERVICE ====================

// TODO: Mock your API service
// jest.mock('../../services/exampleService');
// const mockedService = exampleService as jest.Mocked<typeof exampleService>;

// ==================== REDUCER TESTS ====================

describe('Example Slice - Reducers', () => {
  /**
   * Test initial state
   */
  it('should return the initial state', () => {
    // TODO: Implement test
    // const state = exampleReducer(undefined, { type: 'unknown' });
    // expect(state).toEqual({
    //   items: {},
    //   ids: [],
    //   selectedId: null,
    //   filterBy: 'all',
    //   sortBy: 'name',
    //   searchQuery: '',
    //   isLoading: false,
    //   isRefreshing: false,
    //   isCreating: false,
    //   isUpdating: false,
    //   isDeleting: false,
    //   error: null,
    //   pagination: {
    //     page: 1,
    //     pageSize: 20,
    //     totalItems: 0,
    //     totalPages: 0,
    //     hasMore: false,
    //   },
    // });
  });

  /**
   * Test setSelectedId action
   */
  it('should handle setSelectedId', () => {
    // TODO: Implement test
    // const previousState = {
    //   ...initialState,
    //   selectedId: null,
    // };
    // const state = exampleReducer(previousState, setSelectedId('1'));
    // expect(state.selectedId).toBe('1');
  });

  /**
   * Test setSearchQuery action
   */
  it('should handle setSearchQuery', () => {
    // TODO: Implement test
    // const previousState = {
    //   ...initialState,
    //   searchQuery: '',
    // };
    // const state = exampleReducer(previousState, setSearchQuery('test'));
    // expect(state.searchQuery).toBe('test');
  });

  /**
   * Test setFilter action
   */
  it('should handle setFilter and reset pagination', () => {
    // TODO: Implement test
    // const previousState = {
    //   ...initialState,
    //   filterBy: 'all',
    //   pagination: { ...initialState.pagination, page: 3 },
    // };
    // const state = exampleReducer(previousState, setFilter('active'));
    // expect(state.filterBy).toBe('active');
    // expect(state.pagination.page).toBe(1); // Reset to page 1
  });

  /**
   * Test clearError action
   */
  it('should handle clearError', () => {
    // TODO: Implement test
    // const previousState = {
    //   ...initialState,
    //   error: 'Some error',
    // };
    // const state = exampleReducer(previousState, clearError());
    // expect(state.error).toBeNull();
  });

  /**
   * Test resetState action
   */
  it('should handle resetState', () => {
    // TODO: Implement test
    // const dirtyState = {
    //   ...initialState,
    //   items: { '1': mockItem },
    //   ids: ['1'],
    //   selectedId: '1',
    //   error: 'Error',
    // };
    // const state = exampleReducer(dirtyState, resetState());
    // expect(state).toEqual(initialState);
  });
});

// ==================== THUNK TESTS ====================

describe('Example Slice - Async Thunks', () => {
  /**
   * Setup before each test
   */
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  /**
   * Test fetchExampleData - success
   */
  describe('fetchExampleData', () => {
    it('should fetch items successfully', async () => {
      // TODO: Implement test
      // // Mock API response
      // mockedService.fetchItems.mockResolvedValueOnce({
      //   data: mockItems,
      //   pagination: mockPagination,
      // });
      //
      // // Create store
      // const store = createTestStore();
      //
      // // Dispatch thunk
      // await store.dispatch(fetchExampleData());
      //
      // // Get state
      // const state = store.getState();
      //
      // // Assertions
      // expect(state.example.isLoading).toBe(false);
      // expect(state.example.ids).toEqual(['1', '2', '3']);
      // expect(state.example.items['1']).toEqual(mockItem);
      // expect(state.example.pagination).toEqual(mockPagination);
      // expect(state.example.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      // TODO: Implement test
      // // Mock API error
      // mockedService.fetchItems.mockRejectedValueOnce(new Error(mockError));
      //
      // // Create store
      // const store = createTestStore();
      //
      // // Dispatch thunk
      // await store.dispatch(fetchExampleData());
      //
      // // Get state
      // const state = store.getState();
      //
      // // Assertions
      // expect(state.example.isLoading).toBe(false);
      // expect(state.example.error).toBe(mockError);
      // expect(state.example.ids).toEqual([]);
    });

    it('should set loading state during fetch', () => {
      // TODO: Implement test
      // // Mock API with delay
      // mockedService.fetchItems.mockImplementation(
      //   () => new Promise((resolve) => setTimeout(resolve, 100))
      // );
      //
      // // Create store
      // const store = createTestStore();
      //
      // // Dispatch thunk
      // store.dispatch(fetchExampleData());
      //
      // // Check loading state immediately
      // const state = store.getState();
      // expect(state.example.isLoading).toBe(true);
    });
  });

  /**
   * Test createExampleItem - success
   */
  describe('createExampleItem', () => {
    it('should create item successfully', async () => {
      // TODO: Implement test
      // const newItemData = { name: 'New Item' };
      // const createdItem = { ...mockItem, id: '4', name: 'New Item' };
      //
      // // Mock API response
      // mockedService.createItem.mockResolvedValueOnce(createdItem);
      //
      // // Create store with initial data
      // const store = createTestStore({
      //   example: {
      //     ...initialState,
      //     items: { '1': mockItem },
      //     ids: ['1'],
      //   },
      // });
      //
      // // Dispatch thunk
      // await store.dispatch(createExampleItem(newItemData));
      //
      // // Get state
      // const state = store.getState();
      //
      // // Assertions
      // expect(state.example.isCreating).toBe(false);
      // expect(state.example.ids).toContain('4');
      // expect(state.example.items['4']).toEqual(createdItem);
      // expect(state.example.selectedId).toBe('4'); // Newly created item selected
      // expect(state.example.error).toBeNull();
    });

    it('should handle create error', async () => {
      // TODO: Implement test
      // const newItemData = { name: 'New Item' };
      //
      // // Mock API error
      // mockedService.createItem.mockRejectedValueOnce(new Error(mockError));
      //
      // // Create store
      // const store = createTestStore();
      //
      // // Dispatch thunk
      // await store.dispatch(createExampleItem(newItemData));
      //
      // // Get state
      // const state = store.getState();
      //
      // // Assertions
      // expect(state.example.isCreating).toBe(false);
      // expect(state.example.error).toBe(mockError);
    });
  });

  /**
   * Test updateExampleItem - success
   */
  describe('updateExampleItem', () => {
    it('should update item successfully', async () => {
      // TODO: Implement test
      // const updates = { name: 'Updated Name' };
      // const updatedItem = { ...mockItem, name: 'Updated Name' };
      //
      // // Mock API response
      // mockedService.updateItem.mockResolvedValueOnce(updatedItem);
      //
      // // Create store with initial data
      // const store = createTestStore({
      //   example: {
      //     ...initialState,
      //     items: { '1': mockItem },
      //     ids: ['1'],
      //   },
      // });
      //
      // // Dispatch thunk
      // await store.dispatch(updateExampleItem({ id: '1', updates }));
      //
      // // Get state
      // const state = store.getState();
      //
      // // Assertions
      // expect(state.example.isUpdating).toBe(false);
      // expect(state.example.items['1'].name).toBe('Updated Name');
      // expect(state.example.error).toBeNull();
    });

    it('should handle update error', async () => {
      // TODO: Implement test
      // const updates = { name: 'Updated Name' };
      //
      // // Mock API error
      // mockedService.updateItem.mockRejectedValueOnce(new Error(mockError));
      //
      // // Create store with initial data
      // const store = createTestStore({
      //   example: {
      //     ...initialState,
      //     items: { '1': mockItem },
      //     ids: ['1'],
      //   },
      // });
      //
      // // Dispatch thunk
      // await store.dispatch(updateExampleItem({ id: '1', updates }));
      //
      // // Get state
      // const state = store.getState();
      //
      // // Assertions
      // expect(state.example.isUpdating).toBe(false);
      // expect(state.example.error).toBe(mockError);
      // expect(state.example.items['1']).toEqual(mockItem); // Unchanged
    });
  });

  /**
   * Test deleteExampleItem - success
   */
  describe('deleteExampleItem', () => {
    it('should delete item successfully', async () => {
      // TODO: Implement test
      // // Mock API response
      // mockedService.deleteItem.mockResolvedValueOnce(undefined);
      //
      // // Create store with initial data
      // const store = createTestStore({
      //   example: {
      //     ...initialState,
      //     items: { '1': mockItem },
      //     ids: ['1'],
      //     selectedId: '1',
      //   },
      // });
      //
      // // Dispatch thunk
      // await store.dispatch(deleteExampleItem('1'));
      //
      // // Get state
      // const state = store.getState();
      //
      // // Assertions
      // expect(state.example.isDeleting).toBe(false);
      // expect(state.example.ids).not.toContain('1');
      // expect(state.example.items['1']).toBeUndefined();
      // expect(state.example.selectedId).toBeNull(); // Selection cleared
      // expect(state.example.error).toBeNull();
    });

    it('should handle delete error', async () => {
      // TODO: Implement test
      // // Mock API error
      // mockedService.deleteItem.mockRejectedValueOnce(new Error(mockError));
      //
      // // Create store with initial data
      // const store = createTestStore({
      //   example: {
      //     ...initialState,
      //     items: { '1': mockItem },
      //     ids: ['1'],
      //   },
      // });
      //
      // // Dispatch thunk
      // await store.dispatch(deleteExampleItem('1'));
      //
      // // Get state
      // const state = store.getState();
      //
      // // Assertions
      // expect(state.example.isDeleting).toBe(false);
      // expect(state.example.error).toBe(mockError);
      // expect(state.example.items['1']).toEqual(mockItem); // Still exists
    });
  });
});

// ==================== SELECTOR TESTS ====================

describe('Example Slice - Selectors', () => {
  /**
   * Test selectProcessedItems with filters
   */
  describe('selectProcessedItems', () => {
    it('should return all items when no filters applied', () => {
      // TODO: Implement test
      // const state = {
      //   example: {
      //     ...initialState,
      //     items: {
      //       '1': mockItems[0],
      //       '2': mockItems[1],
      //       '3': mockItems[2],
      //     },
      //     ids: ['1', '2', '3'],
      //   },
      // } as RootState;
      //
      // const result = selectProcessedItems(state);
      // expect(result).toHaveLength(3);
    });

    it('should filter items by search query', () => {
      // TODO: Implement test
      // const state = {
      //   example: {
      //     ...initialState,
      //     items: {
      //       '1': mockItems[0],
      //       '2': mockItems[1],
      //     },
      //     ids: ['1', '2'],
      //     searchQuery: 'Another',
      //   },
      // } as RootState;
      //
      // const result = selectProcessedItems(state);
      // expect(result).toHaveLength(1);
      // expect(result[0].name).toBe('Another Item');
    });

    it('should filter items by status', () => {
      // TODO: Implement test
      // const state = {
      //   example: {
      //     ...initialState,
      //     items: {
      //       '1': mockItems[0],
      //       '2': mockItems[1],
      //       '3': mockItems[2],
      //     },
      //     ids: ['1', '2', '3'],
      //     filterBy: 'active',
      //   },
      // } as RootState;
      //
      // const result = selectProcessedItems(state);
      // expect(result).toHaveLength(2);
      // expect(result.every(item => item.status === 'active')).toBe(true);
    });

    it('should sort items by name', () => {
      // TODO: Implement test
      // const state = {
      //   example: {
      //     ...initialState,
      //     items: {
      //       '1': mockItems[0],
      //       '2': mockItems[1],
      //     },
      //     ids: ['1', '2'],
      //     sortBy: 'name',
      //   },
      // } as RootState;
      //
      // const result = selectProcessedItems(state);
      // expect(result[0].name).toBe('Another Item');
      // expect(result[1].name).toBe('Test Item');
    });
  });

  /**
   * Test selectSelectedItem
   */
  describe('selectSelectedItem', () => {
    it('should return null when no item selected', () => {
      // TODO: Implement test
      // const state = {
      //   example: {
      //     ...initialState,
      //     selectedId: null,
      //   },
      // } as RootState;
      //
      // const result = selectSelectedItem(state);
      // expect(result).toBeNull();
    });

    it('should return selected item', () => {
      // TODO: Implement test
      // const state = {
      //   example: {
      //     ...initialState,
      //     items: { '1': mockItem },
      //     ids: ['1'],
      //     selectedId: '1',
      //   },
      // } as RootState;
      //
      // const result = selectSelectedItem(state);
      // expect(result).toEqual(mockItem);
    });
  });

  /**
   * Test selector memoization
   */
  it('should memoize selector results', () => {
    // TODO: Implement test
    // const state = {
    //   example: {
    //     ...initialState,
    //     items: { '1': mockItem },
    //     ids: ['1'],
    //   },
    // } as RootState;
    //
    // // Call selector twice
    // const result1 = selectProcessedItems(state);
    // const result2 = selectProcessedItems(state);
    //
    // // Should return same reference (memoized)
    // expect(result1).toBe(result2);
  });
});

// ==================== INTEGRATION TESTS ====================

describe('Example Slice - Integration', () => {
  /**
   * Test complete user flow
   */
  it('should handle complete CRUD flow', async () => {
    // TODO: Implement test
    // // Mock API responses
    // mockedService.fetchItems.mockResolvedValueOnce({
    //   data: mockItems,
    //   pagination: mockPagination,
    // });
    // mockedService.createItem.mockResolvedValueOnce({
    //   ...mockItem,
    //   id: '4',
    //   name: 'New Item',
    // });
    // mockedService.updateItem.mockResolvedValueOnce({
    //   ...mockItem,
    //   id: '4',
    //   name: 'Updated Item',
    // });
    // mockedService.deleteItem.mockResolvedValueOnce(undefined);
    //
    // // Create store
    // const store = createTestStore();
    //
    // // 1. Fetch items
    // await store.dispatch(fetchExampleData());
    // expect(store.getState().example.ids).toHaveLength(3);
    //
    // // 2. Create new item
    // await store.dispatch(createExampleItem({ name: 'New Item' }));
    // expect(store.getState().example.ids).toHaveLength(4);
    //
    // // 3. Update the new item
    // await store.dispatch(updateExampleItem({ id: '4', updates: { name: 'Updated Item' } }));
    // expect(store.getState().example.items['4'].name).toBe('Updated Item');
    //
    // // 4. Delete the item
    // await store.dispatch(deleteExampleItem('4'));
    // expect(store.getState().example.ids).toHaveLength(3);
  });

  /**
   * Test search and filter combination
   */
  it('should handle search and filter together', () => {
    // TODO: Implement test
    // const state = {
    //   example: {
    //     ...initialState,
    //     items: {
    //       '1': mockItems[0],
    //       '2': mockItems[1],
    //       '3': mockItems[2],
    //     },
    //     ids: ['1', '2', '3'],
    //     searchQuery: 'Item',
    //     filterBy: 'active',
    //   },
    // } as RootState;
    //
    // const result = selectProcessedItems(state);
    // expect(result).toHaveLength(2); // Only active items matching "Item"
  });
});

// ==================== BEST PRACTICES ====================

/**
 * TESTING BEST PRACTICES:
 *
 * 1. Test Structure (AAA Pattern):
 *    - Arrange: Set up test data and mocks
 *    - Act: Execute the code under test
 *    - Assert: Verify the results
 *
 * 2. Test Independence:
 *    - Each test should be independent
 *    - Use beforeEach to reset state/mocks
 *    - Don't rely on test execution order
 *
 * 3. Mock External Dependencies:
 *    - Mock API services
 *    - Mock async operations
 *    - Don't make real API calls in tests
 *
 * 4. Test Edge Cases:
 *    - Empty arrays
 *    - Null values
 *    - Error scenarios
 *    - Loading states
 *
 * 5. Descriptive Test Names:
 *    - Use "should" pattern
 *    - Describe what's being tested
 *    - Make failures easy to understand
 *
 * 6. Coverage Goals:
 *    - Reducers: 100%
 *    - Thunks: >90%
 *    - Selectors: >85%
 *    - Integration: Key user flows
 */

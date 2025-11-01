/**
 * INTEGRATION TEST TEMPLATE
 *
 * TODO: Update the following:
 * 1. Replace [FeatureName] with the feature being tested
 * 2. Configure API mocks for the feature
 * 3. Test complete user flows
 * 4. Verify Redux state changes
 * 5. Test error handling and edge cases
 *
 * Feature: [FeatureName]
 * Created: [DATE]
 * Author: [YOUR_NAME]
 *
 * Test Type: Integration (Redux + API)
 * Purpose: Test complete feature workflows including state management and API calls
 */

import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Import reducers and actions
// TODO: Update imports
// import [featureName]Reducer, {
//   [actionName],
//   [asyncThunkName],
// } from '@/store/slices/[featureName]Slice';

// Import types
// TODO: Add type imports
// import type { [EntityType] } from '@/types/[entityType]';

// Import test utilities
import { createMock[Entity] } from '@/test-utils/factories/[entityFactory]';
import { waitFor } from '@testing-library/react-native';

// ==================== TEST SETUP ====================

/**
 * Create test store with real reducers
 * This simulates the actual Redux store configuration
 */
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      // TODO: Add feature reducers
      // [featureName]: [featureName]Reducer,
    },
    preloadedState,
  });
};

/**
 * Mock API client
 * Intercepts HTTP requests for testing
 */
let mockApi: MockAdapter;

beforeAll(() => {
  // Create axios mock adapter
  mockApi = new MockAdapter(axios);
});

afterEach(() => {
  // Reset mocks after each test
  mockApi.reset();
});

afterAll(() => {
  // Clean up after all tests
  mockApi.restore();
});

// ==================== TEST DATA FACTORIES ====================

/**
 * Create mock API response
 */
const createMockApiResponse = (data: any, overrides = {}) => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
  ...overrides,
});

/**
 * Create mock error response
 */
const createMockErrorResponse = (message: string, code = 'ERROR') => ({
  success: false,
  error: {
    message,
    code,
    timestamp: new Date().toISOString(),
  },
});

// ==================== INTEGRATION TESTS ====================

describe('[FeatureName] Integration Tests', () => {

  // ==================== SUCCESSFUL FLOWS ====================

  describe('Successful Operations', () => {
    it('should fetch and store data from API', async () => {
      // Arrange
      const mockData = [
        createMock[Entity]({ id: '1', name: 'Item 1' }),
        createMock[Entity]({ id: '2', name: 'Item 2' }),
      ];

      // Mock API endpoint
      mockApi.onGet('/api/[endpoint]').reply(200, createMockApiResponse(mockData));

      const store = createTestStore();

      // Act
      // TODO: Dispatch async action
      // await store.dispatch([asyncThunkName]());

      // Assert - Check Redux state
      const state = store.getState();
      // expect(state.[featureName].items).toEqual(mockData);
      // expect(state.[featureName].loading).toBe(false);
      // expect(state.[featureName].error).toBeNull();
    });

    it('should create new item via API and update store', async () => {
      // Arrange
      const newItem = createMock[Entity]({ name: 'New Item' });
      const createdItem = { ...newItem, id: 'generated-id-123' };

      mockApi.onPost('/api/[endpoint]').reply(201, createMockApiResponse(createdItem));

      const store = createTestStore();

      // Act
      // TODO: Dispatch create action
      // await store.dispatch([createAsyncThunk](newItem));

      // Assert
      const state = store.getState();
      // expect(state.[featureName].items).toContainEqual(createdItem);
      // expect(state.[featureName].items.length).toBe(1);
    });

    it('should update existing item and sync with store', async () => {
      // Arrange
      const existingItem = createMock[Entity]({ id: '1', name: 'Old Name' });
      const updatedItem = { ...existingItem, name: 'Updated Name' };

      mockApi.onPut('/api/[endpoint]/1').reply(200, createMockApiResponse(updatedItem));

      const store = createTestStore({
        [featureName]: {
          items: [existingItem],
          loading: false,
          error: null,
        },
      });

      // Act
      // TODO: Dispatch update action
      // await store.dispatch([updateAsyncThunk]({ id: '1', data: { name: 'Updated Name' } }));

      // Assert
      const state = store.getState();
      const item = state.[featureName].items.find((i) => i.id === '1');
      // expect(item?.name).toBe('Updated Name');
    });

    it('should delete item and remove from store', async () => {
      // Arrange
      const itemToDelete = createMock[Entity]({ id: '1' });

      mockApi.onDelete('/api/[endpoint]/1').reply(200, createMockApiResponse({ success: true }));

      const store = createTestStore({
        [featureName]: {
          items: [itemToDelete],
          loading: false,
          error: null,
        },
      });

      // Act
      // TODO: Dispatch delete action
      // await store.dispatch([deleteAsyncThunk]('1'));

      // Assert
      const state = store.getState();
      // expect(state.[featureName].items).toHaveLength(0);
      // expect(state.[featureName].items.find(i => i.id === '1')).toBeUndefined();
    });

    it('should handle pagination correctly', async () => {
      // Arrange
      const page1Data = [
        createMock[Entity]({ id: '1' }),
        createMock[Entity]({ id: '2' }),
      ];
      const page2Data = [
        createMock[Entity]({ id: '3' }),
        createMock[Entity]({ id: '4' }),
      ];

      mockApi.onGet('/api/[endpoint]', { params: { page: 1 } })
        .reply(200, createMockApiResponse({
          data: page1Data,
          pagination: { page: 1, totalPages: 2, hasMore: true },
        }));

      mockApi.onGet('/api/[endpoint]', { params: { page: 2 } })
        .reply(200, createMockApiResponse({
          data: page2Data,
          pagination: { page: 2, totalPages: 2, hasMore: false },
        }));

      const store = createTestStore();

      // Act - Fetch page 1
      // await store.dispatch([fetchPageAsyncThunk](1));

      // Assert page 1
      let state = store.getState();
      // expect(state.[featureName].items).toHaveLength(2);
      // expect(state.[featureName].pagination.hasMore).toBe(true);

      // Act - Fetch page 2
      // await store.dispatch([fetchPageAsyncThunk](2));

      // Assert page 2
      state = store.getState();
      // expect(state.[featureName].items).toHaveLength(4);
      // expect(state.[featureName].pagination.hasMore).toBe(false);
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle API network errors', async () => {
      // Arrange
      mockApi.onGet('/api/[endpoint]').networkError();

      const store = createTestStore();

      // Act
      // await store.dispatch([asyncThunkName]());

      // Assert
      const state = store.getState();
      // expect(state.[featureName].loading).toBe(false);
      // expect(state.[featureName].error).toBeTruthy();
      // expect(state.[featureName].error).toContain('network');
    });

    it('should handle 404 Not Found errors', async () => {
      // Arrange
      mockApi.onGet('/api/[endpoint]/999').reply(404, createMockErrorResponse('Item not found', 'NOT_FOUND'));

      const store = createTestStore();

      // Act
      // await store.dispatch([fetchOneAsyncThunk]('999'));

      // Assert
      const state = store.getState();
      // expect(state.[featureName].error).toBe('Item not found');
    });

    it('should handle 500 Server errors', async () => {
      // Arrange
      mockApi.onPost('/api/[endpoint]').reply(500, createMockErrorResponse('Internal server error', 'SERVER_ERROR'));

      const store = createTestStore();

      // Act
      // await store.dispatch([createAsyncThunk]({ name: 'Test' }));

      // Assert
      const state = store.getState();
      // expect(state.[featureName].error).toBe('Internal server error');
      // expect(state.[featureName].items).toHaveLength(0);
    });

    it('should handle validation errors (400)', async () => {
      // Arrange
      const validationErrors = {
        name: 'Name is required',
        email: 'Invalid email format',
      };

      mockApi.onPost('/api/[endpoint]').reply(400, {
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationErrors,
        },
      });

      const store = createTestStore();

      // Act
      // await store.dispatch([createAsyncThunk]({ name: '', email: 'invalid' }));

      // Assert
      const state = store.getState();
      // expect(state.[featureName].error).toBeTruthy();
      // expect(state.[featureName].validationErrors).toEqual(validationErrors);
    });

    it('should handle timeout errors', async () => {
      // Arrange
      mockApi.onGet('/api/[endpoint]').timeout();

      const store = createTestStore();

      // Act
      // await store.dispatch([asyncThunkName]());

      // Assert
      const state = store.getState();
      // expect(state.[featureName].error).toContain('timeout');
    });

    it('should handle unauthorized errors (401)', async () => {
      // Arrange
      mockApi.onGet('/api/[endpoint]').reply(401, createMockErrorResponse('Unauthorized', 'UNAUTHORIZED'));

      const store = createTestStore();

      // Act
      // await store.dispatch([asyncThunkName]());

      // Assert
      const state = store.getState();
      // expect(state.[featureName].error).toBe('Unauthorized');
      // TODO: Verify redirect to login or token refresh
    });
  });

  // ==================== COMPLEX WORKFLOWS ====================

  describe('Complex Workflows', () => {
    it('should handle create, update, then delete workflow', async () => {
      // Arrange
      const newItem = createMock[Entity]({ name: 'Test Item' });
      const createdItem = { ...newItem, id: '1' };
      const updatedItem = { ...createdItem, name: 'Updated Item' };

      // Mock create
      mockApi.onPost('/api/[endpoint]').reply(201, createMockApiResponse(createdItem));

      // Mock update
      mockApi.onPut('/api/[endpoint]/1').reply(200, createMockApiResponse(updatedItem));

      // Mock delete
      mockApi.onDelete('/api/[endpoint]/1').reply(200, createMockApiResponse({ success: true }));

      const store = createTestStore();

      // Act - Create
      // await store.dispatch([createAsyncThunk](newItem));
      let state = store.getState();
      // expect(state.[featureName].items).toHaveLength(1);

      // Act - Update
      // await store.dispatch([updateAsyncThunk]({ id: '1', data: { name: 'Updated Item' } }));
      state = store.getState();
      // expect(state.[featureName].items[0].name).toBe('Updated Item');

      // Act - Delete
      // await store.dispatch([deleteAsyncThunk]('1'));
      state = store.getState();
      // expect(state.[featureName].items).toHaveLength(0);
    });

    it('should handle concurrent requests correctly', async () => {
      // Arrange
      const item1 = createMock[Entity]({ id: '1' });
      const item2 = createMock[Entity]({ id: '2' });

      mockApi.onGet('/api/[endpoint]/1').reply(200, createMockApiResponse(item1));
      mockApi.onGet('/api/[endpoint]/2').reply(200, createMockApiResponse(item2));

      const store = createTestStore();

      // Act - Dispatch multiple requests simultaneously
      // await Promise.all([
      //   store.dispatch([fetchOneAsyncThunk]('1')),
      //   store.dispatch([fetchOneAsyncThunk]('2')),
      // ]);

      // Assert
      const state = store.getState();
      // expect(state.[featureName].items).toHaveLength(2);
    });

    it('should handle optimistic updates with rollback on error', async () => {
      // Arrange
      const existingItem = createMock[Entity]({ id: '1', name: 'Original' });
      const optimisticUpdate = { ...existingItem, name: 'Optimistic' };

      // Mock API failure
      mockApi.onPut('/api/[endpoint]/1').reply(500, createMockErrorResponse('Update failed'));

      const store = createTestStore({
        [featureName]: {
          items: [existingItem],
          loading: false,
          error: null,
        },
      });

      // Act - Optimistic update
      // store.dispatch([optimisticUpdateAction](optimisticUpdate));

      // Assert - Optimistic state
      let state = store.getState();
      // expect(state.[featureName].items[0].name).toBe('Optimistic');

      // Act - API call fails
      // await store.dispatch([updateAsyncThunk]({ id: '1', data: optimisticUpdate }));

      // Assert - Rollback to original
      state = store.getState();
      // expect(state.[featureName].items[0].name).toBe('Original');
      // expect(state.[featureName].error).toBeTruthy();
    });

    it('should handle search with debounce', async () => {
      // Arrange
      jest.useFakeTimers();

      const searchResults = [
        createMock[Entity]({ name: 'Test Result' }),
      ];

      mockApi.onGet('/api/[endpoint]/search', { params: { q: 'test' } })
        .reply(200, createMockApiResponse(searchResults));

      const store = createTestStore();

      // Act - Rapid search queries
      // store.dispatch([searchAction]('t'));
      // store.dispatch([searchAction]('te'));
      // store.dispatch([searchAction]('tes'));
      // store.dispatch([searchAction]('test'));

      // Fast-forward debounce timer
      jest.runAllTimers();

      // Assert - Only last search executed
      await waitFor(() => {
        const state = store.getState();
        // expect(state.[featureName].searchResults).toEqual(searchResults);
      });

      jest.useRealTimers();
    });
  });

  // ==================== STATE PERSISTENCE ====================

  describe('State Persistence', () => {
    it('should persist state to localStorage', async () => {
      // Arrange
      const mockData = [createMock[Entity]({ id: '1' })];
      mockApi.onGet('/api/[endpoint]').reply(200, createMockApiResponse(mockData));

      const store = createTestStore();

      // Act
      // await store.dispatch([asyncThunkName]());

      // Assert - Check localStorage
      // const persisted = localStorage.getItem('[featureName]');
      // expect(persisted).toBeTruthy();
      // expect(JSON.parse(persisted!)).toEqual(mockData);
    });

    it('should hydrate state from localStorage', () => {
      // Arrange
      const persistedData = [createMock[Entity]({ id: '1' })];
      // localStorage.setItem('[featureName]', JSON.stringify(persistedData));

      // Act
      const store = createTestStore();

      // Assert
      // const state = store.getState();
      // expect(state.[featureName].items).toEqual(persistedData);
    });
  });

  // ==================== CACHE MANAGEMENT ====================

  describe('Cache Management', () => {
    it('should use cached data when available', async () => {
      // Arrange
      const cachedData = [createMock[Entity]({ id: '1' })];
      const store = createTestStore({
        [featureName]: {
          items: cachedData,
          lastFetch: Date.now(),
          loading: false,
          error: null,
        },
      });

      // Mock should not be called
      const apiSpy = jest.spyOn(mockApi, 'onGet');

      // Act
      // await store.dispatch([fetchWithCacheAsyncThunk]());

      // Assert - Should use cache, not make API call
      // expect(apiSpy).not.toHaveBeenCalled();
      const state = store.getState();
      // expect(state.[featureName].items).toEqual(cachedData);
    });

    it('should invalidate cache after timeout', async () => {
      // Arrange
      const oldData = [createMock[Entity]({ id: '1', name: 'Old' })];
      const newData = [createMock[Entity]({ id: '1', name: 'New' })];

      const store = createTestStore({
        [featureName]: {
          items: oldData,
          lastFetch: Date.now() - 10 * 60 * 1000, // 10 minutes ago
          loading: false,
          error: null,
        },
      });

      mockApi.onGet('/api/[endpoint]').reply(200, createMockApiResponse(newData));

      // Act - Cache should be stale
      // await store.dispatch([fetchWithCacheAsyncThunk]({ maxAge: 5 * 60 * 1000 })); // 5 min max age

      // Assert - Should fetch new data
      const state = store.getState();
      // expect(state.[featureName].items[0].name).toBe('New');
    });
  });
});

// ==================== NOTES ====================

/**
 * INTEGRATION TEST BEST PRACTICES:
 *
 * 1. Test complete workflows
 *    - Don't just test individual actions
 *    - Test user journeys and business flows
 *
 * 2. Use real Redux store
 *    - Don't mock the store
 *    - Use actual reducers and middleware
 *
 * 3. Mock external dependencies
 *    - Mock API calls (axios-mock-adapter)
 *    - Mock browser APIs (localStorage, etc.)
 *    - Keep network requests out of tests
 *
 * 4. Test error paths
 *    - Network errors
 *    - API errors (4xx, 5xx)
 *    - Validation errors
 *
 * 5. Test async operations
 *    - Use async/await
 *    - Use waitFor for async state changes
 *    - Test loading states
 *
 * 6. Test side effects
 *    - Navigation
 *    - Notifications
 *    - Analytics tracking
 *
 * 7. Clean up between tests
 *    - Reset mocks
 *    - Clear localStorage
 *    - Reset timers
 *
 * 8. Use realistic data
 *    - Use factories for test data
 *    - Match production data structure
 *
 * 9. Test optimistic updates
 *    - UI updates before API response
 *    - Rollback on errors
 *
 * 10. Test caching strategies
 *     - Cache hits/misses
 *     - Cache invalidation
 *     - Stale data handling
 */

/**
 * COMMON PATTERNS:
 *
 * Mock API responses:
 *   mockApi.onGet('/path').reply(200, data);
 *   mockApi.onPost('/path').reply(201, data);
 *   mockApi.onPut('/path').reply(200, data);
 *   mockApi.onDelete('/path').reply(204);
 *
 * Mock errors:
 *   mockApi.onGet('/path').reply(500, error);
 *   mockApi.onGet('/path').networkError();
 *   mockApi.onGet('/path').timeout();
 *
 * Dispatch actions:
 *   await store.dispatch(asyncAction());
 *   store.dispatch(syncAction(payload));
 *
 * Check state:
 *   const state = store.getState();
 *   expect(state.feature.data).toBe(expected);
 */

/**
 * Service Layer Test Template
 *
 * This template demonstrates how to test API service layers:
 * - Mock Supabase client
 * - Test CRUD operations
 * - Test error scenarios
 * - Validate request/response DTOs
 * - Test edge cases
 *
 * @example
 * // Run tests:
 * npm test exampleService.test.ts
 */

import { SupabaseClient } from '@supabase/supabase-js';
// TODO: Import your service functions
// import * as exampleService from './exampleService';
// import { ApiError } from './exampleService';

// TODO: Import DTOs from contracts
// import type { ExampleItem, CreateExampleItemDTO, UpdateExampleItemDTO } from '../../contracts/data-contracts/dto-definitions';

// ==================== MOCK DATA ====================

/**
 * Mock data for testing
 */
const mockUserId = 'user-123';

const mockItem = {
  id: '1',
  userId: mockUserId,
  name: 'Test Item',
  description: 'Test description',
  status: 'active' as const,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  deletedAt: null,
};

const mockItems = [
  mockItem,
  {
    id: '2',
    userId: mockUserId,
    name: 'Another Item',
    description: 'Another description',
    status: 'active' as const,
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    deletedAt: null,
  },
  {
    id: '3',
    userId: mockUserId,
    name: 'Archived Item',
    description: 'Archived description',
    status: 'archived' as const,
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z',
    deletedAt: null,
  },
];

const mockPagination = {
  page: 1,
  pageSize: 20,
  totalItems: 3,
  totalPages: 1,
  hasMore: false,
};

// ==================== MOCK SUPABASE CLIENT ====================

/**
 * Create a mock Supabase client
 *
 * This creates a mock that simulates Supabase query builder pattern
 */
function createMockSupabaseClient(): jest.Mocked<SupabaseClient> {
  // Mock query builder methods
  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  };

  // Mock client with from method
  const mockClient = {
    from: jest.fn().mockReturnValue(mockQueryBuilder),
    auth: {
      getSession: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
    },
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    }),
  } as unknown as jest.Mocked<SupabaseClient>;

  return mockClient;
}

// ==================== TEST SETUP ====================

describe('Example Service', () => {
  let mockClient: jest.Mocked<SupabaseClient>;

  /**
   * Setup before each test
   */
  beforeEach(() => {
    // Create fresh mock client
    mockClient = createMockSupabaseClient();

    // TODO: Set the mock client in your service
    // exampleService.setSupabaseClient(mockClient);

    // Clear all mocks
    jest.clearAllMocks();
  });

  /**
   * Cleanup after each test
   */
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ==================== FETCH ITEMS TESTS ====================

  describe('fetchItems', () => {
    it('should fetch items successfully', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockResponse = {
      //   data: mockItems,
      //   error: null,
      //   count: 3,
      // };
      //
      // // Setup mock to return data
      // mockClient.from('example_items').select.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // const result = await exampleService.fetchItems({ page: 1, pageSize: 20 });
      //
      // // Assert
      // expect(result.data).toEqual(mockItems);
      // expect(result.pagination).toEqual(mockPagination);
      // expect(mockClient.from).toHaveBeenCalledWith('example_items');
      // expect(mockClient.from('example_items').select).toHaveBeenCalled();
    });

    it('should apply search filter', async () => {
      // TODO: Implement test
      // // Arrange
      // const searchQuery = 'test';
      // const mockResponse = {
      //   data: [mockItem],
      //   error: null,
      //   count: 1,
      // };
      //
      // mockClient.from('example_items').select.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // await exampleService.fetchItems({ search: searchQuery });
      //
      // // Assert
      // expect(mockClient.from('example_items').or).toHaveBeenCalledWith(
      //   expect.stringContaining(searchQuery)
      // );
    });

    it('should apply status filter', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockResponse = {
      //   data: [mockItems[2]],
      //   error: null,
      //   count: 1,
      // };
      //
      // mockClient.from('example_items').select.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // await exampleService.fetchItems({ status: 'archived' });
      //
      // // Assert
      // expect(mockClient.from('example_items').eq).toHaveBeenCalledWith('status', 'archived');
    });

    it('should apply pagination', async () => {
      // TODO: Implement test
      // // Arrange
      // const page = 2;
      // const pageSize = 10;
      // const mockResponse = {
      //   data: [],
      //   error: null,
      //   count: 25,
      // };
      //
      // mockClient.from('example_items').select.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // await exampleService.fetchItems({ page, pageSize });
      //
      // // Assert
      // expect(mockClient.from('example_items').range).toHaveBeenCalledWith(10, 19);
    });

    it('should handle fetch error', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockError = {
      //   message: 'Database error',
      //   code: 'DB_ERROR',
      // };
      //
      // mockClient.from('example_items').select.mockResolvedValueOnce({
      //   data: null,
      //   error: mockError,
      // });
      //
      // // Act & Assert
      // await expect(exampleService.fetchItems()).rejects.toThrow(ApiError);
      // await expect(exampleService.fetchItems()).rejects.toThrow('Database error');
    });

    it('should exclude soft-deleted items', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockResponse = {
      //   data: mockItems,
      //   error: null,
      //   count: 3,
      // };
      //
      // mockClient.from('example_items').select.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // await exampleService.fetchItems();
      //
      // // Assert
      // expect(mockClient.from('example_items').is).toHaveBeenCalledWith('deletedAt', null);
    });
  });

  // ==================== FETCH BY ID TESTS ====================

  describe('fetchItemById', () => {
    it('should fetch item by ID successfully', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockResponse = {
      //   data: mockItem,
      //   error: null,
      // };
      //
      // mockClient.from('example_items').single.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // const result = await exampleService.fetchItemById('1');
      //
      // // Assert
      // expect(result).toEqual(mockItem);
      // expect(mockClient.from('example_items').eq).toHaveBeenCalledWith('id', '1');
      // expect(mockClient.from('example_items').single).toHaveBeenCalled();
    });

    it('should handle item not found', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockError = {
      //   message: 'Item not found',
      //   code: 'PGRST116',
      // };
      //
      // mockClient.from('example_items').single.mockResolvedValueOnce({
      //   data: null,
      //   error: mockError,
      // });
      //
      // // Act & Assert
      // await expect(exampleService.fetchItemById('999')).rejects.toThrow(ApiError);
    });
  });

  // ==================== CREATE ITEM TESTS ====================

  describe('createItem', () => {
    it('should create item successfully', async () => {
      // TODO: Implement test
      // // Arrange
      // const newItemData = {
      //   name: 'New Item',
      //   description: 'New description',
      // };
      //
      // const createdItem = {
      //   ...mockItem,
      //   id: '4',
      //   name: 'New Item',
      //   description: 'New description',
      // };
      //
      // const mockResponse = {
      //   data: createdItem,
      //   error: null,
      // };
      //
      // mockClient.from('example_items').single.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // const result = await exampleService.createItem(newItemData);
      //
      // // Assert
      // expect(result).toEqual(createdItem);
      // expect(mockClient.from('example_items').insert).toHaveBeenCalledWith([newItemData]);
      // expect(mockClient.from('example_items').select).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      // TODO: Implement test
      // // Arrange
      // const invalidData = {
      //   name: '',
      // };
      //
      // // Act & Assert
      // await expect(exampleService.createItem(invalidData)).rejects.toThrow(ApiError);
      // await expect(exampleService.createItem(invalidData)).rejects.toThrow('Name is required');
    });

    it('should handle database constraint violation', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockError = {
      //   message: 'Unique constraint violation',
      //   code: '23505',
      // };
      //
      // mockClient.from('example_items').single.mockResolvedValueOnce({
      //   data: null,
      //   error: mockError,
      // });
      //
      // // Act & Assert
      // await expect(
      //   exampleService.createItem({ name: 'Duplicate' })
      // ).rejects.toThrow(ApiError);
    });
  });

  // ==================== UPDATE ITEM TESTS ====================

  describe('updateItem', () => {
    it('should update item successfully', async () => {
      // TODO: Implement test
      // // Arrange
      // const updates = {
      //   name: 'Updated Name',
      //   description: 'Updated description',
      // };
      //
      // const updatedItem = {
      //   ...mockItem,
      //   ...updates,
      //   updatedAt: new Date().toISOString(),
      // };
      //
      // const mockResponse = {
      //   data: updatedItem,
      //   error: null,
      // };
      //
      // mockClient.from('example_items').single.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // const result = await exampleService.updateItem('1', updates);
      //
      // // Assert
      // expect(result).toEqual(updatedItem);
      // expect(mockClient.from('example_items').update).toHaveBeenCalledWith(updates);
      // expect(mockClient.from('example_items').eq).toHaveBeenCalledWith('id', '1');
    });

    it('should handle partial updates', async () => {
      // TODO: Implement test
      // // Arrange
      // const updates = {
      //   name: 'Only Name Updated',
      // };
      //
      // const updatedItem = {
      //   ...mockItem,
      //   ...updates,
      // };
      //
      // const mockResponse = {
      //   data: updatedItem,
      //   error: null,
      // };
      //
      // mockClient.from('example_items').single.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // const result = await exampleService.updateItem('1', updates);
      //
      // // Assert
      // expect(result.name).toBe('Only Name Updated');
      // expect(result.description).toBe(mockItem.description); // Unchanged
    });

    it('should validate empty name', async () => {
      // TODO: Implement test
      // // Arrange
      // const updates = {
      //   name: '',
      // };
      //
      // // Act & Assert
      // await expect(exampleService.updateItem('1', updates)).rejects.toThrow(ApiError);
      // await expect(exampleService.updateItem('1', updates)).rejects.toThrow('Name cannot be empty');
    });

    it('should handle update error', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockError = {
      //   message: 'Update failed',
      //   code: 'UPDATE_ERROR',
      // };
      //
      // mockClient.from('example_items').single.mockResolvedValueOnce({
      //   data: null,
      //   error: mockError,
      // });
      //
      // // Act & Assert
      // await expect(
      //   exampleService.updateItem('1', { name: 'Updated' })
      // ).rejects.toThrow(ApiError);
    });
  });

  // ==================== DELETE ITEM TESTS ====================

  describe('deleteItem', () => {
    it('should soft delete item successfully', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockResponse = {
      //   data: null,
      //   error: null,
      // };
      //
      // mockClient.from('example_items').update.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // await exampleService.deleteItem('1');
      //
      // // Assert
      // expect(mockClient.from('example_items').update).toHaveBeenCalledWith(
      //   expect.objectContaining({ deletedAt: expect.any(String) })
      // );
      // expect(mockClient.from('example_items').eq).toHaveBeenCalledWith('id', '1');
    });

    it('should handle delete error', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockError = {
      //   message: 'Delete failed',
      //   code: 'DELETE_ERROR',
      // };
      //
      // mockClient.from('example_items').update.mockResolvedValueOnce({
      //   data: null,
      //   error: mockError,
      // });
      //
      // // Act & Assert
      // await expect(exampleService.deleteItem('1')).rejects.toThrow(ApiError);
    });
  });

  // ==================== BATCH OPERATIONS TESTS ====================

  describe('batchCreateItems', () => {
    it('should create multiple items successfully', async () => {
      // TODO: Implement test
      // // Arrange
      // const newItems = [
      //   { name: 'Item 1' },
      //   { name: 'Item 2' },
      //   { name: 'Item 3' },
      // ];
      //
      // const createdItems = newItems.map((item, idx) => ({
      //   ...mockItem,
      //   id: `${idx + 10}`,
      //   ...item,
      // }));
      //
      // const mockResponse = {
      //   data: createdItems,
      //   error: null,
      // };
      //
      // mockClient.from('example_items').select.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // const result = await exampleService.batchCreateItems(newItems);
      //
      // // Assert
      // expect(result).toHaveLength(3);
      // expect(mockClient.from('example_items').insert).toHaveBeenCalledWith(newItems);
    });
  });

  describe('batchDeleteItems', () => {
    it('should delete multiple items successfully', async () => {
      // TODO: Implement test
      // // Arrange
      // const itemIds = ['1', '2', '3'];
      //
      // const mockResponse = {
      //   data: null,
      //   error: null,
      // };
      //
      // mockClient.from('example_items').update.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // await exampleService.batchDeleteItems(itemIds);
      //
      // // Assert
      // expect(mockClient.from('example_items').in).toHaveBeenCalledWith('id', itemIds);
    });
  });

  // ==================== SEARCH TESTS ====================

  describe('searchItems', () => {
    it('should search items successfully', async () => {
      // TODO: Implement test
      // // Arrange
      // const searchQuery = 'test';
      // const mockResponse = {
      //   data: [mockItem],
      //   error: null,
      // };
      //
      // mockClient.from('example_items').range.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // const result = await exampleService.searchItems(searchQuery);
      //
      // // Assert
      // expect(result).toEqual([mockItem]);
      // expect(mockClient.from('example_items').or).toHaveBeenCalledWith(
      //   expect.stringContaining(searchQuery)
      // );
    });

    it('should apply search limit', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockResponse = {
      //   data: mockItems,
      //   error: null,
      // };
      //
      // mockClient.from('example_items').range.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // await exampleService.searchItems('query', { limit: 10 });
      //
      // // Assert
      // expect(mockClient.from('example_items').range).toHaveBeenCalledWith(0, 9);
    });
  });

  // ==================== UTILITY TESTS ====================

  describe('countItems', () => {
    it('should count items successfully', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockResponse = {
      //   count: 42,
      //   error: null,
      // };
      //
      // mockClient.from('example_items').select.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // const result = await exampleService.countItems();
      //
      // // Assert
      // expect(result).toBe(42);
    });
  });

  describe('itemExists', () => {
    it('should return true when item exists', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockResponse = {
      //   data: { id: '1' },
      //   error: null,
      // };
      //
      // mockClient.from('example_items').single.mockResolvedValueOnce(mockResponse);
      //
      // // Act
      // const result = await exampleService.itemExists('1');
      //
      // // Assert
      // expect(result).toBe(true);
    });

    it('should return false when item does not exist', async () => {
      // TODO: Implement test
      // // Arrange
      // const mockError = {
      //   code: 'PGRST116',
      // };
      //
      // mockClient.from('example_items').single.mockResolvedValueOnce({
      //   data: null,
      //   error: mockError,
      // });
      //
      // // Act
      // const result = await exampleService.itemExists('999');
      //
      // // Assert
      // expect(result).toBe(false);
    });
  });
});

// ==================== ERROR HANDLING TESTS ====================

describe('ApiError', () => {
  it('should create ApiError with all properties', () => {
    // TODO: Implement test
    // const error = new ApiError('Test error', 'TEST_CODE', { detail: 'test' }, 400);
    //
    // expect(error.message).toBe('Test error');
    // expect(error.code).toBe('TEST_CODE');
    // expect(error.details).toEqual({ detail: 'test' });
    // expect(error.statusCode).toBe(400);
    // expect(error.name).toBe('ApiError');
  });
});

// ==================== BEST PRACTICES ====================

/**
 * SERVICE TESTING BEST PRACTICES:
 *
 * 1. Mock External Dependencies:
 *    - Always mock Supabase client
 *    - Never make real API calls in unit tests
 *    - Use integration tests for end-to-end flows
 *
 * 2. Test All Scenarios:
 *    - Success cases
 *    - Error cases
 *    - Edge cases (empty data, null values)
 *    - Validation errors
 *    - Network errors
 *
 * 3. Verify Mock Calls:
 *    - Check that correct methods are called
 *    - Verify parameters passed to methods
 *    - Ensure query builder chain is correct
 *
 * 4. Test Data Validation:
 *    - Required fields
 *    - Data types
 *    - Business rules
 *    - Constraints
 *
 * 5. Test Error Messages:
 *    - Verify user-friendly error messages
 *    - Check error codes
 *    - Validate error details
 *
 * 6. Isolate Tests:
 *    - Each test should be independent
 *    - Reset mocks between tests
 *    - Don't share state across tests
 */

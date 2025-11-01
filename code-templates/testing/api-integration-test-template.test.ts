/**
 * API INTEGRATION TEST TEMPLATE
 *
 * TODO: Update the following:
 * 1. Replace [ResourceName] with the API resource (e.g., Contact, Message)
 * 2. Configure API endpoints
 * 3. Test all CRUD operations
 * 4. Validate request/response DTOs
 * 5. Test error scenarios and edge cases
 *
 * Resource: [ResourceName]
 * Created: [DATE]
 * Author: [YOUR_NAME]
 *
 * Test Framework: Jest + Supertest (for backend) / Nock (for frontend)
 * Purpose: Test API endpoints with full request/response cycle
 */

import request from 'supertest';
import nock from 'nock';

// Import API client or app instance
// TODO: Update import path
// For backend testing:
// import app from '@/app';

// For frontend API client testing:
// import { apiClient } from '@/services/apiClient';

// Import types and DTOs
// TODO: Update imports
// import type {
//   [Resource],
//   Create[Resource]DTO,
//   Update[Resource]DTO,
// } from '@/contracts/data-contracts/dto-definitions';

// Import test utilities
import { create[Resource]Factory } from '@/test-utils/factories/[resource]Factory';

// ==================== TEST CONFIGURATION ====================

/**
 * API configuration
 */
const API_CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  apiVersion: '/api/v1',
  timeout: 5000,
};

/**
 * Test authentication token
 * In real tests, obtain this from auth flow
 */
const TEST_AUTH_TOKEN = 'test-jwt-token-here';

/**
 * Helper: Get full API URL
 */
const getApiUrl = (path: string) => {
  return `${API_CONFIG.baseUrl}${API_CONFIG.apiVersion}${path}`;
};

/**
 * Helper: Create auth headers
 */
const authHeaders = {
  Authorization: `Bearer ${TEST_AUTH_TOKEN}`,
  'Content-Type': 'application/json',
};

// ==================== SETUP & TEARDOWN ====================

beforeAll(async () => {
  // Setup: Initialize database, seed data, etc.
  // await setupTestDatabase();
  // await seedTestData();
});

afterAll(async () => {
  // Cleanup: Close connections, clear database
  // await clearTestDatabase();
  // await closeConnections();
});

beforeEach(() => {
  // Reset mocks before each test
  nock.cleanAll();
});

afterEach(() => {
  // Verify all nock mocks were called
  if (!nock.isDone()) {
    console.warn('Not all nock interceptors were used!');
    nock.cleanAll();
  }
});

// ==================== API INTEGRATION TESTS ====================

describe('[ResourceName] API Integration Tests', () => {

  // ==================== GET (LIST) ENDPOINT ====================

  describe('GET /[resources]', () => {
    it('should return list of resources', async () => {
      // Arrange
      const mockResources = [
        create[Resource]Factory({ id: '1', name: 'Resource 1' }),
        create[Resource]Factory({ id: '2', name: 'Resource 2' }),
      ];

      // For backend tests using supertest:
      // const response = await request(app)
      //   .get('/api/v1/[resources]')
      //   .set(authHeaders)
      //   .expect(200);

      // For frontend tests using nock:
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]`)
        .reply(200, {
          success: true,
          data: mockResources,
          pagination: {
            page: 1,
            pageSize: 10,
            totalItems: 2,
            totalPages: 1,
            hasMore: false,
          },
        });

      // Act
      // const response = await apiClient.get('/[resources]');

      // Assert
      // expect(response.data.success).toBe(true);
      // expect(response.data.data).toHaveLength(2);
      // expect(response.data.data[0]).toMatchObject(mockResources[0]);
    });

    it('should support pagination', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]`)
        .query({ page: 2, pageSize: 10 })
        .reply(200, {
          success: true,
          data: [create[Resource]Factory()],
          pagination: {
            page: 2,
            pageSize: 10,
            totalItems: 15,
            totalPages: 2,
            hasMore: false,
          },
        });

      // Act
      // const response = await apiClient.get('/[resources]', {
      //   params: { page: 2, pageSize: 10 }
      // });

      // Assert
      // expect(response.data.pagination.page).toBe(2);
      // expect(response.data.pagination.hasMore).toBe(false);
    });

    it('should support filtering', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]`)
        .query({ status: 'active', search: 'test' })
        .reply(200, {
          success: true,
          data: [create[Resource]Factory({ status: 'active' })],
        });

      // Act
      // const response = await apiClient.get('/[resources]', {
      //   params: { status: 'active', search: 'test' }
      // });

      // Assert
      // expect(response.data.data).toHaveLength(1);
      // expect(response.data.data[0].status).toBe('active');
    });

    it('should support sorting', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]`)
        .query({ sortBy: 'name', order: 'desc' })
        .reply(200, {
          success: true,
          data: [
            create[Resource]Factory({ name: 'Z Item' }),
            create[Resource]Factory({ name: 'A Item' }),
          ],
        });

      // Act
      // const response = await apiClient.get('/[resources]', {
      //   params: { sortBy: 'name', order: 'desc' }
      // });

      // Assert
      // const names = response.data.data.map((r: any) => r.name);
      // expect(names[0]).toBe('Z Item');
      // expect(names[1]).toBe('A Item');
    });

    it('should return empty array when no resources exist', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]`)
        .reply(200, {
          success: true,
          data: [],
          pagination: {
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
            hasMore: false,
          },
        });

      // Act
      // const response = await apiClient.get('/[resources]');

      // Assert
      // expect(response.data.data).toEqual([]);
    });

    it('should require authentication', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]`)
        .reply(401, {
          success: false,
          error: {
            message: 'Unauthorized',
            code: 'UNAUTHORIZED',
          },
        });

      // Act & Assert
      // await expect(
      //   apiClient.get('/[resources]', { headers: {} }) // No auth header
      // ).rejects.toThrow('Unauthorized');
    });
  });

  // ==================== GET (SINGLE) ENDPOINT ====================

  describe('GET /[resources]/:id', () => {
    it('should return single resource by ID', async () => {
      // Arrange
      const mockResource = create[Resource]Factory({ id: '123', name: 'Test Resource' });

      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]/123`)
        .reply(200, {
          success: true,
          data: mockResource,
        });

      // Act
      // const response = await apiClient.get('/[resources]/123');

      // Assert
      // expect(response.data.data).toMatchObject(mockResource);
      // expect(response.data.data.id).toBe('123');
    });

    it('should return 404 for non-existent resource', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]/999`)
        .reply(404, {
          success: false,
          error: {
            message: 'Resource not found',
            code: 'NOT_FOUND',
          },
        });

      // Act & Assert
      // await expect(
      //   apiClient.get('/[resources]/999')
      // ).rejects.toMatchObject({
      //   response: { status: 404 }
      // });
    });

    it('should validate UUID format', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]/invalid-id`)
        .reply(400, {
          success: false,
          error: {
            message: 'Invalid ID format',
            code: 'VALIDATION_ERROR',
          },
        });

      // Act & Assert
      // await expect(
      //   apiClient.get('/[resources]/invalid-id')
      // ).rejects.toMatchObject({
      //   response: { status: 400 }
      // });
    });
  });

  // ==================== POST (CREATE) ENDPOINT ====================

  describe('POST /[resources]', () => {
    it('should create new resource', async () => {
      // Arrange
      const createDto: Create[Resource]DTO = {
        name: 'New Resource',
        description: 'Test description',
        // TODO: Add required fields
      };

      const createdResource = {
        id: 'generated-uuid',
        ...createDto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      nock(API_CONFIG.baseUrl)
        .post(`${API_CONFIG.apiVersion}/[resources]`, createDto)
        .reply(201, {
          success: true,
          data: createdResource,
        });

      // Act
      // const response = await apiClient.post('/[resources]', createDto);

      // Assert
      // expect(response.status).toBe(201);
      // expect(response.data.data.id).toBeTruthy();
      // expect(response.data.data.name).toBe(createDto.name);
    });

    it('should validate required fields', async () => {
      // Arrange
      const invalidDto = {
        // Missing required fields
        description: 'Only description',
      };

      nock(API_CONFIG.baseUrl)
        .post(`${API_CONFIG.apiVersion}/[resources]`)
        .reply(400, {
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: {
              name: 'Name is required',
            },
          },
        });

      // Act & Assert
      // await expect(
      //   apiClient.post('/[resources]', invalidDto)
      // ).rejects.toMatchObject({
      //   response: { status: 400 }
      // });
    });

    it('should validate field formats', async () => {
      // Arrange
      const invalidDto = {
        name: 'Test',
        email: 'invalid-email', // Invalid format
      };

      nock(API_CONFIG.baseUrl)
        .post(`${API_CONFIG.apiVersion}/[resources]`)
        .reply(400, {
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: {
              email: 'Invalid email format',
            },
          },
        });

      // Act & Assert
      // await expect(
      //   apiClient.post('/[resources]', invalidDto)
      // ).rejects.toMatchObject({
      //   response: { status: 400 }
      // });
    });

    it('should prevent duplicate entries', async () => {
      // Arrange
      const duplicateDto = {
        name: 'Duplicate Name',
        // unique field that already exists
      };

      nock(API_CONFIG.baseUrl)
        .post(`${API_CONFIG.apiVersion}/[resources]`)
        .reply(409, {
          success: false,
          error: {
            message: 'Resource already exists',
            code: 'DUPLICATE_ERROR',
          },
        });

      // Act & Assert
      // await expect(
      //   apiClient.post('/[resources]', duplicateDto)
      // ).rejects.toMatchObject({
      //   response: { status: 409 }
      // });
    });
  });

  // ==================== PUT/PATCH (UPDATE) ENDPOINT ====================

  describe('PUT /[resources]/:id', () => {
    it('should update existing resource', async () => {
      // Arrange
      const updateDto: Update[Resource]DTO = {
        name: 'Updated Name',
        description: 'Updated description',
      };

      const updatedResource = {
        id: '123',
        ...updateDto,
        updatedAt: new Date().toISOString(),
      };

      nock(API_CONFIG.baseUrl)
        .put(`${API_CONFIG.apiVersion}/[resources]/123`, updateDto)
        .reply(200, {
          success: true,
          data: updatedResource,
        });

      // Act
      // const response = await apiClient.put('/[resources]/123', updateDto);

      // Assert
      // expect(response.data.data.name).toBe(updateDto.name);
      // expect(response.data.data.description).toBe(updateDto.description);
    });

    it('should return 404 when updating non-existent resource', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .put(`${API_CONFIG.apiVersion}/[resources]/999`)
        .reply(404, {
          success: false,
          error: {
            message: 'Resource not found',
            code: 'NOT_FOUND',
          },
        });

      // Act & Assert
      // await expect(
      //   apiClient.put('/[resources]/999', { name: 'Test' })
      // ).rejects.toMatchObject({
      //   response: { status: 404 }
      // });
    });

    it('should validate update data', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .put(`${API_CONFIG.apiVersion}/[resources]/123`)
        .reply(400, {
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
          },
        });

      // Act & Assert
      // await expect(
      //   apiClient.put('/[resources]/123', { name: '' }) // Invalid
      // ).rejects.toMatchObject({
      //   response: { status: 400 }
      // });
    });

    it('should support partial updates (PATCH)', async () => {
      // Arrange
      const partialUpdate = { name: 'Only Update Name' };

      nock(API_CONFIG.baseUrl)
        .patch(`${API_CONFIG.apiVersion}/[resources]/123`, partialUpdate)
        .reply(200, {
          success: true,
          data: {
            id: '123',
            name: 'Only Update Name',
            description: 'Original description', // Unchanged
          },
        });

      // Act
      // const response = await apiClient.patch('/[resources]/123', partialUpdate);

      // Assert
      // expect(response.data.data.name).toBe(partialUpdate.name);
      // expect(response.data.data.description).toBe('Original description');
    });
  });

  // ==================== DELETE ENDPOINT ====================

  describe('DELETE /[resources]/:id', () => {
    it('should delete resource', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .delete(`${API_CONFIG.apiVersion}/[resources]/123`)
        .reply(204); // No content

      // Act
      // const response = await apiClient.delete('/[resources]/123');

      // Assert
      // expect(response.status).toBe(204);
    });

    it('should return 404 when deleting non-existent resource', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .delete(`${API_CONFIG.apiVersion}/[resources]/999`)
        .reply(404, {
          success: false,
          error: {
            message: 'Resource not found',
            code: 'NOT_FOUND',
          },
        });

      // Act & Assert
      // await expect(
      //   apiClient.delete('/[resources]/999')
      // ).rejects.toMatchObject({
      //   response: { status: 404 }
      // });
    });

    it('should prevent deletion if resource is in use', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .delete(`${API_CONFIG.apiVersion}/[resources]/123`)
        .reply(409, {
          success: false,
          error: {
            message: 'Cannot delete: Resource is in use',
            code: 'CONFLICT',
          },
        });

      // Act & Assert
      // await expect(
      //   apiClient.delete('/[resources]/123')
      // ).rejects.toMatchObject({
      //   response: { status: 409 }
      // });
    });

    it('should support soft delete', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .delete(`${API_CONFIG.apiVersion}/[resources]/123`)
        .reply(200, {
          success: true,
          data: {
            id: '123',
            deletedAt: new Date().toISOString(),
          },
        });

      // Act
      // const response = await apiClient.delete('/[resources]/123');

      // Assert
      // expect(response.data.data.deletedAt).toBeTruthy();
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]`)
        .replyWithError('Network error');

      // Act & Assert
      // await expect(
      //   apiClient.get('/[resources]')
      // ).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]`)
        .delay(API_CONFIG.timeout + 1000)
        .reply(200, {});

      // Act & Assert
      // await expect(
      //   apiClient.get('/[resources]', { timeout: API_CONFIG.timeout })
      // ).rejects.toThrow('timeout');
    });

    it('should handle 500 server errors', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]`)
        .reply(500, {
          success: false,
          error: {
            message: 'Internal server error',
            code: 'SERVER_ERROR',
          },
        });

      // Act & Assert
      // await expect(
      //   apiClient.get('/[resources]')
      // ).rejects.toMatchObject({
      //   response: { status: 500 }
      // });
    });

    it('should handle malformed JSON responses', async () => {
      // Arrange
      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]`)
        .reply(200, 'Not valid JSON{');

      // Act & Assert
      // await expect(
      //   apiClient.get('/[resources]')
      // ).rejects.toThrow();
    });
  });

  // ==================== RESPONSE VALIDATION ====================

  describe('Response Validation', () => {
    it('should match expected DTO structure', async () => {
      // Arrange
      const mockResource = create[Resource]Factory();

      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]/123`)
        .reply(200, {
          success: true,
          data: mockResource,
        });

      // Act
      // const response = await apiClient.get('/[resources]/123');

      // Assert - Validate structure
      // expect(response.data.data).toHaveProperty('id');
      // expect(response.data.data).toHaveProperty('name');
      // expect(response.data.data).toHaveProperty('createdAt');
      // expect(response.data.data).toHaveProperty('updatedAt');
    });

    it('should have consistent timestamps', async () => {
      // Arrange
      const mockResource = create[Resource]Factory();

      nock(API_CONFIG.baseUrl)
        .get(`${API_CONFIG.apiVersion}/[resources]/123`)
        .reply(200, {
          success: true,
          data: mockResource,
        });

      // Act
      // const response = await apiClient.get('/[resources]/123');

      // Assert
      // expect(response.data.data.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      // expect(new Date(response.data.data.createdAt).getTime()).not.toBeNaN();
    });
  });
});

// ==================== NOTES ====================

/**
 * API INTEGRATION TEST BEST PRACTICES:
 *
 * 1. Test all HTTP methods (GET, POST, PUT, PATCH, DELETE)
 *    - Cover all CRUD operations
 *    - Test both success and error paths
 *
 * 2. Validate request and response DTOs
 *    - Ensure data structure matches contracts
 *    - Verify field types and formats
 *
 * 3. Test authentication and authorization
 *    - Verify token requirements
 *    - Test permission checks
 *
 * 4. Test error scenarios
 *    - Network errors
 *    - Server errors (5xx)
 *    - Client errors (4xx)
 *    - Validation errors
 *
 * 5. Test edge cases
 *    - Empty responses
 *    - Null values
 *    - Very large payloads
 *    - Special characters
 *
 * 6. Use realistic test data
 *    - Use factories for consistency
 *    - Match production data patterns
 *
 * 7. Test pagination and filtering
 *    - Query parameters
 *    - Sorting
 *    - Search
 *
 * 8. Mock external services
 *    - Use nock for HTTP mocks
 *    - Don't make real API calls in tests
 *
 * 9. Clean up after tests
 *    - Reset mocks
 *    - Clear test data
 *
 * 10. Document API behavior
 *     - Tests serve as API documentation
 *     - Show expected usage patterns
 */

/**
 * COMMON PATTERNS:
 *
 * Nock setup:
 *   nock(baseUrl)
 *     .get('/path')
 *     .query({ param: 'value' })
 *     .reply(200, response);
 *
 * Supertest (backend):
 *   await request(app)
 *     .post('/path')
 *     .set(headers)
 *     .send(body)
 *     .expect(201);
 *
 * Error assertions:
 *   await expect(promise).rejects.toThrow();
 *   await expect(promise).rejects.toMatchObject({ response: { status: 404 }});
 *
 * Response validation:
 *   expect(response.data).toHaveProperty('id');
 *   expect(response.data).toMatchObject(expected);
 */

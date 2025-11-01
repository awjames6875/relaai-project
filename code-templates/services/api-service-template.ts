/**
 * API Service Template
 *
 * This template demonstrates how to create a type-safe API service layer:
 * - Supabase client wrapper
 * - CRUD operations
 * - Error handling
 * - Type-safe requests/responses using DTOs
 * - Query building
 *
 * @example
 * // Import and use in thunks or components:
 * import * as exampleService from './services/exampleService';
 *
 * const items = await exampleService.fetchItems({ page: 1 });
 * const newItem = await exampleService.createItem({ name: 'New' });
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
// TODO: Import DTOs from contracts
// import type {
//   Contact,
//   CreateContactDTO,
//   UpdateContactDTO,
//   PaginatedResponse,
//   PaginationParams,
// } from '../../contracts/data-contracts/dto-definitions';

// ==================== CONFIGURATION ====================

/**
 * Supabase client configuration
 *
 * TODO: Move these to environment variables
 */
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

/**
 * Initialize Supabase client
 *
 * This should be a singleton instance shared across the app
 */
let supabaseClient: SupabaseClient | null = null;

/**
 * Get or create Supabase client instance
 *
 * @returns Supabase client
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        // TODO: Configure auth options
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseClient;
}

/**
 * Set custom Supabase client (useful for testing)
 *
 * @param client - Custom Supabase client
 */
export function setSupabaseClient(client: SupabaseClient): void {
  supabaseClient = client;
}

// ==================== ERROR HANDLING ====================

/**
 * Custom API error class
 *
 * Provides structured error information
 */
export class ApiError extends Error {
  code: string;
  details?: any;
  statusCode?: number;

  constructor(message: string, code: string, details?: any, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
  }
}

/**
 * Handle Supabase errors and convert to ApiError
 *
 * @param error - Supabase error object
 * @param operation - Description of the operation that failed
 * @returns ApiError instance
 */
function handleSupabaseError(error: any, operation: string): ApiError {
  console.error(`[${operation}] Supabase error:`, error);

  // Extract error details
  const message = error?.message || `Failed to ${operation}`;
  const code = error?.code || 'UNKNOWN_ERROR';
  const details = error?.details || error?.hint;
  const statusCode = error?.status;

  return new ApiError(message, code, details, statusCode);
}

/**
 * Validate response data
 *
 * @param data - Response data
 * @param operation - Description of the operation
 * @throws ApiError if data is invalid
 */
function validateResponse(data: any, operation: string): void {
  if (data === null || data === undefined) {
    throw new ApiError(
      `${operation} returned no data`,
      'NO_DATA',
      undefined,
      404
    );
  }
}

// ==================== TYPE DEFINITIONS ====================

/**
 * TODO: Replace these with your actual DTO types from contracts
 */
interface ExampleItem {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface CreateExampleItemDTO {
  name: string;
  description?: string;
  status?: 'active' | 'archived';
}

interface UpdateExampleItemDTO {
  name?: string;
  description?: string;
  status?: 'active' | 'archived';
}

interface FetchItemsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'active' | 'archived';
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ==================== FETCH OPERATIONS ====================

/**
 * Fetch paginated list of items
 *
 * Features:
 * - Pagination
 * - Search
 * - Filtering
 * - Sorting
 * - Row Level Security (RLS) enforced by Supabase
 *
 * @param params - Query parameters
 * @returns Paginated response with items
 * @throws ApiError on failure
 *
 * @example
 * const result = await fetchItems({ page: 1, pageSize: 20, search: 'test' });
 */
export async function fetchItems(
  params: FetchItemsParams = {}
): Promise<{
  data: ExampleItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}> {
  const {
    page = 1,
    pageSize = 20,
    search,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  try {
    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    let query = client
      .from('example_items')
      .select('*', { count: 'exact' });

    // Apply filters
    // RLS automatically filters by userId
    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      // TODO: Adjust search fields based on your schema
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Exclude soft-deleted items
    query = query.is('deletedAt', null);

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw handleSupabaseError(error, 'fetch items');
    }

    validateResponse(data, 'fetch items');

    // Calculate pagination metadata
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasMore = page < totalPages;

    return {
      data: data as ExampleItem[],
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasMore,
      },
    };
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, 'fetch items');
  }
}

/**
 * Fetch a single item by ID
 *
 * @param itemId - Item ID
 * @returns Item object
 * @throws ApiError if not found or on failure
 *
 * @example
 * const item = await fetchItemById('123');
 */
export async function fetchItemById(itemId: string): Promise<ExampleItem> {
  try {
    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    const { data, error } = await client
      .from('example_items')
      .select('*')
      .eq('id', itemId)
      .is('deletedAt', null)
      .single();

    if (error) {
      throw handleSupabaseError(error, `fetch item ${itemId}`);
    }

    validateResponse(data, `fetch item ${itemId}`);

    return data as ExampleItem;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, `fetch item ${itemId}`);
  }
}

// ==================== CREATE OPERATION ====================

/**
 * Create a new item
 *
 * Features:
 * - Server-side validation via database constraints
 * - Automatic userId from RLS
 * - Returns created item with generated ID
 *
 * @param itemData - Item creation data
 * @returns Created item
 * @throws ApiError on validation failure or error
 *
 * @example
 * const newItem = await createItem({ name: 'New Item' });
 */
export async function createItem(itemData: CreateExampleItemDTO): Promise<ExampleItem> {
  try {
    // TODO: Add client-side validation
    if (!itemData.name || itemData.name.trim().length === 0) {
      throw new ApiError('Name is required', 'VALIDATION_ERROR', { field: 'name' }, 400);
    }

    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    const { data, error } = await client
      .from('example_items')
      .insert([
        {
          ...itemData,
          // userId is automatically set by RLS
          // id, createdAt, updatedAt are automatically generated
        },
      ])
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, 'create item');
    }

    validateResponse(data, 'create item');

    return data as ExampleItem;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, 'create item');
  }
}

// ==================== UPDATE OPERATION ====================

/**
 * Update an existing item
 *
 * Features:
 * - Partial updates (only changed fields)
 * - Automatic updatedAt timestamp
 * - RLS ensures user can only update their own items
 *
 * @param itemId - Item ID
 * @param updates - Partial item updates
 * @returns Updated item
 * @throws ApiError if not found or on failure
 *
 * @example
 * const updated = await updateItem('123', { name: 'Updated Name' });
 */
export async function updateItem(
  itemId: string,
  updates: UpdateExampleItemDTO
): Promise<ExampleItem> {
  try {
    // TODO: Add client-side validation
    if (updates.name !== undefined && updates.name.trim().length === 0) {
      throw new ApiError('Name cannot be empty', 'VALIDATION_ERROR', { field: 'name' }, 400);
    }

    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    const { data, error } = await client
      .from('example_items')
      .update({
        ...updates,
        // updatedAt is automatically updated by trigger
      })
      .eq('id', itemId)
      .is('deletedAt', null)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, `update item ${itemId}`);
    }

    validateResponse(data, `update item ${itemId}`);

    return data as ExampleItem;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, `update item ${itemId}`);
  }
}

// ==================== DELETE OPERATION ====================

/**
 * Soft delete an item
 *
 * Features:
 * - Soft delete (sets deletedAt timestamp)
 * - Can be restored later
 * - RLS ensures user can only delete their own items
 *
 * @param itemId - Item ID
 * @returns void
 * @throws ApiError if not found or on failure
 *
 * @example
 * await deleteItem('123');
 */
export async function deleteItem(itemId: string): Promise<void> {
  try {
    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    const { error } = await client
      .from('example_items')
      .update({ deletedAt: new Date().toISOString() })
      .eq('id', itemId)
      .is('deletedAt', null);

    if (error) {
      throw handleSupabaseError(error, `delete item ${itemId}`);
    }
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, `delete item ${itemId}`);
  }
}

/**
 * Hard delete an item (permanent)
 *
 * WARNING: This permanently deletes the item. Use with caution.
 *
 * @param itemId - Item ID
 * @returns void
 * @throws ApiError if not found or on failure
 *
 * @example
 * await hardDeleteItem('123');
 */
export async function hardDeleteItem(itemId: string): Promise<void> {
  try {
    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    const { error } = await client
      .from('example_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      throw handleSupabaseError(error, `hard delete item ${itemId}`);
    }
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, `hard delete item ${itemId}`);
  }
}

/**
 * Restore a soft-deleted item
 *
 * @param itemId - Item ID
 * @returns Restored item
 * @throws ApiError if not found or on failure
 *
 * @example
 * const restored = await restoreItem('123');
 */
export async function restoreItem(itemId: string): Promise<ExampleItem> {
  try {
    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    const { data, error } = await client
      .from('example_items')
      .update({ deletedAt: null })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error, `restore item ${itemId}`);
    }

    validateResponse(data, `restore item ${itemId}`);

    return data as ExampleItem;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, `restore item ${itemId}`);
  }
}

// ==================== BATCH OPERATIONS ====================

/**
 * Batch create multiple items
 *
 * @param items - Array of item creation data
 * @returns Array of created items
 * @throws ApiError on failure
 *
 * @example
 * const created = await batchCreateItems([
 *   { name: 'Item 1' },
 *   { name: 'Item 2' },
 * ]);
 */
export async function batchCreateItems(
  items: CreateExampleItemDTO[]
): Promise<ExampleItem[]> {
  try {
    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    const { data, error } = await client
      .from('example_items')
      .insert(items)
      .select();

    if (error) {
      throw handleSupabaseError(error, 'batch create items');
    }

    validateResponse(data, 'batch create items');

    return data as ExampleItem[];
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, 'batch create items');
  }
}

/**
 * Batch update multiple items
 *
 * Note: Supabase doesn't support batch updates with different values per row,
 * so this performs individual updates. For large batches, consider using
 * a database function.
 *
 * @param updates - Array of update operations
 * @returns Array of updated items
 * @throws ApiError on failure
 *
 * @example
 * const updated = await batchUpdateItems([
 *   { id: '1', updates: { status: 'active' } },
 *   { id: '2', updates: { status: 'archived' } },
 * ]);
 */
export async function batchUpdateItems(
  updates: Array<{ id: string; updates: UpdateExampleItemDTO }>
): Promise<ExampleItem[]> {
  try {
    // Perform updates in parallel
    const updatePromises = updates.map(({ id, updates: itemUpdates }) =>
      updateItem(id, itemUpdates)
    );

    const results = await Promise.all(updatePromises);
    return results;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, 'batch update items');
  }
}

/**
 * Batch delete multiple items (soft delete)
 *
 * @param itemIds - Array of item IDs
 * @returns void
 * @throws ApiError on failure
 *
 * @example
 * await batchDeleteItems(['1', '2', '3']);
 */
export async function batchDeleteItems(itemIds: string[]): Promise<void> {
  try {
    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    const { error } = await client
      .from('example_items')
      .update({ deletedAt: new Date().toISOString() })
      .in('id', itemIds)
      .is('deletedAt', null);

    if (error) {
      throw handleSupabaseError(error, 'batch delete items');
    }
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, 'batch delete items');
  }
}

// ==================== SEARCH OPERATIONS ====================

/**
 * Full-text search across items
 *
 * @param query - Search query
 * @param options - Additional search options
 * @returns Array of matching items
 * @throws ApiError on failure
 *
 * @example
 * const results = await searchItems('important', { limit: 10 });
 */
export async function searchItems(
  query: string,
  options: { limit?: number; offset?: number } = {}
): Promise<ExampleItem[]> {
  const { limit = 20, offset = 0 } = options;

  try {
    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    // TODO: Adjust search fields and use full-text search if configured
    const { data, error } = await client
      .from('example_items')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .is('deletedAt', null)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw handleSupabaseError(error, 'search items');
    }

    return (data || []) as ExampleItem[];
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, 'search items');
  }
}

// ==================== AGGREGATE OPERATIONS ====================

/**
 * Count items with optional filters
 *
 * @param filters - Filter options
 * @returns Count of items
 * @throws ApiError on failure
 *
 * @example
 * const count = await countItems({ status: 'active' });
 */
export async function countItems(filters: { status?: string } = {}): Promise<number> {
  try {
    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    let query = client
      .from('example_items')
      .select('*', { count: 'exact', head: true })
      .is('deletedAt', null);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { count, error } = await query;

    if (error) {
      throw handleSupabaseError(error, 'count items');
    }

    return count || 0;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, 'count items');
  }
}

// ==================== REAL-TIME SUBSCRIPTIONS ====================

/**
 * Subscribe to real-time changes for items
 *
 * @param callback - Callback function for changes
 * @returns Unsubscribe function
 *
 * @example
 * const unsubscribe = subscribeToItems((payload) => {
 *   console.log('Change:', payload);
 * });
 *
 * // Later:
 * unsubscribe();
 */
export function subscribeToItems(
  callback: (payload: any) => void
): () => void {
  const client = getSupabaseClient();

  // TODO: Replace 'example_items' with your actual table name
  const subscription = client
    .channel('example_items_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'example_items',
      },
      callback
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if an item exists
 *
 * @param itemId - Item ID
 * @returns True if exists
 * @throws ApiError on failure
 *
 * @example
 * const exists = await itemExists('123');
 */
export async function itemExists(itemId: string): Promise<boolean> {
  try {
    const client = getSupabaseClient();

    // TODO: Replace 'example_items' with your actual table name
    const { data, error } = await client
      .from('example_items')
      .select('id')
      .eq('id', itemId)
      .is('deletedAt', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return false;
      }
      throw handleSupabaseError(error, `check if item ${itemId} exists`);
    }

    return !!data;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw handleSupabaseError(error, `check if item ${itemId} exists`);
  }
}

// ==================== BEST PRACTICES ====================

/**
 * SERVICE LAYER BEST PRACTICES:
 *
 * 1. Type Safety:
 *    - Use DTOs from contracts for all inputs/outputs
 *    - Validate data at service boundaries
 *    - Return typed responses
 *
 * 2. Error Handling:
 *    - Catch and convert all errors to ApiError
 *    - Provide meaningful error messages
 *    - Include error codes for client handling
 *
 * 3. Security:
 *    - Never bypass Row Level Security (RLS)
 *    - Validate user permissions at API level
 *    - Sanitize inputs to prevent injection
 *
 * 4. Performance:
 *    - Use indexes on queried columns
 *    - Implement pagination for large datasets
 *    - Cache frequently accessed data
 *    - Use select('*') sparingly - only select needed fields
 *
 * 5. Maintainability:
 *    - Keep functions focused and single-purpose
 *    - Document with JSDoc comments
 *    - Follow consistent naming conventions
 *    - Use constants for table names
 */

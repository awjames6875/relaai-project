/**
 * Custom React Hook Template
 *
 * This template demonstrates how to create custom hooks for data fetching:
 * - useQuery pattern for fetching data
 * - useMutation pattern for modifying data
 * - Loading/error states
 * - TypeScript generics
 * - Hook composition
 *
 * @example
 * // Use in components:
 * import { useExampleData, useCreateExample } from './hooks/useExample';
 *
 * const MyComponent = () => {
 *   const { data, isLoading, error, refetch } = useExampleData();
 *   const { mutate, isLoading: isCreating } = useCreateExample();
 *
 *   const handleCreate = () => {
 *     mutate({ name: 'New Item' });
 *   };
 * };
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// TODO: Import your thunks and selectors
// import { fetchExampleData, createExampleItem, updateExampleItem, deleteExampleItem } from '../redux/exampleThunks';
// import { selectProcessedItems, selectIsLoading, selectError } from '../redux/exampleSelectors';

// ==================== TYPE DEFINITIONS ====================

/**
 * Generic query result type
 */
interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  isRefetching: boolean;
}

/**
 * Generic mutation result type
 */
interface MutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  data: TData | null;
  reset: () => void;
}

/**
 * Mutation callbacks
 */
interface MutationCallbacks<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: string, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: string | null, variables: TVariables) => void;
}

// ==================== FETCH HOOK (useQuery Pattern) ====================

/**
 * Custom hook for fetching a list of items
 *
 * Features:
 * - Automatic fetch on mount
 * - Loading and error states
 * - Refetch functionality
 * - Integration with Redux
 *
 * @example
 * const { data, isLoading, error, refetch } = useExampleItems();
 *
 * @returns Query result with items data
 */
export function useExampleItems(): QueryResult<any[]> {
  // TODO: Replace with your Redux selectors
  // const data = useSelector(selectProcessedItems);
  // const isLoading = useSelector(selectIsLoading);
  // const error = useSelector(selectError);
  // const dispatch = useDispatch();

  // TODO: Remove mock state
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);

  /**
   * Fetch data from API
   */
  const fetchData = useCallback(() => {
    // TODO: Dispatch your fetch thunk
    // dispatch(fetchExampleData());
    console.log('Fetching example items...');
  }, []);

  /**
   * Refetch data
   */
  const refetch = useCallback(() => {
    setIsRefetching(true);
    fetchData();
    // TODO: Set isRefetching to false after fetch completes
    // You can do this in useEffect watching isLoading
  }, [fetchData]);

  /**
   * Fetch on mount
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Update refetching state
   */
  useEffect(() => {
    if (!isLoading) {
      setIsRefetching(false);
    }
  }, [isLoading]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refetch,
    isRefetching,
  };
}

/**
 * Custom hook for fetching a single item by ID
 *
 * Features:
 * - Automatic fetch when ID changes
 * - Skip fetch if ID is null
 * - Loading and error states
 *
 * @example
 * const { data, isLoading, error } = useExampleItem(itemId);
 *
 * @param itemId - Item ID to fetch (or null to skip)
 * @returns Query result with item data
 */
export function useExampleItem(itemId: string | null): QueryResult<any> {
  // TODO: Use selector to get item from Redux store
  // const data = useSelector((state) => itemId ? selectItemById(state, itemId) : null);
  // const dispatch = useDispatch();

  // TODO: Remove mock state
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);

  /**
   * Fetch item by ID
   */
  const fetchItem = useCallback(() => {
    if (!itemId) return;

    // TODO: Dispatch your fetch by ID thunk
    // dispatch(fetchExampleItemById(itemId));
    console.log('Fetching item:', itemId);
  }, [itemId]);

  /**
   * Refetch item
   */
  const refetch = useCallback(() => {
    setIsRefetching(true);
    fetchItem();
  }, [fetchItem]);

  /**
   * Fetch when ID changes
   */
  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refetch,
    isRefetching,
  };
}

// ==================== MUTATION HOOKS (useMutation Pattern) ====================

/**
 * Custom hook for creating an item
 *
 * Features:
 * - Async mutation with callbacks
 * - Loading and error states
 * - Optimistic updates (optional)
 * - Reset functionality
 *
 * @example
 * const { mutate, isLoading } = useCreateExampleItem({
 *   onSuccess: (data) => console.log('Created:', data),
 *   onError: (error) => console.error('Failed:', error),
 * });
 *
 * mutate({ name: 'New Item' });
 *
 * @param callbacks - Success/error callbacks
 * @returns Mutation result with mutate function
 */
export function useCreateExampleItem(
  callbacks?: MutationCallbacks<any, Partial<any>>
): MutationResult<any, Partial<any>> {
  // const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  // Use ref to store callbacks to avoid re-creating mutate function
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  /**
   * Mutate function (fire and forget)
   */
  const mutate = useCallback(
    async (variables: Partial<any>) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        // TODO: Dispatch your create thunk and unwrap result
        // const result = await dispatch(createExampleItem(variables)).unwrap();

        // TODO: Remove mock result
        const result = { id: Date.now().toString(), ...variables };

        setData(result);
        setIsLoading(false);

        // Call success callback
        callbacksRef.current?.onSuccess?.(result, variables);
        callbacksRef.current?.onSettled?.(result, null, variables);

        return result;
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to create item';
        setError(errorMessage);
        setIsError(true);
        setIsLoading(false);

        // Call error callback
        callbacksRef.current?.onError?.(errorMessage, variables);
        callbacksRef.current?.onSettled?.(undefined, errorMessage, variables);

        return undefined;
      }
    },
    []
  );

  /**
   * Mutate async function (returns promise)
   */
  const mutateAsync = useCallback(
    async (variables: Partial<any>) => {
      const result = await mutate(variables);
      if (!result) {
        throw new Error(error || 'Mutation failed');
      }
      return result;
    },
    [mutate, error]
  );

  /**
   * Reset mutation state
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
    setData(null);
  }, []);

  return {
    mutate,
    mutateAsync,
    isLoading,
    isError,
    error,
    data,
    reset,
  };
}

/**
 * Custom hook for updating an item
 *
 * @example
 * const { mutate } = useUpdateExampleItem({
 *   onSuccess: () => console.log('Updated!'),
 * });
 *
 * mutate({ id: '123', updates: { name: 'Updated' } });
 *
 * @param callbacks - Success/error callbacks
 * @returns Mutation result with mutate function
 */
export function useUpdateExampleItem(
  callbacks?: MutationCallbacks<any, { id: string; updates: Partial<any> }>
): MutationResult<any, { id: string; updates: Partial<any> }> {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const mutate = useCallback(
    async (variables: { id: string; updates: Partial<any> }) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        // TODO: Dispatch your update thunk
        // const result = await dispatch(updateExampleItem(variables)).unwrap();

        // TODO: Remove mock result
        const result = { id: variables.id, ...variables.updates };

        setData(result);
        setIsLoading(false);

        callbacksRef.current?.onSuccess?.(result, variables);
        callbacksRef.current?.onSettled?.(result, null, variables);

        return result;
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to update item';
        setError(errorMessage);
        setIsError(true);
        setIsLoading(false);

        callbacksRef.current?.onError?.(errorMessage, variables);
        callbacksRef.current?.onSettled?.(undefined, errorMessage, variables);

        return undefined;
      }
    },
    []
  );

  const mutateAsync = useCallback(
    async (variables: { id: string; updates: Partial<any> }) => {
      const result = await mutate(variables);
      if (!result) {
        throw new Error(error || 'Mutation failed');
      }
      return result;
    },
    [mutate, error]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
    setData(null);
  }, []);

  return {
    mutate,
    mutateAsync,
    isLoading,
    isError,
    error,
    data,
    reset,
  };
}

/**
 * Custom hook for deleting an item
 *
 * @example
 * const { mutate: deleteItem } = useDeleteExampleItem({
 *   onSuccess: () => console.log('Deleted!'),
 * });
 *
 * deleteItem('123');
 *
 * @param callbacks - Success/error callbacks
 * @returns Mutation result with mutate function
 */
export function useDeleteExampleItem(
  callbacks?: MutationCallbacks<void, string>
): MutationResult<void, string> {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<void | null>(null);

  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const mutate = useCallback(async (itemId: string) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // TODO: Dispatch your delete thunk
      // await dispatch(deleteExampleItem(itemId)).unwrap();

      console.log('Deleting item:', itemId);

      setIsLoading(false);

      callbacksRef.current?.onSuccess?.(undefined as any, itemId);
      callbacksRef.current?.onSettled?.(undefined, null, itemId);

      return undefined;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to delete item';
      setError(errorMessage);
      setIsError(true);
      setIsLoading(false);

      callbacksRef.current?.onError?.(errorMessage, itemId);
      callbacksRef.current?.onSettled?.(undefined, errorMessage, itemId);

      return undefined;
    }
  }, []);

  const mutateAsync = useCallback(
    async (itemId: string) => {
      await mutate(itemId);
      if (error) {
        throw new Error(error);
      }
    },
    [mutate, error]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
    setData(null);
  }, []);

  return {
    mutate,
    mutateAsync,
    isLoading,
    isError,
    error,
    data,
    reset,
  };
}

// ==================== COMPOSED HOOKS ====================

/**
 * Composed hook that provides all CRUD operations for items
 *
 * This combines multiple hooks into a single API
 *
 * @example
 * const {
 *   items,
 *   isLoading,
 *   createItem,
 *   updateItem,
 *   deleteItem,
 * } = useExampleCRUD();
 *
 * @returns Object with data and all CRUD operations
 */
export function useExampleCRUD() {
  const { data: items, isLoading, error, refetch } = useExampleItems();

  const { mutate: createItem, isLoading: isCreating } = useCreateExampleItem({
    onSuccess: () => {
      // Refetch list after creating
      refetch();
    },
  });

  const { mutate: updateItem, isLoading: isUpdating } = useUpdateExampleItem({
    onSuccess: () => {
      // Refetch list after updating
      refetch();
    },
  });

  const { mutate: deleteItem, isLoading: isDeleting } = useDeleteExampleItem({
    onSuccess: () => {
      // Refetch list after deleting
      refetch();
    },
  });

  return {
    items,
    isLoading,
    error,
    refetch,
    createItem,
    isCreating,
    updateItem,
    isUpdating,
    deleteItem,
    isDeleting,
  };
}

// ==================== UTILITY HOOKS ====================

/**
 * Hook for debounced value
 *
 * Useful for search inputs to avoid excessive API calls
 *
 * @example
 * const [searchQuery, setSearchQuery] = useState('');
 * const debouncedQuery = useDebounce(searchQuery, 500);
 *
 * useEffect(() => {
 *   if (debouncedQuery) {
 *     // Perform search
 *   }
 * }, [debouncedQuery]);
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for interval-based polling
 *
 * Useful for refreshing data periodically
 *
 * @example
 * const { data } = useExampleItems();
 * usePolling(() => refetch(), 30000); // Poll every 30 seconds
 *
 * @param callback - Function to call on each interval
 * @param interval - Interval in milliseconds
 * @param enabled - Whether polling is enabled (default: true)
 */
export function usePolling(
  callback: () => void,
  interval: number,
  enabled: boolean = true
): void {
  const savedCallback = useRef(callback);

  // Update callback ref on each render
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up interval
  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval, enabled]);
}

/**
 * Hook for optimistic updates
 *
 * Provides helpers for managing optimistic UI updates
 *
 * @example
 * const { optimisticUpdate, revert } = useOptimisticUpdate();
 *
 * const handleUpdate = async () => {
 *   const rollback = optimisticUpdate(itemId, updates);
 *   try {
 *     await updateItem({ id: itemId, updates });
 *   } catch (error) {
 *     rollback(); // Revert on error
 *   }
 * };
 *
 * @returns Object with optimistic update helpers
 */
export function useOptimisticUpdate() {
  // TODO: Implement optimistic update logic with Redux
  // This would integrate with your Redux slice's optimistic update actions

  const optimisticUpdate = useCallback(
    (itemId: string, updates: Partial<any>) => {
      // TODO: Dispatch optimistic update action
      // dispatch(optimisticUpdate({ id: itemId, updates }));

      // Return rollback function
      return () => {
        // TODO: Dispatch revert action
        // dispatch(revertOptimistic(itemId));
      };
    },
    []
  );

  return {
    optimisticUpdate,
  };
}

// ==================== BEST PRACTICES ====================

/**
 * CUSTOM HOOK BEST PRACTICES:
 *
 * 1. Naming Convention:
 *    - Start with "use" prefix
 *    - Use descriptive names (useCreateExample, not useCreate)
 *    - Follow React naming conventions
 *
 * 2. Return Values:
 *    - Return objects for multiple values
 *    - Use consistent structure across similar hooks
 *    - Provide loading/error states
 *
 * 3. Dependencies:
 *    - Use useCallback for functions
 *    - Use useMemo for computed values
 *    - Minimize re-renders
 *
 * 4. Error Handling:
 *    - Always provide error states
 *    - Use try/catch for async operations
 *    - Provide reset functionality
 *
 * 5. TypeScript:
 *    - Use generics for reusable hooks
 *    - Define explicit return types
 *    - Avoid 'any' types
 *
 * 6. Testing:
 *    - Test hooks with @testing-library/react-hooks
 *    - Mock dependencies
 *    - Test all states (loading, success, error)
 *
 * 7. Composition:
 *    - Build complex hooks from simple ones
 *    - Keep hooks focused and single-purpose
 *    - Share common logic via utility hooks
 */

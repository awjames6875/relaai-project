/**
 * Redux Selector Template
 *
 * This template demonstrates how to create memoized selectors using Reselect:
 * - Basic selectors (direct state access)
 * - Memoized selectors (computed/derived state)
 * - Selector composition
 * - Performance optimization patterns
 *
 * @example
 * // Use in components:
 * import { useSelector } from 'react-redux';
 * import { selectFilteredItems, selectSelectedItem } from './exampleSelectors';
 *
 * const MyComponent = () => {
 *   const items = useSelector(selectFilteredItems);
 *   const selectedItem = useSelector(selectSelectedItem);
 *   // ...
 * };
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../contracts/component-contracts/redux-types';
// TODO: Import your slice state type
// import type { ExampleState } from './exampleSlice';

// ==================== BASE SELECTORS ====================

/**
 * Base selectors directly access state without computation
 *
 * Best Practices:
 * - Keep these simple and focused
 * - Use these as inputs to memoized selectors
 * - Document the returned type
 *
 * Performance: O(1) - direct object property access
 */

/**
 * Select the entire example slice state
 *
 * @param state - Root Redux state
 * @returns The example slice state
 */
export const selectExampleState = (state: RootState) => state.example;

/**
 * Select all items (normalized)
 *
 * @param state - Root Redux state
 * @returns Record of items keyed by ID
 */
export const selectAllItems = (state: RootState) => state.example.items;

/**
 * Select all item IDs
 *
 * @param state - Root Redux state
 * @returns Array of item IDs in order
 */
export const selectAllItemIds = (state: RootState) => state.example.ids;

/**
 * Select the currently selected item ID
 *
 * @param state - Root Redux state
 * @returns Selected item ID or null
 */
export const selectSelectedId = (state: RootState) => state.example.selectedId;

/**
 * Select the search query
 *
 * @param state - Root Redux state
 * @returns Current search query string
 */
export const selectSearchQuery = (state: RootState) => state.example.searchQuery;

/**
 * Select the current filter
 *
 * @param state - Root Redux state
 * @returns Current filter value
 */
export const selectFilter = (state: RootState) => state.example.filterBy;

/**
 * Select the current sort option
 *
 * @param state - Root Redux state
 * @returns Current sort value
 */
export const selectSort = (state: RootState) => state.example.sortBy;

/**
 * Select loading state
 *
 * @param state - Root Redux state
 * @returns True if loading
 */
export const selectIsLoading = (state: RootState) => state.example.isLoading;

/**
 * Select refreshing state
 *
 * @param state - Root Redux state
 * @returns True if refreshing
 */
export const selectIsRefreshing = (state: RootState) => state.example.isRefreshing;

/**
 * Select error state
 *
 * @param state - Root Redux state
 * @returns Error message or null
 */
export const selectError = (state: RootState) => state.example.error;

/**
 * Select pagination state
 *
 * @param state - Root Redux state
 * @returns Pagination metadata
 */
export const selectPagination = (state: RootState) => state.example.pagination;

// ==================== MEMOIZED SELECTORS ====================

/**
 * Memoized selectors use createSelector for performance
 *
 * Benefits:
 * - Only re-compute when input selectors change
 * - Prevent unnecessary re-renders
 * - Can combine multiple selectors
 *
 * Performance: Cached until dependencies change
 */

/**
 * Select all items as an array (denormalized)
 *
 * Memoization: Only recomputes when items or ids change
 *
 * @returns Array of items in order
 */
export const selectItemsArray = createSelector(
  [selectAllItems, selectAllItemIds],
  (items, ids) => {
    // Convert normalized items back to array using ID order
    return ids.map(id => items[id]).filter(Boolean);
  }
);

/**
 * Select the currently selected item object
 *
 * Memoization: Only recomputes when selectedId or items change
 *
 * @returns Selected item object or null
 */
export const selectSelectedItem = createSelector(
  [selectAllItems, selectSelectedId],
  (items, selectedId) => {
    if (!selectedId) return null;
    return items[selectedId] || null;
  }
);

/**
 * Select items filtered by search query
 *
 * Memoization: Only recomputes when items, ids, or searchQuery change
 *
 * @returns Filtered array of items
 */
export const selectSearchedItems = createSelector(
  [selectItemsArray, selectSearchQuery],
  (items, searchQuery) => {
    // TODO: Adjust search logic based on your item structure
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter((item: any) => {
      // TODO: Update search fields based on your data model
      return (
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    });
  }
);

/**
 * Select items filtered by current filter option
 *
 * Memoization: Only recomputes when items or filter change
 *
 * @returns Filtered array of items
 */
export const selectFilteredItems = createSelector(
  [selectSearchedItems, selectFilter],
  (items, filterBy) => {
    // TODO: Implement filter logic based on your requirements
    if (filterBy === 'all') return items;

    return items.filter((item: any) => {
      // Example filter logic - adjust based on your data model
      switch (filterBy) {
        case 'active':
          return item.status === 'active';
        case 'archived':
          return item.status === 'archived';
        default:
          return true;
      }
    });
  }
);

/**
 * Select items sorted by current sort option
 *
 * Memoization: Only recomputes when filtered items or sort option change
 *
 * @returns Sorted array of items
 */
export const selectSortedItems = createSelector(
  [selectFilteredItems, selectSort],
  (items, sortBy) => {
    // Create a copy to avoid mutating the original array
    const sortedItems = [...items];

    // TODO: Implement sort logic based on your requirements
    switch (sortBy) {
      case 'name':
        return sortedItems.sort((a: any, b: any) =>
          a.name?.localeCompare(b.name || '') || 0
        );
      case 'date':
        return sortedItems.sort((a: any, b: any) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      case 'priority':
        return sortedItems.sort((a: any, b: any) =>
          (b.priority || 0) - (a.priority || 0)
        );
      default:
        return sortedItems;
    }
  }
);

/**
 * Select the final processed items (searched, filtered, sorted)
 *
 * This is the main selector to use in components that display item lists
 *
 * Memoization: Only recomputes when any upstream selector changes
 *
 * @returns Final processed array of items
 */
export const selectProcessedItems = createSelector(
  [selectSortedItems],
  (items) => items
);

// ==================== DERIVED STATE SELECTORS ====================

/**
 * Select total count of items
 *
 * @returns Number of items
 */
export const selectItemCount = createSelector(
  [selectAllItemIds],
  (ids) => ids.length
);

/**
 * Select filtered count of items
 *
 * @returns Number of filtered items
 */
export const selectFilteredItemCount = createSelector(
  [selectProcessedItems],
  (items) => items.length
);

/**
 * Select whether any items exist
 *
 * @returns True if items exist
 */
export const selectHasItems = createSelector(
  [selectItemCount],
  (count) => count > 0
);

/**
 * Select whether the list is empty after filtering
 *
 * @returns True if no items match current filters
 */
export const selectIsEmptyFiltered = createSelector(
  [selectFilteredItemCount],
  (count) => count === 0
);

/**
 * Select whether data is currently being fetched
 *
 * Combines loading and refreshing states
 *
 * @returns True if loading or refreshing
 */
export const selectIsFetching = createSelector(
  [selectIsLoading, selectIsRefreshing],
  (isLoading, isRefreshing) => isLoading || isRefreshing
);

/**
 * Select whether there's an error and what it is
 *
 * @returns Object with hasError flag and error message
 */
export const selectErrorState = createSelector(
  [selectError],
  (error) => ({
    hasError: !!error,
    message: error,
  })
);

// ==================== PARAMETERIZED SELECTORS ====================

/**
 * Factory function to create a selector for a specific item by ID
 *
 * Use this when you need to select an item by a dynamic ID
 *
 * @example
 * const item = useSelector(state => selectItemById(state, itemId));
 *
 * @param state - Root Redux state
 * @param itemId - ID of the item to select
 * @returns Item object or undefined
 */
export const selectItemById = (state: RootState, itemId: string) => {
  return state.example.items[itemId];
};

/**
 * Memoized selector factory for item by ID
 *
 * Creates a memoized selector for a specific ID
 * Better performance when ID doesn't change frequently
 *
 * @example
 * const selectUserItem = useMemo(() => makeSelectItemById(userId), [userId]);
 * const item = useSelector(selectUserItem);
 *
 * @param itemId - ID of the item to select
 * @returns Memoized selector function
 */
export const makeSelectItemById = (itemId: string) =>
  createSelector(
    [selectAllItems],
    (items) => items[itemId]
  );

/**
 * Select items by multiple IDs
 *
 * @example
 * const items = useSelector(state => selectItemsByIds(state, [id1, id2, id3]));
 *
 * @param state - Root Redux state
 * @param itemIds - Array of item IDs
 * @returns Array of item objects
 */
export const selectItemsByIds = createSelector(
  [
    selectAllItems,
    (_state: RootState, itemIds: string[]) => itemIds,
  ],
  (items, itemIds) => {
    return itemIds.map(id => items[id]).filter(Boolean);
  }
);

// ==================== COMPLEX COMPOSED SELECTORS ====================

/**
 * Select items with additional computed properties
 *
 * Example of adding derived properties to each item
 *
 * @returns Array of items with computed properties
 */
export const selectItemsWithMetadata = createSelector(
  [selectProcessedItems],
  (items) => {
    return items.map((item: any) => ({
      ...item,
      // TODO: Add computed properties
      // Example:
      // isExpired: new Date(item.expiresAt) < new Date(),
      // daysUntilDue: Math.ceil((new Date(item.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      // hasWarnings: item.warnings?.length > 0,
    }));
  }
);

/**
 * Select grouped items (e.g., by category, status, etc.)
 *
 * Example of grouping items by a property
 *
 * @returns Object with items grouped by category
 */
export const selectItemsGrouped = createSelector(
  [selectProcessedItems],
  (items) => {
    // TODO: Adjust grouping logic based on your data model
    return items.reduce((groups: Record<string, any[]>, item: any) => {
      const groupKey = item.category || 'uncategorized'; // TODO: Change grouping key
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {});
  }
);

/**
 * Select statistics about the items
 *
 * Example of computing aggregate statistics
 *
 * @returns Object with statistical data
 */
export const selectItemStatistics = createSelector(
  [selectProcessedItems],
  (items) => {
    // TODO: Adjust statistics based on your data model
    return {
      total: items.length,
      // Example statistics:
      // active: items.filter((item: any) => item.status === 'active').length,
      // completed: items.filter((item: any) => item.status === 'completed').length,
      // averageScore: items.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / items.length || 0,
    };
  }
);

// ==================== PERFORMANCE TIPS ====================

/**
 * PERFORMANCE BEST PRACTICES:
 *
 * 1. Use createSelector for computed/derived state
 *    - Prevents unnecessary recalculation
 *    - Prevents unnecessary re-renders
 *
 * 2. Keep selectors simple and focused
 *    - Each selector should do one thing
 *    - Compose complex selectors from simple ones
 *
 * 3. Avoid creating selectors inside components
 *    - Define selectors at module level
 *    - Use makeSelect* factory functions for dynamic IDs
 *
 * 4. Use shallow equality for arrays/objects
 *    - createSelector uses === by default
 *    - For deep equality, use custom equality function
 *
 * 5. Profile your selectors
 *    - Use Redux DevTools to identify expensive selectors
 *    - Add logging to measure performance
 *
 * @example
 * // Bad: Creates new selector on every render
 * const MyComponent = ({ id }) => {
 *   const item = useSelector(state => selectItemById(state, id));
 * };
 *
 * // Good: Uses memoized selector
 * const MyComponent = ({ id }) => {
 *   const selectItem = useMemo(() => makeSelectItemById(id), [id]);
 *   const item = useSelector(selectItem);
 * };
 */

// ==================== DEBUGGING HELPERS ====================

/**
 * Debug selector that logs when items change
 *
 * Useful for debugging why components re-render
 * Remove in production
 */
export const selectItemsDebug = createSelector(
  [selectProcessedItems],
  (items) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Selector Debug] Items changed:', items.length);
    }
    return items;
  }
);

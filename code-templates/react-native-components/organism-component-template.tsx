/**
 * Organism Component Template
 *
 * This template demonstrates how to create organism-level components in the RelaAI project.
 * Organisms are complex UI sections that combine multiple molecules and atoms
 * (ContactList, MessageList, Dashboard, MessageGenerator, etc.)
 *
 * Features:
 * - Redux integration for state management
 * - API calls and data fetching
 * - Loading and error states
 * - Performance optimizations (FlatList, memo, callbacks)
 * - Complex user interactions
 *
 * Usage:
 * 1. Copy this template
 * 2. Replace placeholders with your component name
 * 3. Define props interface in contracts/component-contracts/component-interfaces.ts
 * 4. Create Redux slice if needed
 * 5. Implement data fetching logic
 * 6. Add comprehensive tests
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
// TODO: Import Redux hooks
import { useSelector, useDispatch } from 'react-redux';
// TODO: Import component props and data types from contracts
import { ContactListProps } from '../../contracts/component-contracts/component-interfaces';
import { Contact } from '../../contracts/data-contracts/dto-definitions';
// TODO: Import Redux types
import { RootState } from '../../contracts/component-contracts/redux-types';
// TODO: Import Redux actions (create these in your Redux slice)
// import { fetchContacts, refreshContacts, setSearchQuery, setFilter, setSort } from '../../redux/slices/contactsSlice';
// TODO: Import molecule/atom components
// import { ContactListItem, SearchBar, EmptyState, ErrorState } from '../molecules';
// import { LoadingSpinner } from '../atoms';

// ==================== STYLED COMPONENTS ====================

const Container = styled.View`
  flex: 1;
  background-color: #F2F2F7;
`;

const HeaderContainer = styled.View`
  background-color: #FFFFFF;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5EA;
`;

const FilterRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
  padding-horizontal: 16px;
  padding-vertical: 8px;
  border-radius: 8px;
  background-color: ${({ active }) => (active ? '#007AFF' : '#F2F2F7')};
`;

const FilterText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ active }) => (active ? '#FFFFFF' : '#3C3C43')};
`;

const ListContainer = styled.View`
  flex: 1;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const ListFooterContainer = styled.View`
  padding: 16px;
  align-items: center;
`;

// ==================== COMPONENT ====================

/**
 * ContactList Component
 *
 * An organism component that displays a list of contacts with search, filter, and sort functionality.
 * Integrates with Redux for state management and handles data fetching.
 *
 * Features:
 * - Search contacts by name
 * - Filter by favorites, recent contacts, or all
 * - Sort by name, last contact, or health score
 * - Pull-to-refresh
 * - Infinite scroll pagination
 * - Loading and error states
 * - Empty state when no contacts
 *
 * @example
 * ```tsx
 * <ContactList
 *   contacts={contacts}
 *   onContactPress={(id) => navigation.navigate('ContactDetail', { contactId: id })}
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   filterBy="all"
 *   onFilterChange={setFilter}
 *   sortBy="name"
 *   onSortChange={setSort}
 *   loading={isLoading}
 *   refreshing={isRefreshing}
 *   onRefresh={handleRefresh}
 *   onEndReached={loadMore}
 *   testID="contact-list"
 * />
 * ```
 *
 * @param {ContactListProps} props - Component props defined in contracts
 * @returns {JSX.Element} ContactList component
 */
export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onContactPress,
  onContactLongPress,
  searchQuery = '',
  onSearchChange,
  filterBy = 'all',
  onFilterChange,
  sortBy = 'name',
  onSortChange,
  loading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  emptyStateMessage = 'No contacts found',
  testID,
}) => {
  // ==================== REDUX STATE ====================

  // TODO: Select state from Redux store
  // const dispatch = useDispatch();
  // const { items, ids, isLoading, error } = useSelector((state: RootState) => state.contacts);

  // TODO: Select derived/filtered data using memoized selectors
  // const filteredContacts = useSelector((state: RootState) => selectFilteredContacts(state, { searchQuery, filterBy, sortBy }));

  // ==================== EFFECTS ====================

  // TODO: Fetch initial data on mount
  useEffect(() => {
    // dispatch(fetchContacts());
  }, []);

  // TODO: Refetch when filters change
  useEffect(() => {
    // dispatch(fetchContacts({ filter: filterBy, sort: sortBy }));
  }, [filterBy, sortBy]);

  // ==================== CALLBACKS ====================

  // TODO: Create memoized callbacks to prevent unnecessary re-renders
  // Performance tip: Use useCallback for any function passed as a prop or used as a dependency

  const handleContactPress = useCallback(
    (contactId: string) => {
      try {
        onContactPress(contactId);
      } catch (error) {
        console.error('Error handling contact press:', error);
        // TODO: Show error toast
      }
    },
    [onContactPress]
  );

  const handleContactLongPress = useCallback(
    (contactId: string) => {
      try {
        onContactLongPress?.(contactId);
      } catch (error) {
        console.error('Error handling contact long press:', error);
      }
    },
    [onContactLongPress]
  );

  const handleSearchChange = useCallback(
    (text: string) => {
      onSearchChange?.(text);
      // TODO: Optionally debounce search for better performance
    },
    [onSearchChange]
  );

  const handleFilterChange = useCallback(
    (filter: 'all' | 'favorites' | 'recent') => {
      onFilterChange?.(filter);
    },
    [onFilterChange]
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      onSortChange?.(sort);
    },
    [onSortChange]
  );

  const handleRefresh = useCallback(async () => {
    try {
      await onRefresh?.();
      // TODO: Dispatch Redux action to refresh data
      // await dispatch(refreshContacts()).unwrap();
    } catch (error) {
      console.error('Error refreshing contacts:', error);
      // TODO: Show error toast
    }
  }, [onRefresh]);

  const handleEndReached = useCallback(() => {
    if (!loading && onEndReached) {
      onEndReached();
      // TODO: Load more data from API
      // dispatch(fetchContacts({ page: currentPage + 1 }));
    }
  }, [loading, onEndReached]);

  // ==================== RENDER FUNCTIONS ====================

  // TODO: Memoize render functions for FlatList items
  // Performance tip: Use React.memo or useCallback for renderItem

  const renderItem: ListRenderItem<Contact> = useCallback(
    ({ item }) => {
      // TODO: Replace with actual ContactListItem component
      return (
        <TouchableOpacity
          onPress={() => handleContactPress(item.id)}
          onLongPress={() => handleContactLongPress(item.id)}
          style={{
            padding: 16,
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5EA',
          }}
          accessible={true}
          accessibilityLabel={`${item.name} contact`}
          accessibilityRole="button"
          testID={`${testID}-item-${item.id}`}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
          {item.relationshipType && (
            <Text style={{ fontSize: 14, color: '#8E8E93', marginTop: 4 }}>
              {item.relationshipType}
            </Text>
          )}
        </TouchableOpacity>
      );
      /*
      // TODO: Replace with your ContactListItem molecule
      return (
        <ContactListItem
          contact={item}
          onPress={() => handleContactPress(item.id)}
          onLongPress={() => handleContactLongPress(item.id)}
          showHealthScore={true}
          showLastContact={true}
          testID={`${testID}-item-${item.id}`}
        />
      );
      */
    },
    [handleContactPress, handleContactLongPress, testID]
  );

  // TODO: Memoize item key extractor
  const keyExtractor = useCallback((item: Contact) => item.id, []);

  // TODO: Render loading footer for pagination
  const renderFooter = useCallback(() => {
    if (!loading) return null;

    return (
      <ListFooterContainer>
        {/* TODO: Replace with actual LoadingSpinner component */}
        <Text>Loading...</Text>
        {/* <LoadingSpinner size="small" /> */}
      </ListFooterContainer>
    );
  }, [loading]);

  // TODO: Render empty state
  const renderEmptyComponent = useCallback(() => {
    if (loading) return null;

    return (
      <EmptyContainer>
        {/* TODO: Replace with actual EmptyState component */}
        <Text style={{ fontSize: 16, color: '#8E8E93', textAlign: 'center' }}>
          {emptyStateMessage}
        </Text>
        {/*
        <EmptyState
          icon="contacts"
          title="No Contacts"
          description={emptyStateMessage}
          actionLabel="Add Contact"
          onActionPress={() => navigation.navigate('AddContact')}
          testID={`${testID}-empty`}
        />
        */}
      </EmptyContainer>
    );
  }, [loading, emptyStateMessage, testID]);

  // ==================== COMPUTED VALUES ====================

  // TODO: Memoize expensive computations
  // Performance tip: Use useMemo for derived data

  const filteredAndSortedContacts = useMemo(() => {
    let filtered = [...contacts];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'favorites':
        // TODO: Implement favorites logic
        break;
      case 'recent':
        // TODO: Implement recent contacts logic (last 30 days)
        break;
      default:
        // Show all
        break;
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastContact':
          // TODO: Implement last contact date sorting
          return 0;
        case 'healthScore':
          // TODO: Implement health score sorting
          return 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [contacts, searchQuery, filterBy, sortBy]);

  // ==================== RENDER ====================

  // TODO: Handle loading state
  if (loading && contacts.length === 0) {
    return (
      <LoadingContainer>
        {/* TODO: Replace with actual LoadingSpinner component */}
        <Text>Loading contacts...</Text>
        {/* <LoadingSpinner size="large" text="Loading contacts..." /> */}
      </LoadingContainer>
    );
  }

  // TODO: Handle error state
  // if (error) {
  //   return (
  //     <ErrorContainer>
  //       <ErrorState
  //         error={error}
  //         onRetry={handleRefresh}
  //         testID={`${testID}-error`}
  //       />
  //     </ErrorContainer>
  //   );
  // }

  return (
    <Container testID={testID}>
      {/* TODO: Header with search and filters */}
      <HeaderContainer>
        {/* TODO: Replace with actual SearchBar component */}
        <View style={{ height: 44, backgroundColor: '#F2F2F7', borderRadius: 10 }}>
          {/* <SearchBar
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search contacts..."
            testID={`${testID}-search`}
          /> */}
        </View>

        {/* Filter buttons */}
        <FilterRow>
          <FilterButton
            active={filterBy === 'all'}
            onPress={() => handleFilterChange('all')}
            accessible={true}
            accessibilityLabel="Show all contacts"
            accessibilityRole="button"
            accessibilityState={{ selected: filterBy === 'all' }}
            testID={`${testID}-filter-all`}
          >
            <FilterText active={filterBy === 'all'}>All</FilterText>
          </FilterButton>

          <FilterButton
            active={filterBy === 'favorites'}
            onPress={() => handleFilterChange('favorites')}
            accessible={true}
            accessibilityLabel="Show favorite contacts"
            accessibilityRole="button"
            accessibilityState={{ selected: filterBy === 'favorites' }}
            testID={`${testID}-filter-favorites`}
          >
            <FilterText active={filterBy === 'favorites'}>Favorites</FilterText>
          </FilterButton>

          <FilterButton
            active={filterBy === 'recent'}
            onPress={() => handleFilterChange('recent')}
            accessible={true}
            accessibilityLabel="Show recent contacts"
            accessibilityRole="button"
            accessibilityState={{ selected: filterBy === 'recent' }}
            testID={`${testID}-filter-recent`}
          >
            <FilterText active={filterBy === 'recent'}>Recent</FilterText>
          </FilterButton>
        </FilterRow>

        {/* TODO: Add sort dropdown/buttons */}
      </HeaderContainer>

      {/* TODO: Contact list with FlatList for performance */}
      <ListContainer>
        <FlatList
          data={filteredAndSortedContacts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          // Pull to refresh
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#007AFF"
              testID={`${testID}-refresh`}
            />
          }
          // Infinite scroll
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          // Performance optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          // Accessibility
          accessible={true}
          accessibilityLabel="Contacts list"
          accessibilityRole="list"
          testID={`${testID}-flatlist`}
        />
      </ListContainer>
    </Container>
  );
};

// ==================== MEMOIZATION ====================

// TODO: Wrap component in React.memo for performance
// Only re-render if props actually change
export default React.memo(ContactList);

// ==================== ALTERNATIVE EXAMPLES ====================

/**
 * EXAMPLE: MessageList Organism Component
 *
 * Similar structure but for messages:
 */

/*
import { MessageListProps } from '../../contracts/component-contracts/component-interfaces';
import { Message } from '../../contracts/data-contracts/dto-definitions';

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onMessagePress,
  onMessageEdit,
  onMessageDelete,
  onMessageSchedule,
  onMessageSend,
  loading,
  refreshing,
  onRefresh,
  onEndReached,
  emptyStateMessage,
  testID,
}) => {
  // Similar structure to ContactList
  // Use MessageCard molecule for rendering items
  // Group messages by status or date
  // Add swipe actions for edit/delete
};
*/

/**
 * EXAMPLE: Dashboard Organism Component
 *
 * More complex with multiple sections:
 */

/*
import { DashboardProps } from '../../contracts/component-contracts/component-interfaces';

export const Dashboard: React.FC<DashboardProps> = ({
  userId,
  stats,
  recentActivity,
  topRelationships,
  needsAttention,
  onViewAllContacts,
  onViewAllMessages,
  onContactPress,
  loading,
  testID,
}) => {
  // Use ScrollView instead of FlatList for multiple sections
  // Render different widgets/cards for each section
  // Handle navigation to detail screens
  // Show loading skeleton for each section

  return (
    <ScrollView>
      <StatsSection stats={stats} />
      <RecentActivitySection activity={recentActivity} />
      <TopRelationshipsSection relationships={topRelationships} onPress={onContactPress} />
      <NeedsAttentionSection relationships={needsAttention} onPress={onContactPress} />
    </ScrollView>
  );
};
*/

// ==================== PERFORMANCE OPTIMIZATION TIPS ====================

/**
 * FLATLIST OPTIMIZATION:
 *
 * 1. Use getItemLayout for fixed-height items (avoids measurement)
 * 2. Set keyExtractor to stable unique IDs
 * 3. Use React.memo on list item components
 * 4. Set removeClippedSubviews={true} for long lists
 * 5. Adjust windowSize based on item height
 * 6. Use initialNumToRender and maxToRenderPerBatch
 * 7. Avoid anonymous functions in renderItem
 * 8. Use PureComponent or React.memo for items
 * 9. Avoid nested FlatLists if possible
 * 10. Consider using FlashList for better performance
 */

/**
 * REDUX OPTIMIZATION:
 *
 * 1. Use memoized selectors (reselect library)
 * 2. Normalize state shape (entities by ID)
 * 3. Select only needed data, not entire state
 * 4. Use RTK Query for API calls and caching
 * 5. Batch multiple dispatches if needed
 * 6. Use Redux DevTools to monitor performance
 */

/**
 * GENERAL OPTIMIZATION:
 *
 * 1. Use React.memo for expensive components
 * 2. Use useCallback for event handlers
 * 3. Use useMemo for expensive computations
 * 4. Lazy load heavy components
 * 5. Optimize images (size, format, caching)
 * 6. Debounce search/filter inputs
 * 7. Use virtualized lists for long data
 * 8. Avoid deep component trees
 * 9. Profile with React DevTools Profiler
 * 10. Monitor bundle size
 */

// ==================== ERROR HANDLING ====================

/**
 * ERROR HANDLING PATTERNS:
 *
 * 1. Try-catch in async operations
 * 2. Show user-friendly error messages
 * 3. Provide retry mechanisms
 * 4. Log errors for debugging
 * 5. Handle network errors gracefully
 * 6. Show offline indicators
 * 7. Implement error boundaries
 * 8. Validate data before rendering
 */

// ==================== TESTING CONSIDERATIONS ====================

/**
 * WHAT TO TEST:
 *
 * 1. Component renders without crashing
 * 2. Renders loading state correctly
 * 3. Renders error state correctly
 * 4. Renders empty state correctly
 * 5. Renders list items correctly
 * 6. Calls onPress handlers when items are pressed
 * 7. Filters data correctly
 * 8. Sorts data correctly
 * 9. Handles refresh correctly
 * 10. Handles infinite scroll correctly
 * 11. Redux actions are dispatched
 * 12. Accessibility labels are present
 */

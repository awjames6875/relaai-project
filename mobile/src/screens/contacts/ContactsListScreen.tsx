/**
 * Contacts List Screen
 *
 * Displays paginated list of contacts with search and filter capabilities.
 * Implements US-2.2 (View Contact List) and US-2.3 (Search Contacts).
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ContactsStackParamList } from '@contracts/component-contracts/navigation-types';
import { RootState, AppDispatch } from '../../store';
import {
  fetchContactsList,
  selectContacts,
  selectContactsLoading,
  selectContactsError,
  selectContactsPagination,
  setFilters,
  clearFilters,
} from '../../store/slices/contactSlice';
import { selectUser } from '../../store/slices/authSlice';
import { ContactCard } from '../../components/molecules';
import { EmptyState } from '../../components/molecules';
import { colors } from '../../theme';

// Navigation types
type ContactsListScreenNavigationProp = StackNavigationProp<ContactsStackParamList, 'ContactsList'>;
type ContactsListScreenRouteProp = RouteProp<ContactsStackParamList, 'ContactsList'>;

interface Props {
  navigation: ContactsListScreenNavigationProp;
  route: ContactsListScreenRouteProp;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.background};
`;

const Header = styled.View`
  padding: 16px;
  background-color: ${colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.grayLight};
`;

const SearchInput = styled.TextInput`
  height: 44px;
  background-color: ${colors.grayLight};
  border-radius: 10px;
  padding-horizontal: 16px;
  font-size: 16px;
  color: ${colors.textPrimary};
`;

const ClearButton = styled.TouchableOpacity`
  position: absolute;
  right: 24px;
  top: 28px;
  padding: 8px;
`;

const ClearText = styled.Text`
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 600;
`;

const Content = styled.View`
  flex: 1;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  color: ${colors.error};
  text-align: center;
  padding: 16px;
  font-size: 14px;
`;

export const ContactsListScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const contacts = useSelector(selectContacts);
  const isLoading = useSelector(selectContactsLoading);
  const error = useSelector(selectContactsError);
  const pagination = useSelector(selectContactsPagination);

  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch contacts on mount only
  useEffect(() => {
    if (user?.id) {
      dispatch(
        fetchContactsList({
          userId: user.id,
          page: 1,
          pageSize: 20,
        })
      );
    }
  }, [dispatch, user?.id]);

  // Debounce search input
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      if (user?.id) {
        dispatch(setFilters({ search: text || undefined }));
        dispatch(
          fetchContactsList({
            userId: user.id,
            page: 1,
            pageSize: 20,
            search: text || undefined,
          })
        );
      }
    }, 300); // 300ms debounce
  }, [dispatch, user?.id]);

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(clearFilters());
    if (user?.id) {
      dispatch(
        fetchContactsList({
          userId: user.id,
          page: 1,
          pageSize: 20,
        })
      );
    }
  };

  const handleRefresh = useCallback(() => {
    if (user?.id) {
      dispatch(
        fetchContactsList({
          userId: user.id,
          page: 1,
          pageSize: 20,
          search: searchQuery || undefined,
        })
      );
    }
  }, [dispatch, user?.id, searchQuery]);

  const handleLoadMore = () => {
    if (pagination.hasMore && !isLoading && user?.id) {
      dispatch(
        fetchContactsList({
          userId: user.id,
          page: pagination.page + 1,
          pageSize: 20,
          search: searchQuery || undefined,
        })
      );
    }
  };

  const handleContactPress = (contactId: string) => {
    // Navigate to contact detail screen
    navigation.navigate('ContactDetail', { contactId });
  };

  const handleAddContact = () => {
    navigation.navigate('AddContact');
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!user?.id) {
    return (
      <Container>
        <EmptyState
          title="Authentication Required"
          message="Please log in to view your contacts."
        />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <View style={{ position: 'relative' }}>
          <SearchInput
            placeholder="Search contacts..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <ClearButton onPress={handleClearSearch}>
              <ClearText>Clear</ClearText>
            </ClearButton>
          )}
        </View>
      </Header>

      <Content>
        {isLoading && contacts.length === 0 ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color={colors.primary} />
          </LoadingContainer>
        ) : error ? (
          <ErrorText>{error}</ErrorText>
        ) : contacts.length === 0 ? (
          <EmptyState
            title={searchQuery ? 'No contacts found' : 'No contacts yet'}
            message={
              searchQuery
                ? 'Try a different search term'
                : 'Add your first contact to get started'
            }
            actionLabel="Add Contact"
            onAction={handleAddContact}
          />
        ) : (
          <FlatList
            data={contacts}
            renderItem={({ item }) => (
              <ContactCard
                contact={item}
                onPress={() => handleContactPress(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
              <RefreshControl
                refreshing={isLoading && contacts.length > 0}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              pagination.hasMore ? (
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : null
            }
          />
        )}
      </Content>
    </Container>
  );
};

export default ContactsListScreen;


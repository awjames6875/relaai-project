/**
 * Screen Component Template
 *
 * This template demonstrates how to create screen-level components in the RelaAI project.
 * Screens are top-level views that represent entire pages in the app navigation.
 *
 * Features:
 * - Navigation integration (React Navigation)
 * - Safe area handling
 * - Screen-level state management
 * - Data fetching with useEffect
 * - Loading, error, and success states
 * - Navigation params handling
 * - Header configuration
 *
 * Usage:
 * 1. Copy this template
 * 2. Replace placeholders with your screen name
 * 3. Define route params in contracts/component-contracts/navigation-types.ts
 * 4. Add screen to navigation stack
 * 5. Implement data fetching logic
 * 6. Compose organism/molecule components
 * 7. Add comprehensive tests
 */

import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { ScrollView, RefreshControl, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
// TODO: Import navigation types from contracts
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import {
  ContactsStackParamList,
  ContactDetailNavigationProp,
  ContactDetailRouteProp,
} from '../../contracts/component-contracts/navigation-types';
// TODO: Import Redux hooks and actions
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../contracts/component-contracts/redux-types';
// import { fetchContactById, deleteContact } from '../../redux/slices/contactsSlice';
// TODO: Import data types
import { Contact } from '../../contracts/data-contracts/dto-definitions';
// TODO: Import organism/molecule components
// import { ContactCard, MessageList, RelationshipCard } from '../organisms';
// import { Button, LoadingSpinner, ErrorState } from '../atoms';

// ==================== TYPES ====================

interface ContactDetailScreenProps {
  navigation: ContactDetailNavigationProp;
  route: ContactDetailRouteProp;
}

// ==================== STYLED COMPONENTS ====================

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #f2f2f7;
`;

const ContentContainer = styled.View`
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

const Section = styled.View`
  background-color: #ffffff;
  margin-bottom: 12px;
  padding: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 12px;
`;

const ContactHeader = styled.View`
  align-items: center;
  padding: 24px;
  background-color: #ffffff;
`;

const ContactName = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #000000;
  margin-top: 12px;
`;

const ContactInfo = styled.Text`
  font-size: 16px;
  color: #8e8e93;
  margin-top: 4px;
`;

const ActionButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 16px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5ea;
`;

const ActionButton = styled.TouchableOpacity`
  align-items: center;
  padding: 8px 16px;
`;

const ActionButtonText = styled.Text`
  font-size: 14px;
  color: #007aff;
  margin-top: 4px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #8e8e93;
  text-align: center;
  padding: 24px;
`;

// ==================== COMPONENT ====================

/**
 * ContactDetailScreen Component
 *
 * A screen component that displays detailed information about a contact.
 * Shows contact info, recent messages, relationship health, and action buttons.
 *
 * @example
 * ```tsx
 * // Navigation usage:
 * navigation.navigate('ContactDetail', { contactId: '123' });
 * ```
 *
 * @param {ContactDetailScreenProps} props - Screen props with navigation and route
 * @returns {JSX.Element} ContactDetailScreen component
 */
export const ContactDetailScreen: React.FC<ContactDetailScreenProps> = ({
  navigation,
  route,
}) => {
  // ==================== ROUTE PARAMS ====================

  // TODO: Extract params from route
  const { contactId } = route.params;

  // ==================== REDUX STATE ====================

  // TODO: Get data from Redux store
  const dispatch = useDispatch();
  // const contact = useSelector((state: RootState) => state.contacts.items[contactId]);
  // const isLoading = useSelector((state: RootState) => state.contacts.isLoading);
  // const error = useSelector((state: RootState) => state.contacts.error);

  // TODO: Mock data for template (remove when implementing)
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ==================== LOCAL STATE ====================

  // TODO: Add local state for screen-specific UI concerns
  const [isDeleting, setIsDeleting] = useState(false);

  // ==================== NAVIGATION CONFIGURATION ====================

  // TODO: Configure screen header with navigation options
  useLayoutEffect(() => {
    navigation.setOptions({
      title: contact?.name || 'Contact Details',
      headerRight: () => (
        <TouchableOpacity
          onPress={handleEdit}
          style={{ marginRight: 16 }}
          accessible={true}
          accessibilityLabel="Edit contact"
          accessibilityRole="button"
          testID="contact-detail-edit-button"
        >
          <Text style={{ color: '#007AFF', fontSize: 16 }}>Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, contact]);

  // ==================== DATA FETCHING ====================

  // TODO: Fetch data on mount and when contactId changes
  useEffect(() => {
    fetchContactData();
  }, [contactId]);

  const fetchContactData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual Redux action
      // await dispatch(fetchContactById(contactId)).unwrap();

      // Mock API call for template
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setContact({
        id: contactId,
        userId: 'user-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1 234 567 8900',
        relationshipType: 'Friend',
        birthday: '1990-05-15',
        notes: 'Met at conference in 2020',
        personalityTraits: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error fetching contact:', err);
      setError(err instanceof Error ? err.message : 'Failed to load contact');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== CALLBACKS ====================

  // TODO: Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchContactData();
    setIsRefreshing(false);
  }, [contactId]);

  // TODO: Handle edit button press
  const handleEdit = useCallback(() => {
    navigation.navigate('EditContact', {
      contactId,
      mode: 'edit',
    });
  }, [navigation, contactId]);

  // TODO: Handle generate message button
  const handleGenerateMessage = useCallback(() => {
    // Navigate to message generation screen
    // TODO: Replace with actual navigation
    // navigation.navigate('GenerateMessage', { contactId });
    Alert.alert('Generate Message', 'Navigate to message generation');
  }, [contactId]);

  // TODO: Handle send message button
  const handleSendMessage = useCallback(() => {
    if (!contact?.phoneNumber && !contact?.email) {
      Alert.alert(
        'No Contact Info',
        'This contact has no phone number or email address.'
      );
      return;
    }

    // TODO: Open message composer or navigate to messages
    Alert.alert('Send Message', 'Open message composer');
  }, [contact]);

  // TODO: Handle call button
  const handleCall = useCallback(() => {
    if (!contact?.phoneNumber) {
      Alert.alert('No Phone Number', 'This contact has no phone number.');
      return;
    }

    // TODO: Open phone dialer
    // Linking.openURL(`tel:${contact.phoneNumber}`);
    Alert.alert('Call', `Call ${contact.phoneNumber}`);
  }, [contact]);

  // TODO: Handle delete button
  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contact?.name}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);

              // TODO: Replace with actual Redux action
              // await dispatch(deleteContact(contactId)).unwrap();

              // Mock delete for template
              await new Promise((resolve) => setTimeout(resolve, 1000));

              // Navigate back after successful delete
              navigation.goBack();
            } catch (err) {
              console.error('Error deleting contact:', err);
              Alert.alert(
                'Delete Failed',
                'Failed to delete contact. Please try again.'
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  }, [navigation, contactId, contact]);

  // ==================== RENDER HELPERS ====================

  // TODO: Render loading state
  if (isLoading && !contact) {
    return (
      <Container>
        <LoadingContainer>
          {/* TODO: Replace with actual LoadingSpinner component */}
          <Text>Loading contact...</Text>
          {/* <LoadingSpinner size="large" text="Loading contact..." /> */}
        </LoadingContainer>
      </Container>
    );
  }

  // TODO: Render error state
  if (error || !contact) {
    return (
      <Container>
        <ErrorContainer>
          {/* TODO: Replace with actual ErrorState component */}
          <Text style={{ fontSize: 16, color: '#FF3B30', marginBottom: 16 }}>
            {error || 'Contact not found'}
          </Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Text style={{ color: '#007AFF', fontSize: 16 }}>Try Again</Text>
          </TouchableOpacity>
          {/*
          <ErrorState
            error={error || 'Contact not found'}
            onRetry={handleRefresh}
            testID="contact-detail-error"
          />
          */}
        </ErrorContainer>
      </Container>
    );
  }

  // ==================== MAIN RENDER ====================

  return (
    <Container testID="contact-detail-screen">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
            testID="contact-detail-refresh"
          />
        }
        accessible={true}
        accessibilityRole="scrollbar"
      >
        {/* TODO: Contact Header Section */}
        <ContactHeader>
          {/* TODO: Replace with actual Avatar component */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#007AFF',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 40, color: '#FFFFFF', fontWeight: '600' }}>
              {contact.name.charAt(0)}
            </Text>
          </View>
          {/* <Avatar name={contact.name} size="xlarge" /> */}

          <ContactName>{contact.name}</ContactName>

          {contact.relationshipType && (
            <ContactInfo>{contact.relationshipType}</ContactInfo>
          )}
        </ContactHeader>

        {/* TODO: Action Buttons */}
        <ActionButtonsRow>
          <ActionButton
            onPress={handleSendMessage}
            accessible={true}
            accessibilityLabel="Send message"
            accessibilityRole="button"
            testID="contact-detail-message-button"
          >
            <Text style={{ fontSize: 24 }}>💬</Text>
            <ActionButtonText>Message</ActionButtonText>
          </ActionButton>

          <ActionButton
            onPress={handleCall}
            accessible={true}
            accessibilityLabel="Call contact"
            accessibilityRole="button"
            testID="contact-detail-call-button"
          >
            <Text style={{ fontSize: 24 }}>📞</Text>
            <ActionButtonText>Call</ActionButtonText>
          </ActionButton>

          <ActionButton
            onPress={handleGenerateMessage}
            accessible={true}
            accessibilityLabel="Generate AI message"
            accessibilityRole="button"
            testID="contact-detail-generate-button"
          >
            <Text style={{ fontSize: 24 }}>✨</Text>
            <ActionButtonText>Generate</ActionButtonText>
          </ActionButton>
        </ActionButtonsRow>

        {/* TODO: Contact Information Section */}
        <Section>
          <SectionTitle>Information</SectionTitle>

          {contact.phoneNumber && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: '#8E8E93' }}>Phone</Text>
              <Text style={{ fontSize: 16, color: '#000000', marginTop: 4 }}>
                {contact.phoneNumber}
              </Text>
            </View>
          )}

          {contact.email && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: '#8E8E93' }}>Email</Text>
              <Text style={{ fontSize: 16, color: '#000000', marginTop: 4 }}>
                {contact.email}
              </Text>
            </View>
          )}

          {contact.birthday && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: '#8E8E93' }}>Birthday</Text>
              <Text style={{ fontSize: 16, color: '#000000', marginTop: 4 }}>
                {new Date(contact.birthday).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}

          {contact.notes && (
            <View>
              <Text style={{ fontSize: 12, color: '#8E8E93' }}>Notes</Text>
              <Text style={{ fontSize: 16, color: '#000000', marginTop: 4 }}>
                {contact.notes}
              </Text>
            </View>
          )}
        </Section>

        {/* TODO: Relationship Health Section */}
        <Section>
          <SectionTitle>Relationship Health</SectionTitle>
          <EmptyText>Relationship data will appear here</EmptyText>
          {/*
          <RelationshipCard
            contactId={contactId}
            showDetails={true}
            testID="contact-detail-relationship"
          />
          */}
        </Section>

        {/* TODO: Recent Messages Section */}
        <Section>
          <SectionTitle>Recent Messages</SectionTitle>
          <EmptyText>No messages yet</EmptyText>
          {/*
          <MessageList
            contactId={contactId}
            limit={5}
            onMessagePress={(id) => navigation.navigate('MessageDetail', { messageId: id })}
            testID="contact-detail-messages"
          />
          */}
        </Section>

        {/* TODO: Delete Button */}
        <Section>
          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeleting}
            style={{
              padding: 16,
              backgroundColor: '#FF3B30',
              borderRadius: 8,
              alignItems: 'center',
            }}
            accessible={true}
            accessibilityLabel="Delete contact"
            accessibilityRole="button"
            testID="contact-detail-delete-button"
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
              {isDeleting ? 'Deleting...' : 'Delete Contact'}
            </Text>
          </TouchableOpacity>
        </Section>
      </ScrollView>
    </Container>
  );
};

// ==================== DEFAULT EXPORT ====================

export default ContactDetailScreen;

// ==================== NAVIGATION SETUP ====================

/**
 * ADD TO NAVIGATION STACK:
 *
 * In your navigation configuration file:
 *
 * ```tsx
 * import { ContactDetailScreen } from './screens/ContactDetailScreen';
 *
 * const ContactsStack = createStackNavigator<ContactsStackParamList>();
 *
 * function ContactsNavigator() {
 *   return (
 *     <ContactsStack.Navigator>
 *       <ContactsStack.Screen
 *         name="ContactsList"
 *         component={ContactsListScreen}
 *       />
 *       <ContactsStack.Screen
 *         name="ContactDetail"
 *         component={ContactDetailScreen}
 *         options={{
 *           headerShown: true,
 *           presentation: 'card',
 *         }}
 *       />
 *     </ContactsStack.Navigator>
 *   );
 * }
 * ```
 */

// ==================== SCREEN PATTERNS ====================

/**
 * COMMON SCREEN PATTERNS:
 *
 * 1. LIST SCREENS:
 *    - Show list of items (contacts, messages, etc.)
 *    - Search, filter, sort functionality
 *    - Pull to refresh, infinite scroll
 *    - Navigate to detail screens
 *
 * 2. DETAIL SCREENS:
 *    - Show single item details
 *    - Edit/delete actions
 *    - Related data sections
 *    - Navigate to related screens
 *
 * 3. FORM SCREENS:
 *    - Create or edit data
 *    - Form validation
 *    - Submit/cancel actions
 *    - Navigate back on success
 *
 * 4. MODAL SCREENS:
 *    - Quick actions or selections
 *    - Dismiss on completion
 *    - Compact UI
 */

// ==================== SAFE AREA BEST PRACTICES ====================

/**
 * SAFE AREA HANDLING:
 *
 * 1. Use SafeAreaView from react-native-safe-area-context
 * 2. Wrap top-level screen content
 * 3. Use edges prop for fine control:
 *    - edges={['top', 'bottom']} for full screen
 *    - edges={['bottom']} for screens with headers
 * 4. Test on devices with notches (iPhone X+)
 * 5. Consider keyboard avoiding view for forms
 */

// ==================== PERFORMANCE TIPS ====================

/**
 * SCREEN PERFORMANCE:
 *
 * 1. Lazy load heavy components
 * 2. Use React.memo for child components
 * 3. Implement pull-to-refresh efficiently
 * 4. Debounce expensive operations
 * 5. Use FlatList for long lists
 * 6. Optimize images (size, caching)
 * 7. Monitor navigation performance
 * 8. Implement code splitting for large screens
 */

// ==================== TESTING CONSIDERATIONS ====================

/**
 * WHAT TO TEST:
 *
 * 1. Screen renders without crashing
 * 2. Fetches data on mount
 * 3. Shows loading state while fetching
 * 4. Shows error state on failure
 * 5. Displays data correctly
 * 6. Navigation buttons work
 * 7. Pull-to-refresh updates data
 * 8. Action buttons trigger correct functions
 * 9. Handles missing data gracefully
 * 10. Accessibility labels present
 */

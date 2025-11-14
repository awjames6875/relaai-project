/**
 * Contacts Navigator
 *
 * Stack navigator for Contact Management screens (Epic 2)
 * Routes: ContactsList, AddContact, EditContact, ContactDetail
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'styled-components/native';
import { ContactsStackParamList } from '@contracts/component-contracts/navigation-types';
import {
  ContactsListScreen,
  AddContactScreen,
  EditContactScreen,
  ContactDetailScreen,
} from '../screens/contacts';

const Stack = createStackNavigator<ContactsStackParamList>();

export const ContactsNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.neutral[100],
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.neutral[200],
        },
        headerTintColor: theme.colors.primary[500],
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: theme.colors.neutral[900],
        },
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: theme.colors.neutral[50],
        },
      }}
    >
      <Stack.Screen
        name="ContactsList"
        component={ContactsListScreen}
        options={{
          title: 'Contacts',
          headerLeft: () => null, // No back button on list screen (it's the root)
        }}
      />
      <Stack.Screen
        name="AddContact"
        component={AddContactScreen}
        options={{
          title: 'Add Contact',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="EditContact"
        component={EditContactScreen}
        options={{
          title: 'Edit Contact',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
        options={{
          title: 'Contact Details',
        }}
      />
    </Stack.Navigator>
  );
};

export default ContactsNavigator;

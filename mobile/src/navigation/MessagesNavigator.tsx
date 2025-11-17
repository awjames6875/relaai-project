/**
 * Messages Navigator
 *
 * Stack navigation for all message-related screens.
 * Routes: MessagesList, GenerateMessage, EditMessage, ScheduleMessage
 *
 * Implements Epic 3: AI Message Generation
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../theme';

// Import screens
import { GenerateMessageScreen } from '../screens/messages/GenerateMessageScreen';
import { MessagesListScreen } from '../screens/messages/MessagesListScreen';
import { EditMessageScreen } from '../screens/messages/EditMessageScreen';

// Type the params
export type MessagesStackParamList = {
  MessagesList: { status?: 'draft' | 'scheduled' | 'sent' | 'failed' } | undefined;
  GenerateMessage: { contactId?: string } | undefined;
  EditMessage: { messageId: string };
  ScheduleMessage: { messageId: string; content: string } | undefined;
};

const Stack = createStackNavigator<MessagesStackParamList>();

/**
 * Messages Navigator Component
 *
 * Provides stack navigation for:
 * - MessagesList (initial route) - View messages by status
 * - GenerateMessage - Generate AI messages
 * - EditMessage - Edit message content
 * - ScheduleMessage - Schedule message for later
 */
export const MessagesNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.white,
          borderBottomWidth: 1,
          borderBottomColor: colors.grayLight,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: colors.textPrimary,
        },
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="MessagesList"
        component={MessagesListScreen}
        options={{
          headerShown: false, // Use custom header in component
          title: 'Messages',
        }}
      />

      <Stack.Screen
        name="GenerateMessage"
        component={GenerateMessageScreen}
        options={{
          headerShown: false, // Use custom header in component
          title: 'Generate Message',
        }}
      />

      <Stack.Screen
        name="EditMessage"
        component={EditMessageScreen}
        options={{
          title: 'Edit Message',
          headerBackTitle: 'Back',
        }}
      />

      {/* Placeholder for ScheduleMessage screen */}
      {/* Will be implemented in future phases */}
    </Stack.Navigator>
  );
};

export default MessagesNavigator;

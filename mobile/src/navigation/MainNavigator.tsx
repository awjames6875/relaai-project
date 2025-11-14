/**
 * Main Tab Navigator
 *
 * Bottom tab navigation for the authenticated app
 * Tabs: Contacts (+ future: Home, Messages, Relationships, Profile)
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components/native';
import { MainTabParamList } from '@contracts/component-contracts/navigation-types';
import { ContactsNavigator } from './ContactsNavigator';
// TODO: Add icons library when available (react-native-vector-icons or @expo/vector-icons)

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.neutral[500],
        tabBarStyle: {
          backgroundColor: theme.colors.neutral[100],
          borderTopWidth: 1,
          borderTopColor: theme.colors.neutral[200],
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tab.Screen
        name="Contacts"
        component={ContactsNavigator}
        options={{
          tabBarLabel: 'Contacts',
          // TODO: Add icon when library is available
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="contacts" size={size} color={color} />
          // ),
        }}
      />
      {/* Future tabs - Uncomment as features are implemented */}
      {/*
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesNavigator}
        options={{
          tabBarLabel: 'Messages',
        }}
      />
      <Tab.Screen
        name="Relationships"
        component={RelationshipsNavigator}
        options={{
          tabBarLabel: 'Health',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      */}
    </Tab.Navigator>
  );
};

export default MainNavigator;

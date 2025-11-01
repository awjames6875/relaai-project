/**
 * React Navigation Type Definitions
 * 
 * Defines all navigation routes and their parameters
 */

import React from 'react';

// ==================== ROOT NAVIGATION ====================

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    Onboarding: undefined;
  };
  
  // ==================== AUTH STACK ====================
  
  export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
  };
  
  // ==================== MAIN TAB NAVIGATION ====================
  
  export type MainTabParamList = {
    Home: undefined;
    Contacts: undefined;
    Messages: undefined;
    Relationships: undefined;
    Profile: undefined;
  };
  
  // ==================== HOME STACK ====================
  
  export type HomeStackParamList = {
    HomeScreen: undefined;
    QuickActions: undefined;
  };
  
  // ==================== CONTACTS STACK ====================
  
  export type ContactsStackParamList = {
    ContactsList: undefined;
    ContactDetail: {
      contactId: string;
    };
    EditContact: {
      contactId?: string;
      mode: 'create' | 'edit';
    };
    ImportContacts: undefined;
  };
  
  // ==================== MESSAGES STACK ====================
  
  export type MessagesStackParamList = {
    MessagesList: {
      status?: 'draft' | 'scheduled' | 'sent' | 'failed';
    };
    GenerateMessage: {
      contactId: string;
      occasion?: string;
    };
    EditMessage: {
      messageId: string;
    };
    ScheduleMessage: {
      messageId: string;
    };
    MessageDetail: {
      messageId: string;
    };
    MessageTemplates: undefined;
    CreateTemplate: undefined;
    EditTemplate: {
      templateId: string;
    };
  };
  
  // ==================== RELATIONSHIPS STACK ====================
  
  export type RelationshipsStackParamList = {
    RelationshipsList: {
      filter?: 'all' | 'cold' | 'warm' | 'hot';
    };
    RelationshipDetail: {
      contactId: string;
    };
    RelationshipAnalytics: undefined;
  };
  
  // ==================== PROFILE STACK ====================
  
  export type ProfileStackParamList = {
    ProfileScreen: undefined;
    EditProfile: undefined;
    Settings: undefined;
    Subscription: undefined;
    About: undefined;
    Support: undefined;
    PrivacyPolicy: undefined;
    TermsOfService: undefined;
  };
  
  // ==================== MODAL STACK ====================
  
  export type ModalStackParamList = {
    SelectOccasion: {
      onSelect: (occasion: string) => void;
    };
    SelectTone: {
      onSelect: (tone: string) => void;
    };
    DateTimePicker: {
      value: Date;
      onChange: (date: Date) => void;
      mode: 'date' | 'time' | 'datetime';
    };
    ConfirmDialog: {
      title: string;
      message: string;
      confirmLabel: string;
      onConfirm: () => void;
    };
  };
  
  // ==================== NAVIGATION PROPS ====================
  
  import { NavigationProp, RouteProp } from '@react-navigation/native';
  import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
  import { StackNavigationProp } from '@react-navigation/stack';
  
  // Root Navigation Props
  export type RootNavigationProp = NavigationProp<RootStackParamList>;
  
  // Auth Stack Props
  export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;
  export type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;
  export type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;
  
  // Main Tab Props
  export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
  export type HomeTabNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Home'>;
  export type ContactsTabNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Contacts'>;
  export type MessagesTabNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Messages'>;
  export type RelationshipsTabNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Relationships'>;
  export type ProfileTabNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Profile'>;
  
  // Contacts Stack Props
  export type ContactsNavigationProp = StackNavigationProp<ContactsStackParamList>;
  export type ContactDetailNavigationProp = StackNavigationProp<ContactsStackParamList, 'ContactDetail'>;
  export type ContactDetailRouteProp = RouteProp<ContactsStackParamList, 'ContactDetail'>;
  export type EditContactNavigationProp = StackNavigationProp<ContactsStackParamList, 'EditContact'>;
  export type EditContactRouteProp = RouteProp<ContactsStackParamList, 'EditContact'>;
  
  // Messages Stack Props
  export type MessagesNavigationProp = StackNavigationProp<MessagesStackParamList>;
  export type GenerateMessageNavigationProp = StackNavigationProp<MessagesStackParamList, 'GenerateMessage'>;
  export type GenerateMessageRouteProp = RouteProp<MessagesStackParamList, 'GenerateMessage'>;
  export type EditMessageNavigationProp = StackNavigationProp<MessagesStackParamList, 'EditMessage'>;
  export type EditMessageRouteProp = RouteProp<MessagesStackParamList, 'EditMessage'>;
  export type ScheduleMessageNavigationProp = StackNavigationProp<MessagesStackParamList, 'ScheduleMessage'>;
  export type ScheduleMessageRouteProp = RouteProp<MessagesStackParamList, 'ScheduleMessage'>;
  
  // Relationships Stack Props
  export type RelationshipsNavigationProp = StackNavigationProp<RelationshipsStackParamList>;
  export type RelationshipDetailNavigationProp = StackNavigationProp<RelationshipsStackParamList, 'RelationshipDetail'>;
  export type RelationshipDetailRouteProp = RouteProp<RelationshipsStackParamList, 'RelationshipDetail'>;
  
  // Profile Stack Props
  export type ProfileNavigationProp = StackNavigationProp<ProfileStackParamList>;
  
  // ==================== NAVIGATION HELPERS ====================
  
  export type Screen<T extends keyof any> = {
    name: T;
    component: React.ComponentType<any>;
    options?: any;
  };
  
  export type NavigationOptions = {
    headerShown?: boolean;
    title?: string;
    headerTitle?: string;
    headerBackTitle?: string;
    headerLeft?: () => React.ReactNode;
    headerRight?: () => React.ReactNode;
    headerStyle?: object;
    headerTintColor?: string;
    headerTitleStyle?: object;
    gestureEnabled?: boolean;
    animationEnabled?: boolean;
  };
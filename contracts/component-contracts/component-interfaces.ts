/**
 * RelaAI Component Interface Contracts
 * 
 * All React Native component prop interfaces.
 * These define the API for every UI component in the mobile app.
 */

import React from 'react';
import { Contact, Message, Relationship } from '../data-contracts/dto-definitions';

// ==================== ATOMS ====================

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
  testID?: string;
}

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  testID?: string;
}

export interface AvatarProps {
  imageUrl?: string;
  name: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  onPress?: () => void;
  showBadge?: boolean;
  badgeColor?: string;
  badgeCount?: number;
  testID?: string;
}

export interface BadgeProps {
  count: number;
  color?: string;
  maxCount?: number;
  showZero?: boolean;
  size?: 'small' | 'medium' | 'large';
  testID?: string;
}

export interface ChipProps {
  label: string;
  onPress?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  disabled?: boolean;
  icon?: string;
  color?: string;
  testID?: string;
}

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  spacing?: number;
  testID?: string;
}

export interface IconButtonProps {
  icon: string;
  onPress: () => void;
  size?: number;
  color?: string;
  disabled?: boolean;
  testID?: string;
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  testID?: string;
}

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  testID?: string;
}

export interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  testID?: string;
}

// ==================== MOLECULES ====================

export interface MessageCardProps {
  message: Message;
  onEdit?: () => void;
  onDelete?: () => void;
  onSchedule?: () => void;
  onSend?: () => void;
  onSelectAlternative?: (alternative: string) => void;
  showActions?: boolean;
  showAlternatives?: boolean;
  testID?: string;
}

export interface ContactListItemProps {
  contact: Contact;
  onPress: () => void;
  onLongPress?: () => void;
  showHealthScore?: boolean;
  showLastContact?: boolean;
  showBirthday?: boolean;
  selected?: boolean;
  testID?: string;
}

export interface RelationshipCardProps {
  relationship: Relationship;
  contact: Contact;
  onPress: () => void;
  showDetails?: boolean;
  showActions?: boolean;
  testID?: string;
}

export interface HealthScoreProps {
  score: number; // 0-100
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showValue?: boolean;
  animated?: boolean;
  color?: string;
  onPress?: () => void;
  testID?: string;
}

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
  testID?: string;
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  showCancel?: boolean;
  onCancel?: () => void;
  testID?: string;
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  illustration?: string;
  testID?: string;
}

export interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  retryLabel?: string;
  title?: string;
  testID?: string;
}

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  testID?: string;
}

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  elevation?: number;
  padding?: number;
  borderRadius?: number;
  testID?: string;
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onDismiss?: () => void;
  testID?: string;
}

// ==================== ORGANISMS ====================

export interface MessageListProps {
  messages: Message[];
  onMessagePress: (messageId: string) => void;
  onMessageEdit: (messageId: string) => void;
  onMessageDelete: (messageId: string) => void;
  onMessageSchedule?: (messageId: string) => void;
  onMessageSend?: (messageId: string) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  emptyStateMessage?: string;
  testID?: string;
}

export interface ContactListProps {
  contacts: Contact[];
  onContactPress: (contactId: string) => void;
  onContactLongPress?: (contactId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filterBy?: 'all' | 'favorites' | 'recent';
  onFilterChange?: (filter: string) => void;
  sortBy?: 'name' | 'lastContact' | 'healthScore';
  onSortChange?: (sort: string) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  emptyStateMessage?: string;
  testID?: string;
}

export interface DashboardProps {
  userId: string;
  stats: {
    totalContacts: number;
    activeRelationships: number;
    scheduledMessages: number;
    avgHealthScore: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'message_sent' | 'message_scheduled' | 'contact_added';
    timestamp: string;
    description: string;
  }>;
  topRelationships: Relationship[];
  needsAttention: Relationship[];
  onViewAllContacts: () => void;
  onViewAllMessages: () => void;
  onContactPress: (contactId: string) => void;
  loading?: boolean;
  testID?: string;
}

export interface RelationshipListProps {
  relationships: Relationship[];
  contacts: Contact[];
  onRelationshipPress: (contactId: string) => void;
  filterBy?: 'all' | 'cold' | 'warm' | 'hot';
  onFilterChange?: (filter: string) => void;
  sortBy?: 'healthScore' | 'lastContact' | 'name';
  onSortChange?: (sort: string) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  testID?: string;
}

export interface MessageGeneratorProps {
  contactId: string;
  contact: Contact;
  onMessageGenerated: (message: Message) => void;
  onCancel: () => void;
  defaultOccasion?: string;
  defaultTone?: string;
  testID?: string;
}

export interface ScheduleMessageFormProps {
  message: Message;
  onSchedule: (date: Date) => void;
  onCancel: () => void;
  minDate?: Date;
  maxDate?: Date;
  testID?: string;
}

export interface ContactFormProps {
  contact?: Contact;
  onSave: (contact: Partial<Contact>) => void;
  onCancel: () => void;
  mode?: 'create' | 'edit';
  testID?: string;
}

export interface SettingsPanelProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
  loading?: boolean;
  testID?: string;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  autoScheduleEnabled: boolean;
  defaultMessageTone: 'formal' | 'casual' | 'humorous' | 'heartfelt' | 'professional';
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

// ==================== SCREEN PROPS ====================

export interface HomeScreenProps {
  navigation: any; // React Navigation types
  route: any;
}

export interface ContactsScreenProps {
  navigation: any;
  route: any;
}

export interface MessagesScreenProps {
  navigation: any;
  route: any;
}

export interface RelationshipsScreenProps {
  navigation: any;
  route: any;
}

export interface ProfileScreenProps {
  navigation: any;
  route: any;
}

export interface LoginScreenProps {
  navigation: any;
  route: any;
}

export interface SignupScreenProps {
  navigation: any;
  route: any;
}

export interface OnboardingScreenProps {
  navigation: any;
  route: any;
}

export interface GenerateMessageScreenProps {
  navigation: any;
  route: {
    params: {
      contactId: string;
      occasion?: string;
    };
  };
}

export interface EditMessageScreenProps {
  navigation: any;
  route: {
    params: {
      messageId: string;
    };
  };
}

export interface ScheduleMessageScreenProps {
  navigation: any;
  route: {
    params: {
      messageId: string;
    };
  };
}

export interface ContactDetailScreenProps {
  navigation: any;
  route: {
    params: {
      contactId: string;
    };
  };
}

export interface EditContactScreenProps {
  navigation: any;
  route: {
    params: {
      contactId?: string;
      mode: 'create' | 'edit';
    };
  };
}
/**
 * Redux State Type Definitions
 * 
 * Defines the shape of the entire Redux store
 */

import { Contact, Message, Relationship, UserProfile, MessageTemplate } from '../data-contracts/dto-definitions';

// ==================== ROOT STATE ====================

export interface RootState {
  auth: AuthState;
  user: UserState;
  contacts: ContactsState;
  messages: MessagesState;
  relationships: RelationshipsState;
  templates: TemplatesState;
  ui: UIState;
}

// ==================== AUTH STATE ====================

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

// ==================== USER STATE ====================

export interface UserState {
  profile: UserProfile | null;
  settings: UserSettings | null;
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
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

export interface UserStats {
  totalContacts: number;
  totalMessages: number;
  messagesSent: number;
  messagesScheduled: number;
  aiGenerations: number;
  averageHealthScore: number;
  activeRelationships: number;
}

export interface UserActions {
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  fetchStats: (period?: 'week' | 'month' | 'year') => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

// ==================== CONTACTS STATE ====================

export interface ContactsState {
  items: Record<string, Contact>; // Normalized by ID
  ids: string[]; // Ordered list of IDs
  selectedId: string | null;
  searchQuery: string;
  filterBy: 'all' | 'favorites' | 'recent';
  sortBy: 'name' | 'lastContact' | 'healthScore';
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  pagination: PaginationState;
}

export interface ContactsActions {
  fetchContacts: (page?: number) => Promise<void>;
  fetchContactById: (contactId: string) => Promise<void>;
  createContact: (contact: Partial<Contact>) => Promise<Contact>;
  updateContact: (contactId: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
  searchContacts: (query: string) => void;
  setFilter: (filter: 'all' | 'favorites' | 'recent') => void;
  setSort: (sort: 'name' | 'lastContact' | 'healthScore') => void;
  selectContact: (contactId: string | null) => void;
  refreshContacts: () => Promise<void>;
}

// ==================== MESSAGES STATE ====================

export interface MessagesState {
  items: Record<string, Message>; // Normalized by ID
  ids: string[]; // Ordered list of IDs
  byContact: Record<string, string[]>; // Contact ID -> Message IDs
  selectedId: string | null;
  filterByStatus: 'all' | 'draft' | 'scheduled' | 'sent' | 'failed';
  isLoading: boolean;
  isGenerating: boolean;
  isRefreshing: boolean;
  error: string | null;
  pagination: PaginationState;
}

export interface MessagesActions {
  fetchMessages: (page?: number, status?: string) => Promise<void>;
  fetchMessageById: (messageId: string) => Promise<void>;
  fetchMessagesByContact: (contactId: string) => Promise<void>;
  generateMessage: (params: GenerateMessageParams) => Promise<Message>;
  createMessage: (message: Partial<Message>) => Promise<Message>;
  updateMessage: (messageId: string, updates: Partial<Message>) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  scheduleMessage: (messageId: string, scheduledAt: string) => Promise<void>;
  sendMessage: (messageId: string) => Promise<void>;
  selectMessage: (messageId: string | null) => void;
  setStatusFilter: (status: 'all' | 'draft' | 'scheduled' | 'sent' | 'failed') => void;
  refreshMessages: () => Promise<void>;
}

export interface GenerateMessageParams {
  contactId: string;
  occasion: string;
  tone?: string;
  context?: string;
}

// ==================== RELATIONSHIPS STATE ====================

export interface RelationshipsState {
  items: Record<string, Relationship>; // Normalized by contact ID
  ids: string[]; // Ordered list of contact IDs
  selectedContactId: string | null;
  filterBy: 'all' | 'cold' | 'warm' | 'hot';
  sortBy: 'healthScore' | 'lastContact' | 'name';
  analytics: RelationshipAnalytics | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

export interface RelationshipAnalytics {
  averageHealthScore: number;
  totalRelationships: number;
  temperatureBreakdown: {
    cold: number;
    warm: number;
    hot: number;
  };
  healthScoreDistribution: {
    excellent: number; // 80-100
    good: number; // 60-79
    needsAttention: number; // 40-59
    critical: number; // 0-39
  };
  topRelationships: Relationship[];
  needsAttention: Relationship[];
}

export interface RelationshipsActions {
  fetchRelationships: () => Promise<void>;
  fetchRelationshipByContact: (contactId: string) => Promise<void>;
  updateRelationship: (contactId: string, updates: Partial<Relationship>) => Promise<void>;
  calculateHealthScore: (contactId: string) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  setFilter: (filter: 'all' | 'cold' | 'warm' | 'hot') => void;
  setSort: (sort: 'healthScore' | 'lastContact' | 'name') => void;
  selectRelationship: (contactId: string | null) => void;
  refreshRelationships: () => Promise<void>;
}

// ==================== TEMPLATES STATE ====================

export interface TemplatesState {
  items: Record<string, MessageTemplate>; // Normalized by ID
  ids: string[]; // Ordered list of IDs
  selectedId: string | null;
  filterByOccasion: string | null;
  filterByTone: string | null;
  includeSystem: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TemplatesActions {
  fetchTemplates: (occasion?: string, tone?: string) => Promise<void>;
  fetchTemplateById: (templateId: string) => Promise<void>;
  createTemplate: (template: Partial<MessageTemplate>) => Promise<MessageTemplate>;
  updateTemplate: (templateId: string, updates: Partial<MessageTemplate>) => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<void>;
  renderTemplate: (templateId: string, values: Record<string, string>) => Promise<string>;
  setOccasionFilter: (occasion: string | null) => void;
  setToneFilter: (tone: string | null) => void;
  toggleSystemTemplates: (include: boolean) => void;
}

// ==================== UI STATE ====================

export interface UIState {
  /**
   * Theme mode - auto detects system preference
   */
  theme: 'light' | 'dark' | 'auto';
  /**
   * Color scheme for accessibility
   * @default 'default'
   */
  colorScheme: 'default' | 'colorblind' | 'high-contrast';
  /**
   * Font scale for accessibility (0.8 - 1.5)
   * @default 1.0
   */
  fontScale: number;
  /**
   * Reduce animations for accessibility
   * @default false
   */
  reducedMotion: boolean;
  activeScreen: string;
  modals: {
    [key: string]: boolean; // Modal visibility by key
  };
  toasts: ToastState[];
  isOnline: boolean;
  isSyncing: boolean;
}

export interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  timestamp: number;
}

export interface UIActions {
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setColorScheme: (scheme: 'default' | 'colorblind' | 'high-contrast') => void;
  setFontScale: (scale: number) => void;
  setReducedMotion: (enabled: boolean) => void;
  setActiveScreen: (screen: string) => void;
  showModal: (key: string) => void;
  hideModal: (key: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  dismissToast: (id: string) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setSyncStatus: (isSyncing: boolean) => void;
}

// ==================== PAGINATION STATE ====================

export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}

// ==================== ASYNC STATE HELPERS ====================

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

// ==================== ACTION TYPES ====================

export type AsyncThunkStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncActionState {
  status: AsyncThunkStatus;
  error: string | null;
}
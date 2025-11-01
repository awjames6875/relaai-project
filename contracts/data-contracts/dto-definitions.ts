/**
 * RelaAI Data Transfer Objects (DTOs)
 * 
 * Defines all data structures passed between frontend and backend.
 * These match the API contract specifications.
 */

// ==================== USER DTOs ====================

export interface UserRegistrationDTO {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  timezone?: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  timezone: string;
  subscriptionTier: 'free' | 'premium' | 'enterprise';
  subscriptionStatus: 'active' | 'cancelled' | 'expired';
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDTO {
  fullName?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  timezone?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

// ==================== CONTACT DTOs ====================

export interface CreateContactDTO {
  name: string;
  phoneNumber?: string;
  email?: string;
  birthday?: string; // ISO date string (YYYY-MM-DD)
  anniversary?: string; // ISO date string (YYYY-MM-DD)
  relationshipType?: string;
  notes?: string;
}

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  birthday?: string;
  anniversary?: string;
  relationshipType?: string;
  communicationStyle?: string;
  personalityTraits: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface UpdateContactDTO {
  name?: string;
  phoneNumber?: string;
  email?: string;
  birthday?: string;
  anniversary?: string;
  relationshipType?: string;
  notes?: string;
}

// ==================== MESSAGE DTOs ====================

export interface GenerateMessageDTO {
  contactId: string;
  occasion: 'birthday' | 'anniversary' | 'casual' | 'apology' | 'thankyou' | 'congratulations';
  tone?: 'formal' | 'casual' | 'humorous' | 'heartfelt' | 'professional';
  context?: string;
}

export interface Message {
  id: string;
  userId: string;
  contactId: string;
  content: string;
  occasion?: string;
  tone?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  aiGenerated: boolean;
  confidenceScore?: number;
  alternatives: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageDTO {
  contactId: string;
  content: string;
  occasion?: string;
  tone?: string;
}

export interface UpdateMessageDTO {
  content?: string;
  occasion?: string;
  tone?: string;
}

export interface ScheduleMessageDTO {
  scheduledAt: string; // ISO datetime string
}

export interface GeneratedMessageResponse {
  messageId: string;
  content: string;
  alternatives: string[];
  confidence: number;
  occasion: string;
  tone: string;
  generatedAt: string;
}

// ==================== RELATIONSHIP DTOs ====================

export interface Relationship {
  id: string;
  userId: string;
  contactId: string;
  contactName?: string; // Included for convenience
  healthScore: number; // 0-100
  lastContactDate?: string;
  contactFrequency?: number; // days
  daysSinceLastContact?: number;
  temperature: 'cold' | 'warm' | 'hot';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRelationshipDTO {
  healthScore?: number;
  contactFrequency?: number;
  notes?: string;
}

export interface CalculateHealthScoreResponse {
  relationshipId: string;
  contactId: string;
  healthScore: number;
  previousScore: number;
  temperature: 'cold' | 'warm' | 'hot';
  calculatedAt: string;
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

// ==================== MESSAGE TEMPLATE DTOs ====================

export interface MessageTemplate {
  id: string;
  userId?: string; // null for system templates
  name: string;
  occasion: 'birthday' | 'anniversary' | 'casual' | 'apology' | 'thankyou' | 'congratulations';
  tone?: 'formal' | 'casual' | 'humorous' | 'heartfelt' | 'professional';
  templateText: string;
  placeholders: string[];
  isSystemTemplate: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDTO {
  name: string;
  occasion: string;
  tone?: string;
  templateText: string;
  placeholders: string[];
}

export interface UpdateTemplateDTO {
  name?: string;
  templateText?: string;
  tone?: string;
}

export interface RenderTemplateDTO {
  placeholderValues: Record<string, string>;
}

export interface RenderTemplateResponse {
  rendered: string;
  placeholdersUsed: string[];
}

// ==================== PERSONAL FACT DTOs ====================

export interface PersonalFact {
  id: string;
  userId: string;
  contactId: string;
  factType: 'hobby' | 'preference' | 'life_event' | 'personality' | 'other';
  factContent: string;
  source: 'conversation' | 'manual_entry' | 'ai_inference';
  confidenceScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonalFactDTO {
  contactId: string;
  factType: string;
  factContent: string;
  source: string;
  confidenceScore?: number;
}

// ==================== IMPORTANT DATE DTOs ====================

export interface ImportantDate {
  id: string;
  userId: string;
  contactId: string;
  dateType: 'birthday' | 'anniversary' | 'custom';
  date: string; // ISO date string
  description?: string;
  reminderDaysBefore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImportantDateDTO {
  contactId: string;
  dateType: string;
  date: string;
  description?: string;
  reminderDaysBefore?: number;
}

// ==================== USER SETTINGS DTOs ====================

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
  updatedAt: string;
}

export interface UpdateUserSettingsDTO {
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  reminderFrequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  autoScheduleEnabled?: boolean;
  defaultMessageTone?: 'formal' | 'casual' | 'humorous' | 'heartfelt' | 'professional';
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
}

// ==================== SUBSCRIPTION DTOs ====================

export interface Subscription {
  tier: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate?: string;
  renewalDate?: string;
  features: SubscriptionFeatures;
}

export interface SubscriptionFeatures {
  maxContacts: number;
  maxMessagesPerMonth: number;
  aiGenerationsPerMonth: number;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
}

// ==================== USER STATS DTOs ====================

export interface UserStats {
  period: 'week' | 'month' | 'year' | 'all';
  totalContacts: number;
  totalMessages: number;
  messagesSent: number;
  messagesScheduled: number;
  aiGenerations: number;
  averageHealthScore: number;
  activeRelationships: number;
  topContacts: TopContact[];
  activityByDay: DailyActivity[];
}

export interface TopContact {
  contactId: string;
  contactName: string;
  messageCount: number;
}

export interface DailyActivity {
  date: string; // ISO date string
  messageCount: number;
}

// ==================== PAGINATION DTOs ====================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ==================== API RESPONSE DTOs ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ==================== SEARCH & FILTER DTOs ====================

export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  sort?: SortParams;
  pagination?: PaginationParams;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[];
}

// ==================== ONBOARDING DTOs ====================

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface CompleteOnboardingDTO {
  completedSteps: string[];
}

export interface OnboardingStatus {
  onboardingCompleted: boolean;
  completedAt?: string;
  steps: OnboardingStep[];
}

// ==================== ANALYTICS DTOs ====================

export interface DashboardStats {
  totalContacts: number;
  activeRelationships: number;
  scheduledMessages: number;
  avgHealthScore: number;
}

export interface RecentActivity {
  id: string;
  type: 'message_sent' | 'message_scheduled' | 'contact_added' | 'relationship_updated';
  timestamp: string;
  description: string;
  metadata?: Record<string, any>;
}

// ==================== NOTIFICATION DTOs ====================

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: string;
  read: boolean;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  categories: {
    messages: boolean;
    relationships: boolean;
    reminders: boolean;
    updates: boolean;
  };
}

// ==================== IMPORT/EXPORT DTOs ====================

export interface ImportContactsDTO {
  contacts: Partial<Contact>[];
  source: 'csv' | 'google' | 'apple' | 'manual';
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}

export interface ExportFormat {
  format: 'csv' | 'json' | 'xlsx';
  includeMessages: boolean;
  includeRelationships: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}
/**
 * Validation Schemas
 * 
 * Zod validation schemas for all DTOs.
 * Used for runtime validation on both frontend and backend.
 */

import { z, ZodSchema, ZodError } from 'zod';

// ==================== USER VALIDATION ====================

export const UserRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),
  timezone: z.string().optional(),
});

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const UpdateUserSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),
  profilePictureUrl: z.string().url('Invalid URL').optional(),
  timezone: z.string().optional(),
});

// ==================== CONTACT VALIDATION ====================

export const CreateContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),
  email: z.string().email('Invalid email format').optional(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  anniversary: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  relationshipType: z.string().max(50).optional(),
  notes: z.string().max(1000).optional(),
});

export const UpdateContactSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),
  email: z.string().email().optional(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  anniversary: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  relationshipType: z.string().max(50).optional(),
  notes: z.string().max(1000).optional(),
});

// ==================== MESSAGE VALIDATION ====================

export const GenerateMessageSchema = z.object({
  contactId: z.string().uuid('Invalid contact ID'),
  occasion: z.enum([
    'birthday',
    'anniversary',
    'casual',
    'apology',
    'thankyou',
    'congratulations',
  ]),
  tone: z
    .enum(['formal', 'casual', 'humorous', 'heartfelt', 'professional'])
    .optional(),
  context: z.string().max(500).optional(),
});

export const CreateMessageSchema = z.object({
  contactId: z.string().uuid('Invalid contact ID'),
  content: z.string().min(1, 'Message content is required').max(1000),
  occasion: z.string().max(50).optional(),
  tone: z.string().max(50).optional(),
});

export const UpdateMessageSchema = z.object({
  content: z.string().min(1).max(1000).optional(),
  occasion: z.string().max(50).optional(),
  tone: z.string().max(50).optional(),
});

export const ScheduleMessageSchema = z.object({
  scheduledAt: z.string().datetime('Invalid datetime format'),
});

// ==================== RELATIONSHIP VALIDATION ====================

export const UpdateRelationshipSchema = z.object({
  healthScore: z
    .number()
    .int()
    .min(0, 'Health score must be between 0 and 100')
    .max(100, 'Health score must be between 0 and 100')
    .optional(),
  contactFrequency: z
    .number()
    .int()
    .min(1, 'Contact frequency must be at least 1 day')
    .optional(),
  notes: z.string().max(1000).optional(),
});

// ==================== TEMPLATE VALIDATION ====================

export const CreateTemplateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  occasion: z.enum([
    'birthday',
    'anniversary',
    'casual',
    'apology',
    'thankyou',
    'congratulations',
  ]),
  tone: z
    .enum(['formal', 'casual', 'humorous', 'heartfelt', 'professional'])
    .optional(),
  templateText: z
    .string()
    .min(10, 'Template must be at least 10 characters')
    .max(500),
  placeholders: z.array(z.string()).optional(),
});

export const UpdateTemplateSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  templateText: z.string().min(10).max(500).optional(),
  tone: z
    .enum(['formal', 'casual', 'humorous', 'heartfelt', 'professional'])
    .optional(),
});

export const RenderTemplateSchema = z.object({
  placeholderValues: z.record(z.string(), z.string()),
});

// ==================== SETTINGS VALIDATION ====================

export const UpdateSettingsSchema = z.object({
  notificationsEnabled: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  reminderFrequency: z
    .enum(['daily', 'weekly', 'biweekly', 'monthly'])
    .optional(),
  autoScheduleEnabled: z.boolean().optional(),
  defaultMessageTone: z
    .enum(['formal', 'casual', 'humorous', 'heartfelt', 'professional'])
    .optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  language: z
    .string()
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid language code')
    .optional(),
});

// ==================== PAGINATION VALIDATION ====================

export const PaginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20),
});

// ==================== SEARCH VALIDATION ====================

export const SearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  filters: z.record(z.any()).optional(),
  sort: z
    .object({
      field: z.string(),
      order: z.enum(['asc', 'desc']),
    })
    .optional(),
  pagination: PaginationSchema.optional(),
});

// ==================== ONBOARDING VALIDATION ====================

export const CompleteOnboardingSchema = z.object({
  completedSteps: z.array(z.string()).min(1, 'At least one step must be completed'),
});

// ==================== HELPER FUNCTIONS ====================

export const validateDTO = <T>(schema: ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: ZodError;
} => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
};

export const formatValidationErrors = (errors: ZodError): Record<string, string> => {
  const formatted: Record<string, string> = {};
  errors.errors.forEach((error: { path: (string | number)[]; message: string }) => {
    const path = error.path.join('.');
    formatted[path] = error.message;
  });
  return formatted;
};
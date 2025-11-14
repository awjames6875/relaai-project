/**
 * Message Validation Utilities
 *
 * Validates message form fields for Epic 3: AI Message Generation.
 * Provides both individual field validators and a combined validator.
 *
 * Validation Rules:
 * - Content: required, 1-5000 characters
 * - Occasion: optional, must be valid occasion type
 * - Tone: optional, must be valid tone type
 * - Context: optional, max 500 characters
 * - ScheduledAt: optional, must be future date, max 1 year ahead
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface MessageValidationErrors {
  content?: string;
  occasion?: string;
  tone?: string;
  context?: string;
  scheduledAt?: string;
}

export interface MessageFormData {
  content: string;
  occasion?: string;
  tone?: string;
  context?: string;
  scheduledAt?: string; // ISO datetime string
}

/**
 * Validates message content field.
 * Rules: 1-5000 characters, required.
 */
export const validateContent = (content: string): ValidationResult => {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: 'Message content is required' };
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length > 5000) {
    return { isValid: false, error: 'Message content must not exceed 5000 characters' };
  }

  return { isValid: true };
};

/**
 * Validates occasion field.
 * Rules: Optional, but if provided must be one of the valid occasion types.
 */
export const validateOccasion = (occasion?: string): ValidationResult => {
  if (!occasion || occasion.trim().length === 0) {
    return { isValid: true }; // Optional field
  }

  const validOccasions = ['birthday', 'anniversary', 'casual', 'apology', 'thankyou', 'congratulations'];

  if (!validOccasions.includes(occasion.trim().toLowerCase())) {
    return {
      isValid: false,
      error: `Occasion must be one of: ${validOccasions.join(', ')}`,
    };
  }

  return { isValid: true };
};

/**
 * Validates tone field.
 * Rules: Optional, but if provided must be one of the valid tone types.
 */
export const validateTone = (tone?: string): ValidationResult => {
  if (!tone || tone.trim().length === 0) {
    return { isValid: true }; // Optional field
  }

  const validTones = ['formal', 'casual', 'humorous', 'heartfelt', 'professional'];

  if (!validTones.includes(tone.trim().toLowerCase())) {
    return {
      isValid: false,
      error: `Tone must be one of: ${validTones.join(', ')}`,
    };
  }

  return { isValid: true };
};

/**
 * Validates context field.
 * Rules: Optional, max 500 characters.
 */
export const validateContext = (context?: string): ValidationResult => {
  if (!context || context.trim().length === 0) {
    return { isValid: true }; // Optional field
  }

  if (context.length > 500) {
    return { isValid: false, error: 'Context must not exceed 500 characters' };
  }

  return { isValid: true };
};

/**
 * Validates scheduled datetime field.
 * Rules: Optional, must be in the future, max 1 year ahead.
 */
export const validateScheduledAt = (scheduledAt?: string): ValidationResult => {
  if (!scheduledAt || scheduledAt.trim().length === 0) {
    return { isValid: true }; // Optional field
  }

  // Check if it's a valid ISO datetime string
  const scheduledDate = new Date(scheduledAt);
  if (isNaN(scheduledDate.getTime())) {
    return { isValid: false, error: 'Scheduled date must be a valid datetime' };
  }

  // Check if it's in the future
  const now = new Date();
  if (scheduledDate <= now) {
    return { isValid: false, error: 'Scheduled date must be in the future' };
  }

  // Check if it's within 1 year (365 days + 24 hours buffer)
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  if (scheduledDate > oneYearFromNow) {
    return { isValid: false, error: 'Scheduled date cannot be more than 1 year in the future' };
  }

  // Check minimum scheduling time (5 minutes)
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
  if (scheduledDate < fiveMinutesFromNow) {
    return { isValid: false, error: 'Scheduled date must be at least 5 minutes in the future' };
  }

  return { isValid: true };
};

/**
 * Validates all message form fields together.
 * Returns an object with field-specific errors.
 */
export const validateMessage = (formData: MessageFormData): MessageValidationErrors => {
  const errors: MessageValidationErrors = {};

  const contentResult = validateContent(formData.content);
  if (!contentResult.isValid) errors.content = contentResult.error;

  const occasionResult = validateOccasion(formData.occasion);
  if (!occasionResult.isValid) errors.occasion = occasionResult.error;

  const toneResult = validateTone(formData.tone);
  if (!toneResult.isValid) errors.tone = toneResult.error;

  const contextResult = validateContext(formData.context);
  if (!contextResult.isValid) errors.context = contextResult.error;

  const scheduledAtResult = validateScheduledAt(formData.scheduledAt);
  if (!scheduledAtResult.isValid) errors.scheduledAt = scheduledAtResult.error;

  return errors;
};

/**
 * Helper function to check if message validation has any errors.
 */
export const hasValidationErrors = (errors: MessageValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};


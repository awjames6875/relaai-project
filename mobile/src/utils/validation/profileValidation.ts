/**
 * Profile Validation Utilities
 *
 * Validates profile form fields for US-1.3 Profile Setup.
 * Provides both individual field validators and a combined validator.
 *
 * Validation Rules:
 * - Full name: 2-100 characters, spaces/hyphens/apostrophes only
 * - Phone: E.164 format (optional field)
 * - Timezone: valid IANA timezone
 * - Image file: JPG/PNG, max 5MB
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ProfileValidationErrors {
  fullName?: string;
  phone?: string;
  timezone?: string;
  avatarFile?: string;
}

export interface ProfileFormData {
  fullName: string;
  phone?: string;
  timezone: string;
  avatarFile?: {
    uri: string;
    type: string;
    size: number;
    name?: string;
  };
}

/**
 * Validates full name field
 * Rules: 2-100 characters, only letters, spaces, hyphens, apostrophes
 */
export const validateFullName = (fullName: string): ValidationResult => {
  if (!fullName || fullName.trim().length === 0) {
    return {
      isValid: false,
      error: 'Full name is required',
    };
  }

  const trimmedName = fullName.trim();

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: 'Full name must be at least 2 characters',
    };
  }

  if (trimmedName.length > 100) {
    return {
      isValid: false,
      error: 'Full name must not exceed 100 characters',
    };
  }

  // Only allow letters (including unicode), spaces, hyphens, apostrophes
  const nameRegex = /^[\p{L}\s'-]+$/u;
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Full name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  return { isValid: true };
};

/**
 * Validates phone number in E.164 format
 * Rules: Optional field, but if provided must be valid E.164 format
 * E.164 format: +[country code][number] (e.g., +1234567890)
 */
export const validatePhone = (phone?: string): ValidationResult => {
  // Phone is optional
  if (!phone || phone.trim().length === 0) {
    return { isValid: true };
  }

  const trimmedPhone = phone.trim();

  // E.164 format: starts with +, followed by 1-15 digits
  const e164Regex = /^\+[1-9]\d{1,14}$/;

  if (!e164Regex.test(trimmedPhone)) {
    return {
      isValid: false,
      error: 'Phone number must be in E.164 format (e.g., +1234567890)',
    };
  }

  return { isValid: true };
};

/**
 * Validates timezone selection
 * Rules: Must be a valid IANA timezone identifier
 */
export const validateTimezone = (timezone: string): ValidationResult => {
  if (!timezone || timezone.trim().length === 0) {
    return {
      isValid: false,
      error: 'Timezone is required',
    };
  }

  // Basic IANA timezone format validation
  // IANA timezones follow pattern: Area/Location or Area/Location/SubLocation
  const timezoneRegex = /^[A-Z][a-zA-Z_]+\/[A-Z][a-zA-Z_]+(?:\/[A-Z][a-zA-Z_]+)?$/;

  // Also accept common timezone formats like UTC, GMT+X, etc.
  const specialTimezones = ['UTC', 'GMT'];
  const gmtOffsetRegex = /^(GMT|UTC)[+-]\d{1,2}(:\d{2})?$/;

  const isSpecialTimezone = specialTimezones.includes(timezone);
  const isGmtOffset = gmtOffsetRegex.test(timezone);
  const isIanaFormat = timezoneRegex.test(timezone);

  if (!isSpecialTimezone && !isGmtOffset && !isIanaFormat) {
    return {
      isValid: false,
      error: 'Please select a valid timezone',
    };
  }

  return { isValid: true };
};

/**
 * Validates image file
 * Rules: JPG/PNG formats only, max 5MB size
 */
export const validateAvatarFile = (
  file?: { uri: string; type: string; size: number; name?: string }
): ValidationResult => {
  // Avatar is optional
  if (!file) {
    return { isValid: true };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const fileType = file.type.toLowerCase();

  if (!allowedTypes.includes(fileType)) {
    return {
      isValid: false,
      error: 'Profile picture must be JPG or PNG format',
    };
  }

  // Check file size (5MB = 5 * 1024 * 1024 bytes)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `Profile picture must be under 5MB (current size: ${sizeMB}MB)`,
    };
  }

  return { isValid: true };
};

/**
 * Validates all profile fields together
 * Returns an object with field-specific errors
 */
export const validateProfile = (formData: ProfileFormData): ProfileValidationErrors => {
  const errors: ProfileValidationErrors = {};

  // Validate full name
  const fullNameResult = validateFullName(formData.fullName);
  if (!fullNameResult.isValid) {
    errors.fullName = fullNameResult.error;
  }

  // Validate phone
  const phoneResult = validatePhone(formData.phone);
  if (!phoneResult.isValid) {
    errors.phone = phoneResult.error;
  }

  // Validate timezone
  const timezoneResult = validateTimezone(formData.timezone);
  if (!timezoneResult.isValid) {
    errors.timezone = timezoneResult.error;
  }

  // Validate avatar file
  const avatarResult = validateAvatarFile(formData.avatarFile);
  if (!avatarResult.isValid) {
    errors.avatarFile = avatarResult.error;
  }

  return errors;
};

/**
 * Helper function to check if profile validation has any errors
 */
export const hasValidationErrors = (errors: ProfileValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

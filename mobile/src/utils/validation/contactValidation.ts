/**
 * Contact Validation Utilities
 *
 * Validates contact form fields for Epic 2: Contact Management.
 * Provides both individual field validators and a combined validator.
 *
 * Validation Rules:
 * - Name: 2-100 characters, spaces/hyphens/apostrophes only (required)
 * - Phone: E.164 format (optional field)
 * - Email: valid email format (optional field)
 * - Birthday: YYYY-MM-DD format (optional field)
 * - Anniversary: YYYY-MM-DD format (optional field)
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ContactValidationErrors {
  name?: string;
  phone?: string;
  email?: string;
  birthday?: string;
  anniversary?: string;
}

export interface ContactFormData {
  name: string;
  phone?: string;
  email?: string;
  birthday?: string;
  anniversary?: string;
  relationshipType?: string;
  notes?: string;
}

/**
 * Validates contact name field
 * Rules: 2-100 characters, only letters, spaces, hyphens, apostrophes
 */
export const validateContactName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Contact name is required',
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: 'Contact name must be at least 2 characters',
    };
  }

  if (trimmedName.length > 100) {
    return {
      isValid: false,
      error: 'Contact name must not exceed 100 characters',
    };
  }

  // Only allow letters (including unicode), spaces, hyphens, apostrophes
  const nameRegex = /^[\p{L}\s'-]+$/u;
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Contact name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  return { isValid: true };
};

/**
 * Validates phone number in E.164 format
 * Rules: Optional field, but if provided must be valid E.164 format
 * E.164 format: +[country code][number] (e.g., +1234567890)
 */
export const validatePhoneNumber = (phone?: string): ValidationResult => {
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
 * Validates email address
 * Rules: Optional field, but if provided must be valid email format
 */
export const validateEmail = (email?: string): ValidationResult => {
  // Email is optional
  if (!email || email.trim().length === 0) {
    return { isValid: true };
  }

  const trimmedEmail = email.trim();

  // Basic email regex validation
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
};

/**
 * Validates date format (YYYY-MM-DD)
 * Rules: Optional field, but if provided must be valid date format
 */
export const validateDate = (date?: string): ValidationResult => {
  // Date is optional
  if (!date || date.trim().length === 0) {
    return { isValid: true };
  }

  const trimmedDate = date.trim();

  // YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(trimmedDate)) {
    return {
      isValid: false,
      error: 'Date must be in YYYY-MM-DD format',
    };
  }

  // Validate that the date is actually valid
  const parsedDate = new Date(trimmedDate);
  const isInvalidDate = isNaN(parsedDate.getTime());

  if (isInvalidDate) {
    return {
      isValid: false,
      error: 'Please enter a valid date',
    };
  }

  // Check that the parsed date matches the input (catches dates like 2023-13-45)
  const [year, month, day] = trimmedDate.split('-').map(Number);
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return {
      isValid: false,
      error: 'Please enter a valid date',
    };
  }

  return { isValid: true };
};

/**
 * Validates all contact fields together
 * Returns an object with field-specific errors
 */
export const validateContact = (formData: ContactFormData): ContactValidationErrors => {
  const errors: ContactValidationErrors = {};

  // Validate name
  const nameResult = validateContactName(formData.name);
  if (!nameResult.isValid) {
    errors.name = nameResult.error;
  }

  // Validate phone
  const phoneResult = validatePhoneNumber(formData.phone);
  if (!phoneResult.isValid) {
    errors.phone = phoneResult.error;
  }

  // Validate email
  const emailResult = validateEmail(formData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }

  // Validate birthday
  const birthdayResult = validateDate(formData.birthday);
  if (!birthdayResult.isValid) {
    errors.birthday = birthdayResult.error;
  }

  // Validate anniversary
  const anniversaryResult = validateDate(formData.anniversary);
  if (!anniversaryResult.isValid) {
    errors.anniversary = anniversaryResult.error;
  }

  return errors;
};

/**
 * Helper function to check if contact validation has any errors
 */
export const hasValidationErrors = (errors: ContactValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};


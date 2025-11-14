/**
 * PROFILE VALIDATION UNIT TESTS
 *
 * Component: profileValidation
 * Created: 2025-11-02
 * Author: QA Agent (Claude)
 *
 * Test Framework: Jest
 * Coverage Target: 100%
 *
 * Tests validation logic for US-1.3 Profile Setup:
 * - Full name validation (2-100 chars, allowed characters)
 * - Phone validation (E.164 format, optional)
 * - Timezone validation (valid IANA, required)
 * - Image validation (JPG/PNG, max 5MB)
 */

import {
  validateFullName,
  validatePhoneNumber,
  validateTimezone,
  validateImageFile,
  validateProfileForm,
  type ValidationResult,
  type ProfileFormData,
} from '@/utils/validation/profileValidation';

import {
  createValidJPGImageFactory,
  createValidPNGImageFactory,
  createOversizedImageFactory,
  createUnsupportedImageFactory,
  createSVGImageFactory,
} from '../../factories/profile.factory';

// ==================== FULL NAME VALIDATION TESTS ====================

describe('validateFullName', () => {
  describe('Valid Names', () => {
    it('should accept valid name with letters and spaces', () => {
      // Arrange
      const name = 'John Doe';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept name with hyphens', () => {
      // Arrange
      const name = 'Mary-Jane Smith';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept name with apostrophes', () => {
      // Arrange
      const name = "O'Brien";

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept name with hyphens and apostrophes', () => {
      // Arrange
      const name = "Mary O'Brien-Smith";

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept name at minimum length (2 characters)', () => {
      // Arrange
      const name = 'Jo';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept name at maximum length (100 characters)', () => {
      // Arrange
      const name = 'A'.repeat(100);

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept name with multiple spaces', () => {
      // Arrange
      const name = 'John Paul Jones';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Invalid Names', () => {
    it('should reject empty name', () => {
      // Arrange
      const name = '';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name is required');
    });

    it('should reject name with only spaces', () => {
      // Arrange
      const name = '   ';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name is required');
    });

    it('should reject name shorter than 2 characters', () => {
      // Arrange
      const name = 'A';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name must be between 2 and 100 characters');
    });

    it('should reject name longer than 100 characters', () => {
      // Arrange
      const name = 'A'.repeat(101);

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name must be between 2 and 100 characters');
    });

    it('should reject name with numbers', () => {
      // Arrange
      const name = 'John123';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('should reject name with special characters (@)', () => {
      // Arrange
      const name = 'John@Doe';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('should reject name with special characters (!)', () => {
      // Arrange
      const name = 'John!';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('should reject name with underscores', () => {
      // Arrange
      const name = 'John_Doe';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('should reject name with periods', () => {
      // Arrange
      const name = 'Dr. John Doe';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name can only contain letters, spaces, hyphens, and apostrophes');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null input', () => {
      // Arrange
      const name = null as any;

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name is required');
    });

    it('should handle undefined input', () => {
      // Arrange
      const name = undefined as any;

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name is required');
    });

    it('should trim whitespace before validation', () => {
      // Arrange
      const name = '  John Doe  ';

      // Act
      const result = validateFullName(name);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});

// ==================== PHONE NUMBER VALIDATION TESTS ====================

describe('validatePhoneNumber', () => {
  describe('Valid Phone Numbers', () => {
    it('should accept valid E.164 format (+1 followed by 10 digits)', () => {
      // Arrange
      const phone = '+12125551234';

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept E.164 format with different country code (+44)', () => {
      // Arrange
      const phone = '+442071234567';

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept empty string (optional field)', () => {
      // Arrange
      const phone = '';

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept undefined (optional field)', () => {
      // Arrange
      const phone = undefined;

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept null (optional field)', () => {
      // Arrange
      const phone = null;

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Invalid Phone Numbers', () => {
    it('should reject phone without + prefix', () => {
      // Arrange
      const phone = '12125551234';

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number must be in E.164 format (e.g., +12125551234)');
    });

    it('should reject phone with spaces', () => {
      // Arrange
      const phone = '+1 212 555 1234';

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number must be in E.164 format (e.g., +12125551234)');
    });

    it('should reject phone with dashes', () => {
      // Arrange
      const phone = '+1-212-555-1234';

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number must be in E.164 format (e.g., +12125551234)');
    });

    it('should reject phone with parentheses', () => {
      // Arrange
      const phone = '+1(212)5551234';

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number must be in E.164 format (e.g., +12125551234)');
    });

    it('should reject phone that is too short', () => {
      // Arrange
      const phone = '+1234';

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number must be in E.164 format (e.g., +12125551234)');
    });

    it('should reject phone with letters', () => {
      // Arrange
      const phone = '+1212555CALL';

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number must be in E.164 format (e.g., +12125551234)');
    });

    it('should reject phone that starts with 00 instead of +', () => {
      // Arrange
      const phone = '0012125551234';

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number must be in E.164 format (e.g., +12125551234)');
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only string as empty', () => {
      // Arrange
      const phone = '   ';

      // Act
      const result = validatePhoneNumber(phone);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});

// ==================== TIMEZONE VALIDATION TESTS ====================

describe('validateTimezone', () => {
  describe('Valid Timezones', () => {
    it('should accept America/New_York', () => {
      // Arrange
      const timezone = 'America/New_York';

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept America/Los_Angeles', () => {
      // Arrange
      const timezone = 'America/Los_Angeles';

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept UTC', () => {
      // Arrange
      const timezone = 'UTC';

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept Europe/London', () => {
      // Arrange
      const timezone = 'Europe/London';

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept Asia/Tokyo', () => {
      // Arrange
      const timezone = 'Asia/Tokyo';

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Invalid Timezones', () => {
    it('should reject empty timezone', () => {
      // Arrange
      const timezone = '';

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Timezone is required');
    });

    it('should reject undefined timezone', () => {
      // Arrange
      const timezone = undefined as any;

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Timezone is required');
    });

    it('should reject null timezone', () => {
      // Arrange
      const timezone = null as any;

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Timezone is required');
    });

    it('should reject invalid timezone format', () => {
      // Arrange
      const timezone = 'Invalid/Timezone';

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please select a valid timezone');
    });

    it('should reject timezone abbreviations (EST)', () => {
      // Arrange
      const timezone = 'EST';

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please select a valid timezone');
    });

    it('should reject timezone offsets (UTC-5)', () => {
      // Arrange
      const timezone = 'UTC-5';

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please select a valid timezone');
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only string', () => {
      // Arrange
      const timezone = '   ';

      // Act
      const result = validateTimezone(timezone);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Timezone is required');
    });
  });
});

// ==================== IMAGE FILE VALIDATION TESTS ====================

describe('validateImageFile', () => {
  describe('Valid Images', () => {
    it('should accept JPG image under 5MB', () => {
      // Arrange
      const image = createValidJPGImageFactory();

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept PNG image under 5MB', () => {
      // Arrange
      const image = createValidPNGImageFactory();

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept image/jpeg MIME type', () => {
      // Arrange
      const image = {
        uri: 'file:///test.jpg',
        type: 'image/jpeg',
        name: 'test.jpg',
        size: 1024 * 1024,
      };

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept image at exactly 5MB', () => {
      // Arrange
      const image = {
        uri: 'file:///test.jpg',
        type: 'image/jpeg',
        name: 'test.jpg',
        size: 5 * 1024 * 1024, // Exactly 5MB
      };

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept null (optional field)', () => {
      // Arrange
      const image = null;

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept undefined (optional field)', () => {
      // Arrange
      const image = undefined;

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Invalid Images', () => {
    it('should reject image over 5MB', () => {
      // Arrange
      const image = createOversizedImageFactory();

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Image must be less than 5MB');
    });

    it('should reject unsupported format (GIF)', () => {
      // Arrange
      const image = createUnsupportedImageFactory();

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Image must be JPG or PNG format');
    });

    it('should reject SVG format', () => {
      // Arrange
      const image = createSVGImageFactory();

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Image must be JPG or PNG format');
    });

    it('should reject image with no type', () => {
      // Arrange
      const image = {
        uri: 'file:///test.jpg',
        type: '',
        name: 'test.jpg',
        size: 1024 * 1024,
      };

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Image must be JPG or PNG format');
    });

    it('should reject image with invalid MIME type', () => {
      // Arrange
      const image = {
        uri: 'file:///test.txt',
        type: 'text/plain',
        name: 'test.txt',
        size: 1024,
      };

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Image must be JPG or PNG format');
    });

    it('should reject image with zero size', () => {
      // Arrange
      const image = {
        uri: 'file:///test.jpg',
        type: 'image/jpeg',
        name: 'test.jpg',
        size: 0,
      };

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid image file');
    });

    it('should reject image with negative size', () => {
      // Arrange
      const image = {
        uri: 'file:///test.jpg',
        type: 'image/jpeg',
        name: 'test.jpg',
        size: -1024,
      };

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid image file');
    });
  });

  describe('Edge Cases', () => {
    it('should handle image with missing size property', () => {
      // Arrange
      const image = {
        uri: 'file:///test.jpg',
        type: 'image/jpeg',
        name: 'test.jpg',
      } as any;

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid image file');
    });

    it('should handle image with missing type property', () => {
      // Arrange
      const image = {
        uri: 'file:///test.jpg',
        name: 'test.jpg',
        size: 1024 * 1024,
      } as any;

      // Act
      const result = validateImageFile(image);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Image must be JPG or PNG format');
    });
  });
});

// ==================== COMPLETE FORM VALIDATION TESTS ====================

describe('validateProfileForm', () => {
  const createValidFormData = (): ProfileFormData => ({
    fullName: 'John Doe',
    phoneNumber: '+12125551234',
    timezone: 'America/New_York',
    avatarFile: createValidJPGImageFactory(),
  });

  describe('Valid Forms', () => {
    it('should accept complete valid form', () => {
      // Arrange
      const formData = createValidFormData();

      // Act
      const result = validateProfileForm(formData);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should accept form without optional phone', () => {
      // Arrange
      const formData = {
        ...createValidFormData(),
        phoneNumber: undefined,
      };

      // Act
      const result = validateProfileForm(formData);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should accept form without optional avatar', () => {
      // Arrange
      const formData = {
        ...createValidFormData(),
        avatarFile: undefined,
      };

      // Act
      const result = validateProfileForm(formData);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should accept minimal valid form (only required fields)', () => {
      // Arrange
      const formData: ProfileFormData = {
        fullName: 'John Doe',
        timezone: 'America/New_York',
      };

      // Act
      const result = validateProfileForm(formData);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('Invalid Forms', () => {
    it('should reject form with invalid name', () => {
      // Arrange
      const formData = {
        ...createValidFormData(),
        fullName: 'A',
      };

      // Act
      const result = validateProfileForm(formData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.fullName).toBe('Full name must be between 2 and 100 characters');
    });

    it('should reject form with invalid phone', () => {
      // Arrange
      const formData = {
        ...createValidFormData(),
        phoneNumber: '1234567890',
      };

      // Act
      const result = validateProfileForm(formData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.phoneNumber).toBe('Phone number must be in E.164 format (e.g., +12125551234)');
    });

    it('should reject form with invalid timezone', () => {
      // Arrange
      const formData = {
        ...createValidFormData(),
        timezone: 'Invalid/Timezone',
      };

      // Act
      const result = validateProfileForm(formData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.timezone).toBe('Please select a valid timezone');
    });

    it('should reject form with oversized image', () => {
      // Arrange
      const formData = {
        ...createValidFormData(),
        avatarFile: createOversizedImageFactory(),
      };

      // Act
      const result = validateProfileForm(formData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.avatarFile).toBe('Image must be less than 5MB');
    });

    it('should collect multiple validation errors', () => {
      // Arrange
      const formData: ProfileFormData = {
        fullName: 'A',
        phoneNumber: '1234567890',
        timezone: 'Invalid',
        avatarFile: createOversizedImageFactory(),
      };

      // Act
      const result = validateProfileForm(formData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors)).toHaveLength(4);
      expect(result.errors.fullName).toBeTruthy();
      expect(result.errors.phoneNumber).toBeTruthy();
      expect(result.errors.timezone).toBeTruthy();
      expect(result.errors.avatarFile).toBeTruthy();
    });

    it('should reject form with missing required fullName', () => {
      // Arrange
      const formData = {
        timezone: 'America/New_York',
      } as ProfileFormData;

      // Act
      const result = validateProfileForm(formData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.fullName).toBe('Full name is required');
    });

    it('should reject form with missing required timezone', () => {
      // Arrange
      const formData = {
        fullName: 'John Doe',
      } as ProfileFormData;

      // Act
      const result = validateProfileForm(formData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.timezone).toBe('Timezone is required');
    });
  });
});

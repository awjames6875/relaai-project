/**
 * PROFILE TEST FACTORY
 *
 * Entity: Profile
 * Created: 2025-11-02
 * Author: QA Agent (Claude)
 *
 * Purpose: Generate realistic profile test data for US-1.3 Profile Setup tests
 * Library: Faker.js for random data generation
 */

import { faker } from '@faker-js/faker';
import type { UserProfile, UpdateUserDTO } from '@/contracts/data-contracts/dto-definitions';

// ==================== NOTIFICATION PREFERENCES TYPE ====================

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
}

export interface ProfileWithNotifications extends UserProfile {
  notificationPreferences?: NotificationPreferences;
}

// ==================== BASE PROFILE FACTORY ====================

/**
 * Factory: Create a complete UserProfile object
 *
 * @param overrides - Partial object to override default values
 * @returns Complete UserProfile object with realistic data
 *
 * @example
 * const profile = createProfileFactory();
 *
 * @example
 * const profile = createProfileFactory({ fullName: 'John Doe' });
 */
export const createProfileFactory = (
  overrides: Partial<UserProfile> = {}
): UserProfile => {
  const now = new Date().toISOString();

  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    fullName: faker.person.fullName(),
    phoneNumber: faker.phone.number('+1##########'),
    profilePictureUrl: faker.image.avatar(),
    timezone: faker.helpers.arrayElement([
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'America/Denver',
      'America/Phoenix',
      'UTC',
    ]),
    subscriptionTier: 'free',
    subscriptionStatus: 'active',
    onboardingCompleted: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Factory: Create profile with notification preferences
 */
export const createProfileWithNotificationsFactory = (
  overrides: Partial<ProfileWithNotifications> = {}
): ProfileWithNotifications => {
  return {
    ...createProfileFactory(overrides),
    notificationPreferences: {
      email: faker.datatype.boolean(),
      push: faker.datatype.boolean(),
      sms: faker.datatype.boolean(),
      reminderFrequency: faker.helpers.arrayElement(['daily', 'weekly', 'biweekly', 'monthly']),
      ...overrides.notificationPreferences,
    },
  };
};

// ==================== DTO FACTORIES ====================

/**
 * Factory: Create DTO for updating profile
 *
 * @param overrides - Partial DTO to override defaults
 * @returns Update DTO with profile fields
 *
 * @example
 * const updateDto = createUpdateProfileDTOFactory({ fullName: 'John Doe' });
 */
export const createUpdateProfileDTOFactory = (
  overrides: Partial<UpdateUserDTO> = {}
): UpdateUserDTO => {
  return {
    fullName: faker.person.fullName(),
    phoneNumber: faker.phone.number('+1##########'),
    timezone: faker.helpers.arrayElement(['America/New_York', 'America/Los_Angeles', 'UTC']),
    ...overrides,
  };
};

/**
 * Factory: Create complete profile update payload with notifications
 */
export interface ProfileUpdatePayload {
  fullName: string;
  phoneNumber?: string;
  timezone: string;
  avatarUrl?: string;
  notificationPreferences: NotificationPreferences;
}

export const createProfileUpdatePayloadFactory = (
  overrides: Partial<ProfileUpdatePayload> = {}
): ProfileUpdatePayload => {
  return {
    fullName: faker.person.fullName(),
    phoneNumber: faker.phone.number('+1##########'),
    timezone: faker.helpers.arrayElement(['America/New_York', 'America/Los_Angeles', 'UTC']),
    avatarUrl: faker.image.avatar(),
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
      reminderFrequency: 'weekly',
    },
    ...overrides,
  };
};

// ==================== SPECIALIZED FACTORIES ====================

/**
 * Factory: Create minimal valid profile (only required fields)
 */
export const createMinimalProfileFactory = (): UserProfile => {
  return createProfileFactory({
    phoneNumber: undefined,
    profilePictureUrl: undefined,
  });
};

/**
 * Factory: Create profile with all optional fields
 */
export const createCompleteProfileFactory = (): UserProfile => {
  return createProfileFactory({
    phoneNumber: faker.phone.number('+1##########'),
    profilePictureUrl: faker.image.avatar(),
  });
};

/**
 * Factory: Create profile for new user (onboarding not completed)
 */
export const createNewUserProfileFactory = (): UserProfile => {
  return createProfileFactory({
    onboardingCompleted: false,
    subscriptionTier: 'free',
    subscriptionStatus: 'active',
    phoneNumber: undefined,
    profilePictureUrl: undefined,
  });
};

/**
 * Factory: Create profile for completed onboarding
 */
export const createOnboardedProfileFactory = (): UserProfile => {
  return createProfileFactory({
    onboardingCompleted: true,
    phoneNumber: faker.phone.number('+1##########'),
    profilePictureUrl: faker.image.avatar(),
  });
};

/**
 * Factory: Create profile with premium subscription
 */
export const createPremiumProfileFactory = (): UserProfile => {
  return createProfileFactory({
    subscriptionTier: 'premium',
    subscriptionStatus: 'active',
    onboardingCompleted: true,
  });
};

// ==================== VALIDATION TEST FACTORIES ====================

/**
 * Factory: Create profile with valid name
 */
export const createValidNameProfileFactory = (name?: string): UpdateUserDTO => {
  return createUpdateProfileDTOFactory({
    fullName: name || faker.person.fullName(),
  });
};

/**
 * Factory: Create profile with invalid name (too short)
 */
export const createInvalidShortNameProfileFactory = (): UpdateUserDTO => {
  return createUpdateProfileDTOFactory({
    fullName: 'A', // Less than 2 characters
  });
};

/**
 * Factory: Create profile with invalid name (too long)
 */
export const createInvalidLongNameProfileFactory = (): UpdateUserDTO => {
  return createUpdateProfileDTOFactory({
    fullName: 'A'.repeat(101), // More than 100 characters
  });
};

/**
 * Factory: Create profile with invalid name (special characters)
 */
export const createInvalidSpecialCharsNameProfileFactory = (): UpdateUserDTO => {
  return createUpdateProfileDTOFactory({
    fullName: 'Test@User123!', // Contains invalid characters
  });
};

/**
 * Factory: Create profile with valid name including allowed characters
 */
export const createValidComplexNameProfileFactory = (): UpdateUserDTO => {
  return createUpdateProfileDTOFactory({
    fullName: "Mary O'Brien-Smith", // Includes apostrophe and hyphen
  });
};

/**
 * Factory: Create profile with valid E.164 phone
 */
export const createValidPhoneProfileFactory = (): UpdateUserDTO => {
  return createUpdateProfileDTOFactory({
    phoneNumber: faker.phone.number('+1##########'),
  });
};

/**
 * Factory: Create profile with invalid phone (missing +)
 */
export const createInvalidPhoneFormatProfileFactory = (): UpdateUserDTO => {
  return createUpdateProfileDTOFactory({
    phoneNumber: '1234567890', // Missing + prefix
  });
};

/**
 * Factory: Create profile with optional phone omitted
 */
export const createNoPhoneProfileFactory = (): UpdateUserDTO => {
  return createUpdateProfileDTOFactory({
    phoneNumber: undefined,
  });
};

/**
 * Factory: Create profile with valid IANA timezone
 */
export const createValidTimezoneProfileFactory = (): UpdateUserDTO => {
  return createUpdateProfileDTOFactory({
    timezone: 'America/New_York',
  });
};

/**
 * Factory: Create profile with invalid timezone
 */
export const createInvalidTimezoneProfileFactory = (): UpdateUserDTO => {
  return createUpdateProfileDTOFactory({
    timezone: 'Invalid/Timezone',
  });
};

// ==================== IMAGE UPLOAD TEST FACTORIES ====================

export interface MockImageFile {
  uri: string;
  type: string;
  name: string;
  size: number;
}

/**
 * Factory: Create valid JPG image file
 */
export const createValidJPGImageFactory = (): MockImageFile => {
  return {
    uri: 'file:///path/to/image.jpg',
    type: 'image/jpeg',
    name: 'profile.jpg',
    size: 2 * 1024 * 1024, // 2MB
  };
};

/**
 * Factory: Create valid PNG image file
 */
export const createValidPNGImageFactory = (): MockImageFile => {
  return {
    uri: 'file:///path/to/image.png',
    type: 'image/png',
    name: 'profile.png',
    size: 1.5 * 1024 * 1024, // 1.5MB
  };
};

/**
 * Factory: Create oversized image (> 5MB)
 */
export const createOversizedImageFactory = (): MockImageFile => {
  return {
    uri: 'file:///path/to/large-image.jpg',
    type: 'image/jpeg',
    name: 'large-profile.jpg',
    size: 6 * 1024 * 1024, // 6MB
  };
};

/**
 * Factory: Create unsupported image format
 */
export const createUnsupportedImageFactory = (): MockImageFile => {
  return {
    uri: 'file:///path/to/image.gif',
    type: 'image/gif',
    name: 'profile.gif',
    size: 1 * 1024 * 1024, // 1MB
  };
};

/**
 * Factory: Create SVG file (unsupported)
 */
export const createSVGImageFactory = (): MockImageFile => {
  return {
    uri: 'file:///path/to/image.svg',
    type: 'image/svg+xml',
    name: 'profile.svg',
    size: 0.5 * 1024 * 1024, // 0.5MB
  };
};

// ==================== NOTIFICATION PREFERENCE FACTORIES ====================

/**
 * Factory: Create notification preferences with all enabled
 */
export const createAllNotificationsEnabledFactory = (): NotificationPreferences => {
  return {
    email: true,
    push: true,
    sms: true,
    reminderFrequency: 'daily',
  };
};

/**
 * Factory: Create notification preferences with all disabled
 */
export const createAllNotificationsDisabledFactory = (): NotificationPreferences => {
  return {
    email: false,
    push: false,
    sms: false,
    reminderFrequency: 'monthly',
  };
};

/**
 * Factory: Create notification preferences with only email
 */
export const createEmailOnlyNotificationsFactory = (): NotificationPreferences => {
  return {
    email: true,
    push: false,
    sms: false,
    reminderFrequency: 'weekly',
  };
};

// ==================== EDGE CASE FACTORIES ====================

/**
 * Factory: Create profile with unicode characters
 */
export const createUnicodeNameProfileFactory = (): UpdateUserDTO => {
  return createUpdateProfileDTOFactory({
    fullName: '测试用户 😀',
  });
};

/**
 * Factory: Create profile with empty optional fields
 */
export const createEmptyOptionalFieldsProfileFactory = (): UpdateUserDTO => {
  return {
    fullName: faker.person.fullName(),
    timezone: 'UTC',
    phoneNumber: undefined,
    profilePictureUrl: undefined,
  };
};

/**
 * Factory: Create profile with null values
 */
export const createNullFieldsProfileFactory = (): Partial<UpdateUserDTO> => {
  return {
    fullName: faker.person.fullName(),
    timezone: 'UTC',
    phoneNumber: null as any,
    profilePictureUrl: null as any,
  };
};

// ==================== ARRAY FACTORIES ====================

/**
 * Factory: Create array of profiles
 */
export const createProfileArrayFactory = (
  count: number,
  overrides: Partial<UserProfile> = {}
): UserProfile[] => {
  return Array.from({ length: count }, () => createProfileFactory(overrides));
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Reset faker seed for new test
 */
export const resetFactorySeed = (seed?: number) => {
  if (seed) {
    faker.seed(seed);
  } else {
    faker.seed(Math.random() * 1000000);
  }
};

/**
 * Generate consistent data for same seed (for snapshot testing)
 */
export const createDeterministicFactory = <T>(
  factoryFn: () => T,
  seed: number = 123
): T => {
  faker.seed(seed);
  const result = factoryFn();
  resetFactorySeed();
  return result;
};

// ==================== EXPORT ALL ====================

export default {
  // Base factories
  createProfileFactory,
  createProfileWithNotificationsFactory,
  createUpdateProfileDTOFactory,
  createProfileUpdatePayloadFactory,

  // Specialized factories
  createMinimalProfileFactory,
  createCompleteProfileFactory,
  createNewUserProfileFactory,
  createOnboardedProfileFactory,
  createPremiumProfileFactory,

  // Validation test factories
  createValidNameProfileFactory,
  createInvalidShortNameProfileFactory,
  createInvalidLongNameProfileFactory,
  createInvalidSpecialCharsNameProfileFactory,
  createValidComplexNameProfileFactory,
  createValidPhoneProfileFactory,
  createInvalidPhoneFormatProfileFactory,
  createNoPhoneProfileFactory,
  createValidTimezoneProfileFactory,
  createInvalidTimezoneProfileFactory,

  // Image upload factories
  createValidJPGImageFactory,
  createValidPNGImageFactory,
  createOversizedImageFactory,
  createUnsupportedImageFactory,
  createSVGImageFactory,

  // Notification factories
  createAllNotificationsEnabledFactory,
  createAllNotificationsDisabledFactory,
  createEmailOnlyNotificationsFactory,

  // Edge case factories
  createUnicodeNameProfileFactory,
  createEmptyOptionalFieldsProfileFactory,
  createNullFieldsProfileFactory,

  // Array factories
  createProfileArrayFactory,

  // Utilities
  resetFactorySeed,
  createDeterministicFactory,
};

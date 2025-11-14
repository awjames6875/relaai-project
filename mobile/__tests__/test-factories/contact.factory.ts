/**
 * CONTACT TEST FACTORY
 *
 * Entity: Contact
 * Created: 2025-01-02
 * Author: Cursor Agent
 *
 * Purpose: Generate realistic contact test data for Epic 2 Contact Management tests
 * Library: Faker.js for random data generation
 */

import { faker } from '@faker-js/faker';
import type { Contact, CreateContactDTO, UpdateContactDTO } from '@/contracts/data-contracts/dto-definitions';

// ==================== BASE CONTACT FACTORY ====================

/**
 * Factory: Create a complete Contact object
 *
 * @param overrides - Partial object to override default values
 * @returns Complete Contact object with realistic data
 *
 * @example
 * const contact = createContactFactory();
 *
 * @example
 * const contact = createContactFactory({ name: 'John Doe' });
 */
export const createContactFactory = (
  overrides: Partial<Contact> = {}
): Contact => {
  const now = new Date().toISOString();

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.person.fullName(),
    phoneNumber: faker.phone.number('+1##########'),
    email: faker.internet.email(),
    birthday: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toISOString().split('T')[0],
    anniversary: faker.date.recent({ days: 365 }).toISOString().split('T')[0],
    relationshipType: faker.helpers.arrayElement([
      'Friend',
      'Family',
      'Colleague',
      'Acquaintance',
      'Neighbor',
    ]),
    communicationStyle: faker.helpers.arrayElement([
      'Casual',
      'Formal',
      'Professional',
      'Friendly',
    ]),
    personalityTraits: {
      favoriteTopics: [faker.word.words({ count: 3 })],
    },
    notes: faker.lorem.sentence(),
    createdAt: now,
    updatedAt: now,
    deletedAt: undefined,
    ...overrides,
  };
};

// ==================== DTO FACTORIES ====================

/**
 * Factory: Create DTO for creating a contact
 *
 * @param overrides - Partial DTO to override defaults
 * @returns Create DTO with contact fields
 *
 * @example
 * const createDto = createCreateContactDTOFactory({ name: 'John Doe' });
 */
export const createCreateContactDTOFactory = (
  overrides: Partial<CreateContactDTO> = {}
): CreateContactDTO => {
  return {
    name: faker.person.fullName(),
    phoneNumber: faker.phone.number('+1##########'),
    email: faker.internet.email(),
    birthday: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toISOString().split('T')[0],
    anniversary: faker.date.recent({ days: 365 }).toISOString().split('T')[0],
    relationshipType: faker.helpers.arrayElement(['Friend', 'Family', 'Colleague']),
    notes: faker.lorem.sentence(),
    ...overrides,
  };
};

/**
 * Factory: Create DTO for updating a contact
 *
 * @param overrides - Partial DTO to override defaults
 * @returns Update DTO with contact fields
 *
 * @example
 * const updateDto = createUpdateContactDTOFactory({ name: 'Jane Doe' });
 */
export const createUpdateContactDTOFactory = (
  overrides: Partial<UpdateContactDTO> = {}
): UpdateContactDTO => {
  return {
    name: faker.person.fullName(),
    phoneNumber: faker.phone.number('+1##########'),
    email: faker.internet.email(),
    birthday: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toISOString().split('T')[0],
    anniversary: faker.date.recent({ days: 365 }).toISOString().split('T')[0],
    relationshipType: faker.helpers.arrayElement(['Friend', 'Family', 'Colleague']),
    notes: faker.lorem.sentence(),
    ...overrides,
  };
};

// ==================== SPECIALIZED FACTORIES ====================

/**
 * Factory: Create minimal valid contact (only required fields)
 */
export const createMinimalContactFactory = (): Contact => {
  return createContactFactory({
    phoneNumber: undefined,
    email: undefined,
    birthday: undefined,
    anniversary: undefined,
    relationshipType: undefined,
    communicationStyle: undefined,
    personalityTraits: {},
    notes: undefined,
  });
};

/**
 * Factory: Create contact with all optional fields
 */
export const createCompleteContactFactory = (): Contact => {
  return createContactFactory();
};

/**
 * Factory: Create contact for specific relationship type
 */
export const createContactByTypeFactory = (relationshipType: string): Contact => {
  return createContactFactory({ relationshipType });
};

// ==================== VALIDATION TEST FACTORIES ====================

/**
 * Factory: Create contact with valid name
 */
export const createValidNameContactFactory = (name?: string): CreateContactDTO => {
  return createCreateContactDTOFactory({
    name: name || faker.person.fullName(),
  });
};

/**
 * Factory: Create contact with invalid name (too short)
 */
export const createInvalidShortNameContactFactory = (): CreateContactDTO => {
  return createCreateContactDTOFactory({
    name: 'A', // Less than 2 characters
  });
};

/**
 * Factory: Create contact with invalid name (too long)
 */
export const createInvalidLongNameContactFactory = (): CreateContactDTO => {
  return createCreateContactDTOFactory({
    name: 'A'.repeat(101), // More than 100 characters
  });
};

/**
 * Factory: Create contact with invalid name (special characters)
 */
export const createInvalidSpecialCharsNameContactFactory = (): CreateContactDTO => {
  return createCreateContactDTOFactory({
    name: 'Test@User123!', // Contains invalid characters
  });
};

/**
 * Factory: Create contact with valid name including allowed characters
 */
export const createValidComplexNameContactFactory = (): CreateContactDTO => {
  return createCreateContactDTOFactory({
    name: "Mary O'Brien-Smith", // Includes apostrophe and hyphen
  });
};

/**
 * Factory: Create contact with valid E.164 phone
 */
export const createValidPhoneContactFactory = (): CreateContactDTO => {
  return createCreateContactDTOFactory({
    phoneNumber: faker.phone.number('+1##########'),
  });
};

/**
 * Factory: Create contact with invalid phone (missing +)
 */
export const createInvalidPhoneFormatContactFactory = (): CreateContactDTO => {
  return createCreateContactDTOFactory({
    phoneNumber: '1234567890', // Missing + prefix
  });
};

/**
 * Factory: Create contact with optional phone omitted
 */
export const createNoPhoneContactFactory = (): CreateContactDTO => {
  return createCreateContactDTOFactory({
    phoneNumber: undefined,
  });
};

/**
 * Factory: Create contact with valid email
 */
export const createValidEmailContactFactory = (): CreateContactDTO => {
  return createCreateContactDTOFactory({
    email: faker.internet.email(),
  });
};

/**
 * Factory: Create contact with invalid email
 */
export const createInvalidEmailContactFactory = (): CreateContactDTO => {
  return createCreateContactDTOFactory({
    email: 'not-an-email',
  });
};

/**
 * Factory: Create contact with valid date format
 */
export const createValidDateContactFactory = (): CreateContactDTO => {
  return createCreateContactDTOFactory({
    birthday: '1990-01-15',
    anniversary: '2020-06-20',
  });
};

/**
 * Factory: Create contact with invalid date format
 */
export const createInvalidDateContactFactory = (): CreateContactDTO => {
  return createCreateContactDTOFactory({
    birthday: '01/15/1990', // Wrong format
    anniversary: '20-06-2020', // Wrong format
  });
};

// ==================== ARRAY FACTORIES ====================

/**
 * Factory: Create array of contacts
 */
export const createContactArrayFactory = (
  count: number,
  overrides: Partial<Contact> = {}
): Contact[] => {
  return Array.from({ length: count }, () => createContactFactory(overrides));
};

/**
 * Factory: Create array of contacts with different relationship types
 */
export const createMixedContactsFactory = (countPerType: number = 3): Contact[] => {
  const types = ['Friend', 'Family', 'Colleague', 'Acquaintance'];
  const contacts: Contact[] = [];

  types.forEach(type => {
    for (let i = 0; i < countPerType; i++) {
      contacts.push(createContactByTypeFactory(type));
    }
  });

  return contacts;
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
  createContactFactory,
  createCreateContactDTOFactory,
  createUpdateContactDTOFactory,

  // Specialized factories
  createMinimalContactFactory,
  createCompleteContactFactory,
  createContactByTypeFactory,

  // Validation test factories
  createValidNameContactFactory,
  createInvalidShortNameContactFactory,
  createInvalidLongNameContactFactory,
  createInvalidSpecialCharsNameContactFactory,
  createValidComplexNameContactFactory,
  createValidPhoneContactFactory,
  createInvalidPhoneFormatContactFactory,
  createNoPhoneContactFactory,
  createValidEmailContactFactory,
  createInvalidEmailContactFactory,
  createValidDateContactFactory,
  createInvalidDateContactFactory,

  // Array factories
  createContactArrayFactory,
  createMixedContactsFactory,

  // Utilities
  resetFactorySeed,
  createDeterministicFactory,
};


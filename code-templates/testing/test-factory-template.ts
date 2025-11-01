/**
 * TEST FACTORY TEMPLATE
 *
 * TODO: Update the following:
 * 1. Replace [EntityName] with your entity/model name
 * 2. Add all entity fields
 * 3. Use realistic default values
 * 4. Add specialized factory variants
 * 5. Configure Faker for realistic data
 *
 * Entity: [EntityName]
 * Created: [DATE]
 * Author: [YOUR_NAME]
 *
 * Purpose: Generate realistic test data using factory pattern
 * Library: Faker.js for random data generation
 */

import { faker } from '@faker-js/faker';

// Import entity types
// TODO: Update import paths
// import type {
//   [EntityName],
//   Create[EntityName]DTO,
//   Update[EntityName]DTO,
// } from '@/contracts/data-contracts/dto-definitions';

// ==================== CONFIGURATION ====================

/**
 * Set seed for reproducible tests
 * Uncomment to use consistent data across test runs
 */
// faker.seed(123);

/**
 * Configure faker locale (optional)
 */
// faker.locale = 'en_US';

// ==================== BASE ENTITY FACTORY ====================

/**
 * Factory: Create a complete [EntityName] object
 *
 * @param overrides - Partial object to override default values
 * @returns Complete [EntityName] object with realistic data
 *
 * @example
 * // Create with defaults
 * const entity = create[EntityName]Factory();
 *
 * @example
 * // Create with overrides
 * const entity = create[EntityName]Factory({ name: 'Custom Name' });
 */
export const create[EntityName]Factory = (
  overrides: Partial<[EntityName]> = {}
): [EntityName] => {
  const now = new Date().toISOString();

  return {
    // Primary key (UUID)
    id: faker.string.uuid(),

    // User reference (if user-scoped)
    userId: faker.string.uuid(),

    // String fields
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number('+1##########'),

    // Text fields
    description: faker.lorem.sentence(),
    notes: faker.lorem.paragraph(),

    // Enum/Status fields
    status: faker.helpers.arrayElement(['active', 'inactive', 'pending', 'completed']),
    type: faker.helpers.arrayElement(['type1', 'type2', 'type3']),

    // Boolean fields
    isActive: faker.datatype.boolean(),
    isVerified: faker.datatype.boolean(),

    // Numeric fields
    count: faker.number.int({ min: 0, max: 100 }),
    score: faker.number.int({ min: 0, max: 100 }),
    rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),

    // Date fields
    birthday: faker.date.past({ years: 50 }).toISOString().split('T')[0], // YYYY-MM-DD
    scheduledAt: faker.date.future().toISOString(),
    expiresAt: faker.date.future().toISOString(),

    // JSONB/Object fields
    metadata: {
      key1: faker.lorem.word(),
      key2: faker.number.int(),
    },
    settings: {
      notifications: faker.datatype.boolean(),
      theme: faker.helpers.arrayElement(['light', 'dark', 'auto']),
    },

    // Arrays
    tags: faker.helpers.arrayElements(['tag1', 'tag2', 'tag3', 'tag4'], { min: 1, max: 3 }),

    // Timestamps (standard)
    createdAt: now,
    updatedAt: now,
    deletedAt: null,

    // Apply overrides
    ...overrides,
  };
};

// ==================== DTO FACTORIES ====================

/**
 * Factory: Create DTO for creating new entity
 *
 * @param overrides - Partial DTO to override defaults
 * @returns Create DTO without generated fields (id, timestamps)
 *
 * @example
 * const createDto = createCreate[EntityName]DTOFactory({ name: 'Test' });
 */
export const createCreate[EntityName]DTOFactory = (
  overrides: Partial<Create[EntityName]DTO> = {}
): Create[EntityName]DTO => {
  return {
    // Only include fields that can be set on creation
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number('+1##########'),
    description: faker.lorem.sentence(),

    // Apply overrides
    ...overrides,
  };
};

/**
 * Factory: Create DTO for updating entity
 *
 * @param overrides - Partial DTO to override defaults
 * @returns Update DTO with only updatable fields
 *
 * @example
 * const updateDto = createUpdate[EntityName]DTOFactory({ name: 'Updated Name' });
 */
export const createUpdate[EntityName]DTOFactory = (
  overrides: Partial<Update[EntityName]DTO> = {}
): Update[EntityName]DTO => {
  return {
    // Only include fields that can be updated
    name: faker.person.fullName(),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['active', 'inactive']),

    // Apply overrides
    ...overrides,
  };
};

// ==================== SPECIALIZED FACTORIES ====================

/**
 * Factory: Create minimal valid entity
 * Only includes required fields
 *
 * @example
 * const minimalEntity = createMinimal[EntityName]Factory();
 */
export const createMinimal[EntityName]Factory = (): [EntityName] => {
  return create[EntityName]Factory({
    // Set optional fields to null/undefined
    description: null,
    notes: null,
    metadata: {},
    tags: [],
  });
};

/**
 * Factory: Create entity with specific status
 *
 * @param status - Desired status
 * @example
 * const activeEntity = create[EntityName]WithStatus('active');
 */
export const create[EntityName]WithStatus = (
  status: 'active' | 'inactive' | 'pending' | 'completed'
): [EntityName] => {
  return create[EntityName]Factory({ status });
};

/**
 * Factory: Create active entity
 *
 * @example
 * const active = createActive[EntityName]Factory();
 */
export const createActive[EntityName]Factory = (): [EntityName] => {
  return create[EntityName]Factory({
    status: 'active',
    isActive: true,
    deletedAt: null,
  });
};

/**
 * Factory: Create soft-deleted entity
 *
 * @example
 * const deleted = createDeleted[EntityName]Factory();
 */
export const createDeleted[EntityName]Factory = (): [EntityName] => {
  return create[EntityName]Factory({
    deletedAt: faker.date.recent().toISOString(),
    isActive: false,
  });
};

/**
 * Factory: Create entity with past dates
 *
 * @example
 * const oldEntity = createOld[EntityName]Factory();
 */
export const createOld[EntityName]Factory = (): [EntityName] => {
  const pastDate = faker.date.past({ years: 2 }).toISOString();

  return create[EntityName]Factory({
    createdAt: pastDate,
    updatedAt: pastDate,
  });
};

/**
 * Factory: Create entity with future scheduled date
 *
 * @example
 * const scheduled = createScheduled[EntityName]Factory();
 */
export const createScheduled[EntityName]Factory = (): [EntityName] => {
  return create[EntityName]Factory({
    status: 'scheduled',
    scheduledAt: faker.date.future().toISOString(),
  });
};

// ==================== ARRAY FACTORIES ====================

/**
 * Factory: Create array of entities
 *
 * @param count - Number of entities to create
 * @param overrides - Overrides to apply to all entities
 * @returns Array of entities
 *
 * @example
 * const entities = create[EntityName]ArrayFactory(5);
 *
 * @example
 * // Create 3 entities with same userId
 * const entities = create[EntityName]ArrayFactory(3, { userId: 'user-123' });
 */
export const create[EntityName]ArrayFactory = (
  count: number,
  overrides: Partial<[EntityName]> = {}
): [EntityName][] => {
  return Array.from({ length: count }, (_, index) =>
    create[EntityName]Factory({
      ...overrides,
      // Optionally add index-based variation
      name: overrides.name || `${faker.person.fullName()} ${index + 1}`,
    })
  );
};

/**
 * Factory: Create paginated response
 *
 * @param count - Number of entities per page
 * @param page - Page number
 * @param totalItems - Total number of items
 * @returns Paginated response structure
 *
 * @example
 * const response = create[EntityName]PaginatedFactory(10, 1, 25);
 */
export const create[EntityName]PaginatedFactory = (
  count: number = 10,
  page: number = 1,
  totalItems: number = 100
) => {
  const pageSize = count;
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasMore = page < totalPages;

  return {
    data: create[EntityName]ArrayFactory(count),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasMore,
    },
  };
};

// ==================== RELATIONSHIP FACTORIES ====================

/**
 * Factory: Create entity with related entities
 *
 * @example
 * const entityWithRelations = create[EntityName]WithRelationsFactory();
 */
export const create[EntityName]WithRelationsFactory = () => {
  const entity = create[EntityName]Factory();

  return {
    ...entity,
    // Add related entities
    // relatedEntity: createRelatedEntityFactory({ parentId: entity.id }),
    // relatedEntities: createRelatedEntityArrayFactory(3, { parentId: entity.id }),
  };
};

// ==================== EDGE CASE FACTORIES ====================

/**
 * Factory: Create entity with null optional fields
 *
 * @example
 * const entityWithNulls = create[EntityName]WithNullsFactory();
 */
export const create[EntityName]WithNullsFactory = (): [EntityName] => {
  return create[EntityName]Factory({
    description: null,
    notes: null,
    phoneNumber: null,
    metadata: {},
    tags: [],
    scheduledAt: null,
    expiresAt: null,
  });
};

/**
 * Factory: Create entity with empty strings
 *
 * @example
 * const entityWithEmpty = create[EntityName]WithEmptyStringsFactory();
 */
export const create[EntityName]WithEmptyStringsFactory = (): [EntityName] => {
  return create[EntityName]Factory({
    description: '',
    notes: '',
  });
};

/**
 * Factory: Create entity with very long text
 *
 * @example
 * const entityWithLongText = create[EntityName]WithLongTextFactory();
 */
export const create[EntityName]WithLongTextFactory = (): [EntityName] => {
  return create[EntityName]Factory({
    name: faker.lorem.words(50),
    description: faker.lorem.paragraphs(10),
    notes: faker.lorem.paragraphs(20),
  });
};

/**
 * Factory: Create entity with special characters
 *
 * @example
 * const entityWithSpecialChars = create[EntityName]WithSpecialCharsFactory();
 */
export const create[EntityName]WithSpecialCharsFactory = (): [EntityName] => {
  return create[EntityName]Factory({
    name: "Test O'Brien <>&\"",
    description: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
  });
};

/**
 * Factory: Create entity with unicode characters
 *
 * @example
 * const entityWithUnicode = create[EntityName]WithUnicodeFactory();
 */
export const create[EntityName]WithUnicodeFactory = (): [EntityName] => {
  return create[EntityName]Factory({
    name: '测试用户 😀 Ñoño',
    description: 'Unicode test: 日本語 한국어 العربية',
  });
};

// ==================== DOMAIN-SPECIFIC FACTORIES ====================

/**
 * Example: Contact factory
 */
export const createContactFactory = (overrides: Partial<Contact> = {}): Contact => {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.person.fullName(),
    phoneNumber: faker.phone.number('+1##########'),
    email: faker.internet.email(),
    birthday: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toISOString().split('T')[0],
    anniversary: faker.helpers.maybe(() =>
      faker.date.past({ years: 20 }).toISOString().split('T')[0]
    ),
    relationshipType: faker.helpers.arrayElement(['Friend', 'Family', 'Colleague', 'Professional']),
    communicationStyle: faker.helpers.arrayElement(['formal', 'casual', 'professional']),
    personalityTraits: {
      extroverted: faker.datatype.boolean(),
      analytical: faker.datatype.boolean(),
    },
    favoriteThings: {
      hobbies: faker.helpers.arrayElements(['hiking', 'reading', 'cooking', 'gaming'], 2),
      foods: faker.helpers.arrayElements(['pizza', 'sushi', 'pasta', 'tacos'], 2),
    },
    notes: faker.lorem.paragraph(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    ...overrides,
  };
};

/**
 * Example: Message factory
 */
export const createMessageFactory = (overrides: Partial<Message> = {}): Message => {
  const status = faker.helpers.arrayElement(['draft', 'scheduled', 'sent', 'failed']);
  const aiGenerated = faker.datatype.boolean();

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    contactId: faker.string.uuid(),
    content: faker.lorem.paragraph(),
    occasion: faker.helpers.arrayElement(['birthday', 'anniversary', 'casual', 'thankyou']),
    tone: faker.helpers.arrayElement(['formal', 'casual', 'humorous', 'heartfelt']),
    status,
    scheduledAt: status === 'scheduled' ? faker.date.future().toISOString() : null,
    sentAt: status === 'sent' ? faker.date.recent().toISOString() : null,
    aiGenerated,
    confidenceScore: aiGenerated ? faker.number.float({ min: 0.5, max: 1.0, precision: 0.01 }) : null,
    alternatives: aiGenerated ? [
      faker.lorem.paragraph(),
      faker.lorem.paragraph(),
    ] : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Example: User profile factory
 */
export const createUserProfileFactory = (overrides: Partial<UserProfile> = {}): UserProfile => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    fullName: faker.person.fullName(),
    phoneNumber: faker.phone.number('+1##########'),
    profilePictureUrl: faker.image.avatar(),
    timezone: faker.helpers.arrayElement(['America/New_York', 'America/Los_Angeles', 'UTC']),
    subscriptionTier: faker.helpers.arrayElement(['free', 'premium', 'enterprise']),
    subscriptionStatus: faker.helpers.arrayElement(['active', 'cancelled', 'expired']),
    onboardingCompleted: faker.datatype.boolean(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Reset faker seed for new test
 * Useful when you need fresh random data
 */
export const resetFactorySeed = (seed?: number) => {
  if (seed) {
    faker.seed(seed);
  } else {
    faker.seed(Math.random() * 1000000);
  }
};

/**
 * Generate consistent data for same seed
 * Useful for snapshot testing
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
  create[EntityName]Factory,
  createCreate[EntityName]DTOFactory,
  createUpdate[EntityName]DTOFactory,

  // Specialized factories
  createMinimal[EntityName]Factory,
  create[EntityName]WithStatus,
  createActive[EntityName]Factory,
  createDeleted[EntityName]Factory,
  createOld[EntityName]Factory,
  createScheduled[EntityName]Factory,

  // Array factories
  create[EntityName]ArrayFactory,
  create[EntityName]PaginatedFactory,

  // Edge case factories
  create[EntityName]WithNullsFactory,
  create[EntityName]WithEmptyStringsFactory,
  create[EntityName]WithLongTextFactory,
  create[EntityName]WithSpecialCharsFactory,
  create[EntityName]WithUnicodeFactory,

  // Domain-specific (examples)
  createContactFactory,
  createMessageFactory,
  createUserProfileFactory,

  // Utilities
  resetFactorySeed,
  createDeterministicFactory,
};

// ==================== NOTES ====================

/**
 * FACTORY PATTERN BEST PRACTICES:
 *
 * 1. Use realistic data
 *    - Faker.js provides realistic values
 *    - Better than random strings
 *    - Easier to debug test failures
 *
 * 2. Support partial overrides
 *    - Allow customizing any field
 *    - Use spread operator for overrides
 *    - Maintains flexibility
 *
 * 3. Create specialized variants
 *    - Common scenarios (active, deleted)
 *    - Edge cases (null, empty)
 *    - Domain-specific needs
 *
 * 4. Keep factories simple
 *    - One responsibility per factory
 *    - Easy to understand and maintain
 *    - Compose complex objects from simple ones
 *
 * 5. Match production data
 *    - Use same types and structure
 *    - Follow validation rules
 *    - Include all required fields
 *
 * 6. Use for all tests
 *    - Consistency across test suite
 *    - Reduces boilerplate
 *    - Easier to update when schema changes
 *
 * 7. Version control
 *    - Keep factories in version control
 *    - Update when models change
 *    - Document special cases
 *
 * 8. Seed for reproducibility
 *    - Use faker.seed() for consistent data
 *    - Useful for debugging
 *    - Reset between tests if needed
 *
 * 9. Type safety
 *    - Use TypeScript types
 *    - Ensures factories match schemas
 *    - Catch errors at compile time
 *
 * 10. Don't overuse
 *     - Sometimes explicit data is clearer
 *     - Use factories when it makes tests better
 *     - Balance reusability and readability
 */

/**
 * COMMON FAKER.JS METHODS:
 *
 * Person:
 *   faker.person.fullName()
 *   faker.person.firstName()
 *   faker.person.lastName()
 *
 * Internet:
 *   faker.internet.email()
 *   faker.internet.url()
 *   faker.internet.password()
 *
 * Phone:
 *   faker.phone.number('+1##########')
 *
 * Date:
 *   faker.date.past()
 *   faker.date.future()
 *   faker.date.recent()
 *   faker.date.birthdate({ min: 18, max: 65, mode: 'age' })
 *
 * Lorem:
 *   faker.lorem.word()
 *   faker.lorem.sentence()
 *   faker.lorem.paragraph()
 *
 * Number:
 *   faker.number.int({ min: 0, max: 100 })
 *   faker.number.float({ min: 0, max: 1, precision: 0.01 })
 *
 * String:
 *   faker.string.uuid()
 *   faker.string.alphanumeric(10)
 *
 * Helpers:
 *   faker.helpers.arrayElement(['a', 'b', 'c'])
 *   faker.helpers.arrayElements(['a', 'b', 'c'], 2)
 *   faker.helpers.maybe(() => value, { probability: 0.5 })
 *
 * Datatype:
 *   faker.datatype.boolean()
 */

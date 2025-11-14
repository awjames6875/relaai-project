/**
 * MESSAGE TEST FACTORY
 *
 * Entity: Message
 * Created: 2025-01-02
 * Author: Cursor Agent
 *
 * Purpose: Generate realistic message test data for Epic 3 AI Message Generation tests
 * Library: Faker.js for random data generation
 */

import { faker } from '@faker-js/faker';
import type {
  Message,
  CreateMessageDTO,
  UpdateMessageDTO,
  ScheduleMessageDTO,
} from '@/contracts/data-contracts/dto-definitions';

// ==================== BASE MESSAGE FACTORY ====================

/**
 * Factory: Create a complete Message object
 *
 * @param overrides - Partial object to override default values
 * @returns Complete Message object with realistic data
 *
 * @example
 * const message = createMessageFactory();
 *
 * @example
 * const message = createMessageFactory({ content: 'Happy birthday!' });
 */
export const createMessageFactory = (overrides: Partial<Message> = {}): Message => {
  const now = new Date().toISOString();

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    contactId: faker.string.uuid(),
    content: faker.lorem.paragraph({ min: 1, max: 3 }),
    occasion: faker.helpers.arrayElement([
      'birthday',
      'anniversary',
      'casual',
      'apology',
      'thankyou',
      'congratulations',
    ]),
    tone: faker.helpers.arrayElement(['formal', 'casual', 'humorous', 'heartfelt', 'professional']),
    status: faker.helpers.arrayElement(['draft', 'scheduled', 'sent', 'failed']),
    scheduledAt: faker.date.future().toISOString(),
    sentAt: undefined,
    aiGenerated: faker.datatype.boolean(),
    confidenceScore: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    alternatives: [
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
    ].filter(() => faker.datatype.boolean({ probability: 0.7 })),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

// ==================== DTO FACTORIES ====================

/**
 * Factory: Create DTO for creating a message
 *
 * @param overrides - Partial DTO to override defaults
 * @returns Create DTO with message fields
 *
 * @example
 * const createDto = createCreateMessageDTOFactory({ content: 'Happy birthday!' });
 */
export const createCreateMessageDTOFactory = (overrides: Partial<CreateMessageDTO> = {}): CreateMessageDTO => {
  return {
    contactId: faker.string.uuid(),
    content: faker.lorem.paragraph(),
    occasion: faker.helpers.arrayElement([
      'birthday',
      'anniversary',
      'casual',
      'apology',
      'thankyou',
      'congratulations',
    ]),
    tone: faker.helpers.arrayElement(['formal', 'casual', 'humorous', 'heartfelt', 'professional']),
    ...overrides,
  };
};

/**
 * Factory: Create DTO for updating a message
 *
 * @param overrides - Partial DTO to override defaults
 * @returns Update DTO with message fields
 *
 * @example
 * const updateDto = createUpdateMessageDTOFactory({ content: 'Updated content' });
 */
export const createUpdateMessageDTOFactory = (overrides: Partial<UpdateMessageDTO> = {}): UpdateMessageDTO => {
  return {
    content: faker.lorem.paragraph(),
    occasion: faker.helpers.arrayElement([
      'birthday',
      'anniversary',
      'casual',
      'apology',
      'thankyou',
      'congratulations',
    ]),
    tone: faker.helpers.arrayElement(['formal', 'casual', 'humorous', 'heartfelt', 'professional']),
    ...overrides,
  };
};

/**
 * Factory: Create ScheduleMessageDTO
 *
 * @param overrides - Partial DTO to override defaults
 * @returns ScheduleMessageDTO
 */
export const createScheduleMessageDTOFactory = (
  overrides: Partial<ScheduleMessageDTO> = {}
): ScheduleMessageDTO => {
  return {
    scheduledAt: faker.date.future().toISOString(),
    ...overrides,
  };
};

// ==================== SPECIALIZED FACTORIES ====================

/**
 * Factory: Create draft message
 */
export const createDraftMessageFactory = (): Message => {
  return createMessageFactory({
    status: 'draft',
    scheduledAt: undefined,
    sentAt: undefined,
  });
};

/**
 * Factory: Create scheduled message
 */
export const createScheduledMessageFactory = (): Message => {
  return createMessageFactory({
    status: 'scheduled',
    scheduledAt: faker.date.future().toISOString(),
    sentAt: undefined,
  });
};

/**
 * Factory: Create sent message
 */
export const createSentMessageFactory = (): Message => {
  const sentDate = faker.date.past();
  return createMessageFactory({
    status: 'sent',
    scheduledAt: undefined,
    sentAt: sentDate.toISOString(),
    createdAt: faker.date.past({ refDate: sentDate }).toISOString(),
  });
};

/**
 * Factory: Create AI-generated message
 */
export const createAIGeneratedMessageFactory = (): Message => {
  return createMessageFactory({
    aiGenerated: true,
    confidenceScore: faker.number.float({ min: 0.7, max: 1, fractionDigits: 2 }),
    alternatives: [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()],
  });
};

/**
 * Factory: Create message for specific occasion
 */
export const createMessageByOccasionFactory = (occasion: string): Message => {
  return createMessageFactory({ occasion });
};

/**
 * Factory: Create message with specific tone
 */
export const createMessageByToneFactory = (tone: string): Message => {
  return createMessageFactory({ tone });
};

// ==================== VALIDATION TEST FACTORIES ====================

/**
 * Factory: Create message with valid content
 */
export const createValidContentMessageFactory = (content?: string): CreateMessageDTO => {
  return createCreateMessageDTOFactory({
    content: content || faker.lorem.sentence({ min: 10, max: 100 }),
  });
};

/**
 * Factory: Create message with empty content (invalid)
 */
export const createEmptyContentMessageFactory = (): CreateMessageDTO => {
  return createCreateMessageDTOFactory({ content: '' });
};

/**
 * Factory: Create message with oversized content (invalid)
 */
export const createOversizedContentMessageFactory = (): CreateMessageDTO => {
  return createCreateMessageDTOFactory({ content: 'x'.repeat(5001) });
};

/**
 * Factory: Create message with valid occasion
 */
export const createValidOccasionMessageFactory = (occasion: string): CreateMessageDTO => {
  return createCreateMessageDTOFactory({ occasion });
};

/**
 * Factory: Create message with invalid occasion
 */
export const createInvalidOccasionMessageFactory = (): CreateMessageDTO => {
  return createCreateMessageDTOFactory({ occasion: 'invalid_occasion' });
};

/**
 * Factory: Create message with valid tone
 */
export const createValidToneMessageFactory = (tone: string): CreateMessageDTO => {
  return createCreateMessageDTOFactory({ tone });
};

/**
 * Factory: Create message with invalid tone
 */
export const createInvalidToneMessageFactory = (): CreateMessageDTO => {
  return createCreateMessageDTOFactory({ tone: 'invalid_tone' });
};

/**
 * Factory: Create message with valid future scheduled date
 */
export const createValidScheduledMessageFactory = (): Message => {
  const futureDate = new Date();
  futureDate.setHours(futureDate.getHours() + 1); // 1 hour from now
  return createMessageFactory({
    status: 'scheduled',
    scheduledAt: futureDate.toISOString(),
  });
};

/**
 * Factory: Create message with past scheduled date (invalid)
 */
export const createPastScheduledMessageFactory = (): Message => {
  return createMessageFactory({
    status: 'scheduled',
    scheduledAt: faker.date.past().toISOString(),
  });
};

/**
 * Factory: Create message with too-far-future scheduled date (invalid)
 */
export const createTooFarScheduledMessageFactory = (): Message => {
  const farFuture = new Date();
  farFuture.setFullYear(farFuture.getFullYear() + 2);
  return createMessageFactory({
    status: 'scheduled',
    scheduledAt: farFuture.toISOString(),
  });
};

// ==================== ARRAY FACTORIES ====================

/**
 * Factory: Create array of messages
 */
export const createMessageArrayFactory = (count: number, overrides: Partial<Message> = {}): Message[] => {
  return Array.from({ length: count }, () => createMessageFactory(overrides));
};

/**
 * Factory: Create array of messages by occasion
 */
export const createMessagesByOccasionFactory = (
  occasion: string,
  count: number = 5
): Message[] => {
  return Array.from({ length: count }, () => createMessageByOccasionFactory(occasion));
};

/**
 * Factory: Create array of messages by tone
 */
export const createMessagesByToneFactory = (tone: string, count: number = 5): Message[] => {
  return Array.from({ length: count }, () => createMessageByToneFactory(tone));
};

/**
 * Factory: Create mixed messages array (draft, scheduled, sent)
 */
export const createMixedMessagesFactory = (
  drafts: number = 3,
  scheduled: number = 3,
  sent: number = 4
): Message[] => {
  const messages: Message[] = [];

  for (let i = 0; i < drafts; i++) {
    messages.push(createDraftMessageFactory());
  }

  for (let i = 0; i < scheduled; i++) {
    messages.push(createScheduledMessageFactory());
  }

  for (let i = 0; i < sent; i++) {
    messages.push(createSentMessageFactory());
  }

  // Shuffle the array
  return messages.sort(() => Math.random() - 0.5);
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
export const createDeterministicFactory = <T>(factoryFn: () => T, seed: number = 123): T => {
  faker.seed(seed);
  const result = factoryFn();
  resetFactorySeed();
  return result;
};

// ==================== EXPORT ALL ====================

export default {
  // Base factories
  createMessageFactory,
  createCreateMessageDTOFactory,
  createUpdateMessageDTOFactory,
  createScheduleMessageDTOFactory,

  // Specialized factories
  createDraftMessageFactory,
  createScheduledMessageFactory,
  createSentMessageFactory,
  createAIGeneratedMessageFactory,
  createMessageByOccasionFactory,
  createMessageByToneFactory,

  // Validation test factories
  createValidContentMessageFactory,
  createEmptyContentMessageFactory,
  createOversizedContentMessageFactory,
  createValidOccasionMessageFactory,
  createInvalidOccasionMessageFactory,
  createValidToneMessageFactory,
  createInvalidToneMessageFactory,
  createValidScheduledMessageFactory,
  createPastScheduledMessageFactory,
  createTooFarScheduledMessageFactory,

  // Array factories
  createMessageArrayFactory,
  createMessagesByOccasionFactory,
  createMessagesByToneFactory,
  createMixedMessagesFactory,

  // Utilities
  resetFactorySeed,
  createDeterministicFactory,
};


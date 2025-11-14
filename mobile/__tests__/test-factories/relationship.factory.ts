/**
 * RELATIONSHIP TEST FACTORY
 *
 * Entity: Relationship
 * Created: 2025-01-02
 * Author: Cursor Agent
 *
 * Purpose: Generate realistic relationship test data for Epic 4 Relationship Health tests
 * Library: Faker.js for random data generation
 */

import { faker } from '@faker-js/faker';
import type {
  Relationship,
  UpdateRelationshipDTO,
  RelationshipAnalytics,
} from '@/contracts/data-contracts/dto-definitions';

// ==================== BASE RELATIONSHIP FACTORY ====================

/**
 * Factory: Create a complete Relationship object
 *
 * @param overrides - Partial object to override default values
 * @returns Complete Relationship object with realistic data
 *
 * @example
 * const relationship = createRelationshipFactory();
 *
 * @example
 * const relationship = createRelationshipFactory({ healthScore: 85 });
 */
export const createRelationshipFactory = (overrides: Partial<Relationship> = {}): Relationship => {
  const now = new Date().toISOString();
  const healthScore = overrides.healthScore ?? faker.number.int({ min: 0, max: 100 });

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    contactId: faker.string.uuid(),
    healthScore,
    lastContactDate: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
    contactFrequency: faker.number.int({ min: 1, max: 30 }),
    daysSinceLastContact: faker.number.int({ min: 0, max: 90 }),
    temperature: getTemperatureFromHealthScore(healthScore),
    notes: faker.lorem.paragraph(),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Helper function to determine temperature from health score
 */
const getTemperatureFromHealthScore = (score: number): 'cold' | 'warm' | 'hot' => {
  if (score < 30) return 'cold';
  if (score > 70) return 'hot';
  return 'warm';
};

// ==================== DTO FACTORIES ====================

/**
 * Factory: Create DTO for updating a relationship
 *
 * @param overrides - Partial DTO to override defaults
 * @returns Update DTO with relationship fields
 *
 * @example
 * const updateDto = createUpdateRelationshipDTOFactory({ healthScore: 75 });
 */
export const createUpdateRelationshipDTOFactory = (
  overrides: Partial<UpdateRelationshipDTO> = {}
): UpdateRelationshipDTO => {
  return {
    healthScore: faker.number.int({ min: 0, max: 100 }),
    contactFrequency: faker.number.int({ min: 1, max: 30 }),
    notes: faker.lorem.paragraph(),
    ...overrides,
  };
};

// ==================== SPECIALIZED FACTORIES ====================

/**
 * Factory: Create cold relationship (health score < 30)
 */
export const createColdRelationshipFactory = (): Relationship => {
  const score = faker.number.int({ min: 0, max: 29 });
  return createRelationshipFactory({
    healthScore: score,
    temperature: 'cold',
    contactFrequency: faker.number.int({ min: 30, max: 365 }), // Less frequent
    daysSinceLastContact: faker.number.int({ min: 60, max: 365 }), // Longer gap
  });
};

/**
 * Factory: Create warm relationship (health score 30-70)
 */
export const createWarmRelationshipFactory = (): Relationship => {
  const score = faker.number.int({ min: 30, max: 70 });
  return createRelationshipFactory({
    healthScore: score,
    temperature: 'warm',
    contactFrequency: faker.number.int({ min: 7, max: 30 }),
    daysSinceLastContact: faker.number.int({ min: 7, max: 60 }),
  });
};

/**
 * Factory: Create hot relationship (health score > 70)
 */
export const createHotRelationshipFactory = (): Relationship => {
  const score = faker.number.int({ min: 71, max: 100 });
  return createRelationshipFactory({
    healthScore: score,
    temperature: 'hot',
    contactFrequency: faker.number.int({ min: 1, max: 7 }), // More frequent
    daysSinceLastContact: faker.number.int({ min: 0, max: 7 }), // Recent
  });
};

/**
 * Factory: Create relationship with critical health score
 */
export const createCriticalRelationshipFactory = (): Relationship => {
  const score = faker.number.int({ min: 0, max: 19 });
  return createRelationshipFactory({
    healthScore: score,
    temperature: 'cold',
    contactFrequency: faker.number.int({ min: 90, max: 365 }),
    daysSinceLastContact: faker.number.int({ min: 180, max: 365 }),
  });
};

/**
 * Factory: Create relationship with excellent health score
 */
export const createExcellentRelationshipFactory = (): Relationship => {
  const score = faker.number.int({ min: 90, max: 100 });
  return createRelationshipFactory({
    healthScore: score,
    temperature: 'hot',
    contactFrequency: faker.number.int({ min: 1, max: 3 }),
    daysSinceLastContact: faker.number.int({ min: 0, max: 3 }),
  });
};

/**
 * Factory: Create relationship by temperature
 */
export const createRelationshipByTemperatureFactory = (temperature: 'cold' | 'warm' | 'hot'): Relationship => {
  if (temperature === 'cold') return createColdRelationshipFactory();
  if (temperature === 'hot') return createHotRelationshipFactory();
  return createWarmRelationshipFactory();
};

// ==================== VALIDATION TEST FACTORIES ====================

/**
 * Factory: Create relationship with valid health score
 */
export const createValidHealthScoreRelationshipFactory = (healthScore: number): UpdateRelationshipDTO => {
  return createUpdateRelationshipDTOFactory({ healthScore });
};

/**
 * Factory: Create relationship with invalid health score (negative)
 */
export const createInvalidNegativeHealthScoreRelationshipFactory = (): UpdateRelationshipDTO => {
  return createUpdateRelationshipDTOFactory({ healthScore: -1 });
};

/**
 * Factory: Create relationship with invalid health score (over 100)
 */
export const createInvalidHighHealthScoreRelationshipFactory = (): UpdateRelationshipDTO => {
  return createUpdateRelationshipDTOFactory({ healthScore: 101 });
};

/**
 * Factory: Create relationship with valid contact frequency
 */
export const createValidContactFrequencyRelationshipFactory = (contactFrequency: number): UpdateRelationshipDTO => {
  return createUpdateRelationshipDTOFactory({ contactFrequency });
};

// ==================== ARRAY FACTORIES ====================

/**
 * Factory: Create array of relationships
 */
export const createRelationshipArrayFactory = (
  count: number,
  overrides: Partial<Relationship> = {}
): Relationship[] => {
  return Array.from({ length: count }, () => createRelationshipFactory(overrides));
};

/**
 * Factory: Create array of relationships by temperature
 */
export const createRelationshipsByTemperatureFactory = (
  temperature: 'cold' | 'warm' | 'hot',
  count: number = 5
): Relationship[] => {
  return Array.from({ length: count }, () => createRelationshipByTemperatureFactory(temperature));
};

/**
 * Factory: Create mixed relationships array (cold, warm, hot)
 */
export const createMixedRelationshipsFactory = (
  cold: number = 3,
  warm: number = 5,
  hot: number = 2
): Relationship[] => {
  const relationships: Relationship[] = [];

  for (let i = 0; i < cold; i++) {
    relationships.push(createColdRelationshipFactory());
  }

  for (let i = 0; i < warm; i++) {
    relationships.push(createWarmRelationshipFactory());
  }

  for (let i = 0; i < hot; i++) {
    relationships.push(createHotRelationshipFactory());
  }

  // Shuffle the array
  return relationships.sort(() => Math.random() - 0.5);
};

/**
 * Factory: Create relationships with health score distribution
 */
export const createRelationshipsWithDistributionFactory = (): Relationship[] => {
  const relationships: Relationship[] = [];

  // Critical (0-19): 1 relationship
  relationships.push(createCriticalRelationshipFactory());

  // Needs Attention (40-59): 2 relationships
  for (let i = 0; i < 2; i++) {
    relationships.push(createRelationshipFactory({
      healthScore: faker.number.int({ min: 40, max: 59 }),
      temperature: 'cold',
    }));
  }

  // Good (60-79): 3 relationships
  for (let i = 0; i < 3; i++) {
    relationships.push(createRelationshipFactory({
      healthScore: faker.number.int({ min: 60, max: 79 }),
      temperature: 'warm',
    }));
  }

  // Excellent (80-100): 2 relationships
  for (let i = 0; i < 2; i++) {
    relationships.push(createExcellentRelationshipFactory());
  }

  return relationships;
};

// ==================== ANALYTICS FACTORIES ====================

/**
 * Factory: Create RelationshipAnalytics object
 */
export const createRelationshipAnalyticsFactory = (overrides: Partial<RelationshipAnalytics> = {}): RelationshipAnalytics => {
  const relationships = createRelationshipArrayFactory(10);
  
  const averageHealthScore = relationships.reduce((sum, rel) => sum + rel.healthScore, 0) / relationships.length;
  
  const temperatureBreakdown = {
    cold: relationships.filter((r) => r.temperature === 'cold').length,
    warm: relationships.filter((r) => r.temperature === 'warm').length,
    hot: relationships.filter((r) => r.temperature === 'hot').length,
  };

  const healthScoreDistribution = {
    excellent: relationships.filter((r) => r.healthScore >= 80).length,
    good: relationships.filter((r) => r.healthScore >= 60 && r.healthScore < 80).length,
    needsAttention: relationships.filter((r) => r.healthScore >= 40 && r.healthScore < 60).length,
    critical: relationships.filter((r) => r.healthScore < 40).length,
  };

  const topRelationships = relationships
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 5);

  return {
    averageHealthScore: Math.round(averageHealthScore * 10) / 10,
    totalRelationships: relationships.length,
    temperatureBreakdown,
    healthScoreDistribution,
    topRelationships,
    ...overrides,
  };
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
  createRelationshipFactory,
  createUpdateRelationshipDTOFactory,

  // Specialized factories
  createColdRelationshipFactory,
  createWarmRelationshipFactory,
  createHotRelationshipFactory,
  createCriticalRelationshipFactory,
  createExcellentRelationshipFactory,
  createRelationshipByTemperatureFactory,

  // Validation test factories
  createValidHealthScoreRelationshipFactory,
  createInvalidNegativeHealthScoreRelationshipFactory,
  createInvalidHighHealthScoreRelationshipFactory,
  createValidContactFrequencyRelationshipFactory,

  // Array factories
  createRelationshipArrayFactory,
  createRelationshipsByTemperatureFactory,
  createMixedRelationshipsFactory,
  createRelationshipsWithDistributionFactory,

  // Analytics factories
  createRelationshipAnalyticsFactory,

  // Utilities
  resetFactorySeed,
  createDeterministicFactory,
};


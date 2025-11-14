/**
 * Relationship Service
 *
 * Handles all relationship operations using Supabase.
 * Provides methods for relationship health tracking and management.
 *
 * Based on: contracts/database-contracts/schema.sql (relationships table)
 * Based on: contracts/data-contracts/dto-definitions.ts (Relationship, UpdateRelationshipDTO, etc.)
 */

import { supabase } from './supabase';
import {
  Relationship,
  UpdateRelationshipDTO,
  CalculateHealthScoreResponse,
  RelationshipAnalytics,
} from '@contracts/data-contracts/dto-definitions';

// ==================== ERROR TYPES ====================

export interface ServiceError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface DatabaseError extends ServiceError {
  type: 'database';
}

export interface ValidationError extends ServiceError {
  type: 'validation';
  field?: string;
}

// ==================== INPUT TYPES ====================

export interface FetchRelationshipsParams {
  temperature?: 'cold' | 'warm' | 'hot';
  healthScoreMin?: number;
  healthScoreMax?: number;
}

// ==================== DATABASE OPERATIONS ====================

/**
 * Maps database relationship object to Relationship DTO.
 * @param data - Database row data.
 * @returns Relationship DTO.
 */
const mapToRelationshipDTO = (data: any): Relationship => {
  // Calculate days since last contact if available
  let daysSinceLastContact: number | undefined;
  if (data.last_contact_date) {
    const lastContact = new Date(data.last_contact_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastContact.getTime());
    daysSinceLastContact = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return {
    id: data.id,
    userId: data.user_id,
    contactId: data.contact_id,
    healthScore: data.health_score || 50,
    lastContactDate: data.last_contact_date || undefined,
    contactFrequency: data.contact_frequency || undefined,
    daysSinceLastContact,
    temperature: data.temperature || 'warm',
    notes: data.notes || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

/**
 * Fetches all relationships for the current user.
 *
 * @param userId - The user's ID
 * @param params - Filter parameters.
 * @returns Array of relationships or error.
 */
export const fetchRelationships = async (
  userId: string,
  params: FetchRelationshipsParams = {}
): Promise<{ data: Relationship[]; error: DatabaseError | null }> => {
  try {
    const { temperature, healthScoreMin, healthScoreMax } = params;

    let query = supabase.from('relationships').select('*').eq('user_id', userId);

    // Apply filters
    if (temperature) {
      query = query.eq('temperature', temperature);
    }
    if (healthScoreMin !== undefined) {
      query = query.gte('health_score', healthScoreMin);
    }
    if (healthScoreMax !== undefined) {
      query = query.lte('health_score', healthScoreMax);
    }

    // Apply sorting by health score (descending)
    query = query.order('health_score', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return {
      data: (data || []).map(mapToRelationshipDTO),
      error: null,
    };
  } catch (error: any) {
    return {
      data: [],
      error: {
        type: 'database',
        message: error.message || 'Failed to fetch relationships',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Fetches a single relationship by contact ID.
 *
 * @param userId - The user's ID
 * @param contactId - The ID of the contact.
 * @returns The relationship data or error.
 */
export const getRelationshipByContactId = async (
  userId: string,
  contactId: string
): Promise<{ data: Relationship | null; error: DatabaseError | null }> => {
  try {
    const { data, error } = await supabase
      .from('relationships')
      .select('*')
      .eq('contact_id', contactId)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return {
        data: null,
        error: {
          type: 'database',
          message: 'Relationship not found',
          code: 'RELATIONSHIP_NOT_FOUND',
        } as DatabaseError,
      };
    }

    return { data: mapToRelationshipDTO(data), error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to fetch relationship',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Creates or updates a relationship (upsert based on unique constraint).
 *
 * @param userId - The user's ID
 * @param contactId - The ID of the contact.
 * @param relationshipData - Data for the relationship.
 * @returns The created/updated relationship or error.
 */
export const createOrUpdateRelationship = async (
  userId: string,
  contactId: string,
  relationshipData: UpdateRelationshipDTO = {}
): Promise<{ data: Relationship | null; error: DatabaseError | ValidationError | null }> => {
  try {
    // Validate health score if provided
    if (relationshipData.healthScore !== undefined) {
      if (relationshipData.healthScore < 0 || relationshipData.healthScore > 100) {
        return {
          data: null,
          error: {
            type: 'validation',
            message: 'Health score must be between 0 and 100',
            code: 'INVALID_HEALTH_SCORE',
            field: 'healthScore',
          } as ValidationError,
        };
      }
    }

    // Calculate temperature based on health score
    const healthScore = relationshipData.healthScore ?? 50;
    let temperature: 'cold' | 'warm' | 'hot' = 'warm';
    if (healthScore < 30) {
      temperature = 'cold';
    } else if (healthScore > 70) {
      temperature = 'hot';
    }

    // Upsert relationship (handles unique constraint on user_id, contact_id)
    const { data, error } = await supabase
      .from('relationships')
      .upsert(
        {
          user_id: userId,
          contact_id: contactId,
          health_score: healthScore,
          contact_frequency: relationshipData.contactFrequency || null,
          notes: relationshipData.notes || null,
          temperature: temperature,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,contact_id' }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: mapToRelationshipDTO(data), error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to create/update relationship',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Updates relationship notes.
 *
 * @param userId - The user's ID
 * @param contactId - The ID of the contact.
 * @param notes - The notes to save.
 * @returns The updated relationship or error.
 */
export const updateRelationshipNotes = async (
  userId: string,
  contactId: string,
  notes: string
): Promise<{ data: Relationship | null; error: DatabaseError | null }> => {
  try {
    const { data, error } = await supabase
      .from('relationships')
      .update({
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('contact_id', contactId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return {
        data: null,
        error: {
          type: 'database',
          message: 'Relationship not found for update',
          code: 'RELATIONSHIP_NOT_FOUND',
        } as DatabaseError,
      };
    }

    return { data: mapToRelationshipDTO(data), error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to update relationship notes',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Updates the last contact date for a relationship.
 *
 * @param userId - The user's ID
 * @param contactId - The ID of the contact.
 * @returns The updated relationship or error.
 */
export const updateLastContactDate = async (
  userId: string,
  contactId: string
): Promise<{ data: Relationship | null; error: DatabaseError | null }> => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format

    const { data, error } = await supabase
      .from('relationships')
      .update({
        last_contact_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('contact_id', contactId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return {
        data: null,
        error: {
          type: 'database',
          message: 'Relationship not found for update',
          code: 'RELATIONSHIP_NOT_FOUND',
        } as DatabaseError,
      };
    }

    return { data: mapToRelationshipDTO(data), error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to update last contact date',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Calculates health score for a relationship.
 * NOTE: This is a placeholder until health calculation logic is implemented.
 *
 * @param userId - The user's ID
 * @param contactId - The ID of the contact.
 * @returns Calculated health score response or error.
 */
export const calculateHealthScore = async (
  userId: string,
  contactId: string
): Promise<{ data: CalculateHealthScoreResponse | null; error: DatabaseError | null }> => {
  // TODO: Implement health score calculation logic
  // This should consider:
  // - Time since last contact
  // - Contact frequency vs expected frequency
  // - Message history (if available)
  // - Engagement patterns

  return {
    data: null,
    error: {
      type: 'database',
      message: 'Health score calculation not yet implemented',
      code: 'NOT_IMPLEMENTED',
    } as DatabaseError,
  };
};

/**
 * Fetches relationship analytics for the user.
 *
 * @param userId - The user's ID
 * @returns Relationship analytics or error.
 */
export const fetchRelationshipAnalytics = async (
  userId: string
): Promise<{ data: RelationshipAnalytics | null; error: DatabaseError | null }> => {
  try {
    const { data, error } = await supabase.from('relationships').select('*').eq('user_id', userId);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        data: {
          averageHealthScore: 0,
          totalRelationships: 0,
          temperatureBreakdown: {
            cold: 0,
            warm: 0,
            hot: 0,
          },
          healthScoreDistribution: {
            excellent: 0,
            good: 0,
            needsAttention: 0,
            critical: 0,
          },
          topRelationships: [],
        } as RelationshipAnalytics,
        error: null,
      };
    }

    // Calculate analytics
    const relationships = data.map(mapToRelationshipDTO);
    const totalRelationships = relationships.length;

    // Average health score
    const averageHealthScore = relationships.reduce((sum, rel) => sum + rel.healthScore, 0) / totalRelationships;

    // Temperature breakdown
    const temperatureBreakdown = {
      cold: relationships.filter((r) => r.temperature === 'cold').length,
      warm: relationships.filter((r) => r.temperature === 'warm').length,
      hot: relationships.filter((r) => r.temperature === 'hot').length,
    };

    // Health score distribution
    const healthScoreDistribution = {
      excellent: relationships.filter((r) => r.healthScore >= 80).length,
      good: relationships.filter((r) => r.healthScore >= 60 && r.healthScore < 80).length,
      needsAttention: relationships.filter((r) => r.healthScore >= 40 && r.healthScore < 60).length,
      critical: relationships.filter((r) => r.healthScore < 40).length,
    };

    // Top 5 relationships by health score
    const topRelationships = relationships
      .sort((a, b) => b.healthScore - a.healthScore)
      .slice(0, 5);

    return {
      data: {
        averageHealthScore: Math.round(averageHealthScore * 10) / 10, // Round to 1 decimal
        totalRelationships,
        temperatureBreakdown,
        healthScoreDistribution,
        topRelationships,
      } as RelationshipAnalytics,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to fetch relationship analytics',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Batch fetches relationships for multiple contacts.
 *
 * @param userId - The user's ID
 * @param contactIds - Array of contact IDs.
 * @returns Array of relationships or error.
 */
export const batchFetchRelationships = async (
  userId: string,
  contactIds: string[]
): Promise<{ data: Relationship[]; error: DatabaseError | null }> => {
  try {
    const { data, error } = await supabase
      .from('relationships')
      .select('*')
      .eq('user_id', userId)
      .in('contact_id', contactIds);

    if (error) {
      throw error;
    }

    return {
      data: (data || []).map(mapToRelationshipDTO),
      error: null,
    };
  } catch (error: any) {
    return {
      data: [],
      error: {
        type: 'database',
        message: error.message || 'Failed to batch fetch relationships',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};


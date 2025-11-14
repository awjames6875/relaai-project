/**
 * Contact Service
 *
 * Handles all contact operations using Supabase.
 * Provides methods for contact CRUD operations.
 *
 * Based on: contracts/database-contracts/schema.sql (contacts table)
 * Based on: contracts/data-contracts/dto-definitions.ts (Contact, CreateContactDTO, UpdateContactDTO)
 */

import { supabase } from './supabase';
import { Contact, CreateContactDTO, UpdateContactDTO } from '@contracts/data-contracts/dto-definitions';

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

export interface NetworkError extends ServiceError {
  type: 'network';
}

export interface PermissionError extends ServiceError {
  type: 'permission';
}

export interface ServerError extends ServiceError {
  type: 'server';
}

// ==================== ERROR HANDLING ====================

/**
 * Convert Supabase/network errors into typed service errors
 */
const handleSupabaseError = (error: any): DatabaseError | NetworkError | PermissionError | ServerError => {
  // Network/timeout errors
  if (
    error.message?.toLowerCase().includes('fetch') ||
    error.message?.toLowerCase().includes('network') ||
    error.message?.toLowerCase().includes('timeout') ||
    error.message?.toLowerCase().includes('connection')
  ) {
    return {
      type: 'network',
      message: 'Unable to connect. Please check your internet connection and try again.',
      code: 'NETWORK_ERROR',
      details: error,
    };
  }

  // RLS permission errors
  if (error.code === '42501' || error.code === 'PGRST301') {
    return {
      type: 'permission',
      message: 'You do not have permission to access this contact.',
      code: 'PERMISSION_DENIED',
      details: error,
    };
  }

  // Not found (could be 404 or RLS blocking access)
  if (error.code === 'PGRST116') {
    return {
      type: 'database',
      message: 'Contact not found or access denied.',
      code: 'NOT_FOUND',
      details: error,
    };
  }

  // Server errors (5xx)
  if (error.status && error.status >= 500) {
    return {
      type: 'server',
      message: 'Server error. Please try again later.',
      code: 'SERVER_ERROR',
      details: error,
    };
  }

  // Generic database error
  return {
    type: 'database',
    message: error.message || 'An unexpected database error occurred.',
    code: error.code || 'UNKNOWN_ERROR',
    details: error,
  };
};

// ==================== VALIDATION ====================

/**
 * Validate email format
 */
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (E.164 format: +[country code][number])
 */
const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Validate contact name (2-100 characters, letters, spaces, hyphens, apostrophes only)
 */
const validateContactName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-']{2,100}$/;
  return nameRegex.test(name);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

// ==================== DATABASE OPERATIONS ====================

/**
 * Fetch paginated list of contacts
 *
 * @param userId - The user's ID
 * @param options - Pagination and filter options
 * @returns Paginated response with contacts
 */
export const fetchContacts = async (
  userId: string,
  options: {
    page?: number;
    pageSize?: number;
    search?: string;
    relationshipType?: string;
  } = {}
) => {
  try {
    const { page = 1, pageSize = 20, search, relationshipType } = options;

    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .is('deleted_at', null);

    // Apply search filter
    if (search && search.trim().length > 0) {
      query = query.ilike('name', `%${search.trim()}%`);
    }

    // Apply relationship type filter
    if (relationshipType) {
      query = query.eq('relationship_type', relationshipType);
    }

    // Apply sorting (by name by default)
    query = query.order('name', { ascending: true });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Transform database columns to DTO format
    const contacts: Contact[] = (data || []).map((item) => ({
      id: item.id,
      userId: item.user_id,
      name: item.name,
      phoneNumber: item.phone_number || undefined,
      email: item.email || undefined,
      birthday: item.birthday || undefined,
      anniversary: item.anniversary || undefined,
      relationshipType: item.relationship_type || undefined,
      communicationStyle: item.communication_style || undefined,
      personalityTraits: item.personality_traits || {},
      notes: item.notes || undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at || undefined,
    }));

    // Calculate pagination metadata
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasMore = page < totalPages;

    return {
      data: contacts,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasMore,
      },
      error: null,
    };
  } catch (error: any) {
    return {
      data: [],
      pagination: {
        page: options.page || 1,
        pageSize: options.pageSize || 20,
        totalItems: 0,
        totalPages: 0,
        hasMore: false,
      },
      error: handleSupabaseError(error),
    };
  }
};

/**
 * Get a single contact by ID
 *
 * @param userId - The user's ID
 * @param contactId - The contact's ID
 * @returns Contact data or error
 */
export const getContactById = async (userId: string, contactId: string) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return {
        data: null,
        error: {
          type: 'database',
          message: 'Contact not found',
          code: 'CONTACT_NOT_FOUND',
        } as DatabaseError,
      };
    }

    // Map database columns to DTO format
    const contact: Contact = {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      phoneNumber: data.phone_number || undefined,
      email: data.email || undefined,
      birthday: data.birthday || undefined,
      anniversary: data.anniversary || undefined,
      relationshipType: data.relationship_type || undefined,
      communicationStyle: data.communication_style || undefined,
      personalityTraits: data.personality_traits || {},
      notes: data.notes || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at || undefined,
    };

    return { data: contact, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
};

/**
 * Create a new contact
 *
 * @param userId - The user's ID
 * @param contactData - Contact creation data
 * @returns Created contact or error
 */
export const createContact = async (userId: string, contactData: CreateContactDTO) => {
  try {
    // Validate required fields
    if (!contactData.name || !validateContactName(contactData.name)) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Contact name must be 2-100 characters with letters, spaces, hyphens, or apostrophes only',
          code: 'INVALID_CONTACT_NAME',
          field: 'name',
        } as ValidationError,
      };
    }

    // Validate optional fields if provided
    if (contactData.phoneNumber && !validatePhoneNumber(contactData.phoneNumber)) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Phone number must be in E.164 format (e.g., +1234567890)',
          code: 'INVALID_PHONE_NUMBER',
          field: 'phoneNumber',
        } as ValidationError,
      };
    }

    if (contactData.email && !validateEmail(contactData.email)) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Email must be in valid format',
          code: 'INVALID_EMAIL',
          field: 'email',
        } as ValidationError,
      };
    }

    if (contactData.birthday && !validateDate(contactData.birthday)) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Birthday must be in YYYY-MM-DD format',
          code: 'INVALID_BIRTHDAY',
          field: 'birthday',
        } as ValidationError,
      };
    }

    if (contactData.anniversary && !validateDate(contactData.anniversary)) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Anniversary must be in YYYY-MM-DD format',
          code: 'INVALID_ANNIVERSARY',
          field: 'anniversary',
        } as ValidationError,
      };
    }

    // Insert contact
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        user_id: userId,
        name: contactData.name,
        phone_number: contactData.phoneNumber || null,
        email: contactData.email || null,
        birthday: contactData.birthday || null,
        anniversary: contactData.anniversary || null,
        relationship_type: contactData.relationshipType || null,
        notes: contactData.notes || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Map to DTO
    const contact: Contact = {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      phoneNumber: data.phone_number || undefined,
      email: data.email || undefined,
      birthday: data.birthday || undefined,
      anniversary: data.anniversary || undefined,
      relationshipType: data.relationship_type || undefined,
      communicationStyle: data.communication_style || undefined,
      personalityTraits: data.personality_traits || {},
      notes: data.notes || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at || undefined,
    };

    return { data: contact, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
};

/**
 * Update an existing contact
 *
 * @param userId - The user's ID
 * @param contactId - The contact's ID
 * @param updates - Partial contact data to update
 * @returns Updated contact or error
 */
export const updateContact = async (
  userId: string,
  contactId: string,
  updates: UpdateContactDTO
) => {
  try {
    // Validate fields if provided
    if (updates.name !== undefined) {
      if (!validateContactName(updates.name)) {
        return {
          data: null,
          error: {
            type: 'validation',
            message: 'Contact name must be 2-100 characters with letters, spaces, hyphens, or apostrophes only',
            code: 'INVALID_CONTACT_NAME',
            field: 'name',
          } as ValidationError,
        };
      }
    }

    if (updates.phoneNumber !== undefined && updates.phoneNumber !== '') {
      if (!validatePhoneNumber(updates.phoneNumber)) {
        return {
          data: null,
          error: {
            type: 'validation',
            message: 'Phone number must be in E.164 format (e.g., +1234567890)',
            code: 'INVALID_PHONE_NUMBER',
            field: 'phoneNumber',
          } as ValidationError,
        };
      }
    }

    if (updates.email !== undefined && updates.email !== '') {
      if (!validateEmail(updates.email)) {
        return {
          data: null,
          error: {
            type: 'validation',
            message: 'Email must be in valid format',
            code: 'INVALID_EMAIL',
            field: 'email',
          } as ValidationError,
        };
      }
    }

    if (updates.birthday !== undefined && updates.birthday !== '') {
      if (!validateDate(updates.birthday)) {
        return {
          data: null,
          error: {
            type: 'validation',
            message: 'Birthday must be in YYYY-MM-DD format',
            code: 'INVALID_BIRTHDAY',
            field: 'birthday',
          } as ValidationError,
        };
      }
    }

    if (updates.anniversary !== undefined && updates.anniversary !== '') {
      if (!validateDate(updates.anniversary)) {
        return {
          data: null,
          error: {
            type: 'validation',
            message: 'Anniversary must be in YYYY-MM-DD format',
            code: 'INVALID_ANNIVERSARY',
            field: 'anniversary',
          } as ValidationError,
        };
      }
    }

    // Map DTO fields to database columns
    const updateData: Record<string, any> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.phoneNumber !== undefined) updateData.phone_number = updates.phoneNumber || null;
    if (updates.email !== undefined) updateData.email = updates.email || null;
    if (updates.birthday !== undefined) updateData.birthday = updates.birthday || null;
    if (updates.anniversary !== undefined) updateData.anniversary = updates.anniversary || null;
    if (updates.relationshipType !== undefined) updateData.relationship_type = updates.relationshipType || null;
    if (updates.notes !== undefined) updateData.notes = updates.notes || null;

    // Update contact
    const { data, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', contactId)
      .eq('user_id', userId)
      .is('deleted_at', null)
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
          message: 'Contact not found',
          code: 'CONTACT_NOT_FOUND',
        } as DatabaseError,
      };
    }

    // Map to DTO
    const contact: Contact = {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      phoneNumber: data.phone_number || undefined,
      email: data.email || undefined,
      birthday: data.birthday || undefined,
      anniversary: data.anniversary || undefined,
      relationshipType: data.relationship_type || undefined,
      communicationStyle: data.communication_style || undefined,
      personalityTraits: data.personality_traits || {},
      notes: data.notes || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at || undefined,
    };

    return { data: contact, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
};

/**
 * Soft delete a contact
 *
 * @param userId - The user's ID
 * @param contactId - The contact's ID
 * @returns Success status or error
 */
export const deleteContact = async (userId: string, contactId: string) => {
  try {
    const { error } = await supabase
      .from('contacts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', contactId)
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error: any) {
    return {
      error: handleSupabaseError(error),
    };
  }
};

/**
 * Hard delete a contact (permanent)
 * WARNING: This permanently deletes the contact
 *
 * @param userId - The user's ID
 * @param contactId - The contact's ID
 * @returns Success status or error
 */
export const hardDeleteContact = async (userId: string, contactId: string) => {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error: any) {
    return {
      error: handleSupabaseError(error),
    };
  }
};

// Export validation functions for use in components
export const validators = {
  validateContactName,
  validatePhoneNumber,
  validateEmail,
  validateDate,
};


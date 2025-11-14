/**
 * Message Service
 *
 * Handles all message operations using Supabase.
 * Provides methods for message CRUD operations, scheduling, and AI generation.
 *
 * Based on: contracts/database-contracts/schema.sql (messages table)
 * Based on: contracts/data-contracts/dto-definitions.ts (Message, CreateMessageDTO, UpdateMessageDTO, etc.)
 */

import { supabase } from './supabase';
import {
  Message,
  CreateMessageDTO,
  UpdateMessageDTO,
  ScheduleMessageDTO,
  GeneratedMessageResponse,
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

export interface FetchMessagesParams {
  page?: number;
  pageSize?: number;
  status?: 'draft' | 'scheduled' | 'sent' | 'failed';
  contactId?: string;
  occasion?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'scheduledAt' | 'sentAt';
  sortOrder?: 'asc' | 'desc';
}

// ==================== DATABASE OPERATIONS ====================

/**
 * Maps database message object to Message DTO.
 * @param data - Database row data.
 * @returns Message DTO.
 */
const mapToMessageDTO = (data: any): Message => ({
  id: data.id,
  userId: data.user_id,
  contactId: data.contact_id,
  content: data.content,
  occasion: data.occasion || undefined,
  tone: data.tone || undefined,
  status: data.status || 'draft',
  scheduledAt: data.scheduled_at || undefined,
  sentAt: data.sent_at || undefined,
  aiGenerated: data.ai_generated || false,
  confidenceScore: data.confidence_score || undefined,
  alternatives: data.alternatives || [],
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

/**
 * Fetches a paginated list of messages for the current user.
 *
 * @param userId - The user's ID
 * @param params - Query parameters for pagination, filter, sort.
 * @returns Paginated response with messages.
 */
export const fetchMessages = async (
  userId: string,
  params: FetchMessagesParams = {}
): Promise<{
  data: Message[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
  error: DatabaseError | null;
}> => {
  try {
    const {
      page = 1,
      pageSize = 20,
      status,
      contactId,
      occasion,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from('messages').select('*', { count: 'exact' }).eq('user_id', userId);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (contactId) {
      query = query.eq('contact_id', contactId);
    }
    if (occasion) {
      query = query.eq('occasion', occasion);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw error;
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasMore = page < totalPages;

    return {
      data: (data || []).map(mapToMessageDTO),
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
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        totalItems: 0,
        totalPages: 0,
        hasMore: false,
      },
      error: {
        type: 'database',
        message: error.message || 'Failed to fetch messages',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Fetches a single message by ID.
 *
 * @param userId - The user's ID
 * @param messageId - The ID of the message.
 * @returns The message data or error.
 */
export const getMessageById = async (
  userId: string,
  messageId: string
): Promise<{ data: Message | null; error: DatabaseError | null }> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
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
          message: 'Message not found',
          code: 'MESSAGE_NOT_FOUND',
        } as DatabaseError,
      };
    }

    return { data: mapToMessageDTO(data), error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to fetch message',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Creates a new message (draft by default).
 *
 * @param userId - The user's ID
 * @param messageData - Data for the new message.
 * @returns The created message or error.
 */
export const createMessage = async (
  userId: string,
  messageData: CreateMessageDTO
): Promise<{ data: Message | null; error: DatabaseError | ValidationError | null }> => {
  try {
    // Validate required fields
    if (!messageData.content || messageData.content.trim().length === 0) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Message content is required',
          code: 'INVALID_MESSAGE_CONTENT',
          field: 'content',
        } as ValidationError,
      };
    }

    // Insert message
    const insertData = {
      user_id: userId,
      contact_id: messageData.contactId,
      content: messageData.content.trim(),
      occasion: messageData.occasion || null,
      tone: messageData.tone || null,
      status: 'draft',
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: mapToMessageDTO(data), error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to create message',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Updates an existing message.
 *
 * @param userId - The user's ID
 * @param messageId - The ID of the message to update.
 * @param updates - Partial data to update.
 * @returns The updated message or error.
 */
export const updateMessage = async (
  userId: string,
  messageId: string,
  updates: UpdateMessageDTO
): Promise<{ data: Message | null; error: DatabaseError | ValidationError | null }> => {
  try {
    // Validate content if provided
    if (updates.content !== undefined && updates.content.trim().length === 0) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Message content cannot be empty',
          code: 'INVALID_MESSAGE_CONTENT',
          field: 'content',
        } as ValidationError,
      };
    }

    // Map DTO to database schema
    const updateData: Record<string, any> = {};
    if (updates.content !== undefined) updateData.content = updates.content.trim();
    if (updates.occasion !== undefined) updateData.occasion = updates.occasion || null;
    if (updates.tone !== undefined) updateData.tone = updates.tone || null;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('messages')
      .update(updateData)
      .eq('id', messageId)
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
          message: 'Message not found for update',
          code: 'MESSAGE_NOT_FOUND',
        } as DatabaseError,
      };
    }

    return { data: mapToMessageDTO(data), error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to update message',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Deletes a message.
 *
 * @param userId - The user's ID
 * @param messageId - The ID of the message to delete.
 * @returns Success or error.
 */
export const deleteMessage = async (
  userId: string,
  messageId: string
): Promise<{ error: DatabaseError | null }> => {
  try {
    const { error } = await supabase.from('messages').delete().eq('id', messageId).eq('user_id', userId);

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error: any) {
    return {
      error: {
        type: 'database',
        message: error.message || 'Failed to delete message',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Schedules a message for future delivery.
 *
 * @param userId - The user's ID
 * @param messageId - The ID of the message to schedule.
 * @param scheduleData - Schedule data.
 * @returns The updated message or error.
 */
export const scheduleMessage = async (
  userId: string,
  messageId: string,
  scheduleData: ScheduleMessageDTO
): Promise<{ data: Message | null; error: DatabaseError | ValidationError | null }> => {
  try {
    const { scheduledAt } = scheduleData;

    // Validate scheduled date is in the future
    const scheduledDate = new Date(scheduledAt);
    const now = new Date();
    if (scheduledDate <= now) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Scheduled time must be in the future',
          code: 'INVALID_SCHEDULED_TIME',
          field: 'scheduledAt',
        } as ValidationError,
      };
    }

    // Update message
    const { data, error } = await supabase
      .from('messages')
      .update({
        scheduled_at: scheduledAt,
        status: 'scheduled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId)
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
          message: 'Message not found for scheduling',
          code: 'MESSAGE_NOT_FOUND',
        } as DatabaseError,
      };
    }

    return { data: mapToMessageDTO(data), error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to schedule message',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Cancels a scheduled message (returns to draft).
 *
 * @param userId - The user's ID
 * @param messageId - The ID of the message to cancel.
 * @returns The updated message or error.
 */
export const cancelScheduledMessage = async (
  userId: string,
  messageId: string
): Promise<{ data: Message | null; error: DatabaseError | null }> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .update({
        scheduled_at: null,
        status: 'draft',
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId)
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
          message: 'Message not found for cancellation',
          code: 'MESSAGE_NOT_FOUND',
        } as DatabaseError,
      };
    }

    return { data: mapToMessageDTO(data), error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to cancel message',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Marks a message as sent.
 *
 * @param userId - The user's ID
 * @param messageId - The ID of the message to mark as sent.
 * @returns The updated message or error.
 */
export const markMessageAsSent = async (
  userId: string,
  messageId: string
): Promise<{ data: Message | null; error: DatabaseError | null }> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .update({
        sent_at: new Date().toISOString(),
        status: 'sent',
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId)
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
          message: 'Message not found',
          code: 'MESSAGE_NOT_FOUND',
        } as DatabaseError,
      };
    }

    return { data: mapToMessageDTO(data), error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        type: 'database',
        message: error.message || 'Failed to mark message as sent',
        code: error.code,
        details: error,
      } as DatabaseError,
    };
  }
};

/**
 * Subscribes to real-time changes for messages.
 *
 * @param callback - Callback function for changes.
 * @returns Unsubscribe function.
 */
export function subscribeToMessages(callback: (payload: any) => void): () => void {
  const subscription = supabase
    .channel('messages_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
      },
      callback
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Generates an AI message using Claude API.
 * NOTE: This is a placeholder until Claude API integration is implemented.
 *
 * @param generateData - Generation parameters.
 * @returns Generated message response or error.
 */
export const generateAIMessage = async (
  generateData: {
    contactId: string;
    occasion: 'birthday' | 'anniversary' | 'casual' | 'apology' | 'thankyou' | 'congratulations';
    tone?: 'formal' | 'casual' | 'humorous' | 'heartfelt' | 'professional';
    context?: string;
  }
): Promise<{ data: GeneratedMessageResponse | null; error: DatabaseError | null }> => {
  // TODO: Implement Claude API integration
  // This is a placeholder that returns a mock response for now
  return {
    data: null,
    error: {
      type: 'database',
      message: 'AI message generation not yet implemented',
      code: 'NOT_IMPLEMENTED',
    } as DatabaseError,
  };
};


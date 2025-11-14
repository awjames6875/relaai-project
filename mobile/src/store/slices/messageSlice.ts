/**
 * Message Redux Slice
 *
 * Manages message state (messages list, drafts, scheduled, loading, error, pagination).
 * Based on Epic 3: AI Message Generation requirements.
 *
 * Follows the same pattern as contactSlice.ts for consistency.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  scheduleMessage,
  cancelScheduledMessage,
  markMessageAsSent,
  FetchMessagesParams,
} from '../../services/message';
import {
  Message,
  CreateMessageDTO,
  UpdateMessageDTO,
  ScheduleMessageDTO,
} from '@contracts/data-contracts/dto-definitions';
import type { RootState } from '../index';

interface MessagesState {
  messages: Message[];
  drafts: Message[];
  scheduled: Message[];
  selectedMessage: Message | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters: {
    status?: 'draft' | 'scheduled' | 'sent' | 'failed';
    contactId?: string;
    occasion?: string;
  };
}

const initialState: MessagesState = {
  messages: [],
  drafts: [],
  scheduled: [],
  selectedMessage: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasMore: false,
  },
  filters: {},
};

// Async thunks
export const fetchMessagesThunk = createAsyncThunk(
  'messages/fetchMessages',
  async (
    { userId, params }: { userId: string; params?: FetchMessagesParams },
    { rejectWithValue }
  ) => {
    const result = await fetchMessages(userId, params);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result;
  }
);

export const fetchMessageByIdThunk = createAsyncThunk(
  'messages/fetchMessageById',
  async ({ userId, messageId }: { userId: string; messageId: string }, { rejectWithValue }) => {
    const result = await getMessageById(userId, messageId);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

export const createMessageThunk = createAsyncThunk(
  'messages/createMessage',
  async (
    { userId, messageData }: { userId: string; messageData: CreateMessageDTO },
    { rejectWithValue }
  ) => {
    const result = await createMessage(userId, messageData);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

export const updateMessageThunk = createAsyncThunk(
  'messages/updateMessage',
  async (
    {
      userId,
      messageId,
      updates,
    }: { userId: string; messageId: string; updates: UpdateMessageDTO },
    { rejectWithValue }
  ) => {
    const result = await updateMessage(userId, messageId, updates);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

export const deleteMessageThunk = createAsyncThunk(
  'messages/deleteMessage',
  async ({ userId, messageId }: { userId: string; messageId: string }, { rejectWithValue }) => {
    const result = await deleteMessage(userId, messageId);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return messageId;
  }
);

export const scheduleMessageThunk = createAsyncThunk(
  'messages/scheduleMessage',
  async (
    {
      userId,
      messageId,
      scheduleData,
    }: { userId: string; messageId: string; scheduleData: ScheduleMessageDTO },
    { rejectWithValue }
  ) => {
    const result = await scheduleMessage(userId, messageId, scheduleData);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

export const cancelScheduledMessageThunk = createAsyncThunk(
  'messages/cancelScheduledMessage',
  async ({ userId, messageId }: { userId: string; messageId: string }, { rejectWithValue }) => {
    const result = await cancelScheduledMessage(userId, messageId);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

export const markMessageAsSentThunk = createAsyncThunk(
  'messages/markMessageAsSent',
  async ({ userId, messageId }: { userId: string; messageId: string }, { rejectWithValue }) => {
    const result = await markMessageAsSent(userId, messageId);
    if (result.error) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<'draft' | 'scheduled' | 'sent' | 'failed' | undefined>) => {
      state.filters.status = action.payload;
      state.pagination.page = 1;
    },
    setContactFilter: (state, action: PayloadAction<string | undefined>) => {
      state.filters.contactId = action.payload;
      state.pagination.page = 1;
    },
    setOccasionFilter: (state, action: PayloadAction<string | undefined>) => {
      state.filters.occasion = action.payload;
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    clearSelectedMessage: (state) => {
      state.selectedMessage = null;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.drafts = [];
      state.scheduled = [];
      state.selectedMessage = null;
      state.error = null;
      state.isLoading = false;
      state.pagination = initialState.pagination;
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchMessagesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload.data;
        state.pagination = action.payload.pagination;

        // Separate drafts and scheduled messages
        state.drafts = action.payload.data.filter((msg) => msg.status === 'draft');
        state.scheduled = action.payload.data.filter((msg) => msg.status === 'scheduled');
      })
      .addCase(fetchMessagesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Message By Id
      .addCase(fetchMessageByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedMessage = null;
      })
      .addCase(fetchMessageByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedMessage = action.payload;
      })
      .addCase(fetchMessageByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Message
      .addCase(createMessageThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMessageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.unshift(action.payload);
        if (action.payload.status === 'draft') {
          state.drafts.unshift(action.payload);
        } else if (action.payload.status === 'scheduled') {
          state.scheduled.unshift(action.payload);
        }
        state.pagination.totalItems += 1;
      })
      .addCase(createMessageThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Message
      .addCase(updateMessageThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMessageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.messages.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
        if (state.selectedMessage?.id === action.payload.id) {
          state.selectedMessage = action.payload;
        }

        // Update drafts and scheduled arrays
        const draftIndex = state.drafts.findIndex((m) => m.id === action.payload.id);
        const scheduledIndex = state.scheduled.findIndex((m) => m.id === action.payload.id);

        if (action.payload.status === 'draft' && draftIndex === -1) {
          state.drafts.unshift(action.payload);
        } else if (action.payload.status === 'draft' && draftIndex !== -1) {
          state.drafts[draftIndex] = action.payload;
        } else if (action.payload.status !== 'draft' && draftIndex !== -1) {
          state.drafts.splice(draftIndex, 1);
        }

        if (action.payload.status === 'scheduled' && scheduledIndex === -1) {
          state.scheduled.unshift(action.payload);
        } else if (action.payload.status === 'scheduled' && scheduledIndex !== -1) {
          state.scheduled[scheduledIndex] = action.payload;
        } else if (action.payload.status !== 'scheduled' && scheduledIndex !== -1) {
          state.scheduled.splice(scheduledIndex, 1);
        }
      })
      .addCase(updateMessageThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Message
      .addCase(deleteMessageThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMessageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = state.messages.filter((msg) => msg.id !== action.payload);
        state.drafts = state.drafts.filter((msg) => msg.id !== action.payload);
        state.scheduled = state.scheduled.filter((msg) => msg.id !== action.payload);
        state.pagination.totalItems -= 1;
        if (state.selectedMessage?.id === action.payload) {
          state.selectedMessage = null;
        }
      })
      .addCase(deleteMessageThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Schedule Message
      .addCase(scheduleMessageThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(scheduleMessageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.messages.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
        if (state.selectedMessage?.id === action.payload.id) {
          state.selectedMessage = action.payload;
        }

        // Remove from drafts, add to scheduled
        state.drafts = state.drafts.filter((m) => m.id !== action.payload.id);
        const scheduledIndex = state.scheduled.findIndex((m) => m.id === action.payload.id);
        if (scheduledIndex === -1) {
          state.scheduled.unshift(action.payload);
        } else {
          state.scheduled[scheduledIndex] = action.payload;
        }
      })
      .addCase(scheduleMessageThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Cancel Scheduled Message
      .addCase(cancelScheduledMessageThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelScheduledMessageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.messages.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
        if (state.selectedMessage?.id === action.payload.id) {
          state.selectedMessage = action.payload;
        }

        // Remove from scheduled, add to drafts
        state.scheduled = state.scheduled.filter((m) => m.id !== action.payload.id);
        const draftIndex = state.drafts.findIndex((m) => m.id === action.payload.id);
        if (draftIndex === -1) {
          state.drafts.unshift(action.payload);
        } else {
          state.drafts[draftIndex] = action.payload;
        }
      })
      .addCase(cancelScheduledMessageThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Mark Message As Sent
      .addCase(markMessageAsSentThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markMessageAsSentThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.messages.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
        if (state.selectedMessage?.id === action.payload.id) {
          state.selectedMessage = action.payload;
        }

        // Remove from drafts and scheduled
        state.drafts = state.drafts.filter((m) => m.id !== action.payload.id);
        state.scheduled = state.scheduled.filter((m) => m.id !== action.payload.id);
      })
      .addCase(markMessageAsSentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setStatusFilter,
  setContactFilter,
  setOccasionFilter,
  clearFilters,
  clearSelectedMessage,
  clearMessages,
} = messageSlice.actions;

// Selectors
export const selectMessages = (state: RootState) => state.messages.messages;
export const selectDrafts = (state: RootState) => state.messages.drafts;
export const selectScheduled = (state: RootState) => state.messages.scheduled;
export const selectSelectedMessage = (state: RootState) => state.messages.selectedMessage;
export const selectMessagesLoading = (state: RootState) => state.messages.isLoading;
export const selectMessagesError = (state: RootState) => state.messages.error;
export const selectMessagesPagination = (state: RootState) => state.messages.pagination;
export const selectMessagesFilters = (state: RootState) => state.messages.filters;

export default messageSlice.reducer;


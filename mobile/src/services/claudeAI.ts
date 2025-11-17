/**
 * Claude AI Message Generation Service
 *
 * Handles AI-powered message generation using Anthropic's Claude API.
 * Generates contextual, personalized messages based on contact details,
 * personal facts, and occasion/tone preferences.
 *
 * Based on: Epic 3 - AI Message Generation
 */

import Anthropic from '@anthropic-ai/sdk';
import { supabase } from './supabase';
import { getContactById } from './contact';
import {
  GenerateMessageDTO,
  GeneratedMessageResponse,
} from '@contracts/data-contracts/dto-definitions';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '',
});

// ==================== TYPES ====================

export interface AIGenerationError {
  type: 'api' | 'validation' | 'parsing' | 'database';
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface AIGenerationResult {
  data: GeneratedMessageResponse | null;
  error: AIGenerationError | null;
}

// ==================== MAIN GENERATION FUNCTION ====================

/**
 * Generate AI message alternatives using Claude
 *
 * @param userId - User ID
 * @param generateData - Generation request (contactId, occasion, tone, context)
 * @returns Generated message with 3 alternatives or error
 */
export const generateAIMessage = async (
  userId: string,
  generateData: GenerateMessageDTO
): Promise<AIGenerationResult> => {
  try {
    // Validate inputs
    if (!userId || !generateData.contactId || !generateData.occasion) {
      return {
        data: null,
        error: {
          type: 'validation',
          message: 'Missing required fields: userId, contactId, occasion',
        },
      };
    }

    // Check API key
    if (!anthropic.apiKey) {
      return {
        data: null,
        error: {
          type: 'api',
          message: 'Anthropic API key not configured',
          code: 'NO_API_KEY',
        },
      };
    }

    // 1. Fetch contact details
    const contactResult = await getContactById(userId, generateData.contactId);
    if (contactResult.error || !contactResult.data) {
      return {
        data: null,
        error: {
          type: 'database',
          message: 'Contact not found',
          code: 'CONTACT_NOT_FOUND',
        },
      };
    }
    const contact = contactResult.data;

    // 2. Fetch personal facts about contact
    const { data: facts, error: factsError } = await supabase
      .from('personal_facts')
      .select('fact_category, fact_content, confidence_score')
      .eq('contact_id', generateData.contactId)
      .eq('user_id', userId)
      .order('confidence_score', { ascending: false })
      .limit(5); // Limit to top 5 facts to avoid token overflow

    if (factsError) {
      console.warn('Could not fetch personal facts:', factsError);
    }

    // 3. Build context-rich prompt
    const prompt = buildPrompt(contact, facts || [], generateData);

    // 4. Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // 5. Parse response and extract alternatives
    if (response.content.length === 0 || response.content[0].type !== 'text') {
      return {
        data: null,
        error: {
          type: 'parsing',
          message: 'Invalid response format from Claude',
          code: 'INVALID_RESPONSE',
        },
      };
    }

    const messageContent = response.content[0].text;
    const alternatives = parseAlternatives(messageContent);

    if (alternatives.length < 3) {
      return {
        data: null,
        error: {
          type: 'parsing',
          message: 'Failed to parse 3 message alternatives from response',
          code: 'PARSE_ERROR',
          details: { parsed: alternatives.length },
        },
      };
    }

    // 6. Save to database
    const { data: message, error: insertError } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        contact_id: generateData.contactId,
        content: alternatives[0], // Primary message is first option
        occasion: generateData.occasion,
        tone: generateData.tone || 'casual',
        status: 'draft',
        ai_generated: true,
        confidence_score: 0.85, // Default confidence
        alternatives: JSON.stringify(alternatives),
      })
      .select()
      .single();

    if (insertError) {
      return {
        data: null,
        error: {
          type: 'database',
          message: 'Failed to save generated message',
          code: 'INSERT_FAILED',
          details: insertError,
        },
      };
    }

    // 7. Return successful response
    return {
      data: {
        messageId: message.id,
        content: alternatives[0],
        alternatives: alternatives,
        confidence: 0.85,
        occasion: generateData.occasion,
        tone: generateData.tone || 'casual',
        generatedAt: new Date().toISOString(),
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Claude API error:', error);

    // Handle specific API errors
    if (error.status === 401) {
      return {
        data: null,
        error: {
          type: 'api',
          message: 'Invalid API key',
          code: 'UNAUTHORIZED',
        },
      };
    }

    if (error.status === 429) {
      return {
        data: null,
        error: {
          type: 'api',
          message: 'Rate limit exceeded. Please wait a moment and try again.',
          code: 'RATE_LIMITED',
        },
      };
    }

    if (error.status === 500) {
      return {
        data: null,
        error: {
          type: 'api',
          message: 'Anthropic API is temporarily unavailable',
          code: 'SERVICE_ERROR',
        },
      };
    }

    return {
      data: null,
      error: {
        type: 'api',
        message: error.message || 'Unknown error occurred',
        code: error.code || 'UNKNOWN_ERROR',
      },
    };
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Build context-rich prompt for Claude
 *
 * Constructs a detailed prompt that includes:
 * - Contact information (name, relationship type)
 * - Personal facts (hobbies, preferences, life events)
 * - Occasion and tone preferences
 * - Generation instructions and format
 */
function buildPrompt(
  contact: any,
  facts: any[],
  generateData: GenerateMessageDTO
): string {
  const { occasion, tone, context } = generateData;

  let prompt = `You are a relationship management AI assistant. Your task is to generate 3 personalized message alternatives for reaching out to someone.\n\n`;

  // Contact information
  prompt += `**CONTACT INFORMATION:**\n`;
  prompt += `Name: ${contact.name}\n`;
  if (contact.relationship_type) {
    prompt += `Relationship: ${contact.relationship_type}\n`;
  }
  if (contact.email) {
    prompt += `Email: ${contact.email}\n`;
  }
  prompt += `\n`;

  // Personal facts
  if (facts && facts.length > 0) {
    prompt += `**PERSONAL FACTS ABOUT ${contact.name.toUpperCase()}:**\n`;
    facts.forEach((fact, index) => {
      prompt += `${index + 1}. (${fact.fact_category}) ${fact.fact_content}\n`;
    });
    prompt += `\n`;
  }

  // Occasion and tone
  prompt += `**MESSAGE CONTEXT:**\n`;
  prompt += `Occasion: ${occasion}\n`;
  prompt += `Tone: ${tone || 'casual'}\n`;
  if (context) {
    prompt += `Additional context: ${context}\n`;
  }
  prompt += `\n`;

  // Generation instructions
  prompt += `**REQUIREMENTS:**\n`;
  prompt += `1. Generate exactly 3 message alternatives\n`;
  prompt += `2. Each message should be 50-300 characters long\n`;
  prompt += `3. Messages should be personalized to ${contact.name}\n`;
  prompt += `4. Messages should be appropriate for the "${occasion}" occasion\n`;
  prompt += `5. Messages should have a ${tone || 'casual'} tone\n`;
  if (facts && facts.length > 0) {
    prompt += `6. Reference at least one personal fact from the list above\n`;
  }
  prompt += `7. Messages should feel authentic and natural\n`;
  prompt += `8. Each message should be distinct from the others\n`;
  prompt += `\n`;

  // Format instructions
  prompt += `**FORMAT:**\n`;
  prompt += `Provide your response in the following exact format:\n\n`;
  prompt += `OPTION 1: [first message here]\n`;
  prompt += `OPTION 2: [second message here]\n`;
  prompt += `OPTION 3: [third message here]\n\n`;

  prompt += `Do not include any other text or explanations. Start with OPTION 1.`;

  return prompt;
}

/**
 * Parse Claude response to extract 3 message alternatives
 *
 * Looks for "OPTION 1:", "OPTION 2:", "OPTION 3:" format
 * Falls back gracefully if parsing fails
 */
function parseAlternatives(response: string): string[] {
  const alternatives: string[] = [];

  // Try to extract alternatives from formatted response
  const lines = response.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('OPTION 1:')) {
      alternatives[0] = line.replace('OPTION 1:', '').trim();
    } else if (line.startsWith('OPTION 2:')) {
      alternatives[1] = line.replace('OPTION 2:', '').trim();
    } else if (line.startsWith('OPTION 3:')) {
      alternatives[2] = line.replace('OPTION 3:', '').trim();
    }
  }

  // Fallback: if we got at least 1 option, pad with variations
  if (alternatives.length >= 1 && alternatives[0]) {
    if (!alternatives[1] || !alternatives[1].trim()) {
      alternatives[1] = alternatives[0]; // Duplicate for now
    }
    if (!alternatives[2] || !alternatives[2].trim()) {
      alternatives[2] = alternatives[0]; // Duplicate for now
    }
  }

  // Clean up whitespace and filter empty strings
  return alternatives
    .filter((msg) => msg && msg.trim().length > 0)
    .slice(0, 3);
}

/**
 * Check if API key is configured
 *
 * Useful for validating setup before attempting generation
 */
export const isAPIKeyConfigured = (): boolean => {
  return !!(
    process.env.ANTHROPIC_API_KEY || process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY
  );
};

/**
 * Get Claude model info for display
 */
export const getModelInfo = () => {
  return {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    description: 'Claude 3.5 Sonnet - Fast, intelligent message generation',
  };
};

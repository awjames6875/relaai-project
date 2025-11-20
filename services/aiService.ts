import axios from 'axios';

// Configuration from environment variables
// For development, these should be set in your .env file
const AI_PROVIDER = process.env.EXPO_PUBLIC_AI_PROVIDER || 'openai';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo';
const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';
const ANTHROPIC_MODEL = process.env.EXPO_PUBLIC_ANTHROPIC_MODEL || 'claude-3-haiku-20240307';

interface MessageGenerationParams {
  contactName: string;
  phone?: string;
  email?: string;
  context?: string;
}

/**
 * Generate a personalized AI message using OpenAI API
 */
async function generateWithOpenAI(params: MessageGenerationParams): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const prompt = `Generate a warm, personalized message to re-engage with a contact.
Contact Name: ${params.contactName}
${params.phone ? `Phone: ${params.phone}` : ''}
${params.email ? `Email: ${params.email}` : ''}
${params.context ? `Context: ${params.context}` : ''}

Requirements:
- Keep it concise (1-2 sentences)
- Be genuine and friendly
- Include their name
- Suggest catching up or checking in
- Do not include any formatting or quotation marks, just the plain message

Message:`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const message = response.data.choices[0]?.message?.content?.trim();
    if (!message) {
      throw new Error('No response from OpenAI');
    }

    return message;
  } catch (error: any) {
    console.error('OpenAI error:', error.response?.data || error.message);
    throw new Error(`Failed to generate message with OpenAI: ${error.message}`);
  }
}

/**
 * Generate a personalized AI message using Anthropic Claude API
 */
async function generateWithAnthropic(params: MessageGenerationParams): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key is not configured');
  }

  try {
    const prompt = `Generate a warm, personalized message to re-engage with a contact.
Contact Name: ${params.contactName}
${params.phone ? `Phone: ${params.phone}` : ''}
${params.email ? `Email: ${params.email}` : ''}
${params.context ? `Context: ${params.context}` : ''}

Requirements:
- Keep it concise (1-2 sentences)
- Be genuine and friendly
- Include their name
- Suggest catching up or checking in
- Do not include any formatting or quotation marks, just the plain message`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: ANTHROPIC_MODEL,
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    const message = response.data.content[0]?.text?.trim();
    if (!message) {
      throw new Error('No response from Anthropic');
    }

    return message;
  } catch (error: any) {
    console.error('Anthropic error:', error.response?.data || error.message);
    throw new Error(`Failed to generate message with Anthropic: ${error.message}`);
  }
}

/**
 * Generate a personalized AI message based on configured provider
 */
export async function generateAIMessage(params: MessageGenerationParams): Promise<string> {
  try {
    // For development without API keys, provide a fallback
    if (!OPENAI_API_KEY && !ANTHROPIC_API_KEY) {
      console.warn(
        'No API keys configured. Using placeholder message. Set EXPO_PUBLIC_OPENAI_API_KEY or EXPO_PUBLIC_ANTHROPIC_API_KEY to enable real AI.'
      );
      return getPlaceholderMessage(params.contactName);
    }

    if (AI_PROVIDER === 'anthropic' && ANTHROPIC_API_KEY) {
      return await generateWithAnthropic(params);
    }

    if (AI_PROVIDER === 'openai' && OPENAI_API_KEY) {
      return await generateWithOpenAI(params);
    }

    // Default to OpenAI if provider not recognized but key exists
    if (OPENAI_API_KEY) {
      return await generateWithOpenAI(params);
    }

    // Fallback to Anthropic if OpenAI not available
    if (ANTHROPIC_API_KEY) {
      return await generateWithAnthropic(params);
    }

    throw new Error('No AI provider configured');
  } catch (error) {
    console.error('Error generating AI message:', error);
    throw error;
  }
}

/**
 * Placeholder messages for development without API keys
 */
function getPlaceholderMessage(contactName: string): string {
  const messages = [
    `Hey ${contactName}! Just thinking of you and wanted to check in. How have you been?`,
    `Hi ${contactName}! Hope you're doing great. Would love to catch up soon!`,
    `Hey ${contactName}! Missing our chats. Let's schedule a call this week!`,
    `${contactName}, it's been too long! Let's reconnect and catch up over coffee.`,
    `Hi ${contactName}! Wanted to reach out and see how things are going with you.`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

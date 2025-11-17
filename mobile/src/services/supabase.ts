/**
 * Supabase Client Service
 *
 * Initializes and exports the Supabase client for use throughout the app.
 * Handles authentication, database queries, and real-time subscriptions.
 *
 * Configuration:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_ANON_KEY: Your Supabase anonymous key
 *
 * Usage:
 * import { supabase } from '@/services/supabase';
 *
 * const { data, error } = await supabase.auth.signUp({ email, password });
 */
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Environment variables
// IMPORTANT: Fill in .env with real credentials from Supabase dashboard
// Settings > API > Project URL and Project API keys (anon key)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase credentials not configured. Please add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
  );
}

/**
 * Supabase client instance
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-client-info': 'relaai-mobile',
    },
  },
});

// Re-export types for convenience
export type { AuthUser } from '@supabase/supabase-js';
export type { Session } from '@supabase/supabase-js';


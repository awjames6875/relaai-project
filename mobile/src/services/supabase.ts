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
// In production, use @env config or similar
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://odgkiyjmegjdiheyxxbf.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZ2tpeWptZWdqZGloZXl4eGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjk0NDksImV4cCI6MjA3NzYwNTQ0OX0.5lTb3dJrFMgTCqOxxTjgFqdr6VpgLZiPZ7zX5-F8bcA';

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


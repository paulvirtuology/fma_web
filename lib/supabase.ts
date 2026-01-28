
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

/**
 * A mock implementation of the Supabase client to prevent the app from crashing
 * if environment variables are not yet configured.
 */
const mockSupabase = {
  from: () => ({
    select: () => ({
      order: () => ({
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => Promise.resolve({ data: [{}], error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: { path: 'mock' }, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800' } }),
    }),
  },
};

// Only initialize the real client if both URL and Key are provided.
// This satisfies the "supabaseUrl is required" constraint of createClient.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (mockSupabase as any);


import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for Vite, fallback to process.env for other environments
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || (process as any).env?.SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (process as any).env?.SUPABASE_ANON_KEY;

console.log('[Supabase Config Check]');
console.log('- URL:', supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'MISSING');
console.log('- Key length:', supabaseAnonKey ? supabaseAnonKey.length : 'MISSING');

const createMockQuery = () => {
  const basePromise = Promise.resolve({ data: [], error: null });
  const mockQuery = {
    eq: () => mockQuery,
    order: () => mockQuery,
    limit: () => basePromise,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (onFulfilled: any, onRejected: any) => basePromise.then(onFulfilled, onRejected),
    catch: (onRejected: any) => basePromise.catch(onRejected),
  };
  return mockQuery;
};

const mockSupabase = {
  auth: {
    signInWithPassword: () => {
      console.warn('[Mock] signInWithPassword called');
      return Promise.resolve({ data: { user: null, session: null }, error: null });
    },
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => {
      console.warn('[Mock] getUser called');
      return Promise.resolve({ data: { user: null }, error: null });
    },
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
  },
  from: () => ({
    select: () => createMockQuery(),
    insert: () => ({ select: () => Promise.resolve({ data: [{}], error: null }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
    upsert: () => Promise.resolve({ data: [{}], error: null }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: { path: 'mock' }, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c' } }),
    }),
  },
};

export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your_supabase'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (console.warn('[Supabase] Initializing MOCK client due to missing or placeholder config'), mockSupabase as any);

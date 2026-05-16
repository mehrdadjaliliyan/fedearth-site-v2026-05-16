import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-supabase') &&
    !supabaseAnonKey.includes('your-supabase'),
);

function createStubClient(): SupabaseClient {
  const err = () =>
    new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.',
    );

  const authStub = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signInWithPassword: async () => ({ data: null, error: err() }),
    signUp: async () => ({ data: null, error: err() }),
    signOut: async () => ({ error: null }),
  };

  const queryStub: any = {
    select: () => queryStub,
    eq: () => queryStub,
    single: async () => ({ data: null, error: err() }),
    insert: async () => ({ data: null, error: err() }),
    update: async () => ({ data: null, error: err() }),
    delete: async () => ({ data: null, error: err() }),
    order: () => queryStub,
    limit: () => queryStub,
  };

  return {
    auth: authStub,
    from: () => queryStub,
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe() {} }) }),
      subscribe: () => ({ unsubscribe() {} }),
    }),
    removeChannel: () => {},
  } as unknown as SupabaseClient;
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createStubClient();

export async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getUserProfile(userId: string) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

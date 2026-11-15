import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface NoticeRow {
  id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
}

const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const rawSupabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

// Normalize URL in case `/rest/v1` or trailing slash was included
const normalizedSupabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');

const hasValidConfig =
  /^https?:\/\/.+/i.test(normalizedSupabaseUrl) && rawSupabaseAnonKey.length > 0;

let client: SupabaseClient | null = null;

if (hasValidConfig) {
  try {
    client = createClient(normalizedSupabaseUrl, rawSupabaseAnonKey);
  } catch (err) {
    console.warn('Supabase client initialization failed:', err);
    client = null;
  }
} else {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not configured.'
  );
}

export const supabase: SupabaseClient | null = client;
export const isSupabaseConfigured: boolean = client !== null;

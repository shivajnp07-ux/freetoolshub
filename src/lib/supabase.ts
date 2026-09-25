import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface FavoriteRow {
  id: string;
  user_id: string;
  tool_slug: string;
  created_at: string;
}

export interface HistoryRow {
  id: string;
  user_id: string;
  tool_slug: string;
  visited_at: string;
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SessionType = 'focus' | 'short_break' | 'long_break';

export type FocusSession = {
  id: string;
  user_id: string;
  duration_minutes: number;
  session_type: SessionType;
  intent?: string;
  reflection?: string;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
  created_at: string;
};

export type UserProfile = {
  id: string;
  full_name: string;
  bio: string;
  profile_photo_url?: string;
  updated_at: string;
};

export type Reflection = {
  id: string;
  user_id: string;
  session_id: string | null;
  content: string;
  created_at: string;
};

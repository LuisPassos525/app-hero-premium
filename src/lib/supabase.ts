import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  points: number;
  level: number;
  consecutive_days: number;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  points: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface WeeklyProgress {
  id: string;
  user_id: string;
  day: string;
  value: number;
  date: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// Using process.env to avoid TypeScript errors with import.meta.env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if keys are present (allows Hybrid Mode)
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * SQL SCHEMA FOR SUPABASE (Run this in Supabase SQL Editor to make the app work):
 * 
 * -- 1. Profiles Table
 * create table profiles (
 *   id uuid references auth.users on delete cascade not null primary key,
 *   email text,
 *   name text,
 *   role text,
 *   wallet_balance decimal default 0,
 *   avatar_url text,
 *   is_approved boolean default false,
 *   specialty text,
 *   hospital text,
 *   country text,
 *   linkedin text,
 *   bio text,
 *   rating decimal default 5.0,
 *   cases_closed int default 0,
 *   bonus_points int default 0,
 *   created_at timestamp with time zone default timezone('utc'::text, now())
 * );
 * 
 * -- 2. Policies
 * alter table profiles enable row level security;
 * create policy "Public profiles are viewable by everyone" on profiles for select using (true);
 * create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
 * create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
 */
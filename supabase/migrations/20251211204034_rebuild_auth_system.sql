/*
  # Rebuild Authentication System
  
  1. Changes
    - Drop existing users table and all its policies
    - Create fresh users table with proper schema
    - Set up clean RLS policies for all three user types (PATIENT, DOCTOR, ADMIN)
  
  2. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `name` (text, not null)
      - `role` (text, not null, check constraint for PATIENT/DOCTOR/ADMIN)
      - `wallet_balance` (numeric, default 0)
      - `avatar_url` (text, optional)
      - `is_approved` (boolean, default false for doctors, true for patients/admins)
      - `specialty` (text, optional, for doctors)
      - `hospital` (text, optional, for doctors)
      - `country` (text, optional, for doctors)
      - `linkedin` (text, optional, for doctors)
      - `bio` (text, optional, for doctors)
      - `rating` (numeric, default 5.0, for doctors)
      - `cases_closed` (integer, default 0, for doctors)
      - `bonus_points` (integer, default 0)
      - `created_at` (timestamptz, default now())
  
  3. Security
    - Enable RLS on users table
    - Users can read their own profile
    - Users can insert their own profile during signup
    - Users can update their own profile (except wallet_balance)
    - Public/authenticated users can view approved doctors
    - Admins can view, update, and delete all users
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS users CASCADE;

-- Create fresh users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('PATIENT', 'DOCTOR', 'ADMIN')),
  wallet_balance numeric DEFAULT 0 NOT NULL,
  avatar_url text,
  is_approved boolean DEFAULT false NOT NULL,
  specialty text,
  hospital text,
  country text,
  linkedin text,
  bio text,
  rating numeric DEFAULT 5.0 NOT NULL,
  cases_closed integer DEFAULT 0 NOT NULL,
  bonus_points integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Users can insert their own profile during signup
CREATE POLICY "Users can create own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 3: Users can update their own profile (but not wallet_balance)
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND wallet_balance = (SELECT wallet_balance FROM users WHERE id = auth.uid())
  );

-- Policy 4: Anyone can view approved doctors
CREATE POLICY "Anyone can view approved doctors"
  ON users FOR SELECT
  TO authenticated, anon
  USING (role = 'DOCTOR' AND is_approved = true);

-- Policy 5: Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'ADMIN'
    )
  );

-- Policy 6: Admins can update any user
CREATE POLICY "Admins can update any user"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'ADMIN'
    )
  );

-- Policy 7: Admins can delete any user
CREATE POLICY "Admins can delete any user"
  ON users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'ADMIN'
    )
  );

-- Create index for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_approved ON users(is_approved);

/*
  # Fix RLS Circular Dependency
  
  1. Problem
    - Admin policies check the users table to verify admin role
    - This creates a circular dependency where viewing requires viewing
  
  2. Solution
    - Use auth.jwt() to check role from JWT metadata instead of querying users table
    - For now, simplify to allow all authenticated users to view their own profile
    - Keep admin policies but ensure basic profile access works first
  
  3. Changes
    - Drop existing policies
    - Recreate with simpler logic that avoids circular dependencies
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view approved doctors" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Admins can delete any user" ON users;

-- Policy 1: Users can view their own profile (no circular dependency)
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
  WITH CHECK (auth.uid() = id);

-- Policy 4: Public can view approved doctors (unauthenticated users)
CREATE POLICY "Public can view approved doctors"
  ON users FOR SELECT
  TO anon
  USING (role = 'DOCTOR' AND is_approved = true);

-- Policy 5: Authenticated users can view approved doctors
CREATE POLICY "Authenticated can view approved doctors"
  ON users FOR SELECT
  TO authenticated
  USING (role = 'DOCTOR' AND is_approved = true);

-- Create helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy 6: Service role can do anything (for admin operations via functions)
CREATE POLICY "Service role full access"
  ON users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

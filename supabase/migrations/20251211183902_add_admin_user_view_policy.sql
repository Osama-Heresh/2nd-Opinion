/*
  # Add Admin User View Policy

  1. Changes
    - Add RLS policy to allow admin users to view all users
    - Add RLS policy to allow admin users to update any user's approval status
    - Add RLS policy to allow admin users to delete any user

  2. Security
    - Only users with role 'ADMIN' can view, update, and delete all users
    - This enables the admin dashboard to properly display and manage all users
*/

-- Allow admins to view all users
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

-- Allow admins to update any user
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

-- Allow admins to delete any user
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
/*
  # Add Admin Policies for Cases and Transactions

  1. Changes
    - Add RLS policy to allow admin users to view all cases
    - Add RLS policy to allow admin users to view all transactions
    - Add RLS policy to allow admin users to update any case
    - Add RLS policy to allow admin users to delete any case

  2. Security
    - Only users with role 'ADMIN' can view and manage all cases and transactions
    - This enables the admin dashboard to properly display and manage all data
*/

-- Allow admins to view all cases
CREATE POLICY "Admins can view all cases"
  ON cases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'ADMIN'
    )
  );

-- Allow admins to update any case
CREATE POLICY "Admins can update any case"
  ON cases FOR UPDATE
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

-- Allow admins to delete any case
CREATE POLICY "Admins can delete any case"
  ON cases FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'ADMIN'
    )
  );

-- Allow admins to view all transactions
CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'ADMIN'
    )
  );
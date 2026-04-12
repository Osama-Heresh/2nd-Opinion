/*
  # Add Doctor Case Access Policies

  1. Security Changes
    - Add policy for doctors to view cases assigned to them
    - Add policy for doctors to view unassigned cases matching their specialty
*/

CREATE POLICY "Doctors can view assigned cases"
  ON cases
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'DOCTOR'
    )
    AND assigned_doctor_id = auth.uid()
  );

CREATE POLICY "Doctors can view unassigned cases in their specialty"
  ON cases
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'DOCTOR'
    )
    AND assigned_doctor_id IS NULL
    AND specialty = (
      SELECT specialty FROM users
      WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view all cases for opinion submission"
  ON cases
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'DOCTOR'
    )
  );

CREATE POLICY "Doctors can update cases with opinions"
  ON cases
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'DOCTOR'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'DOCTOR'
    )
  );

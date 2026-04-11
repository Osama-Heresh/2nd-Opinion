/*
  # Fix Doctor Avatar URLs and Case Status Mapping

  1. Updates
    - Add avatar URLs to all doctors
    - Change case statuses from "In Progress" to "Open" to match app expectations
    
  2. Notes
    - Uses Pexels stock photos for doctor avatars
    - Status "In Progress" should be "Open" for pending cases
*/

UPDATE users 
SET avatar_url = CASE email
  WHEN 'dr.sarah.chen@example.com' THEN 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  WHEN 'dr.james.wilson@example.com' THEN 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  WHEN 'dr.priya.patel@example.com' THEN 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  ELSE avatar_url
END
WHERE role = 'DOCTOR';

UPDATE cases 
SET status = 'Open'
WHERE status = 'In Progress';

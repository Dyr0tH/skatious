/*
  # Initialize Special Discount Settings

  1. New Tables
    - Ensures `special_discount_settings` table has a default row with proper UUID
  
  2. Data Initialization
    - Inserts a single row with UUID '00000000-0000-0000-0000-000000000001'
    - Sets active to false by default
  
  3. Security
    - No changes to existing RLS policies
*/

-- Insert the default special discount settings row if it doesn't exist
INSERT INTO special_discount_settings (id, active)
VALUES ('00000000-0000-0000-0000-000000000001', false)
ON CONFLICT (id) DO NOTHING;